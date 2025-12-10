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

	// Reservation form handling: validation, localStorage save and UI feedback
	const reservationForm = document.getElementById('reservationForm');
	const formMessage = document.getElementById('formMessage');
	const formReset = document.getElementById('formReset');

	function showFormMessage(text, isError){
		if(!formMessage) return;
		formMessage.textContent = text;
		formMessage.style.color = isError ? '#e74c3c' : 'var(--brand)';
	}

	function clearErrors(){
		const els = reservationForm.querySelectorAll('.input-error');
		els.forEach(el=>el.classList.remove('input-error'));
	}

	if(reservationForm){
		reservationForm.addEventListener('submit', function(e){
			e.preventDefault();
			clearErrors();

			const name = (reservationForm.name.value || '').trim();
			const phone = (reservationForm.phone.value || '').trim();
			const email = (reservationForm.email.value || '').trim();
			const date = (reservationForm.date.value || '').trim();
			const time = (reservationForm.time.value || '').trim();
			const people = parseInt(reservationForm.people.value || '0',10) || 0;
			const notes = (reservationForm.notes.value || '').trim();

			// Basic validation
			if(!name){ reservationForm.name.classList.add('input-error'); showFormMessage('Por favor preencha o nome.', true); reservationForm.name.focus(); return; }
			// Validate Mozambique phone numbers: accept 9 local digits or with country code (258 + 9 digits)
			function isMozPhone(p){ const digits = (p||'').replace(/\D/g,''); return digits.length===9 || (digits.length===12 && digits.indexOf('258')===0); }
			if(!isMozPhone(phone)){ reservationForm.phone.classList.add('input-error'); showFormMessage('Telefone inválido — use formato de Moçambique (+258).', true); reservationForm.phone.focus(); return; }
			if(!date){ reservationForm.date.classList.add('input-error'); showFormMessage('Escolha a data da reserva.', true); reservationForm.date.focus(); return; }
			if(!time){ reservationForm.time.classList.add('input-error'); showFormMessage('Escolha a hora da reserva.', true); reservationForm.time.focus(); return; }
			if(people < 1){ reservationForm.people.classList.add('input-error'); showFormMessage('Número de pessoas inválido.', true); reservationForm.people.focus(); return; }

			// Optional email basic check
			if(email){ const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if(!emailRe.test(email)){ reservationForm.email.classList.add('input-error'); showFormMessage('E-mail inválido.', true); reservationForm.email.focus(); return; } }

			// Build reservation object
			const reservation = { name, phone, email, date, time, people, notes, createdAt: new Date().toISOString() };

			try{
				const key = 'restaurante_reservations';
				const list = JSON.parse(localStorage.getItem(key) || '[]');
				list.push(reservation);
				localStorage.setItem(key, JSON.stringify(list));
				showFormMessage('Reserva enviada com sucesso! Confirmaremos o contacto.', false);
				reservationForm.reset();
				reservationForm.name.focus();
			}catch(err){
				console.error('Erro ao salvar reserva', err);
				showFormMessage('Ocorreu um erro ao processar a reserva. Tente novamente.', true);
			}
		});

		if(formReset){
			formReset.addEventListener('click', function(){
				reservationForm.reset();
				clearErrors();
				if(formMessage) formMessage.textContent='';
			});
		}

		// Contact form handling
		const contactForm = document.getElementById('contactForm');
		const contactMessage = document.getElementById('contactMessage');
		if(contactForm){
			contactForm.addEventListener('submit', function(e){
				e.preventDefault();
				if(contactMessage) contactMessage.textContent = '';
				const name = (contactForm.name.value || '').trim();
				const phone = (contactForm.phone.value || '').trim();
				const email = (contactForm.email.value || '').trim();
				const message = (contactForm.message.value || '').trim();
				if(!name){ contactForm.querySelector('#c_name').classList.add('input-error'); if(contactMessage) contactMessage.textContent='Por favor preencha o nome.'; return; }
				if(!isMozPhone(phone)){ contactForm.querySelector('#c_phone').classList.add('input-error'); if(contactMessage) contactMessage.textContent='Telefone inválido — use formato de Moçambique (+258).'; return; }
				if(!message){ contactForm.querySelector('#message').classList.add('input-error'); if(contactMessage) contactMessage.textContent='Escreva a sua mensagem.'; return; }

				const contact = { name, phone, email, message, createdAt: new Date().toISOString() };
				try{
					const key = 'restaurante_contacts';
					const list = JSON.parse(localStorage.getItem(key) || '[]');
					list.push(contact);
					localStorage.setItem(key, JSON.stringify(list));
					if(contactMessage){ contactMessage.textContent = 'Mensagem enviada. Obrigado!'; contactMessage.style.color='var(--brand)'; }
					contactForm.reset();
				}catch(err){
					console.error('Erro ao salvar contacto', err);
					if(contactMessage){ contactMessage.textContent = 'Ocorreu um erro. Tente novamente.'; contactMessage.style.color='#e74c3c'; }
				}
			});

			contactForm.addEventListener('input', function(e){ if(e.target && e.target.classList.contains('input-error')) e.target.classList.remove('input-error'); });
		}

		// Remove error class while typing
		reservationForm.addEventListener('input', function(e){
			if(e.target && e.target.classList.contains('input-error')) e.target.classList.remove('input-error');
		});
	}

	// --- Navigation active link marking ---
	function markActiveNav(){
		try{
			const navLinks = document.querySelectorAll('.site-nav a');
			const current = window.location.pathname.split('/').pop() || 'index.html';
			navLinks.forEach(a=>{
				const href = a.getAttribute('href');
				if(!href) return;
				// Compare filenames
				const file = href.split('/').pop();
				if(file === current) a.classList.add('active'); else a.classList.remove('active');
			});
		}catch(e){/* ignore */}
	}
	markActiveNav();

	// --- Simple lightbox for gallery images ---
	function initGalleryLightbox(){
		const imgs = document.querySelectorAll('.gallery .gallery-img');
		if(!imgs || imgs.length===0) return;

		// create modal
		let lb = document.querySelector('.lightbox');
		if(!lb){
			lb = document.createElement('div'); lb.className='lightbox'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-hidden','true');
			lb.innerHTML = '<div class="lightbox-inner" tabindex="-1"><button class="lightbox-close" aria-label="Fechar">✕</button><div class="lightbox-media"></div><div class="lightbox-caption"></div></div>';
			document.body.appendChild(lb);
		}

		const media = lb.querySelector('.lightbox-media');
		const captionEl = lb.querySelector('.lightbox-caption');
		const closeBtn = lb.querySelector('.lightbox-close');

		function open(src, caption){
			media.innerHTML = '';
			const img = document.createElement('img'); img.src = src; img.alt = caption || ''; img.onload = ()=>{};
			media.appendChild(img);
			captionEl.textContent = caption || '';
			lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
			// focus for accessibility
			lb.querySelector('.lightbox-inner').focus();
		}

		function close(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); media.innerHTML=''; }

		imgs.forEach(i=>{
			i.addEventListener('click', function(e){
				const src = i.getAttribute('src') || (i.querySelector && i.querySelector('img') && i.querySelector('img').src);
				const fig = i.closest('figure');
				const caption = fig ? (fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : i.getAttribute('alt')) : i.getAttribute('alt');
				open(src, caption);
			});
			i.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); i.click(); } });
			i.setAttribute('tabindex','0');
		});

		// close handlers
		closeBtn.addEventListener('click', close);
		lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
		document.addEventListener('keydown', function(e){ if(e.key==='Escape') close(); });
	}
	initGalleryLightbox();

})();

