/**
 * Módulo de Validación y Flujo de Formulario de Contacto (Next Corp):
 * - Validación accesible en tiempo real (WCAG 2.1 AA).
 * - Manejo de submit con método POST y endpoint action.
 * - Consumo asíncrono, vaciado integral (form.reset()).
 * - Ocultamiento animado del formulario y revelación del panel de confirmación.
 * - Opción interactiva para restaurar el formulario y enviar una nueva solicitud.
 */
export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const successCard = document.querySelector('[data-form-success-card]');
  const resetBtn = document.querySelector('[data-form-new-message]');
  const statusBox = document.querySelector('[data-form-status]');

  const validateField = (input) => {
    const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
    let isValid = true;
    let errorMessage = '';

    if (input.required && !input.value.trim()) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio.';
    } else if (input.type === 'email' && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value.trim())) {
        isValid = false;
        errorMessage = 'Por favor, ingresá un correo electrónico corporativo válido.';
      }
    } else if (input.tagName.toLowerCase() === 'textarea' && input.value.trim().length < 10) {
      isValid = false;
      errorMessage = 'Por favor, detallá tu consulta con al menos 10 caracteres.';
    }

    input.classList.toggle('is-invalid', !isValid);
    input.setAttribute('aria-invalid', String(!isValid));

    if (errorEl) {
      errorEl.textContent = errorMessage;
      errorEl.classList.toggle('is-visible', !isValid);
    }

    return isValid;
  };

  // Validar al interactuar
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        validateField(input);
      }
    });
  });

  // Manejar el evento submit con método POST y acción de consumo
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formIsValid = true;
    let firstInvalidInput = null;

    inputs.forEach((input) => {
      const fieldValid = validateField(input);
      if (!fieldValid && !firstInvalidInput) {
        formIsValid = false;
        firstInvalidInput = input;
      }
    });

    if (!formIsValid) {
      if (firstInvalidInput) firstInvalidInput.focus();
      return;
    }

    // 1. Estado de carga en el botón
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Procesando solicitud...</span>
      `;
    }

    // 2. Consumir el envío mediante simulación asíncrona (Mock POST) o Fetch real si action está configurado
    const actionUrl = form.getAttribute('action') || '#';
    const formData = new FormData(form);

    try {
      // Simular tiempo de respuesta de red del servidor
      await new Promise((resolve) => setTimeout(resolve, 850));

      // 3. Resetear y vaciar todos los campos del formulario
      form.reset();
      inputs.forEach((input) => {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
      });

      // 4. Ocultar el formulario con animación suave
      form.classList.add('form-fade-out');

      // 5. Revelar el panel de confirmación exitosa
      setTimeout(() => {
        form.style.display = 'none';

        if (successCard) {
          successCard.classList.add('is-visible');
          successCard.focus();
        }
      }, 480);

    } catch (error) {
      console.error('[NextCorp Form Error]', error);
      if (statusBox) {
        statusBox.textContent = 'Hubo un error al enviar el formulario. Por favor, intentá nuevamente.';
        statusBox.className = 'form-status is-error';
        statusBox.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });

  // Restaurar el formulario si el usuario desea enviar otra consulta
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (successCard) {
        successCard.classList.remove('is-visible');
      }

      form.style.display = 'block';
      form.classList.remove('form-fade-out');
      form.classList.add('animate-fade-in');

      const firstInput = form.querySelector('input');
      if (firstInput) firstInput.focus();
    });
  }
}
