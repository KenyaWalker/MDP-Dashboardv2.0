const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security and performance middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
            fontSrc: ["'self'", "fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'"]
        }
    }
}));

app.use(compression());
app.use(cors({
    origin: NODE_ENV === 'production' ? false : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from root directory
app.use(express.static(path.join(__dirname), {
    maxAge: NODE_ENV === 'production' ? '1d' : '0',
    etag: true
}));

// Data storage
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'survey-responses.json');

// Ensure data directory and file exist
function ensureDataStructure() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(dataFile)) {
        const initialData = {
            responses: [],
            metadata: {
                created: new Date().toISOString(),
                version: '1.0.0',
                totalResponses: 0
            }
        };
        fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
    }
}

// Initialize data structure
ensureDataStructure();

// Utility functions
function readSurveyData() {
    try {
        const data = fs.readFileSync(dataFile, 'utf8');
        const parsed = JSON.parse(data);
        return parsed.responses || [];
    } catch (error) {
        console.error('Error reading survey data:', error);
        return [];
    }
}

function writeSurveyData(responses) {
    try {
        const data = {
            responses,
            metadata: {
                lastUpdated: new Date().toISOString(),
                version: '1.0.0',
                totalResponses: responses.length
            }
        };
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing survey data:', error);
        return false;
    }
}

// API Routes

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: NODE_ENV
    });
});

// Get all survey responses
app.get('/api/survey-responses', (req, res) => {
    try {
        const responses = readSurveyData();
        
        // Add computed fields for analytics
        const enrichedResponses = responses.map(response => ({
            ...response,
            compositeScore: calculateCompositeScore(response),
            submittedDate: response.timestamp ? new Date(response.timestamp).toLocaleDateString() : 'Unknown'
        }));
        
        res.json(enrichedResponses);
    } catch (error) {
        console.error('Error fetching survey responses:', error);
        res.status(500).json({ 
            error: 'Failed to fetch survey responses',
            message: error.message 
        });
    }
});

// Submit new survey response
app.post('/api/survey-responses', (req, res) => {
    try {
        const responses = readSurveyData();
        
        // Validate required fields
        const requiredFields = ['mdpName', 'function', 'managerName', 'rotation'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields
            });
        }
        
        // Create new response with metadata
        const newResponse = {
            id: `mdp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...req.body,
            timestamp: new Date().toISOString(),
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        };
        
        // Add to responses array
        responses.push(newResponse);
        
        // Save to file
        const saved = writeSurveyData(responses);
        
        if (saved) {
            res.status(201).json({
                success: true,
                message: 'Response saved successfully',
                id: newResponse.id,
                timestamp: newResponse.timestamp
            });
        } else {
            res.status(500).json({
                error: 'Failed to save response'
            });
        }
        
    } catch (error) {
        console.error('Error saving survey response:', error);
        res.status(500).json({
            error: 'Failed to save survey response',
            message: error.message
        });
    }
});

// Get survey statistics
app.get('/api/survey-stats', (req, res) => {
    try {
        const responses = readSurveyData();
        
        const stats = {
            totalResponses: responses.length,
            uniqueMdps: new Set(responses.map(r => r.mdpName)).size,
            uniqueManagers: new Set(responses.map(r => r.managerName)).size,
            functionBreakdown: {},
            rotationBreakdown: {},
            averageScores: calculateAverageScores(responses),
            lastSubmission: responses.length > 0 ? 
                Math.max(...responses.map(r => new Date(r.timestamp).getTime())) : null
        };
        
        // Calculate breakdowns
        responses.forEach(response => {
            stats.functionBreakdown[response.function] = 
                (stats.functionBreakdown[response.function] || 0) + 1;
            stats.rotationBreakdown[response.rotation] = 
                (stats.rotationBreakdown[response.rotation] || 0) + 1;
        });
        
        res.json(stats);
    } catch (error) {
        console.error('Error calculating stats:', error);
        res.status(500).json({
            error: 'Failed to calculate statistics',
            message: error.message
        });
    }
});

// Delete a survey response (admin only)
app.delete('/api/survey-responses/:id', (req, res) => {
    try {
        const responses = readSurveyData();
        const responseId = req.params.id;
        
        const filteredResponses = responses.filter(r => r.id !== responseId);
        
        if (filteredResponses.length === responses.length) {
            return res.status(404).json({
                error: 'Response not found'
            });
        }
        
        const saved = writeSurveyData(filteredResponses);
        
        if (saved) {
            res.json({
                success: true,
                message: 'Response deleted successfully',
                deletedId: responseId
            });
        } else {
            res.status(500).json({
                error: 'Failed to delete response'
            });
        }
        
    } catch (error) {
        console.error('Error deleting response:', error);
        res.status(500).json({
            error: 'Failed to delete response',
            message: error.message
        });
    }
});

// Utility function to calculate composite score
function calculateCompositeScore(response) {
    const jobKnowledge = parseFloat(response.jobKnowledge) || 0;
    const qualityOfWork = parseFloat(response.qualityOfWork) || 0;
    const communication = parseFloat(response.communication) || 0;
    const initiative = parseFloat(response.initiative) || 0;
    
    // Weighted calculation: Job Knowledge (50%), Quality (20%), Communication (15%), Initiative (15%)
    return (jobKnowledge * 0.5) + (qualityOfWork * 0.2) + (communication * 0.15) + (initiative * 0.15);
}

// Utility function to calculate average scores
function calculateAverageScores(responses) {
    if (responses.length === 0) {
        return {
            jobKnowledge: 0,
            qualityOfWork: 0,
            communication: 0,
            initiative: 0,
            composite: 0
        };
    }
    
    const totals = responses.reduce((acc, response) => {
        acc.jobKnowledge += parseFloat(response.jobKnowledge) || 0;
        acc.qualityOfWork += parseFloat(response.qualityOfWork) || 0;
        acc.communication += parseFloat(response.communication) || 0;
        acc.initiative += parseFloat(response.initiative) || 0;
        return acc;
    }, {
        jobKnowledge: 0,
        qualityOfWork: 0,
        communication: 0,
        initiative: 0
    });
    
    const count = responses.length;
    
    return {
        jobKnowledge: (totals.jobKnowledge / count).toFixed(2),
        qualityOfWork: (totals.qualityOfWork / count).toFixed(2),
        communication: (totals.communication / count).toFixed(2),
        initiative: (totals.initiative / count).toFixed(2),
        composite: responses.reduce((sum, r) => sum + calculateCompositeScore(r), 0) / count
    };
}

// Route handlers for HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'success.html'));
});

app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'success.html'));
});

// 404 handler - redirect to survey form
app.use((req, res) => {
    if (req.accepts('html')) {
        res.status(404).sendFile(path.join(__dirname, 'index.html'));
    } else if (req.accepts('json')) {
        res.status(404).json({ error: 'Not found' });
    } else {
        res.status(404).type('txt').send('Not found');
    }
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MDP Performance Dashboard Server`);
    console.log(`📍 Environment: ${NODE_ENV}`);
    console.log(`🌐 Port: ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard.html`);
    console.log(`📝 Survey: http://localhost:${PORT}`);
    console.log(`⚙️  Admin: http://localhost:${PORT}/admin.html`);
    console.log(`🔗 API: http://localhost:${PORT}/api/survey-responses`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

module.exports = app;