const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data', 'data.json');

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:"],
        },
    },
}));
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Ensure data directory and file exist
async function ensureDataFile() {
    try {
        const dataDir = path.dirname(DATA_FILE);
        await fs.mkdir(dataDir, { recursive: true });
        
        try {
            await fs.access(DATA_FILE);
        } catch (error) {
            // File doesn't exist, create with empty array
            await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
            console.log('Created new data.json file');
        }
    } catch (error) {
        console.error('Error ensuring data file:', error);
    }
}

// Read data from file
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
}

// Write data to file
async function writeData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
}

// API Routes

// Get all survey responses
app.get('/api/survey-responses', async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        console.error('Error fetching survey responses:', error);
        res.status(500).json({ error: 'Failed to fetch survey responses' });
    }
});

// Submit new survey response
app.post('/api/survey-responses', async (req, res) => {
    try {
        const {
            mdpName,
            function: mdpFunction,
            managerName,
            rotation,
            jobKnowledge,
            qualityOfWork,
            communication,
            initiative,
            functionSpecific1,
            functionSpecific2
        } = req.body;

        // Validate required fields
        if (!mdpName || !mdpFunction || !managerName || !rotation) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate rating fields
        const ratings = [jobKnowledge, qualityOfWork, communication, initiative];
        if (ratings.some(rating => rating < 1 || rating > 5)) {
            return res.status(400).json({ error: 'Ratings must be between 1 and 5' });
        }

        // Calculate composite score with weights
        const weights = {
            jobKnowledge: 0.50,
            qualityOfWork: 0.20,
            communication: 0.15,
            initiative: 0.15
        };

        const compositeScore = (
            jobKnowledge * weights.jobKnowledge +
            qualityOfWork * weights.qualityOfWork +
            communication * weights.communication +
            initiative * weights.initiative
        );

        // Create response object
        const response = {
            id: `mdp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            mdpName: mdpName.trim(),
            function: mdpFunction,
            managerName: managerName.trim(),
            rotation: rotation.toString(),
            jobKnowledge: parseInt(jobKnowledge),
            qualityOfWork: parseInt(qualityOfWork),
            communication: parseInt(communication),
            initiative: parseInt(initiative),
            functionSpecific1: functionSpecific1 ? parseInt(functionSpecific1) : null,
            functionSpecific2: functionSpecific2 ? parseInt(functionSpecific2) : null,
            compositeScore: Math.round(compositeScore * 100) / 100,
            timestamp: new Date().toISOString(),
            submittedAt: new Date().toLocaleString('en-US', {
                timeZone: 'America/Chicago',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };

        // Read existing data and add new response
        const data = await readData();
        data.push(response);

        // Write updated data
        const success = await writeData(data);
        if (!success) {
            return res.status(500).json({ error: 'Failed to save survey response' });
        }

        console.log(`New survey response saved: ${mdpName} (${mdpFunction})`);
        res.status(201).json({ 
            message: 'Survey response saved successfully', 
            id: response.id,
            compositeScore: response.compositeScore
        });

    } catch (error) {
        console.error('Error submitting survey response:', error);
        res.status(500).json({ error: 'Failed to submit survey response' });
    }
});

// Delete survey response (admin only)
app.delete('/api/survey-responses/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readData();
        
        const initialLength = data.length;
        const filteredData = data.filter(response => response.id !== id);
        
        if (filteredData.length === initialLength) {
            return res.status(404).json({ error: 'Survey response not found' });
        }

        const success = await writeData(filteredData);
        if (!success) {
            return res.status(500).json({ error: 'Failed to delete survey response' });
        }

        console.log(`Survey response deleted: ${id}`);
        res.json({ message: 'Survey response deleted successfully' });

    } catch (error) {
        console.error('Error deleting survey response:', error);
        res.status(500).json({ error: 'Failed to delete survey response' });
    }
});

// Get survey statistics
app.get('/api/survey-stats', async (req, res) => {
    try {
        const data = await readData();
        
        const stats = {
            totalResponses: data.length,
            uniqueMDPs: new Set(data.map(r => r.mdpName)).size,
            uniqueManagers: new Set(data.map(r => r.managerName)).size,
            functionBreakdown: {},
            rotationBreakdown: {},
            averageScores: {
                composite: 0,
                jobKnowledge: 0,
                qualityOfWork: 0,
                communication: 0,
                initiative: 0
            },
            recentSubmissions: data.slice(-5).reverse()
        };

        // Calculate function breakdown
        data.forEach(response => {
            stats.functionBreakdown[response.function] = (stats.functionBreakdown[response.function] || 0) + 1;
        });

        // Calculate rotation breakdown
        data.forEach(response => {
            stats.rotationBreakdown[response.rotation] = (stats.rotationBreakdown[response.rotation] || 0) + 1;
        });

        // Calculate average scores
        if (data.length > 0) {
            stats.averageScores.composite = Math.round((data.reduce((sum, r) => sum + r.compositeScore, 0) / data.length) * 100) / 100;
            stats.averageScores.jobKnowledge = Math.round((data.reduce((sum, r) => sum + r.jobKnowledge, 0) / data.length) * 100) / 100;
            stats.averageScores.qualityOfWork = Math.round((data.reduce((sum, r) => sum + r.qualityOfWork, 0) / data.length) * 100) / 100;
            stats.averageScores.communication = Math.round((data.reduce((sum, r) => sum + r.communication, 0) / data.length) * 100) / 100;
            stats.averageScores.initiative = Math.round((data.reduce((sum, r) => sum + r.initiative, 0) / data.length) * 100) / 100;
        }

        res.json(stats);

    } catch (error) {
        console.error('Error fetching survey stats:', error);
        res.status(500).json({ error: 'Failed to fetch survey statistics' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        port: PORT
    });
});

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Initialize server
async function startServer() {
    try {
        await ensureDataFile();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 MDP Dashboard server running on port ${PORT}`);
            console.log(`📊 Dashboard: http://localhost:${PORT}/dashboard.html`);
            console.log(`📝 Survey: http://localhost:${PORT}/`);
            console.log(`⚙️ Admin: http://localhost:${PORT}/admin.html`);
            console.log(`💚 Health: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();