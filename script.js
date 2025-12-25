document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.querySelector('.primary-navigation');

    navToggle.addEventListener('click', () => {
        const isVisible = primaryNav.getAttribute('data-visible') === 'true';
        primaryNav.setAttribute('data-visible', !isVisible);
        navToggle.setAttribute('aria-expanded', !isVisible);
    });

    // Close nav when clicking a link
    primaryNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            primaryNav.setAttribute('data-visible', false);
            navToggle.setAttribute('aria-expanded', false);
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.fade-in-scroll');
    scrollElements.forEach(el => observer.observe(el));

    // Generic Form Toggle Logic
    const toggleForm = (btnId, formId, otherFormId) => {
        const btn = document.getElementById(btnId);
        const form = document.getElementById(formId);
        const otherForm = document.getElementById(otherFormId);

        if (btn && form) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                // Close other form if open
                if (otherForm && !otherForm.classList.contains('hidden')) {
                    otherForm.classList.add('hidden');
                }

                form.classList.toggle('hidden');

                if (!form.classList.contains('hidden')) {
                    setTimeout(() => {
                        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            });

            form.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault();

                const formData = new FormData(e.target);
                const submitBtn = e.target.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;

                // Set loading state
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                // Convert FormData to JSON object, handling duplicate keys as arrays
                const data = {};
                for (const [key, value] of formData.entries()) {
                    if (data[key]) {
                        if (!Array.isArray(data[key])) {
                            data[key] = [data[key]];
                        }
                        data[key].push(value);
                    } else {
                        data[key] = value;
                    }
                }

                // Add configuration fields
                data._subject = formId === 'volunteer-form-container' ? 'New Volunteer Application' : 'Equipment Donation Offer';
                data._captcha = 'false';
                data._template = 'table';

                fetch('https://formsubmit.co/ajax/e78a3eecd44f450fb81e033a2269a425', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(data => {
                        alert('Thank you for your submission, we\'ll be in touch soon!');
                        form.classList.add('hidden');
                        e.target.reset();

                        // Scroll to Join the Movement section
                        const involvedSection = document.getElementById('involved');
                        if (involvedSection) {
                            setTimeout(() => {
                                involvedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 300);
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Oops! Something went wrong. Please try again later.');
                    })
                    .finally(() => {
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    });
            });
        }
    };

    // Initialize toggles for Volunteer and Donate forms
    toggleForm('btn-volunteer', 'volunteer-form-container', 'donate-form-container');
    toggleForm('btn-donate', 'donate-form-container', 'volunteer-form-container');

    // Generic Dropdown Toggle
    const toggleDropdown = (linkId, messageId) => {
        const link = document.getElementById(linkId);
        const message = document.getElementById(messageId);

        if (link && message) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Close other open dropdowns (optional, but good UX)
                document.querySelectorAll('.dropdown-message').forEach(el => {
                    if (el.id !== messageId) el.classList.add('hidden');
                });
                message.classList.toggle('hidden');
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (!link.contains(e.target) && !message.contains(e.target)) {
                    message.classList.add('hidden');
                }
            });
        }
    };

    toggleDropdown('about-us-link', 'about-us-message');
    toggleDropdown('financials-link', 'financials-message');
    toggleDropdown('partners-link', 'partners-message');
    toggleDropdown('privacy-link', 'privacy-message');
    toggleDropdown('tos-link', 'tos-message');
});
