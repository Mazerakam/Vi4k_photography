// Contact page specific JavaScript

// ========================================
// EmailJS Configuration
// ========================================

// EmailJS configuration (replace with your own keys)
const EMAILJS_CONFIG = {
    serviceID: 'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
    templateID: 'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
    publicKey: 'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
};

// ========================================
// Contact Form Variables
// ========================================
let isSubmitting = false;

// ========================================
// Contact Form Functions
// ========================================

// Initialize contact form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Initialize EmailJS if keys are provided
    if (EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' && typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized');
    } else {
        console.warn('EmailJS not configured. Please update EMAILJS_CONFIG in contact.js');
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(data)) {
        return;
    }
    
    try {
        isSubmitting = true;
        updateSubmitButton(true);
        hideMessages();
        
        // Check if EmailJS is configured
        if (EMAILJS_CONFIG.publicKey === 'YOUR_PUBLIC_KEY' || typeof emailjs === 'undefined') {
            // Simulate form submission for demo
            await simulateFormSubmission(data);
        } else {
            // Send email via EmailJS
            await sendEmailViaEmailJS(data);
        }
        
        showSuccessMessage(data);
        form.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showErrorMessage(error.message || 'Une erreur est survenue lors de l\'envoi du message.');
    } finally {
        isSubmitting = false;
        updateSubmitButton(false);
    }
}

// Validate form data
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères.');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Veuillez entrer une adresse email valide.');
    }
    
    if (!data.subject || data.subject.trim().length < 3) {
        errors.push('Le sujet doit contenir au moins 3 caractères.');
    }
    
    if (!data.category) {
        errors.push('Veuillez sélectionner un type de projet.');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Le message doit contenir au moins 10 caractères.');
    }
    
    if (errors.length > 0) {
        showErrorMessage(errors.join(' '));
        return false;
    }
    
    return true;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Send email via EmailJS
async function sendEmailViaEmailJS(data) {
    const templateParams = {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone || 'Non renseigné',
        subject: data.subject,
        category: data.category,
        preferred_date: data.date || 'Non renseigné',
        message: data.message,
        to_name: portfolioData.photographer ? portfolioData.photographer.name : 'Alex Dubois'
    };
    
    const response = await emailjs.send(
        EMAILJS_CONFIG.serviceID,
        EMAILJS_CONFIG.templateID,
        templateParams
    );
    
    if (response.status !== 200) {
        throw new Error('Échec de l\'envoi de l\'email');
    }
    
    return response;
}

// Simulate form submission for demo
async function simulateFormSubmission(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate success
    console.log('Form data submitted (demo):', data);
    return { status: 'success' };
}

// ========================================
// UI Update Functions
// ========================================

// Update submit button state
function updateSubmitButton(loading) {
    const submitBtn = document.getElementById('submit-btn');
    if (!submitBtn) return;
    
    const btnText = submitBtn.querySelector('.btn__text');
    const btnSpinner = submitBtn.querySelector('.btn__spinner');
    
    if (loading) {
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnSpinner) btnSpinner.style.display = 'flex';
    } else {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'block';
        if (btnSpinner) btnSpinner.style.display = 'none';
    }
}

// Hide all messages
function hideMessages() {
    const successElement = document.getElementById('contact-success');
    const errorElement = document.getElementById('contact-error');
    const formElement = document.getElementById('contact-form');
    
    if (successElement) successElement.style.display = 'none';
    if (errorElement) errorElement.style.display = 'none';
    if (formElement) formElement.style.display = 'block';
}

// Show success message
function showSuccessMessage(data) {
    const successElement = document.getElementById('contact-success');
    const formElement = document.getElementById('contact-form');
    const successName = document.getElementById('success-name');
    const successDetails = document.getElementById('success-details');
    
    if (!successElement) return;
    
    // Update success message with user data
    if (successName) {
        successName.textContent = data.name;
    }
    
    if (successDetails) {
        const categoryName = getCategoryDisplayName(data.category);
        let details = `
            <p><strong>Sujet :</strong> ${data.subject}</p>
            <p><strong>Catégorie :</strong> ${categoryName}</p>
        `;
        
        if (data.date) {
            details += `<p><strong>Date souhaitée :</strong> ${formatDate(data.date)}</p>`;
        }
        
        successDetails.innerHTML = details;
    }
    
    // Show success, hide form
    successElement.style.display = 'block';
    if (formElement) formElement.style.display = 'none';
    
    // Scroll to success message
    successElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Show error message
function showErrorMessage(message) {
    const errorElement = document.getElementById('contact-error');
    const errorMessage = document.getElementById('error-message');
    
    if (!errorElement) return;
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    
    errorElement.style.display = 'block';
    
    // Scroll to error message
    errorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
        if (errorElement.style.display === 'block') {
            errorElement.style.display = 'none';
        }
    }, 5000);
}

// Get category display name
function getCategoryDisplayName(categoryId) {
    if (categoryId === 'autre') return 'Autre';
    
    const category = getCategoryById(categoryId);
    return category ? category.name : categoryId;
}

// ========================================
// Additional UI Functions
// ========================================

// Initialize send another message button
function initSendAnotherButton() {
    const sendAnotherBtn = document.getElementById('send-another');
    if (!sendAnotherBtn) return;
    
    sendAnotherBtn.addEventListener('click', () => {
        hideMessages();
        
        // Scroll to form
        const formElement = document.getElementById('contact-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Format date for display
function formatContactDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ========================================
// Contact Page Initialization
// ========================================

// Initialize contact page
function initContactPageFeatures() {
    initContactForm();
    initSendAnotherButton();
    
    // Load contact services (handled by main.js)
    if (typeof loadContactServices === 'function') {
        loadContactServices();
    }
    
    console.log('Contact page initialized');
}

// ========================================
// Page Load Event
// ========================================

// Initialize contact page when data is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for main.js to load
        setTimeout(initContactPageFeatures, 100);
    });
} else {
    setTimeout(initContactPageFeatures, 100);
}

// ========================================
// EmailJS Setup Instructions
// ========================================

console.log(`
📧 EmailJS Setup Instructions:

1. Go to https://www.emailjs.com/ and create an account
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - {{from_name}}
   - {{from_email}} 
   - {{phone}}
   - {{subject}}
   - {{category}}
   - {{preferred_date}}
   - {{message}}
   - {{to_name}}

4. Update the EMAILJS_CONFIG object in contact.js:
   - serviceID: Your service ID
   - templateID: Your template ID  
   - publicKey: Your public key

5. Add EmailJS script to contact.html:
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>

Without EmailJS configuration, the form will work in demo mode.
`);

// Export functions for external use
window.contactPage = {
    initContactForm,
    handleFormSubmit,
    validateForm,
    showSuccessMessage,
    showErrorMessage,
    formatContactDate
};