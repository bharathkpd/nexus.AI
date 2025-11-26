document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursor = document.querySelector('.cursor-glow');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Trigger number counter animation if it's a stat number
                if (entry.target.querySelector('.stat-number')) {
                    entry.target.querySelectorAll('.stat-number').forEach(counter => {
                        animateValue(counter);
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .stats-grid').forEach(el => {
        observer.observe(el);
    });

    // Number Counter Animation
    function animateValue(obj) {
        const target = parseInt(obj.getAttribute('data-target'));
        const duration = 2000;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease out quart
            const easeProgress = 1 - Math.pow(1 - progress, 4);

            obj.innerHTML = Math.floor(easeProgress * target) + (obj.nextElementSibling.innerText.includes('%') ? '%' : '+');

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = target + (obj.nextElementSibling.innerText.includes('%') ? '%' : '+');
            }
        };

        window.requestAnimationFrame(step);
    }

    // Neural Network Canvas Background
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.baseColor = 'rgba(112, 0, 255, '; // Primary color base
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor + '0.5)';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.min(width * 0.05, 60); // Responsive count
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(112, 0, 255, ${0.15 - distance / 1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    // Code Typing Simulation
    const codeLines = document.querySelectorAll('.code-editor .line');
    const executionPanel = document.querySelector('.execution-panel');
    const statusLine = document.querySelector('.status-line');
    const successMsg = document.querySelector('.success-msg');

    setTimeout(() => {
        statusLine.classList.add('hidden');
        successMsg.classList.remove('hidden');
    }, 3000);

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Change icon
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                body.style.overflow = 'auto';
            }
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                body.style.overflow = 'auto';
            });
        });
    }

    // Form Submission Handling
    const emailForm = document.querySelector('.email-form');
    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputGroup = emailForm.querySelector('.input-group');
            const button = emailForm.querySelector('button');
            const input = emailForm.querySelector('input');

            // Simulate loading
            const originalBtnText = button.innerText;
            button.innerText = 'Sending...';
            button.disabled = true;

            setTimeout(() => {
                // Success state
                inputGroup.classList.add('success');
                button.classList.add('success');
                button.innerHTML = '<i class="fas fa-check"></i> Joined';
                input.value = 'Welcome to Nexus AI!';
                input.disabled = true;

                // Reset after 5 seconds (optional)
                // setTimeout(() => {
                //     inputGroup.classList.remove('success');
                //     button.classList.remove('success');
                //     button.innerText = originalBtnText;
                //     button.disabled = false;
                //     input.value = '';
                //     input.disabled = false;
                // }, 5000);
            }, 1500);
        });
    }

});
