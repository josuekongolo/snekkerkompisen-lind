/**
 * Snekkerkompisen Lind - Main JavaScript
 * Din snekker-kompis i Gjovik og omegn
 */

(function() {
    'use strict';

    // ============================================
    // Mobile Navigation
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close menu when clicking on a link
        const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileNav.contains(event.target) && !menuToggle.contains(event.target)) {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Contact Form Handling
    // ============================================
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                location: document.getElementById('location').value,
                projectType: document.getElementById('projectType').value,
                description: document.getElementById('description').value,
                siteVisit: document.getElementById('siteVisit').checked
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.projectType || !formData.description) {
                showError('Vennligst fyll ut alle paakrevde felt.');
                return;
            }

            // Validate email format
            if (!isValidEmail(formData.email)) {
                showError('Vennligst skriv inn en gyldig e-postadresse.');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sender...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            // For production, integrate with Resend API or other email service
            setTimeout(function() {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Show success message
                showSuccess();

                // Reset form
                contactForm.reset();

                // Log form data (for development)
                console.log('Form submitted:', formData);

                // In production, send to API:
                // sendToResendAPI(formData);
            }, 1500);
        });
    }

    function showSuccess() {
        if (formSuccess) {
            formSuccess.style.display = 'block';
            if (formError) formError.style.display = 'none';

            // Scroll to message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide after 10 seconds
            setTimeout(function() {
                formSuccess.style.display = 'none';
            }, 10000);
        }
    }

    function showError(message) {
        if (formError) {
            formError.innerHTML = '<strong>Feil:</strong><br>' + message;
            formError.style.display = 'block';
            if (formSuccess) formSuccess.style.display = 'none';

            // Scroll to message
            formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ============================================
    // Resend API Integration (Production)
    // ============================================
    // Uncomment and configure for production use
    /*
    async function sendToResendAPI(formData) {
        const RESEND_API_KEY = 'YOUR_RESEND_API_KEY';
        const TO_EMAIL = 'post@snekkerkompisen-lind.no';

        const projectTypeLabels = {
            'renovering': 'Renovering / Oppussing',
            'tilbygg': 'Tilbygg / Pabygg',
            'innvendig': 'Innvendig snekkerarbeid',
            'utvendig': 'Utvendig snekkerarbeid',
            'hytte': 'Hyttearbeid',
            'smajobber': 'Smajobber / Vedlikehold',
            'annet': 'Annet'
        };

        const emailBody = `
            <h2>Ny henvendelse fra nettsiden</h2>
            <p><strong>Navn:</strong> ${formData.name}</p>
            <p><strong>E-post:</strong> ${formData.email}</p>
            <p><strong>Telefon:</strong> ${formData.phone}</p>
            <p><strong>Sted:</strong> ${formData.location || 'Ikke oppgitt'}</p>
            <p><strong>Type arbeid:</strong> ${projectTypeLabels[formData.projectType] || formData.projectType}</p>
            <p><strong>Onsker befaring:</strong> ${formData.siteVisit ? 'Ja' : 'Nei'}</p>
            <h3>Beskrivelse:</h3>
            <p>${formData.description.replace(/\n/g, '<br>')}</p>
        `;

        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'nettside@snekkerkompisen-lind.no',
                    to: TO_EMAIL,
                    subject: `Ny henvendelse: ${projectTypeLabels[formData.projectType]} fra ${formData.name}`,
                    html: emailBody,
                    reply_to: formData.email
                })
            });

            if (response.ok) {
                showSuccess();
                contactForm.reset();
            } else {
                throw new Error('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            showError('Kunne ikke sende meldingen. Proev igjen eller ring direkte.');
        }
    }
    */

    // ============================================
    // Header Scroll Effect
    // ============================================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.08)';
        }

        lastScrollTop = scrollTop;
    });

    // ============================================
    // Lazy Loading Images
    // ============================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Form Field Validation Feedback
    // ============================================
    const formFields = document.querySelectorAll('input, select, textarea');

    formFields.forEach(function(field) {
        field.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '';
            }
        });

        field.addEventListener('focus', function() {
            this.style.borderColor = '';
        });
    });

    // ============================================
    // Phone Number Formatting
    // ============================================
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Remove non-numeric characters except spaces
            let value = this.value.replace(/[^\d\s]/g, '');

            // Limit length
            if (value.replace(/\s/g, '').length > 12) {
                value = value.substring(0, 14);
            }

            this.value = value;
        });
    }

    // ============================================
    // Accessibility: Focus Management
    // ============================================
    // Skip to main content for keyboard users
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const main = document.querySelector('main');
            if (main) {
                main.setAttribute('tabindex', '-1');
                main.focus();
            }
        });
    }

    // ============================================
    // Service Cards Animation on Scroll
    // ============================================
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.service-card, .feature-item, .value-card');

        const animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            animationObserver.observe(el);
        });
    }

    // ============================================
    // Click to Call Tracking (for analytics)
    // ============================================
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Track phone call click (integrate with analytics)
            console.log('Phone call initiated');

            // For Google Analytics 4:
            // gtag('event', 'click', { event_category: 'Contact', event_label: 'Phone Call' });
        });
    });

    // ============================================
    // Email Link Tracking
    // ============================================
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

    emailLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // Track email click (integrate with analytics)
            console.log('Email link clicked');

            // For Google Analytics 4:
            // gtag('event', 'click', { event_category: 'Contact', event_label: 'Email' });
        });
    });

    // ============================================
    // Console Welcome Message
    // ============================================
    console.log('%cSnekkerkompisen Lind', 'color: #2D5016; font-size: 24px; font-weight: bold;');
    console.log('%cDin snekker-kompis i Gjovik og omegn', 'color: #B8860B; font-size: 14px;');
    console.log('Trenger du snekkerarbeid? Ta kontakt: post@snekkerkompisen-lind.no');

})();
