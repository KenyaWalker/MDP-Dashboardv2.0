// MDP Performance Dashboard - Production Ready
const API_BASE = window.location.origin;

class MDPDashboard {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.charts = {};
        this.viewMode = 'cohort';
        this.selectedMdpA = '';
        this.selectedMdpB = '';
        this.filters = {
            function: '',
            manager: '',
            rotation: '',
            search: ''
        };
        
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
        } catch (error) {
            console.error('Failed to initialize dashboard:', error);
            this.showError('Failed to load dashboard. Please refresh the page.');
        }
    }

    async loadData() {
        try {
            const response = await fetch(`${API_BASE}/api/survey-responses`);
            if (!response.ok) throw new Error('Failed to fetch data');
            
            this.data = await response.json();
            this.applyFilters();
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load survey data. Please check your connection.');
            return [];
        }
    }

    applyFilters() {
        this.filteredData = this.data.filter(item => {
            if (this.filters.function && item.function !== this.filters.function) return false;
            if (this.filters.manager && item.managerName !== this.filters.manager) return false;
            if (this.filters.rotation && item.rotation !== this.filters.rotation) return false;
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                if (!item.mdpName.toLowerCase().includes(searchTerm)) return false;
            }
            return true;
        });
    }

    setupEventListeners() {
        // Mode selector
        document.getElementById('modeSelect').addEventListener('change', (e) => {
            this.handleModeChange(e.target.value);
        });

        // Filter controls
        document.getElementById('functionFilter').addEventListener('change', (e) => {
            this.filters.function = e.target.value;
            this.applyFilters();
            this.render();
        });

        document.getElementById('managerFilter').addEventListener('change', (e) => {
            this.filters.manager = e.target.value;
            this.applyFilters();
            this.render();
        });

        document.getElementById('rotationFilter').addEventListener('change', (e) => {
            this.filters.rotation = e.target.value;
            this.applyFilters();
            this.render();
        });

        document.getElementById('searchFilter').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.applyFilters();
            this.render();
        });

        // Comparison selectors
        document.getElementById('mdpA').addEventListener('change', (e) => {
            this.selectedMdpA = e.target.value;
            this.renderComparison();
        });

        document.getElementById('mdpB').addEventListener('change', (e) => {
            this.selectedMdpB = e.target.value;
            this.renderComparison();
        });
    }

    handleModeChange(value) {
        if (value === 'cohort') {
            this.viewMode = 'cohort';
            this.showElement('tilesGrid');
            this.showElement('chartsGrid');
            this.hideElement('comparisonPicker');
            this.render();
        } else if (value === 'compare') {
            this.viewMode = 'compare';
            this.hideElement('tilesGrid');
            this.hideElement('chartsGrid');
            this.showElement('comparisonPicker');
            this.populateComparisonDropdowns();
            this.renderComparison();
        } else {
            // Individual MDP view
            this.viewMode = 'individual';
            this.selectedIndividualMdp = value;
            this.showElement('tilesGrid');
            this.showElement('chartsGrid');
            this.hideElement('comparisonPicker');
            this.renderIndividual();
        }
        
        document.getElementById('modeBadge').textContent = this.getModeBadgeText();
    }

    getModeBadgeText() {
        if (this.viewMode === 'cohort') return 'Cohort';
        if (this.viewMode === 'compare') return 'Comparison';
        if (this.viewMode === 'individual') return `Individual: ${this.selectedIndividualMdp}`;
        return 'Cohort';
    }

    populateFilters() {
        // Populate function filter
        const functions = [...new Set(this.data.map(item => item.function))].sort();
        this.populateSelect('functionFilter', functions);

        // Populate manager filter
        const managers = [...new Set(this.data.map(item => item.managerName))].sort();
        this.populateSelect('managerFilter', managers);

        // Populate rotation filter
        const rotations = [...new Set(this.data.map(item => item.rotation))].sort();
        this.populateSelect('rotationFilter', rotations);

        // Add individual MDP options to mode selector
        const modeSelect = document.getElementById('modeSelect');
        const mdpNames = [...new Set(this.data.map(item => item.mdpName))].sort();
        
        // Remove existing MDP options
        const existingOptions = modeSelect.querySelectorAll('option[data-mdp]');
        existingOptions.forEach(option => option.remove());

        // Add new MDP options
        mdpNames.forEach(mdpName => {
            const option = document.createElement('option');
            option.value = mdpName;
            option.textContent = mdpName;
            option.setAttribute('data-mdp', 'true');
            modeSelect.appendChild(option);
        });
    }

    populateSelect(selectId, options) {
        const select = document.getElementById(selectId);
        const currentValue = select.value;
        
        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
        
        // Restore selection if still valid
        if (options.includes(currentValue)) {
            select.value = currentValue;
        }
    }

    populateComparisonDropdowns() {
        const mdpNames = [...new Set(this.data.map(item => item.mdpName))].sort();
        this.populateSelect('mdpA', mdpNames);
        this.populateSelect('mdpB', mdpNames);
    }

    render() {
        if (this.viewMode === 'cohort') {
            this.renderCohort();
        } else if (this.viewMode === 'individual') {
            this.renderIndividual();
        }
        this.updateDynamicSummary();
    }

    renderCohort() {
        this.renderTiles();
        this.renderCharts();
        this.renderTable();
    }

    renderIndividual() {
        const mdpData = this.data.filter(item => item.mdpName === this.selectedIndividualMdp);
        this.renderIndividualTiles(mdpData);
        this.renderIndividualCharts(mdpData);
        this.renderIndividualTable(mdpData);
    }

    renderTiles() {
        const tilesGrid = document.getElementById('tilesGrid');
        const stats = this.calculateCohortStats();
        
        tilesGrid.innerHTML = `
            <div class="tile">
                <div class="tile-header">
                    <span class="tile-title">Total MDPs</span>
                </div>
                <div class="tile-value">${stats.totalMdps}</div>
                <div class="tile-subtitle">In current view</div>
            </div>
            
            <div class="tile">
                <div class="tile-header">
                    <span class="tile-title">Average Score</span>
                    <span class="score-badge ${this.getScoreClass(stats.averageScore)}">${stats.averageScore.toFixed(2)}</span>
                </div>
                <div class="tile-value">${stats.averageScore.toFixed(1)}</div>
                <div class="tile-subtitle">Weighted composite</div>
            </div>
            
            <div class="tile">
                <div class="tile-header">
                    <span class="tile-title">Top Performer</span>
                    <span class="score-badge score-high">${stats.topScore.toFixed(2)}</span>
                </div>
                <div class="tile-value">${stats.topPerformer}</div>
                <div class="tile-subtitle">Highest scoring MDP</div>
            </div>
            
            <div class="tile">
                <div class="tile-header">
                    <span class="tile-title">Functions</span>
                </div>
                <div class="tile-value">${stats.uniqueFunctions}</div>
                <div class="tile-subtitle">Different functions represented</div>
            </div>
        `;
    }

    renderCharts() {
        const chartsGrid = document.getElementById('chartsGrid');
        chartsGrid.innerHTML = `
            <div class="chart-container">
                <h3 class="chart-title">Performance by Assessment Area</h3>
                <canvas id="assessmentChart" class="chart-canvas"></canvas>
            </div>
            
            <div class="chart-container">
                <h3 class="chart-title">Performance by Function</h3>
                <canvas id="functionChart" class="chart-canvas"></canvas>
            </div>
        `;
        
        this.createAssessmentChart();
        this.createFunctionChart();
    }

    createAssessmentChart() {
        const ctx = document.getElementById('assessmentChart').getContext('2d');
        const data = this.calculateAssessmentAreaAverages();
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.assessmentAreas,
                datasets: [{
                    label: 'Average Score',
                    data: data,
                    backgroundColor: 'rgba(0, 98, 173, 0.8)',
                    borderColor: 'rgba(0, 98, 173, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5
                    }
                }
            }
        });
    }

    createFunctionChart() {
        const ctx = document.getElementById('functionChart').getContext('2d');
        const data = this.calculateFunctionAverages();
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: [
                        'rgba(0, 98, 173, 0.8)',
                        'rgba(0, 53, 142, 0.8)',
                        'rgba(53, 196, 236, 0.8)',
                        'rgba(151, 234, 255, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderTable() {
        const tableHead = document.getElementById('tableHead');
        const tableBody = document.getElementById('tableBody');
        
        tableHead.innerHTML = `
            <tr>
                <th>MDP Name</th>
                <th>Function</th>
                <th>Manager</th>
                <th>Rotation</th>
                <th>Composite Score</th>
                <th>Job Knowledge</th>
                <th>Quality of Work</th>
                <th>Communication</th>
                <th>Initiative</th>
            </tr>
        `;
        
        tableBody.innerHTML = this.filteredData.map(item => {
            const compositeScore = this.calculateCompositeScore(item);
            return `
                <tr class="expandable-row" onclick="this.classList.toggle('expanded')">
                    <td><strong>${item.mdpName}</strong></td>
                    <td>${item.function}</td>
                    <td>${item.managerName}</td>
                    <td>${item.rotation}</td>
                    <td><span class="score-badge ${this.getScoreClass(compositeScore)}">${compositeScore.toFixed(2)}</span></td>
                    <td>${item.jobKnowledge || 'N/A'}</td>
                    <td>${item.qualityOfWork || 'N/A'}</td>
                    <td>${item.communication || 'N/A'}</td>
                    <td>${item.initiative || 'N/A'}</td>
                </tr>
            `;
        }).join('');
    }

    calculateCohortStats() {
        if (this.filteredData.length === 0) {
            return {
                totalMdps: 0,
                averageScore: 0,
                topPerformer: 'N/A',
                topScore: 0,
                uniqueFunctions: 0
            };
        }

        const scores = this.filteredData.map(item => this.calculateCompositeScore(item));
        const topScoreIndex = scores.indexOf(Math.max(...scores));
        
        return {
            totalMdps: this.filteredData.length,
            averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
            topPerformer: this.filteredData[topScoreIndex]?.mdpName || 'N/A',
            topScore: Math.max(...scores),
            uniqueFunctions: new Set(this.filteredData.map(item => item.function)).size
        };
    }

    calculateCompositeScore(item) {
        // Weighted scoring as per requirements
        const jobKnowledge = parseFloat(item.jobKnowledge) || 0;
        const qualityOfWork = parseFloat(item.qualityOfWork) || 0;
        const communication = parseFloat(item.communication) || 0;
        const initiative = parseFloat(item.initiative) || 0;
        
        return (jobKnowledge * 0.5) + (qualityOfWork * 0.2) + (communication * 0.15) + (initiative * 0.15);
    }

    calculateAssessmentAreaAverages() {
        if (this.filteredData.length === 0) return [0, 0, 0, 0];
        
        const totals = this.filteredData.reduce((acc, item) => {
            acc[0] += parseFloat(item.jobKnowledge) || 0;
            acc[1] += parseFloat(item.qualityOfWork) || 0;
            acc[2] += parseFloat(item.communication) || 0;
            acc[3] += parseFloat(item.initiative) || 0;
            return acc;
        }, [0, 0, 0, 0]);
        
        return totals.map(total => total / this.filteredData.length);
    }

    calculateFunctionAverages() {
        const functionData = {};
        this.filteredData.forEach(item => {
            if (!functionData[item.function]) {
                functionData[item.function] = [];
            }
            functionData[item.function].push(this.calculateCompositeScore(item));
        });
        
        const averages = {};
        Object.keys(functionData).forEach(func => {
            const scores = functionData[func];
            averages[func] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        });
        
        return averages;
    }

    getScoreClass(score) {
        if (score >= 4.0) return 'score-high';
        if (score >= 3.0) return 'score-medium';
        return 'score-low';
    }

    updateDynamicSummary() {
        const summary = document.getElementById('dynamicSummary');
        const count = this.filteredData.length;
        const total = this.data.length;
        
        let text = `Showing ${count} of ${total} MDPs`;
        
        if (this.filters.function) text += ` • Function: ${this.filters.function}`;
        if (this.filters.manager) text += ` • Manager: ${this.filters.manager}`;
        if (this.filters.rotation) text += ` • Rotation: ${this.filters.rotation}`;
        if (this.filters.search) text += ` • Search: "${this.filters.search}"`;
        
        summary.textContent = text;
    }

    updateLastUpdated() {
        const now = new Date();
        document.getElementById('lastUpdated').textContent = 
            `Last updated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    }

    // Utility methods
    showElement(id) {
        document.getElementById(id).style.display = 'block';
    }

    hideElement(id) {
        document.getElementById(id).style.display = 'none';
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--danger);
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            z-index: 1000;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }

    // Public methods for UI interactions
    async refresh() {
        await this.loadData();
        this.populateFilters();
        this.render();
        this.updateLastUpdated();
    }

    clearFilters() {
        this.filters = { function: '', manager: '', rotation: '', search: '' };
        document.getElementById('functionFilter').value = '';
        document.getElementById('managerFilter').value = '';
        document.getElementById('rotationFilter').value = '';
        document.getElementById('searchFilter').value = '';
        this.applyFilters();
        this.render();
    }

    swapMdps() {
        const tempA = this.selectedMdpA;
        this.selectedMdpA = this.selectedMdpB;
        this.selectedMdpB = tempA;
        document.getElementById('mdpA').value = this.selectedMdpA;
        document.getElementById('mdpB').value = this.selectedMdpB;
        this.renderComparison();
    }

    clearComparison() {
        this.selectedMdpA = '';
        this.selectedMdpB = '';
        document.getElementById('mdpA').value = '';
        document.getElementById('mdpB').value = '';
        this.renderComparison();
    }

    renderComparison() {
        // Comparison logic would go here
        // For now, just update the table
        this.renderTable();
    }

    exportCSV() {
        const headers = ['MDP Name', 'Function', 'Manager', 'Rotation', 'Composite Score', 'Job Knowledge', 'Quality of Work', 'Communication', 'Initiative'];
        const rows = this.filteredData.map(item => [
            item.mdpName,
            item.function,
            item.managerName,
            item.rotation,
            this.calculateCompositeScore(item).toFixed(2),
            item.jobKnowledge || '',
            item.qualityOfWork || '',
            item.communication || '',
            item.initiative || ''
        ]);
        
        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mdp-performance-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    exportPDF() {
        window.print();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new MDPDashboard();
});