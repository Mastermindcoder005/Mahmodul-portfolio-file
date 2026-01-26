document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.menu-btn');
    const nav = document.querySelector('.nav');

    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuBtn.classList.toggle('open');
        // We can add a simple burger animation class 'open' if we want to animate the icon later
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuBtn.classList.remove('open');
        });
    });


    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.2
    };

    // --- Counting Animation Function ---
    const animateValue = (obj, start, end, duration, suffix = '') => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate Skill Bars & Percentages
                if (entry.target.classList.contains('skill-card')) {
                    const progressBar = entry.target.querySelector('.skill-progress');
                    const percentText = entry.target.querySelector('.skill-percent');

                    if (progressBar.classList.contains('js-loading-bar')) {
                        // Custom Infinite Loading Animation for JS
                        let width = 10;
                        let growing = true;

                        const animateJS = () => {
                            if (growing) {
                                width += 0.5;
                                if (width >= 95) growing = false;
                            } else {
                                width -= 0.5;
                                if (width <= 10) growing = true;
                            }
                            progressBar.style.width = `${width}%`;
                            requestAnimationFrame(animateJS);
                        };
                        animateJS();

                        // Cycle Loading Text
                        const texts = ["Loading...", "Learning...", "Debugging...", "Developing..."];
                        let textIndex = 0;
                        setInterval(() => {
                            textIndex = (textIndex + 1) % texts.length;
                            if (percentText) percentText.innerText = texts[textIndex];
                        }, 2000);
                    } else {
                        const width = progressBar.getAttribute('data-width');
                        progressBar.style.width = width;

                        // Animate percentage
                        if (percentText) {
                            const targetVal = parseInt(percentText.innerText);
                            animateValue(percentText, 0, targetVal, 1500, '%');
                        }
                    }
                }

                // Element Reveal Animation
                if (entry.target.classList.contains('reveal')) {
                    entry.target.classList.add('active');
                }

                // Animate Stats
                if (entry.target.classList.contains('stat-item')) {
                    const numberEl = entry.target.querySelector('.stat-number');
                    const text = numberEl.innerText;
                    const suffix = text.replace(/[0-9]/g, '');
                    const targetVal = parseInt(text);
                    animateValue(numberEl, 0, targetVal, 2000, suffix);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe Skill Cards
    document.querySelectorAll('.skill-card').forEach(card => {
        animateOnScroll.observe(card);
    });

    // Observe Stat Items
    document.querySelectorAll('.stat-item').forEach(item => {
        animateOnScroll.observe(item);
    });

    // Observe Reveal Elements
    document.querySelectorAll('.reveal').forEach(el => {
        animateOnScroll.observe(el);
    });


    // --- Active Link Highlighting ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id) {
                    navLinks.forEach(link => {
                        // Only remove active class if we found a match to add
                        // This prevents flickering if multiple sections are briefly in view
                        if (link.getAttribute('href').includes(id)) {
                            navLinks.forEach(l => l.classList.remove('active'));
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        activeLinkObserver.observe(section);
    });


    // --- Header Scroll Effect ---
    // --- Header Scroll Effect (Hide on Scroll Down, Show on Scroll Up) ---
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    const delta = 5;

    window.addEventListener('scroll', () => {
        const st = window.scrollY;

        // Toggle Glass Effect
        if (st > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/Show logic
        if (Math.abs(lastScrollTop - st) <= delta) return;

        if (st > lastScrollTop && st > 80) {
            // Scroll Down
            header.classList.add('hidden');
        } else {
            // Scroll Up
            header.classList.remove('hidden');
        }

        lastScrollTop = st;
    });

    // --- Text Scramble Effect (COMMENTED OUT) ---
    /*
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.uppercaseChars = 'QWERTYUIOPASDFGHJKLZXCVBNM';
            this.lowercaseChars = 'qwertyuiopasdfghjklzxcvbnm';
            this.symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
            this.update = this.update.bind(this);
        }
        
        getCharType(char) {
            if (/[A-Z]/.test(char)) return 'uppercase';
            if (/[a-z]/.test(char)) return 'lowercase';
            if (/[0-9]/.test(char)) return 'digit';
            if (/\s/.test(char)) return 'space';
            return 'symbol';
        }
        
        getRandomCharForType(type) {
            switch(type) {
                case 'uppercase':
                    return this.uppercaseChars[Math.floor(Math.random() * this.uppercaseChars.length)];
                case 'lowercase':
                    return this.lowercaseChars[Math.floor(Math.random() * this.lowercaseChars.length)];
                case 'digit':
                    return String(Math.floor(Math.random() * 10));
                case 'symbol':
                    return this.symbolChars[Math.floor(Math.random() * this.symbolChars.length)];
                case 'space':
                    return ' ';
                default:
                    return this.uppercaseChars[Math.floor(Math.random() * this.uppercaseChars.length)];
            }
        }
        
        setText(newText, originalHTML) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const charType = this.getCharType(to);
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 60);
                this.queue.push({ from, to, start, end, charType });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.originalHTML = originalHTML;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char, charType } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.getRandomCharForType(charType);
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }

    const scrambleEl = document.querySelector('.scramble-text');
    if (scrambleEl) {
        const originalHTML = scrambleEl.innerHTML;
        const textContent = scrambleEl.innerText;
        
        // Clear the text initially
        scrambleEl.innerText = '';
        
        const fx = new TextScramble(scrambleEl);

        // Start effect after a short delay
        setTimeout(() => {
            scrambleEl.classList.add('active');
            fx.setText(textContent, originalHTML);
        }, 1000);
    }
    */

    // --- Typing Effect ---
    const typingEl = document.querySelector('.scramble-text');
    if (typingEl) {
        const originalHTML = typingEl.innerHTML;
        const textContent = typingEl.innerText;

        // Clear initially and add cursor
        typingEl.innerHTML = '<span class="typing-cursor">|</span>';

        let charIndex = 0;
        const typingSpeed = 100; // milliseconds per character

        setTimeout(() => {
            typingEl.classList.add('active');

            const typeChar = () => {
                if (charIndex < textContent.length) {
                    const currentText = textContent.substring(0, charIndex + 1);
                    typingEl.innerHTML = currentText + '<span class="typing-cursor">|</span>';
                    charIndex++;
                    setTimeout(typeChar, typingSpeed);
                } else {
                    // Finished typing, restore original HTML with highlight
                    typingEl.innerHTML = originalHTML;
                }
            };

            typeChar();
        }, 1000);
    }
});
