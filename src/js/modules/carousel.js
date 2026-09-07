/**
 * Módulo de Carrusel interactivo para el slider cinemático principal,
 * coordinando renderizado visual accesible, animación continua con requestAnimationFrame,
 * controles manuales y captura de gestos táctiles.
 */

const DURATION = 7500;

function renderSlide(track, slides, dots, currentIndex) {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  slides.forEach((slide, idx) => {
    const isActive = idx === currentIndex;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('is-active', idx === currentIndex);
  });
}

function createDots(container, count, onSelect) {
  if (!container) return [];

  container.innerHTML = '';
  const dots = [];

  for (let idx = 0; idx < count; idx++) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `carousel__dot ${idx === 0 ? 'is-active' : ''}`;
    dot.setAttribute('aria-label', `Ir a la diapositiva ${idx + 1}`);
    dot.dataset.slideIndex = String(idx);
    container.appendChild(dot);
    dots.push(dot);
  }

  container.addEventListener('click', (e) => {
    const dot = e.target.closest('[data-slide-index]');
    if (!dot) return;
    e.preventDefault();
    onSelect(Number(dot.dataset.slideIndex));
  });

  return dots;
}

function bindControls({ prevBtn, nextBtn, pauseBtn, carousel, onNext, onPrev, onTogglePause }) {
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      onNext();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      onPrev();
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      onTogglePause();
    });
  }

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onPrev();
    }
  });
}

function bindTouchSwipe(element, onSwipeLeft, onSwipeRight) {
  let touchStartX = 0;

  element.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  element.addEventListener('touchend', (e) => {
    const diffX = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) onSwipeLeft();
      else onSwipeRight();
    }
  }, { passive: true });
}

function bindLifecycleEvents({ heroSection, carousel, onPause, onResume }) {
  heroSection.addEventListener('mouseenter', onPause);
  heroSection.addEventListener('mouseleave', onResume);
  carousel.addEventListener('focusin', onPause);
  carousel.addEventListener('focusout', onResume);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) onPause();
    else onResume();
  });
}

export function initCarousel() {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel__track');
  const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');
  const dotsContainer = carousel.querySelector('[data-carousel-dots]');
  const pauseBtn = carousel.querySelector('[data-carousel-pause]');
  const progressBar = carousel.querySelector('[data-carousel-progress]');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let isPausedManually = false;
  let isHovered = false;
  let isTabHidden = false;
  let startTime = null;
  let elapsedTime = 0;

  const resetProgress = () => {
    elapsedTime = 0;
    startTime = performance.now();
    if (progressBar) progressBar.style.width = '0%';
  };

  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    renderSlide(track, slides, dots, currentIndex);
    resetProgress();
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  const dots = createDots(dotsContainer, slides.length, goToSlide);

  bindControls({
    prevBtn,
    nextBtn,
    pauseBtn,
    carousel,
    onNext: nextSlide,
    onPrev: prevSlide,
    onTogglePause: () => {
      isPausedManually = !isPausedManually;
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-pressed', String(isPausedManually));
        pauseBtn.setAttribute('aria-label', isPausedManually ? 'Reanudar carrusel' : 'Pausar carrusel');
      }
    }
  });

  bindTouchSwipe(carousel, nextSlide, prevSlide);

  const heroSection = carousel.closest('.hero') || carousel;

  bindLifecycleEvents({
    heroSection,
    carousel,
    onPause: () => {
      isHovered = true;
    },
    onResume: () => {
      isHovered = false;
      startTime = performance.now();
    }
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isPausedManually = true;
    if (pauseBtn) {
      pauseBtn.setAttribute('aria-pressed', 'true');
      pauseBtn.setAttribute('aria-label', 'Reanudar carrusel');
    }
  }

  const shouldAnimate = () => !isPausedManually && !isHovered && !isTabHidden;

  const progressLoop = (currentTime) => {
    if (!startTime) startTime = currentTime;

    if (shouldAnimate()) {
      const delta = currentTime - startTime;
      startTime = currentTime;
      elapsedTime += delta;

      if (progressBar) {
        const percent = Math.min((elapsedTime / DURATION) * 100, 100);
        progressBar.style.width = `${percent}%`;
      }

      if (elapsedTime >= DURATION) {
        nextSlide();
      }
    } else {
      startTime = currentTime;
    }

    requestAnimationFrame(progressLoop);
  };

  renderSlide(track, slides, dots, currentIndex);
  resetProgress();
  requestAnimationFrame(progressLoop);
}
