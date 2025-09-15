// Survey Form JavaScript with Live Data Integration
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('surveyForm');
    const functionSelect = document.getElementById('function');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Function-specific sections
    const functionSections = {
        'Planning': document.getElementById('planningSpecific'),
        'Digital Merch': document.getElementById('digitalMerchSpecific'),
        'Replenishment': document.getElementById('replenishmentSpecific'),
        "Member's Mark": document.getElementById('membersMarkSpecific')
    };

    // Show/hide function-specific sections
    functionSelect.addEventListener('change', function() {
        // Hide all function-specific sections
        Object.values(functionSections).forEach(section => {
            if (section) section.classList.remove('active');
        });

        // Clear function-specific radio buttons
        document.querySelectorAll('input[name="functionSpecific1"], input[name="functionSpecific2"]').forEach(input => {
            input.checked = false;
        });

        // Show the selected function's section
        const selectedFunction = this.value;
        if (functionSections[selectedFunction]) {
            functionSections[selectedFunction].classList.add('active');
        }
    });

    // Enhanced rating option selection
    document.querySelectorAll('.rating-option').forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            const name = radio.name;
            
            // Remove selected class from all options with the same name
            document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
                input.closest('.rating-option').classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
            radio.checked = true;
        });
    });

    // Form validation
    function validateForm() {
        const requiredFields = ['mdpName', 'function', 'managerName', 'rotation'];
        const requiredRatings = ['jobKnowledge', 'qualityOfWork', 'communication', 'initiative'];
        
        // Check required text fields
        for (let field of requiredFields) {
            const element = document.getElementById(field);
            if (!element.value.trim()) {
                showError(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                element.focus();
                return false;
            }
        }

        // Check required ratings
        for (let rating of requiredRatings) {
            const selected = document.querySelector(`input[name="${rating}"]:checked`);
            if (!selected) {
                showError(`Please rate ${rating.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                return false;
            }
        }

        return true;
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Show success message
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Hide messages
    function hideMessages() {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    }

    // Form submission with live data integration
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        hideMessages();

        if (!validateForm()) {
            return;
        }

        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Submit to server API
            const response = await fetch('/api/survey-responses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Success - show message and redirect
                showSuccess(`Survey submitted successfully! Composite Score: ${result.compositeScore}/5.0`);
                
                // Reset form
                form.reset();
                document.querySelectorAll('.rating-option').forEach(option => {
                    option.classList.remove('selected');
                });
                Object.values(functionSections).forEach(section => {
                    if (section) section.classList.remove('active');
                });

                // Redirect to success page after delay
                setTimeout(() => {
                    window.location.href = '/success.html';
                }, 2000);

            } else {
                // Error response
                showError(result.error || 'Failed to submit survey. Please try again.');
            }

        } catch (error) {
            console.error('Survey submission error:', error);
            showError('Network error. Please check your connection and try again.');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Evaluation';
        }
    });

    // Real-time character count for text inputs
    const textInputs = document.querySelectorAll('input[type="text"]');
    textInputs.forEach(input => {
        input.addEventListener('input', function() {
            // Remove any previous validation styling
            this.style.borderColor = '';
            
            // Basic validation styling
            if (this.value.trim().length > 0) {
                this.style.borderColor = '#4CAF50';
            }
        });
    });

    // Auto-save draft functionality (optional)
    let draftTimer;
    function saveDraft() {
        const formData = new FormData(form);
        const draft = {};
        for (let [key, value] of formData.entries()) {
            draft[key] = value;
        }
        localStorage.setItem('surveyDraft', JSON.stringify(draft));
        console.log('Draft saved');
    }

    function loadDraft() {
        const draft = localStorage.getItem('surveyDraft');
        if (draft) {
            try {
                const data = JSON.parse(draft);
                Object.keys(data).forEach(key => {
                    const element = document.querySelector(`[name="${key}"]`);
                    if (element) {
                        if (element.type === 'radio') {
                            const radio = document.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                            if (radio) {
                                radio.checked = true;
                                radio.closest('.rating-option').classList.add('selected');
                            }
                        } else {
                            element.value = data[key];
                        }
                    }
                });
                
                // Trigger function change if function was saved
                if (data.function) {
                    functionSelect.dispatchEvent(new Event('change'));
                }
            } catch (e) {
                console.error('Error loading draft:', e);
            }
        }
    }

    // Save draft on input changes
    form.addEventListener('input', function() {
        clearTimeout(draftTimer);
        draftTimer = setTimeout(saveDraft, 1000); // Save after 1 second of inactivity
    });

    // Load draft on page load
    loadDraft();

    // Clear draft on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem('surveyDraft');
    });

    // Form field animations
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });

    // Keyboard navigation for rating options
    document.addEventListener('keydown', function(e) {
        if (e.target.type === 'radio') {
            const name = e.target.name;
            const options = document.querySelectorAll(`input[name="${name}"]`);
            const currentIndex = Array.from(options).indexOf(e.target);
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % options.length;
                options[nextIndex].focus();
                options[nextIndex].click();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + options.length) % options.length;
                options[prevIndex].focus();
                options[prevIndex].click();
            }
        }
    });

    console.log('Survey form initialized with live data integration');
});