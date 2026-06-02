// =========================================================================
// 1. GLOBAL VARIABLES & ELEMENT SELECTORS
// =========================================================================
const hamburger = document.querySelector('.header .nav-bar .nav-list .hamburger');
const mobile_menu = document.querySelector('.header .nav-bar .nav-list ul');
const menu_item = document.querySelectorAll('.header .nav-bar .nav-list ul li a');
const header = document.querySelector('.header.container');
const brandLink = document.querySelector('#header .brand a');
const brandHeading = document.querySelector('#header .brand h1');
const brandAccents = document.querySelectorAll('#header .brand h1 span');
const themeButtons = document.querySelectorAll('[data-theme-option]');
const themeStorageKey = 'portfolio-theme';
const rootElement = document.documentElement;

// =========================================================================
// 2. THEME ENGINE & LOCAL STORAGE MECHANICS
// =========================================================================
function setTheme(themeName) {
    rootElement.setAttribute('data-theme', themeName);
    try {
        localStorage.setItem(themeStorageKey, themeName);
    } catch (error) {
        // Safe bypass for restricted browsing environments
    }
    themeButtons.forEach((button) => {
        const isActive = button.dataset.themeOption === themeName;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
}

const savedTheme = (() => {
    try {
        return localStorage.getItem(themeStorageKey);
    } catch (error) {
        return null;
    }
})();

setTheme(savedTheme || 'light');

themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        setTheme(button.dataset.themeOption || 'light');
    });
});

// =========================================================================
// 3. UTILITY FUNCTIONS (CLIPBOARD HANDLING)
// =========================================================================
function copyEmailToClipboard(emailAddress, statusElement) {
    const writeSuccess = () => {
        if (statusElement) {
            statusElement.textContent = `Copied ${emailAddress} to clipboard.`;
        }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailAddress).then(writeSuccess).catch(() => {
            if (statusElement) {
                statusElement.textContent = 'Clipboard access was blocked. Please copy the email manually.';
            }
        });
        return;
    }

    const fallbackInput = document.createElement('input');
    fallbackInput.value = emailAddress;
    fallbackInput.style.position = 'fixed';
    fallbackInput.style.left = '-9999px';
    document.body.appendChild(fallbackInput);
    fallbackInput.select();
    try {
        document.execCommand('copy');
        writeSuccess();
    } catch (error) {
        if (statusElement) {
            statusElement.textContent = 'Clipboard access was blocked. Please copy the email manually.';
        }
    } finally {
        document.body.removeChild(fallbackInput);
    }
}

document.querySelectorAll('[data-copy-email]').forEach((button) => {
    button.addEventListener('click', () => {
        const emailAddress = button.getAttribute('data-copy-email') || 'sharifssebuguzi06@gmail.com';
        const statusElement = document.querySelector('[data-copy-status]');
        copyEmailToClipboard(emailAddress, statusElement);
    });
});

// =========================================================================
// 4. INTERACTION LAYERS (MOBILE NAVIGATION)
// =========================================================================
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobile_menu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(mobile_menu.classList.contains('active')));
    });

    hamburger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            hamburger.click();
        }
    });
}

menu_item.forEach((item) => {
    item.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobile_menu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// =========================================================================
// 5. LIFECYCLE LISTENERS & INFINITE-LOOP SAFEGARD ENGINE
// =========================================================================
document.addEventListener("DOMContentLoaded", function () {
    const videos = document.querySelectorAll(".lazy-youtube");
    console.log("System initialized safely.");

    function updateHeaderState() {
        var scroll_position = window.scrollY;
        const isScrolled = scroll_position > 40;
        
        if (header) {
            header.classList.toggle('scrolled', isScrolled);
        }
        if (brandLink) {
            brandLink.style.backgroundColor = 'transparent';
            brandLink.style.boxShadow = 'none';
            brandLink.style.webkitBackdropFilter = 'none';
            brandLink.style.backdropFilter = 'none';
        }
        if (brandHeading) {
            brandHeading.style.color = isScrolled ? '#ffffff' : 'transparent';
        }
        brandAccents.forEach((accent) => {
            accent.style.color = isScrolled ? 'crimson' : 'transparent';
        });
    }

    function checkScrollPlay() {
        videos.forEach(iframe => {
            const videoId = iframe.getAttribute("data-video-id");
            const rect = iframe.getBoundingClientRect();
            
            const isVisible = (
                rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom > 0
            );

            if (isVisible) {
                // FIXED: Check a custom data attribute to lock execution and stop layout loops
                if (!iframe.getAttribute('data-is-loading')) {
                    iframe.setAttribute('data-is-loading', 'true');
                    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playlist=${videoId}&loop=1`;
                }
            } else {
                // Only clear the frame if it is actually loaded, preventing repetitive calculations
                if (iframe.getAttribute('data-is-loading')) {
                    iframe.removeAttribute('data-is-loading');
                    iframe.src = "";
                }
            }
        });
    }

    // Debounce wrapper to smoothly time execution under heavy scrolling
    let scrollTimeout;
    function handleGlobalScroll() {
        updateHeaderState();
        
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                checkScrollPlay();
                scrollTimeout = null;
            }, 100); // 100ms throttle keeps your frame rate ultra-smooth
        }
    }

    window.addEventListener("scroll", handleGlobalScroll);
    window.addEventListener("resize", handleGlobalScroll);
    
    // Run baseline evaluations on initial setup
    updateHeaderState();
    setTimeout(checkScrollPlay, 500);
});