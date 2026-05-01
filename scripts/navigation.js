export function initNavigation() {
    const hamburger   = document.querySelector('.hamburger');
    const navLinks    = document.querySelector('.nav-links');
    const menuItems   = document.querySelectorAll('nav ul li a');

    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger?.classList.remove('active');
        });
    });

    const sections = {
        resort: {
            menuItem: document.getElementById('resort-link'),
            section:  document.getElementById('booking-section'),
            tab:      document.getElementById('resort-booking-tab')
        },
        pool: {
            menuItem: document.getElementById('swimming-pool-link'),
            section:  document.getElementById('booking-section'),
            tab:      document.getElementById('pool-booking-tab')
        },
        events: {
            menuItem: document.getElementById('event-link'),
            section:  document.getElementById('booking-section'),
            tab:      document.getElementById('events-booking-tab')
        },
        rooms: {
            menuItem: document.getElementById('rooms-link'),
            section:  document.getElementById('rooms-section')
        },
        offers: {
            menuItem: document.getElementById('offer-link'),
            section:  document.getElementById('offers-section')
        },
        about: {
            menuItem: document.getElementById('about-link'),
            section:  document.getElementById('about-section')
        },
        contact: {
            menuItem: document.getElementById('contact-link'),
            section:  document.getElementById('contact-section')
        }
    };

    function setActive(item) {
        menuItems.forEach(i => i.classList.remove('active'));
        item?.classList.add('active');
    }

    function scrollTo(cfg, e) {
        e.preventDefault();
        cfg.section?.scrollIntoView({ behavior: 'smooth', block: cfg.tab ? 'center' : 'start' });
        setActive(cfg.menuItem);
        if (cfg.tab) {
            setTimeout(() => {
                document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
                cfg.tab.classList.add('active');
                window.TabManager?.setActiveTab(cfg.tab);
            }, 300);
        }
    }

    Object.values(sections).forEach(cfg => {
        cfg.menuItem?.addEventListener('click', e => scrollTo(cfg, e));
    });

    // Hero "Explore Pool Services" button
    document.getElementById('explore-service-link')?.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setActive(sections.rooms.menuItem);
    });

    // Reset active state at page top
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            setActive(sections.resort.menuItem);
            document.querySelector('.tab-item:first-child')?.classList.add('active');
        }
    });

    // Start at top
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.querySelector('.tab-item:first-child')?.classList.add('active');
    }, 100);
}
