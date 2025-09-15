// MDP Performance Dashboard - Redesigned
// Maintains existing API endpoints while implementing new UI architecture

// API endpoint for live data
const API_BASE = window.location.origin;

class MDPDashboard {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.charts = {};
        this.viewMode = 'cohort';
        this.selectedMdpA = '';
        this.selectedMdpB = '';
        this.selectedIndividualMdp = '';
        this.filters = {
            function: '',
            manager: '',
            rotation: '',
            search: ''
        };
        
        // Assessment areas as defined in requirements
        this.assessmentAreas = [
            'Job Knowledge',
            'Quality of Work', 
            'Communication Skills & Teamwork',
            'Initiative & Productivity'
        ];
        
        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.populateFilters();
            this.updateLastUpdated();
            this.render();
            this.loadUserPreferences();
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
        }
    }

    async loadData() {
        try {
            const response = await fetch(`${API_BASE}/api/survey-responses`);
            if (!response.ok) throw new Error('Failed to fetch data');
function updateDashboard() {
    updateStatistics();
    updateCharts();
    updateDataTable();
    updateFilterOptions();
    hideLoading();
}

// Update statistics cards
function updateStatistics() {
    const stats = calculateStatistics(filteredData);
    
    document.getElementById('totalResponses').textContent = stats.totalResponses;
    document.getElementById('uniqueMDPs').textContent = stats.uniqueMDPs;
    document.getElementById('averageScore').textContent = stats.averageScore.toFixed(1);
    document.getElementById('uniqueManagers').textContent = stats.uniqueManagers;
}

// Calculate statistics from data
function calculateStatistics(data) {
    return {
        totalResponses: data.length,
        uniqueMDPs: new Set(data.map(r => r.mdpName)).size,
        uniqueManagers: new Set(data.map(r => r.managerName)).size,
        averageScore: data.length > 0 ? data.reduce((sum, r) => sum + r.compositeScore, 0) / data.length : 0
    };
}

// Setup and update charts
function setupCharts() {
    // Assessment Areas Chart
    const assessmentCtx = document.getElementById('assessmentChart').getContext('2d');
    charts.assessment = new Chart(assessmentCtx, {
        type: 'bar',
        data: {
            labels: ['Job Knowledge', 'Quality of Work', 'Communication', 'Initiative'],
            datasets: [{
                label: 'Average Score',
                data: [0, 0, 0, 0],
                backgroundColor: ['#0062AD', '#00358E', '#35C4EC', '#11224B'],
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Function Distribution Chart
    const functionCtx = document.getElementById('functionChart').getContext('2d');
    charts.function = new Chart(functionCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#0062AD', '#00358E', '#35C4EC', '#11224B'],
                borderWidth: 3,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20
                    }
                }
            }
        }
    });

    // Rotation Progress Chart
    const rotationCtx = document.getElementById('rotationChart').getContext('2d');
    charts.rotation = new Chart(rotationCtx, {
        type: 'bar',
        data: {
            labels: ['Rotation 1', 'Rotation 2', 'Rotation 3', 'Rotation 4', 'Rotation 5', 'Rotation 6'],
            datasets: [{
                label: 'Evaluations',
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: '#35C4EC',
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Score Distribution Chart
    const scoreCtx = document.getElementById('scoreChart').getContext('2d');
    charts.score = new Chart(scoreCtx, {
        type: 'line',
        data: {
            labels: ['1.0-1.5', '1.5-2.0', '2.0-2.5', '2.5-3.0', '3.0-3.5', '3.5-4.0', '4.0-4.5', '4.5-5.0'],
            datasets: [{
                label: 'Number of MDPs',
                data: [0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: '#0062AD',
                backgroundColor: 'rgba(0, 98, 173, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#0062AD',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Update chart data
function updateCharts() {
    if (filteredData.length === 0) return;

    // Update Assessment Areas Chart
    const avgJobKnowledge = filteredData.reduce((sum, r) => sum + r.jobKnowledge, 0) / filteredData.length;
    const avgQuality = filteredData.reduce((sum, r) => sum + r.qualityOfWork, 0) / filteredData.length;
    const avgCommunication = filteredData.reduce((sum, r) => sum + r.communication, 0) / filteredData.length;
    const avgInitiative = filteredData.reduce((sum, r) => sum + r.initiative, 0) / filteredData.length;

    charts.assessment.data.datasets[0].data = [avgJobKnowledge, avgQuality, avgCommunication, avgInitiative];
    charts.assessment.update();

    // Update Function Distribution Chart
    const functionCounts = {};
    filteredData.forEach(r => {
        functionCounts[r.function] = (functionCounts[r.function] || 0) + 1;
    });

    charts.function.data.labels = Object.keys(functionCounts);
    charts.function.data.datasets[0].data = Object.values(functionCounts);
    charts.function.update();

    // Update Rotation Chart
    const rotationCounts = [0, 0, 0, 0, 0, 0];
    filteredData.forEach(r => {
        const rotationIndex = parseInt(r.rotation) - 1;
        if (rotationIndex >= 0 && rotationIndex < 6) {
            rotationCounts[rotationIndex]++;
        }
    });

    charts.rotation.data.datasets[0].data = rotationCounts;
    charts.rotation.update();

    // Update Score Distribution Chart
    const scoreBuckets = [0, 0, 0, 0, 0, 0, 0, 0];
    filteredData.forEach(r => {
        const score = r.compositeScore;
        const bucketIndex = Math.min(Math.floor((score - 1) / 0.5), 7);
        if (bucketIndex >= 0) {
            scoreBuckets[bucketIndex]++;
        }
    });

    charts.score.data.datasets[0].data = scoreBuckets;
    charts.score.update();
}

// Update data table
function updateDataTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    // Sort by timestamp descending (newest first)
    const sortedData = [...filteredData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedData.forEach(response => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${response.mdpName}</strong></td>
            <td>${response.function}</td>
            <td>${response.managerName}</td>
            <td>Rotation ${response.rotation}</td>
            <td><span class="score-badge ${getScoreClass(response.compositeScore)}">${response.compositeScore.toFixed(1)}</span></td>
            <td>${response.jobKnowledge}</td>
            <td>${response.qualityOfWork}</td>
            <td>${response.communication}</td>
            <td>${response.initiative}</td>
            <td>${formatTimestamp(response.timestamp)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Get CSS class for score badge
function getScoreClass(score) {
    if (score >= 4.5) return 'score-excellent';
    if (score >= 3.5) return 'score-good';
    if (score >= 2.5) return 'score-average';
    return 'score-needs-improvement';
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Setup filter functionality
function setupFilters() {
    const filters = ['functionFilter', 'rotationFilter', 'managerFilter', 'searchFilter'];
    
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', applyFilters);
            if (element.type === 'text') {
                element.addEventListener('input', debounce(applyFilters, 300));
            }
        }
    });
}

// Apply all filters
function applyFilters() {
    const functionFilter = document.getElementById('functionFilter').value;
    const rotationFilter = document.getElementById('rotationFilter').value;
    const managerFilter = document.getElementById('managerFilter').value;
    const searchFilter = document.getElementById('searchFilter').value.toLowerCase();

    filteredData = dashboardData.filter(response => {
        const matchesFunction = !functionFilter || response.function === functionFilter;
        const matchesRotation = !rotationFilter || response.rotation === rotationFilter;
        const matchesManager = !managerFilter || response.managerName === managerFilter;
        const matchesSearch = !searchFilter || response.mdpName.toLowerCase().includes(searchFilter);

        return matchesFunction && matchesRotation && matchesManager && matchesSearch;
    });

    updateDashboard();
}

// Update filter dropdown options
function updateFilterOptions() {
    // Update manager filter
    const managers = [...new Set(dashboardData.map(r => r.managerName))].sort();
    const managerFilter = document.getElementById('managerFilter');
    
    // Preserve current selection
    const currentManager = managerFilter.value;
    
    // Clear and repopulate
    managerFilter.innerHTML = '<option value="">All Managers</option>';
    managers.forEach(manager => {
        const option = document.createElement('option');
        option.value = manager;
        option.textContent = manager;
        managerFilter.appendChild(option);
    });
    
    // Restore selection if still valid
    if (managers.includes(currentManager)) {
        managerFilter.value = currentManager;
    }
}

// Refresh data from server
async function refreshData() {
    const refreshBtn = document.querySelector('.refresh-btn');
    const originalText = refreshBtn.textContent;
    
    refreshBtn.textContent = '🔄 Refreshing...';
    refreshBtn.disabled = true;

    try {
        await loadDashboardData();
        updateLastRefresh();
        
        // Show success feedback
        refreshBtn.textContent = '✅ Updated';
        setTimeout(() => {
            refreshBtn.textContent = originalText;
            refreshBtn.disabled = false;
        }, 1500);
        
    } catch (error) {
        console.error('Refresh error:', error);
        refreshBtn.textContent = '❌ Error';
        setTimeout(() => {
            refreshBtn.textContent = originalText;
            refreshBtn.disabled = false;
        }, 2000);
    }
}

// Export data as CSV
function exportData() {
    if (filteredData.length === 0) {
        alert('No data to export');
        return;
    }

    const headers = [
        'MDP Name', 'Function', 'Manager', 'Rotation', 'Composite Score',
        'Job Knowledge', 'Quality of Work', 'Communication', 'Initiative',
        'Function Specific 1', 'Function Specific 2', 'Submitted At'
    ];

    const csvContent = [
        headers.join(','),
        ...filteredData.map(row => [
            `"${row.mdpName}"`,
            `"${row.function}"`,
            `"${row.managerName}"`,
            row.rotation,
            row.compositeScore,
            row.jobKnowledge,
            row.qualityOfWork,
            row.communication,
            row.initiative,
            row.functionSpecific1 || '',
            row.functionSpecific2 || '',
            `"${row.submittedAt || formatTimestamp(row.timestamp)}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mdp-evaluations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Setup auto-refresh
function setupAutoRefresh() {
    // Refresh every 5 minutes
    setInterval(() => {
        refreshData();
    }, 5 * 60 * 1000);
}

// Update last refresh timestamp
function updateLastRefresh() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = 
        `Updated: ${now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
}

// Show/hide loading and no data states
function hideLoading() {
    document.getElementById('loadingMessage').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';
}

function showNoData() {
    hideLoading();
    document.getElementById('noDataMessage').style.display = 'block';
}

function hideNoData() {
    document.getElementById('noDataMessage').style.display = 'none';
}

function showError(message) {
    hideLoading();
    document.getElementById('loadingMessage').innerHTML = `
        <div style="color: #c62828; background: #ffebee; padding: 20px; border-radius: 10px; border-left: 4px solid #f44336;">
            <strong>Error:</strong> ${message}
        </div>
    `;
    document.getElementById('loadingMessage').style.display = 'block';
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make functions globally available
window.refreshData = refreshData;
window.exportData = exportData;

console.log('Dashboard initialized with live data integration');