/**
 * Módulo de Validación de Formulario para validación declarativa en tiempo real
 * (focusout, input, change), gestión accesible de estados
 * y flujo asíncrono de envío con panel de confirmación.
 */
import { isValidEmail, isValidPhone, hasMinLength, isValidName } from '../utils/validators.js';

const VALIDATION_STRATEGIES = {
  'contact-name': (val) => {
    if (!val) return 'Este campo es obligatorio.';
    if (!isValidName(val)) return 'Por favor, ingresá un nombre y apellido válido (mínimo 3 letras).';
    return '';
  },
  'contact-email': (val) => {
    if (!val) return 'Este campo es obligatorio.';
    if (!isValidEmail(val)) return 'Por favor, ingresá un correo corporativo válido (ej. usuario@empresa.com).';
    return '';
  },
  'contact-phone': (val) => {
    if (val !== '' && !isValidPhone(val)) {
      return 'Por favor, ingresá un teléfono válido (entre 7 y 15 dígitos numéricos).';
    }
    return '';
  },
  'contact-service': (val, input) => {
    if (input.required && !val) {
      return 'Por favor, seleccioná un área tecnológica de interés.';
    }
    return '';
  },
  'contact-message': (val) => {
    if (!val) return 'Este campo es obligatorio.';
    if (!hasMinLength(val, 10)) return 'Por favor, detallá tu consulta técnica con al menos 10 caracteres.';
    return '';
  }
};

function getFieldError(input) {
  const value = input.value.trim();
  const strategy = VALIDATION_STRATEGIES[input.id];

  if (strategy) {
    return strategy(value, input);
  }

  if (input.required && !value) {
    return 'Este campo es obligatorio.';
  }

  return '';
}

function syncFieldUI(input, errorMessage) {
  const errorEl = document.querySelector(`[data-error-for="${input.id}"]`);
  const isValid = errorMessage === '';
  const hasValue = input.value.trim().length > 0;

  input.classList.toggle('is-invalid', !isValid);
  input.classList.toggle('is-valid', isValid && hasValue);
  input.setAttribute('aria-invalid', String(!isValid));

  if (errorEl) {
    errorEl.textContent = errorMessage;
    errorEl.classList.toggle('is-visible', !isValid);
  }

  return isValid;
}

function preselectService(select) {
  if (!select) return;
  const requestedService = new URLSearchParams(window.location.search).get('service');
  if (requestedService) {
    const optionExists = Array.from(select.options).some((opt) => opt.value === requestedService);
    if (optionExists) {
      select.value = requestedService;
      select.classList.remove('is-invalid');
    }
  }
}

export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const successCard = document.querySelector('[data-form-success-card]');
  const resetBtn = document.querySelector('[data-form-new-message]');
  const statusBox = document.querySelector('[data-form-status]');
  const serviceSelect = form.querySelector('#contact-service');
  const inputs = Array.from(form.querySelectorAll('input, textarea, select'));

  preselectService(serviceSelect);

  const validateField = (input) => {
    const error = getFieldError(input);
    return syncFieldUI(input, error);
  };

  form.addEventListener('focusout', (e) => {
    if (e.target.matches('input, textarea, select')) {
      validateField(e.target);
    }
  });

  form.addEventListener('input', (e) => {
    if (e.target.matches('input, textarea, select') && e.target.classList.contains('is-invalid')) {
      validateField(e.target);
    }
  });

  form.addEventListener('change', (e) => {
    if (e.target.matches('select')) {
      validateField(e.target);
    }
  });

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
      if (statusBox) {
        statusBox.textContent = 'Por favor, revisá los campos con errores marcados en rojo antes de enviar.';
        statusBox.className = 'form-status is-error';
        statusBox.style.display = 'block';
      }
      if (firstInvalidInput) {
        firstInvalidInput.focus();
        if (typeof firstInvalidInput.scrollIntoView === 'function') {
          firstInvalidInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Enviando solicitud técnica...</span>
      `;
    }

    if (statusBox) {
      statusBox.style.display = 'none';
      statusBox.textContent = '';
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 850));

      form.reset();
      inputs.forEach((input) => {
        input.classList.remove('is-invalid', 'is-valid');
        input.removeAttribute('aria-invalid');
      });

      form.classList.add('form-fade-out');

      setTimeout(() => {
        form.style.display = 'none';

        if (successCard) {
          successCard.classList.add('is-visible');
          successCard.focus();
        }

        if (statusBox) {
          statusBox.textContent = '¡Solicitud enviada con éxito! Un arquitecto de software se pondrá en contacto.';
          statusBox.className = 'form-status is-success';
          statusBox.style.display = 'block';
        }
      }, 450);

    } catch (error) {
      console.error('[NextCorp Form Error]', error);
      if (statusBox) {
        statusBox.textContent = 'Ocurrió un error al procesar tu solicitud. Por favor, intentá nuevamente.';
        statusBox.className = 'form-status is-error';
        statusBox.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
        submitBtn.innerHTML = originalBtnContent;
      }
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (successCard) {
        successCard.classList.remove('is-visible');
      }

      if (statusBox) {
        statusBox.style.display = 'none';
        statusBox.textContent = '';
      }

      form.style.display = 'block';
      form.classList.remove('form-fade-out');
      form.classList.add('animate-fade-in');

      const firstInput = form.querySelector('input');
      if (firstInput) {
        firstInput.focus();
      }
    });
  }
}
