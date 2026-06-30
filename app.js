/**
 * Can Fabs Premium Website Interactive Engine
 * Handles navigation scroll effects, scroll revelations, animated stats counters,
 * portfolio filters, image lightbox, testimonial sliders, accordion FAQs, and forms.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Header & Navigation Interactions
       ========================================================================== */
    const header = document.querySelector('.main-header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add scrolled class to header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    mobileNavToggle.addEventListener('click', () => {
        mobileNavToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Close Mobile Menu on Link Click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });

    // Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       2. Scroll Reveal Animations (Intersection Observer)
       ========================================================================== */
    const revealItems = document.querySelectorAll('.reveal-item');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });


    /* ==========================================================================
       3. Statistics Counter Animation
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const runCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // Animation duration in milliseconds
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;
            
            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    stat.textContent = target + (target === 30 || target === 500 || target === 1000 ? '+' : '');
                    clearInterval(timer);
                } else {
                    stat.textContent = current;
                }
            }, stepTime);
        });
    };

    // Observer to trigger counter animations when section is visible
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    runCounters();
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }


    /* ==========================================================================
       4. Portfolio Filtering & Sorting
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(',');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    });


    /* ==========================================================================
       5. Lightbox Modal for Projects Gallery
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxDesc = lightbox.querySelector('.lightbox-desc');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    let currentImagesList = [];
    let currentImageIndex = 0;

    // Collect images based on filter
    const updateImagesList = () => {
        currentImagesList = [];
        portfolioItems.forEach(item => {
            if (item.style.display !== 'none') {
                const img = item.querySelector('.portfolio-img');
                const name = item.querySelector('.project-name').textContent;
                const desc = item.querySelector('.project-desc').textContent;
                const loc = item.querySelector('.project-loc').textContent;
                
                currentImagesList.push({
                    src: img.src,
                    alt: img.alt,
                    title: name,
                    description: `${desc} (${loc})`
                });
            }
        });
    };

    const openLightbox = (index) => {
        updateImagesList();
        
        // Find matched index in our active items list
        const clickedSrc = triggers[index].closest('.portfolio-item').querySelector('.portfolio-img').src;
        currentImageIndex = currentImagesList.findIndex(item => item.src === clickedSrc);
        
        if (currentImageIndex === -1) currentImageIndex = 0;

        showImage();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    };

    const showImage = () => {
        const item = currentImagesList[currentImageIndex];
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt;
        lightboxTitle.textContent = item.title;
        lightboxDesc.textContent = item.description;
    };

    const nextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % currentImagesList.length;
        showImage();
    };

    const prevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + currentImagesList.length) % currentImagesList.length;
        showImage();
    };

    portfolioItems.forEach((item, idx) => {
        item.addEventListener('click', (e) => {
            openLightbox(idx);
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Unlock scrolling
    });

    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    // Keyboard support for Lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') {
            lightboxClose.click();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        }
    });


    /* ==========================================================================
       6. Testimonials Slider
       ========================================================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    let currentSlide = 0;
    let autoSlideInterval;

    const showSlide = (idx) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = idx;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 6000); // Transitions slide every 6 seconds
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    if (slides.length > 0) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            resetAutoSlide();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetIdx = parseInt(dot.getAttribute('data-slide'), 10);
                showSlide(targetIdx);
                resetAutoSlide();
            });
        });

        // Initialize Testimonials
        startAutoSlide();
    }


    /* ==========================================================================
       7. Accordion FAQs
       ========================================================================== */
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });


    /* ==========================================================================
       8. Quote Form Handling & Success Dialog
       ========================================================================== */
    const quoteForm = document.getElementById('quoteForm');
    const successModal = document.getElementById('successModal');
    const successCloseBtn = document.querySelector('.success-close-btn');

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values
            const formData = new FormData(quoteForm);
            const submission = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                service: formData.get('service'),
                message: formData.get('message')
            };
            
            // Trigger mailto client-side dispatch to direct email recipient
            const subject = encodeURIComponent(`Can Fabs Quote Request from ${submission.name}`);
            const body = encodeURIComponent(
                `Can Fabs Quote Request Details:\n\n` +
                `Name: ${submission.name}\n` +
                `Phone: ${submission.phone}\n` +
                `Email: ${submission.email || 'Not Provided'}\n` +
                `Requested Service: ${submission.service}\n\n` +
                `Message / Project Dimensions:\n${submission.message || 'No additional details provided.'}`
            );
            
            const mailtoUrl = `mailto:canfabscbe@gmail.com?subject=${subject}&body=${body}`;
            
            // Open Success Popup dialog
            successModal.classList.add('active');
            successModal.setAttribute('aria-hidden', 'false');
            
            // Reset fields
            quoteForm.reset();

            // Redirect user to open default email client with details pre-filled
            window.location.href = mailtoUrl;
        });
    }

    if (successModal) {
        successCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
            successModal.setAttribute('aria-hidden', 'true');
        });

        // Click outside success content to close
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successCloseBtn.click();
            }
        });
    }

});
