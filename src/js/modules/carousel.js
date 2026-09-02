/**
 * Módulo de Carrusel: Slider horizontal cinemático con Barra de Carga en tiempo real,
 * cambio automático sincronizado al completarse la carga (5 segundos),
 * y pausa por tiempo indefinido mientras el cursor esté sobre el panel (hover).
 */
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

  const DURATION = 5000; // 5 segundos exactos para completar la barra de carga
  let animationFrameId = null;
  let startTime = null;
  let elapsedTime = 0;

  // 1. Crear indicadores dinámicos
  let dots = [];
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel__dot ${idx === 0 ? 'is-active' : ''}`;
      dot.setAttribute('aria-label', `Ir a la diapositiva ${idx + 1}`);
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  // 2. Actualizar posición visual y estados de accesibilidad
  const updateSlidePosition = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, idx) => {
      const isActive = idx === currentIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentIndex);
    });
  };

  // 3. Reiniciar la barra de progreso a 0%
  const resetProgressBar = () => {
    elapsedTime = 0;
    startTime = performance.now();
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  };

  // 4. Navegación entre diapositivas
  const goToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    updateSlidePosition();
    resetProgressBar();
  };

  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndex - 1);
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
    });
  }

  // 5. Motor de animación de la Barra de Carga (60 FPS con requestAnimationFrame)
  const shouldAnimate = () => {
    return !isPausedManually && !isHovered && !isTabHidden;
  };

  const progressLoop = (currentTime) => {
    if (!startTime) {
      startTime = currentTime;
    }

    if (shouldAnimate()) {
      const delta = currentTime - startTime;
      startTime = currentTime;
      elapsedTime += delta;

      const progressPercent = Math.min((elapsedTime / DURATION) * 100, 100);

      if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
      }

      // Al completarse el 100% de la carga, pasar a la siguiente diapositiva
      if (elapsedTime >= DURATION) {
        nextSlide();
      }
    } else {
      // Mientras esté pausado o con el mouse encima, mantener startTime actualizado sin incrementar elapsedTime
      startTime = currentTime;
    }

    animationFrameId = requestAnimationFrame(progressLoop);
  };

  // 6. Control de Pausa Manual (Accesibilidad)
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPausedManually = !isPausedManually;
      pauseBtn.setAttribute('aria-pressed', String(isPausedManually));
      pauseBtn.setAttribute('aria-label', isPausedManually ? 'Reanudar carrusel' : 'Pausar carrusel');
    });
  }

  // 7. Navegación por teclado
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  // 8. DETENER POR TIEMPO INDEFINIDO SI EL CURSOR ESTÁ POR ENCIMA DEL PANEL
  const heroSection = carousel.closest('.hero') || carousel;

  heroSection.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  heroSection.addEventListener('mouseleave', () => {
    isHovered = false;
    startTime = performance.now();
  });

  // También pausar si un elemento interno recibe foco por teclado
  carousel.addEventListener('focusin', () => {
    isHovered = true;
  });

  carousel.addEventListener('focusout', () => {
    isHovered = false;
    startTime = performance.now();
  });

  // 9. Visibilidad de pestaña (Page Visibility API)
  document.addEventListener('visibilitychange', () => {
    isTabHidden = document.hidden;
    if (!isTabHidden) {
      startTime = performance.now();
    }
  });

  // Inicializar estado y arrancar motor de barra de progreso
  updateSlidePosition();
  resetProgressBar();
  animationFrameId = requestAnimationFrame(progressLoop);
}
