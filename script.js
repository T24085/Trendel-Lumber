const revealEls = document.querySelectorAll('.reveal');
const siteHeader = document.querySelector('.site-header');
const tiltTargets = document.querySelectorAll('.card, .project, .hero-card, .contact-wrap, .hero-copy');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 35, 220)}ms`;
  io.observe(el);
});

if (!reduceMotion) {
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY || 0;
    document.body.style.setProperty('--bg-y', `${Math.min(y * 0.08, 60)}px`);

    if (siteHeader) {
      siteHeader.classList.toggle('compact', y > 60);
    }
    ticking = false;
  };

  const schedule = () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  };

  window.addEventListener('scroll', schedule, { passive: true });
  onScroll();

  tiltTargets.forEach((el) => {
    el.addEventListener('mousemove', (event) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const tiltX = (0.5 - py) * 5.5;
      const tiltY = (px - 0.5) * 6.5;
      el.style.transform = `translateY(-5px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

const form = document.querySelector('.quote-form');
const formButton = document.querySelector('#formButton');
const formStatus = document.querySelector('#formStatus');
const topNav = document.querySelector('.top-nav');
const navBubble = document.querySelector('.nav-bubble');
const quoteCta = document.querySelector('.site-header .btn-accent');

if (topNav && navBubble) {
  const navLinks = topNav.querySelectorAll('a');

  navLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      const linkRect = link.getBoundingClientRect();
      const navRect = topNav.getBoundingClientRect();
      const bubbleW = Math.max(linkRect.width + 20, 56);
      const bubbleH = Math.max(linkRect.height + 10, 32);
      navBubble.style.width = `${bubbleW}px`;
      navBubble.style.height = `${bubbleH}px`;
      topNav.style.setProperty('--bubble-x', `${linkRect.left - navRect.left + (linkRect.width - bubbleW) / 2}px`);
      topNav.style.setProperty('--bubble-y', `${linkRect.top - navRect.top + (linkRect.height - bubbleH) / 2}px`);
      topNav.classList.add('has-hover');
    });

    link.addEventListener('mousemove', (event) => {
      const linkRect = link.getBoundingClientRect();
      const navRect = topNav.getBoundingClientRect();
      const bubbleW = navBubble.offsetWidth || 56;
      const bubbleH = navBubble.offsetHeight || 32;
      const localX = event.clientX - linkRect.left;
      const x = linkRect.left - navRect.left + localX - bubbleW / 2;
      const y = linkRect.top - navRect.top + (linkRect.height - bubbleH) / 2;
      topNav.style.setProperty('--bubble-x', `${x}px`);
      topNav.style.setProperty('--bubble-y', `${y}px`);
    });
  });

  topNav.addEventListener('mouseleave', () => {
    topNav.classList.remove('has-hover');
  });
}

if (quoteCta && !reduceMotion) {
  const runRandomFlash = () => {
    const nextDelay = 2800 + Math.random() * 4200;
    window.setTimeout(() => {
      quoteCta.classList.add('flash-now');
      window.setTimeout(() => {
        quoteCta.classList.remove('flash-now');
      }, 700);
      runRandomFlash();
    }, nextDelay);
  };

  runRandomFlash();
}

if (form && formButton && formStatus) {
  form.addEventListener('submit', () => {
    formButton.disabled = true;
    formButton.textContent = 'Submitting...';
    formStatus.textContent = 'Sending your request...';
  });
}
