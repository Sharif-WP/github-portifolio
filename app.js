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

function setTheme(themeName) {
	rootElement.setAttribute('data-theme', themeName);
	try {
		localStorage.setItem(themeStorageKey, themeName);
	} catch (error) {
		// localStorage can fail in private or restricted browsing contexts.
	}
	themeButtons.forEach((button) => {
		const isActive = button.dataset.themeOption === themeName;
		button.classList.toggle('active', isActive);
		button.setAttribute('aria-pressed', String(isActive));
	});
}

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

document.querySelectorAll('[data-copy-email]').forEach((button) => {
	button.addEventListener('click', () => {
		const emailAddress = button.getAttribute('data-copy-email') || 'sharifssebuguzi06@gmail.com';
		const statusElement = document.querySelector('[data-copy-status]');
		copyEmailToClipboard(emailAddress, statusElement);
	});
});

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

function updateHeaderState() {
	var scroll_position = window.scrollY;
	const isScrolled = scroll_position > 40;
	header.classList.toggle('scrolled', isScrolled);
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

window.addEventListener('scroll', updateHeaderState);
updateHeaderState();

menu_item.forEach((item) => {
	item.addEventListener('click', () => {
		hamburger.classList.toggle('active');
		mobile_menu.classList.toggle('active');
		hamburger.setAttribute('aria-expanded', 'false');
	});
});

/* Testimonials carousel */
document.addEventListener('DOMContentLoaded', () => {
	const items = Array.from(document.querySelectorAll('#testimonials .testimonial-item'));
	if (!items.length) return;
	let current = 0;
	const showTime = 5000; // ms per testimonial (slower per user request)

	// Testimonials: removed carousel/animation per user request; all testimonials are static cards now.
});
