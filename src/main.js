document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ИНИЦИАЛИЗАЦИЯ БИБЛИОТЕК ---
    lucide.createIcons();
    gsap.registerPlugin(ScrollTrigger);

    // Настройка Lenis (плавный скролл)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Синхронизация Lenis и ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // --- 2. ВАЛИДАЦИЯ ТЕЛЕФОНА (ЗАПРЕТ БУКВ) ---
    const phoneInput = document.getElementById('phone-input');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Удаляем всё, кроме цифр и знака +
            // /[^0-9+]/g означает: найти всё, что НЕ цифра и НЕ плюс, и заменить на пустоту
            const cursorPosition = e.target.selectionStart;
            const originalLength = e.target.value.length;
            
            e.target.value = e.target.value.replace(/[^0-9+]/g, '');
            
            // Сохраняем позицию курсора после фильтрации
            const newLength = e.target.value.length;
            e.target.setSelectionRange(cursorPosition - (originalLength - newLength), cursorPosition - (originalLength - newLength));
        });
    }

    // --- 3. МОБИЛЬНОЕ МЕНЮ ---
    const burger = document.getElementById('burger-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.querySelector('.header');
    const menuLinks = document.querySelectorAll('.mobile-menu__link');

    const toggleMenu = (state) => {
        const isActive = state !== undefined ? state : !mobileMenu.classList.contains('active');
        mobileMenu.classList.toggle('active', isActive);
        header.classList.toggle('menu-open', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    if (burger) {
        burger.addEventListener('click', () => toggleMenu());
    }

    menuLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // --- 4. АНИМАЦИИ ПОЯВЛЕНИЯ (БЕЗОПАСНЫЙ ЦИКЛ) ---
    const setupAnims = () => {
        // Очистка
        ScrollTrigger.getAll().forEach(t => t.kill());

        // Общая настройка для всех карточек (Data, Income, Tech)
        const animateItems = (selector, props) => {
            document.querySelectorAll(selector).forEach(el => {
                gsap.to(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                    },
                    opacity: 1,
                    ...props,
                    from: { opacity: 0, ...props.from }
                });
            });
        };

        animateItems('.info-card', { y: 0, duration: 0.8, ease: "back.out(1.4)", from: { y: 50 } });
        animateItems('.income-card', { scale: 1, duration: 0.6, from: { scale: 0.8 } });
        animateItems('.tech-item', { x: 0, duration: 0.6, from: { x: -50 } });

        // Hero (сразу)
        gsap.timeline()
            .to(".hero__title", { opacity: 1, x: 0, duration: 1, from: { opacity: 0, x: -50 } })
            .to(".hero__text", { opacity: 1, y: 0, duration: 0.6, from: { opacity: 0, y: 20 } }, "-=0.6")
            .to(".brutal-card", { opacity: 1, scale: 1, rotate: 0, duration: 0.8, from: { opacity: 0, scale: 0.8, rotate: 10 } }, "-=0.4");
    };

    // --- 5. ФОРМА И КАПЧА ---
    const contactForm = document.getElementById('main-form');
    if (contactForm) {
        const n1 = Math.floor(Math.random() * 10);
        const n2 = Math.floor(Math.random() * 5);
        const ans = n1 + n2;
        const label = document.getElementById('captcha-label');
        const captchaInput = document.getElementById('captcha-input');
        if (label) label.innerText = `РЕШИТЕ ПРИМЕР: ${n1} + ${n2} = ?`;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const success = document.getElementById('form-success');
            const error = document.getElementById('form-error');

            if (parseInt(captchaInput.value) === ans) {
                success.style.display = 'block';
                error.style.display = 'none';
                contactForm.style.opacity = '0.5';
                contactForm.style.pointerEvents = 'none';
            } else {
                error.style.display = 'block';
                gsap.to(captchaInput, { x: 5, repeat: 5, yoyo: true, duration: 0.05 });
            }
        });
    }

    // --- 6. COOKIE POPUP ---
    const cookiePopup = document.getElementById('cookie-popup');
    if (cookiePopup && !localStorage.getItem('fractal_cookies_accepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('active');
            gsap.to(cookiePopup, { opacity: 1, y: 0, duration: 0.5, from: { opacity: 0, y: 20 } });
        }, 2500);
    }

    const acceptBtn = document.getElementById('accept-cookies');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('fractal_cookies_accepted', 'true');
            cookiePopup.classList.remove('active');
        });
    }

    // Запуск после полной загрузки
    window.addEventListener('load', () => {
        setupAnims();
        ScrollTrigger.refresh();
    });
});