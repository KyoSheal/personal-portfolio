// Data Management
class PortfolioData {
    constructor() {
        this.data = {};
    }

    async loadAllData() {
        try {
            const [profile, experience, projects, skills] = await Promise.all([
                this.loadData('data/profile.json'),
                this.loadData('data/experience.json'),
                this.loadData('data/projects.json'),
                this.loadData('data/skills.json')
            ]);

            this.data = { profile, experience, projects, skills };
            return this.data;
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }

    async loadData(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error(`Failed to load ${url}:`, error);
            return null;
        }
    }
}

// Data Binding
class DataBinder {
    constructor() {
        this.data = {};
    }

    setData(data) {
        this.data = data;
    }





    // Bind work experience
    bindExperience() {
        const experienceContainer = document.querySelector('[data-experience="items"]');
        console.log('Experience container:', experienceContainer);
        console.log('Experience data:', this.data.experience);
        
        if (experienceContainer && this.data.experience?.items) {
            console.log('Binding experience items:', this.data.experience.items);
            experienceContainer.innerHTML = this.data.experience.items.map(item => `
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-header">
                            <h3>${item.position}</h3>
                            <span class="company">${item.company}</span>
                            <span class="period">${item.period}</span>
                            ${item.location ? `<span class="location">${item.location}</span>` : ''}
                        </div>
                        <p>${item.description}</p>
                        <div class="tech-stack">
                            ${item.techStack.map(tech => `<span>${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            console.error('Experience container or data not found');
        }
    }

    // Bind projects
    bindProjects() {
        const projectsContainer = document.querySelector('[data-projects="items"]');
        if (projectsContainer && this.data.projects?.items) {
            projectsContainer.innerHTML = this.data.projects.items.map(project => `
                <div class="project-card">
                    <div class="project-image">
                        <i class="${project.icon}"></i>
                        <div class="project-overlay">
                            <div class="project-links">
                                <a href="${project.links.demo}" class="project-link" target="_blank">
                                    <i class="fas fa-external-link-alt"></i>
                                </a>
                                <a href="${project.links.github}" class="project-link" target="_blank">
                                    <i class="fab fa-github"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="project-content">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Bind social media links
    bindSocial() {
        // Bind large social media icons in contact section
        const largeSocialContainers = document.querySelectorAll('[data-profile="social"]');
        if (this.data.profile?.social) {
            largeSocialContainers.forEach(container => {
                if (container.classList.contains('social-links-large')) {
                    // Large icons for contact section
                    container.innerHTML = this.data.profile.social.map(social => `
                        <a href="${social.url}" class="social-link" target="_blank" title="${social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}">
                            <i class="${social.icon}"></i>
                        </a>
                    `).join('');
                } else {
                    // Regular icons for footer
                    container.innerHTML = this.data.profile.social.map(social => `
                        <a href="${social.url}" class="social-link" target="_blank" title="${social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}">
                            <i class="${social.icon}"></i>
                        </a>
                    `).join('');
                }
            });
        }
    }

    // Bind all data
    bindAllData() {
        this.bindExperience();
        this.bindProjects();
        this.bindSocial();
    }
}

// Main Application Logic
class PortfolioApp {
    constructor() {
        this.dataManager = new PortfolioData();
        this.dataBinder = new DataBinder();
    }

    async init() {
        // Load data
        const data = await this.dataManager.loadAllData();
        this.dataBinder.setData(data);
        
        // Bind data to page
        this.dataBinder.bindAllData();
        
        // Initialize interactions
        this.initInteractions();
        this.initAnimations();
    }

    initInteractions() {
        // Navigation menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Contact form handling
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Project card hover effects
        this.initProjectCards();
        
        // Skill tag hover effects
        this.initSkillTags();
    }

    initAnimations() {
        // Scroll animations
        this.initScrollAnimations();
        
        // Timeline animations
        this.initTimelineAnimations();
        

        
        // Page load animations
        this.initPageLoadAnimations();
    }

    // Contact form handling
    handleContactForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Simple form validation
        if (!data.name || !data.email || !data.message) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate successful send
        this.showNotification('Message sent successfully!', 'success');
        e.target.reset();
    }

    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto hide
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Project card effects
    initProjectCards() {
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.project-card')) {
                const card = e.target.closest('.project-card');
                card.style.transform = 'translateY(-10px)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.project-card')) {
                const card = e.target.closest('.project-card');
                card.style.transform = 'translateY(0)';
            }
        });
    }

    // Skill tag effects
    initSkillTags() {
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('skill-tag')) {
                e.target.style.transform = 'scale(1.1)';
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('skill-tag')) {
                e.target.style.transform = 'scale(1)';
            }
        });
    }

    // Scroll animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements that need animation
        document.querySelectorAll('.section-header, .about-card, .project-card, .timeline-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Timeline animations
    initTimelineAnimations() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
            timelineObserver.observe(item);
        });
    }



    // Page load animations
    initPageLoadAnimations() {
        // Page fade in effect
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);

        // Hero area typewriter effect
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            this.typeWriter(heroTitle, heroTitle.textContent);
        }
    }

    // Typewriter effect
    typeWriter(element, text) {
        element.textContent = '';
        let i = 0;
        const speed = 100;
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        setTimeout(type, 1000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp().init();
});
