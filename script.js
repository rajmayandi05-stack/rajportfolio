document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // 1. Loading Screen
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => { loadingScreen.classList.add('hidden'); }, 2200);

    // 2. Mobile Menu
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileOverlay.classList.toggle('active');
            mobileBtn.classList.toggle('active');
        });
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileOverlay.classList.remove('active');
                mobileBtn.classList.remove('active');
            });
        });
    }

    // 3. Header scroll effect
    const header = document.getElementById('site-header');
    const bottomBar = document.getElementById('bottom-bar');
    const heroSection = document.getElementById('hero');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroH = heroSection ? heroSection.offsetHeight : 500;

        // Show bottom bar after scrolling past hero
        if (scrollY > heroH * 0.7) {
            bottomBar.classList.add('visible');
        } else {
            bottomBar.classList.remove('visible');
        }

        // Header background opacity
        if (scrollY > 100) {
            header.style.background = 'rgba(5,5,5,0.95)';
        } else {
            header.style.background = 'rgba(5,5,5,0.85)';
        }
    });

    // 4. Portfolio Filter
    const filterBtns = document.querySelectorAll('.filter-btn, .bottom-filter-btn, .nav-link[data-filter]');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    const applyFilter = (filter) => {
        // Update active state on all filter buttons
        document.querySelectorAll('.filter-btn, .bottom-filter-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.filter === filter);
        });

        portfolioItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden-item');
            } else {
                item.classList.add('hidden-item');
            }
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = btn.dataset.filter;
            if (filter) {
                e.preventDefault();
                applyFilter(filter);
            }
        });
    });

    // 5. Auto-detect video aspect ratios and apply grid classes
    portfolioItems.forEach(item => {
        const video = item.querySelector('.item-video');
        if (!video) return;

        const applyAspectClass = () => {
            const w = video.videoWidth;
            const h = video.videoHeight;
            if (!w || !h) return;

            const ratio = w / h;
            item.classList.remove('ar-landscape', 'ar-portrait', 'ar-square', 'ar-wide');

            if (ratio >= 2.0) {
                item.classList.add('ar-wide');       // Ultra-wide (21:9+)
            } else if (ratio > 1.2) {
                item.classList.add('ar-landscape');   // Landscape (16:9, etc)
            } else if (ratio < 0.8) {
                item.classList.add('ar-portrait');    // Portrait (9:16, etc)
            } else {
                item.classList.add('ar-square');      // Square-ish (1:1)
            }
        };

        // Detect when metadata is ready
        if (video.readyState >= 1) {
            applyAspectClass();
        } else {
            video.addEventListener('loadedmetadata', applyAspectClass);
        }

        // Add sound hint badge
        const hint = document.createElement('div');
        hint.className = 'sound-hint';
        hint.innerHTML = '🔊 SOUND';
        item.appendChild(hint);

        // Hover: play & unmute
        item.addEventListener('mouseenter', () => {
            video.muted = false;
            video.play().catch(() => {});
        });

        // Leave: pause & mute
        item.addEventListener('mouseleave', () => {
            video.muted = true;
            video.pause();
            video.currentTime = 0;
        });
    });

    // 6. Intersection Observer for reveal animations
    const revealEls = document.querySelectorAll('.portfolio-item, .about-content, .about-quote, .contact-massive-name, .contact-info-row, .send-mail-btn');
    revealEls.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));

    // 7. Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not([data-filter])');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 200;
            if (window.scrollY >= top) current = section.id;
        });
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = 'var(--sun)';
            }
        });
    });

    // 8. Golden Particles System
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;

        const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        class P {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.s = Math.random() * 2 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.25;
                this.vy = (Math.random() - 0.5) * 0.2 - 0.1;
                this.o = Math.random() * 0.4 + 0.1;
                this.fd = 1;
                this.fs = Math.random() * 0.003 + 0.001;
                const h = 35 + Math.random() * 20;
                const s = 70 + Math.random() * 30;
                const l = 55 + Math.random() * 25;
                this.c = `hsla(${h},${s}%,${l}%,`;
                this.life = 0;
                this.ml = 300 + Math.random() * 500;
            }
            update() {
                this.x += this.vx + Math.sin(this.life * 0.02) * 0.08;
                this.y += this.vy;
                this.o += this.fs * this.fd;
                if (this.o >= 0.5) this.fd = -1;
                if (this.o <= 0.05) this.fd = 1;
                this.life++;
                if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10 || this.life > this.ml) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2);
                ctx.fillStyle = this.c + this.o + ')';
                ctx.fill();
                if (this.s > 1.5) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.s * 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = this.c + (this.o * 0.12) + ')';
                    ctx.fill();
                }
            }
        }

        const count = Math.min(50, Math.floor(innerWidth / 30));
        for (let i = 0; i < count; i++) particles.push(new P());

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            animId = requestAnimationFrame(animate);
        };
        animate();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) cancelAnimationFrame(animId);
            else animate();
        });
    }
});
