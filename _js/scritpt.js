(function(){
	// Toggle mobile nav
	const navToggle = document.getElementById('navToggle');
	const siteNav = document.getElementById('siteNav');

	function setNavOpen(open){
		if(open){
			siteNav.classList.add('open');
			navToggle.setAttribute('aria-expanded','true');
		} else {
			siteNav.classList.remove('open');
			navToggle.setAttribute('aria-expanded','false');
		}
	}

	navToggle.addEventListener('click', function(e){
		const isOpen = siteNav.classList.contains('open');
		setNavOpen(!isOpen);
	});

	// Close nav on resize (desktop)
	window.addEventListener('resize', function(){
		if(window.innerWidth >= 720){ setNavOpen(false); }
	});

	// Close nav when clicking outside on mobile
	document.addEventListener('click', function(e){
		if(window.innerWidth < 720){
			if(!siteNav.contains(e.target) && !navToggle.contains(e.target)){
				setNavOpen(false);
			}
		}
	});

	// Set current year in footer
	const y = new Date().getFullYear();
	const yearEl = document.getElementById('year');
	if(yearEl) yearEl.textContent = y;

	// Basic platform detection to add classes for small UI tweaks
	const ua = navigator.userAgent || navigator.vendor || window.opera;
	if(/android/i.test(ua)) document.documentElement.classList.add('android');
	if(/iPad|iPhone|iPod/.test(ua) && !window.MSStream) document.documentElement.classList.add('ios');
})();

