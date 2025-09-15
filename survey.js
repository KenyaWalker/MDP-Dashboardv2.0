// Survey Form JavaScript - Production Ready
const API_BASE = window.location.origin;

class SurveyForm {
    constructor() {
        this.currentFunction = '';
        this.ratings = {};
        this.functionQuestions = {
            'Planning': ['planningFinancial', 'planningMath'],
            'Digital Merch': ['digitalFramework', 'digitalSEO'],
            'Replenishment': ['replenishmentForecasting', 'replenishmentInventory'],
            "Member's Mark": ['membersMarkStrategy', 'membersMarkGuidelines']
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupRatingControls();
        this.validateForm();
    }

    setupEventListeners() {
        const form = document.getElementById('surveyForm');
        const functionSelect = document.getElementById('function');

        // Function change handler
        functionSelect.addEventListener('change', (e) => {
            this.currentFunction = e.target.value;
            this.showFunctionQuestions();
            this.validateForm();
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });

        // Real-time validation
        form.addEventListener('input', () => {
            this.validateForm();
        });
    }

    setupRatingControls() {
        const ratingScales = document.querySelectorAll('.rating-scale');
        
        ratingScales.forEach(scale => {
            const fieldName = scale.getAttribute('data-field');
            const options = scale.querySelectorAll('.rating-option');
            
            options.forEach(option => {
                option.addEventListener('click', () => {
                    // Clear previous selections
                    options.forEach(opt => opt.classList.remove('selected'));
                    
                    // Select current option
                    option.classList.add('selected');
                    
                    // Store rating
                    this.ratings[fieldName] = option.getAttribute('data-value');
                    
                    // Validate form
                    this.validateForm();
                });
            });
        });
    }

    showFunctionQuestions() {
        // Hide all function question groups
        const allQuestions = document.querySelectorAll('.function-questions');
        allQuestions.forEach(group => group.classList.remove('active'));
        
        // Show questions for selected function
        if (this.currentFunction) {
            const questionGroupId = this.getFunctionQuestionId(this.currentFunction);
            const questionGroup = document.getElementById(questionGroupId);
            if (questionGroup) {
                questionGroup.classList.add('active');
            }
        }
    }

    getFunctionQuestionId(functionName) {
        const mapping = {
            'Planning': 'planningQuestions',
            'Digital Merch': 'digitalMerchQuestions',
            'Replenishment': 'replenishmentQuestions',
            "Member's Mark": 'membersMarkQuestions'
        };
        return mapping[functionName];
    }

    validateForm() {
        const submitBtn = document.querySelector('.submit-btn');
        const form = document.getElementById('surveyForm');
        
        // Check required form fields
        const requiredFields = ['mdpName', 'function', 'managerName', 'rotation'];
        const formValid = requiredFields.every(field => {
            const element = document.getElementById(field);
            return element && element.value.trim() !== '';
        });
        
        // Check required ratings
        const requiredRatings = ['jobKnowledge', 'qualityOfWork', 'communication', 'initiative'];
        
        // Add function-specific ratings if function is selected
        if (this.currentFunction && this.functionQuestions[this.currentFunction]) {
            requiredRatings.push(...this.functionQuestions[this.currentFunction]);
        }
        
        const ratingsValid = requiredRatings.every(rating => this.ratings[rating]);
        
        // Enable/disable submit button
        const isValid = formValid && ratingsValid;
        submitBtn.disabled = !isValid;
        
        if (isValid) {
            submitBtn.textContent = 'Submit Evaluation';
            submitBtn.style.background = 'var(--primary)';
        } else {
            submitBtn.textContent = 'Please Complete All Required Fields';
            submitBtn.style.background = 'var(--neutral2)';
        }
        
        return isValid;
    }

    async submitForm() {
        const submitBtn = document.querySelector('.submit-btn');
        
        try {
            // Disable button and show loading
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            // Collect form data
            const formData = this.collectFormData();
            
            // Validate data
            if (!this.validateSubmissionData(formData)) {
                throw new Error('Invalid form data');
            }
            
            // Submit to API
            const response = await fetch(`${API_BASE}/api/survey-responses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Submission failed');
            }
            
            const result = await response.json();
            
            // Show success and redirect
            this.showSuccess();
            setTimeout(() => {
                window.location.href = '/success.html';
            }, 1500);
            
        } catch (error) {
            console.error('Submission error:', error);
            this.showError(error.message || 'Failed to submit evaluation. Please try again.');
            
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Evaluation';
        }
    }

    collectFormData() {
        const form = document.getElementById('surveyForm');
        const formData = new FormData(form);
        
        // Convert FormData to object
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Add ratings
        Object.assign(data, this.ratings);
        
        // Add metadata
        data.submissionTimestamp = new Date().toISOString();
        data.browserInfo = navigator.userAgent;
        data.functionQuestions = this.functionQuestions[this.currentFunction] || [];
        
        return data;
    }

    validateSubmissionData(data) {
        // Check required fields
        const required = ['mdpName', 'function', 'managerName', 'rotation'];
        const hasRequired = required.every(field => data[field] && data[field].trim());
        
        // Check core ratings
        const coreRatings = ['jobKnowledge', 'qualityOfWork', 'communication', 'initiative'];
        const hasRatings = coreRatings.every(rating => data[rating] && !isNaN(data[rating]));
        
        // Check function-specific ratings
        let hasFunctionRatings = true;
        if (data.function && this.functionQuestions[data.function]) {
            hasFunctionRatings = this.functionQuestions[data.function].every(rating => 
                data[rating] && !isNaN(data[rating])
            );
        }
        
        return hasRequired && hasRatings && hasFunctionRatings;
    }

    showSuccess() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 600;
        `;
        message.textContent = '✅ Evaluation submitted successfully!';
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 3000);
    }

    showError(errorMessage) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--danger);
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: 600;
            max-width: 400px;
        `;
        message.textContent = `❌ ${errorMessage}`;
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 5000);
    }

    // Utility method to get selected rating value
    getRatingValue(fieldName) {
        return this.ratings[fieldName] || null;
    }

    // Utility method to reset form
    resetForm() {
        document.getElementById('surveyForm').reset();
        this.ratings = {};
        this.currentFunction = '';
        
        // Clear all rating selections
        document.querySelectorAll('.rating-option.selected').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Hide function questions
        document.querySelectorAll('.function-questions').forEach(group => {
            group.classList.remove('active');
        });
        
        this.validateForm();
    }
}

// Initialize survey form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.surveyForm = new SurveyForm();
});