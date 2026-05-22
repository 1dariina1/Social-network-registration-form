/**
 * NEXUS Registration Form  |  script.js
 *
 * JS Events used:
 *  - input   : real-time validation, username status, password strength, progress
 *  - blur    : validate field on leave
 *  - change  : radio / checkbox validation
 *  - click   : password toggle button
 *  - submit  : full form validation before "submission"
 */

'use strict';

/* ── Selectors ──────────────────────────────────────────────── */
const form            = document.getElementById('registrationForm');
const progressFill    = document.getElementById('progressFill');
const progressLabel   = document.getElementById('progressLabel');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput   = document.getElementById('password');
const confirmInput    = document.getElementById('confirmPassword');
const usernameInput   = document.getElementById('username');
const usernameStatus  = document.getElementById('username-status');
const strengthBars    = document.querySelectorAll('.strength-bar');
const strengthLabel   = document.getElementById('strengthLabel');
const successMessage  = document.getElementById('successMessage');
const resetBtn        = document.getElementById('resetBtn');

/* ── Fake taken usernames ───────────────────────────────────── */
const TAKEN_USERNAMES = new Set(['ada_lovelace', 'admin', 'user', 'nexus', 'test', 'john_doe']);

/* ══════════════════════════════════════════════════════════════
   VALIDATION HELPERS
══════════════════════════════════════════════════════════════ */

/**
 * Show or clear an error on a field wrapper.
 * @param {string} fieldId   - id of the .field wrapper (e.g. "field-email")
 * @param {string} errorId   - id of the <span class="field__error">
 * @param {string} message   - error text; empty string = no error
 */
function setFieldError(fieldId, errorId, message) {
  const wrapper = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  if (!wrapper || !errorEl) return;

  if (message) {
    wrapper.classList.add('field--error');
    wrapper.classList.remove('field--valid');
    errorEl.textContent = message;
  } else {
    wrapper.classList.remove('field--error');
    errorEl.textContent = '';
  }
}

/** Mark a field as valid (green border). */
function setFieldValid(fieldId) {
  const wrapper = document.getElementById(fieldId);
  if (!wrapper) return;
  wrapper.classList.remove('field--error');
  wrapper.classList.add('field--valid');
}

/** Mark a fieldset as error. */
function setFieldsetError(fieldsetId, errorId, message) {
  const wrapper = document.getElementById(fieldsetId);
  const errorEl = document.getElementById(errorId);
  if (!wrapper || !errorEl) return;
  if (message) {
    wrapper.classList.add('fieldset--error');
    errorEl.textContent = message;
  } else {
    wrapper.classList.remove('fieldset--error');
    errorEl.textContent = '';
  }
}

/* ── Individual validators ──────────────────────────────────── */

function validateFirstName() {
  const val = document.getElementById('firstName').value.trim();
  if (!val) {
    setFieldError('field-firstName', 'firstName-error', 'First name is required.');
    return false;
  }
  if (val.length < 2) {
    setFieldError('field-firstName', 'firstName-error', 'Must be at least 2 characters.');
    return false;
  }
  setFieldError('field-firstName', 'firstName-error', '');
  setFieldValid('field-firstName');
  return true;
}

function validateLastName() {
  const val = document.getElementById('lastName').value.trim();
  if (!val) {
    setFieldError('field-lastName', 'lastName-error', 'Last name is required.');
    return false;
  }
  if (val.length < 2) {
    setFieldError('field-lastName', 'lastName-error', 'Must be at least 2 characters.');
    return false;
  }
  setFieldError('field-lastName', 'lastName-error', '');
  setFieldValid('field-lastName');
  return true;
}

function validateUsername() {
  const val = usernameInput.value.trim();
  const pattern = /^[a-zA-Z0-9_]{3,30}$/;

  if (!val) {
    setFieldError('field-username', 'username-error', 'Username is required.');
    usernameStatus.textContent = '';
    return false;
  }
  if (!pattern.test(val)) {
    setFieldError('field-username', 'username-error', 'Only letters, numbers, and underscores (3–30 chars).');
    usernameStatus.textContent = '✗';
    usernameStatus.style.color = 'var(--color-error)';
    return false;
  }
  if (TAKEN_USERNAMES.has(val.toLowerCase())) {
    setFieldError('field-username', 'username-error', 'This username is already taken.');
    usernameStatus.textContent = '✗';
    usernameStatus.style.color = 'var(--color-error)';
    return false;
  }
  setFieldError('field-username', 'username-error', '');
  setFieldValid('field-username');
  usernameStatus.textContent = '✓';
  usernameStatus.style.color = 'var(--color-success)';
  return true;
}

function validateEmail() {
  const val = document.getElementById('email').value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!val) {
    setFieldError('field-email', 'email-error', 'Email address is required.');
    return false;
  }
  if (!pattern.test(val)) {
    setFieldError('field-email', 'email-error', 'Please enter a valid email address.');
    return false;
  }
  setFieldError('field-email', 'email-error', '');
  setFieldValid('field-email');
  return true;
}

function validateDob() {
  const val = document.getElementById('dob').value;
  if (!val) {
    setFieldError('field-dob', 'dob-error', 'Date of birth is required.');
    return false;
  }
  const dob    = new Date(val);
  const today  = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  if (age < 13) {
    setFieldError('field-dob', 'dob-error', 'You must be at least 13 years old.');
    return false;
  }
  if (age > 120) {
    setFieldError('field-dob', 'dob-error', 'Please enter a valid date of birth.');
    return false;
  }
  setFieldError('field-dob', 'dob-error', '');
  setFieldValid('field-dob');
  return true;
}

function validateGender() {
  const checked = document.querySelector('input[name="gender"]:checked');
  if (!checked) {
    setFieldsetError('field-gender', 'gender-error', 'Please select a gender option.');
    return false;
  }
  setFieldsetError('field-gender', 'gender-error', '');
  return true;
}

function validatePassword() {
  const val = passwordInput.value;
  if (!val) {
    setFieldError('field-password', 'password-error', 'Password is required.');
    return false;
  }
  if (val.length < 8) {
    setFieldError('field-password', 'password-error', 'Password must be at least 8 characters.');
    return false;
  }
  setFieldError('field-password', 'password-error', '');
  setFieldValid('field-password');
  return true;
}

function validateConfirmPassword() {
  const val = confirmInput.value;
  if (!val) {
    setFieldError('field-confirmPassword', 'confirmPassword-error', 'Please confirm your password.');
    return false;
  }
  if (val !== passwordInput.value) {
    setFieldError('field-confirmPassword', 'confirmPassword-error', 'Passwords do not match.');
    return false;
  }
  setFieldError('field-confirmPassword', 'confirmPassword-error', '');
  setFieldValid('field-confirmPassword');
  return true;
}

function validateInterests() {
  const checked = document.querySelectorAll('input[name="interests"]:checked');
  if (checked.length === 0) {
    setFieldsetError('field-interests', 'interests-error', 'Please select at least one interest.');
    return false;
  }
  setFieldsetError('field-interests', 'interests-error', '');
  return true;
}

function validateTerms() {
  const checked = document.getElementById('terms').checked;
  if (!checked) {
    setFieldError('field-terms', 'terms-error', 'You must agree to the Terms of Service.');
    return false;
  }
  setFieldError('field-terms', 'terms-error', '');
  return true;
}

/* ══════════════════════════════════════════════════════════════
   PASSWORD STRENGTH METER
══════════════════════════════════════════════════════════════ */

/**
 * Returns a strength score 0–4.
 * Rules: length ≥ 8, uppercase, lowercase, number, special char.
 */
function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8)                    score++;
  if (/[A-Z]/.test(password))                 score++;
  if (/[a-z]/.test(password))                 score++;
  if (/[0-9]/.test(password))                 score++;
  if (/[^A-Za-z0-9]/.test(password))          score++;
  // Clamp: at most 4 bars
  return Math.min(4, score);
}

const STRENGTH_LEVELS = [
  { label: '',          cls: '' },
  { label: 'Weak',      cls: 'active-weak' },
  { label: 'Fair',      cls: 'active-fair' },
  { label: 'Good',      cls: 'active-good' },
  { label: 'Strong ✓',  cls: 'active-strong' },
];

const STRENGTH_COLORS = {
  'active-weak':   'var(--str-weak)',
  'active-fair':   'var(--str-fair)',
  'active-good':   'var(--str-good)',
  'active-strong': 'var(--str-strong)',
};

function updateStrengthMeter(password) {
  if (!password) {
    strengthBars.forEach(bar => {
      bar.className = 'strength-bar';
    });
    strengthLabel.textContent = '';
    strengthLabel.style.color = '';
    return;
  }

  const score  = getPasswordStrength(password);
  const level  = STRENGTH_LEVELS[score] || STRENGTH_LEVELS[0];

  strengthBars.forEach((bar, i) => {
    bar.className = 'strength-bar';
    if (i < score) bar.classList.add(level.cls);
  });

  strengthLabel.textContent = level.label;
  strengthLabel.style.color = STRENGTH_COLORS[level.cls] || 'var(--color-text-hint)';
}

/* ══════════════════════════════════════════════════════════════
   PROGRESS BAR
   Counts how many of the required fields are filled / valid.
══════════════════════════════════════════════════════════════ */

const REQUIRED_FIELDS = [
  () => document.getElementById('firstName').value.trim().length >= 2,
  () => document.getElementById('lastName').value.trim().length >= 2,
  () => /^[a-zA-Z0-9_]{3,30}$/.test(usernameInput.value.trim()) && !TAKEN_USERNAMES.has(usernameInput.value.trim().toLowerCase()),
  () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('email').value.trim()),
  () => {
    const v = document.getElementById('dob').value;
    if (!v) return false;
    const dob = new Date(v);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age >= 13;
  },
  () => !!document.querySelector('input[name="gender"]:checked'),
  () => passwordInput.value.length >= 8,
  () => confirmInput.value === passwordInput.value && confirmInput.value.length > 0,
  () => document.querySelectorAll('input[name="interests"]:checked').length > 0,
  () => document.getElementById('terms').checked,
];

function updateProgress() {
  const completed = REQUIRED_FIELDS.filter(fn => fn()).length;
  const pct = Math.round((completed / REQUIRED_FIELDS.length) * 100);
  progressFill.style.width = pct + '%';
  progressLabel.textContent = pct + '% complete';
  progressFill.parentElement.setAttribute('aria-valuenow', pct);
}

/* ══════════════════════════════════════════════════════════════
   EVENT LISTENERS
══════════════════════════════════════════════════════════════ */

/* ── Real-time input events ─────────────────────────────────── */

document.getElementById('firstName').addEventListener('input', () => {
  validateFirstName();
  updateProgress();
});

document.getElementById('lastName').addEventListener('input', () => {
  validateLastName();
  updateProgress();
});

usernameInput.addEventListener('input', () => {
  validateUsername();
  updateProgress();
});

document.getElementById('email').addEventListener('input', () => {
  validateEmail();
  updateProgress();
});

document.getElementById('dob').addEventListener('input', () => {
  validateDob();
  updateProgress();
});

passwordInput.addEventListener('input', () => {
  updateStrengthMeter(passwordInput.value);
  validatePassword();
  // Also re-validate confirm if it already has a value
  if (confirmInput.value) validateConfirmPassword();
  updateProgress();
});

confirmInput.addEventListener('input', () => {
  validateConfirmPassword();
  updateProgress();
});

/* ── Blur events (validate on leave) ───────────────────────── */

document.getElementById('firstName').addEventListener('blur', validateFirstName);
document.getElementById('lastName').addEventListener('blur', validateLastName);
usernameInput.addEventListener('blur', validateUsername);
document.getElementById('email').addEventListener('blur', validateEmail);
document.getElementById('dob').addEventListener('blur', validateDob);
passwordInput.addEventListener('blur', validatePassword);
confirmInput.addEventListener('blur', validateConfirmPassword);

/* ── Change events for radio and checkbox groups ───────────── */

document.querySelectorAll('input[name="gender"]').forEach(radio => {
  radio.addEventListener('change', () => {
    validateGender();
    updateProgress();
  });
});

document.querySelectorAll('input[name="interests"]').forEach(cb => {
  cb.addEventListener('change', () => {
    validateInterests();
    updateProgress();
  });
});

document.getElementById('terms').addEventListener('change', () => {
  validateTerms();
  updateProgress();
});

/* ── Click: toggle password visibility ─────────────────────── */

togglePasswordBtn.addEventListener('click', () => {
  const isVisible = passwordInput.type === 'text';
  passwordInput.type    = isVisible ? 'password' : 'text';
  confirmInput.type     = isVisible ? 'password' : 'text';
  togglePasswordBtn.setAttribute('aria-pressed', String(!isVisible));
  togglePasswordBtn.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
});

/* ── Submit event ───────────────────────────────────────────── */

form.addEventListener('submit', (event) => {
  event.preventDefault(); // prevent native browser submission

  // Run all validators
  const results = [
    validateFirstName(),
    validateLastName(),
    validateUsername(),
    validateEmail(),
    validateDob(),
    validateGender(),
    validatePassword(),
    validateConfirmPassword(),
    validateInterests(),
    validateTerms(),
  ];

  const allValid = results.every(Boolean);

  if (!allValid) {
    // Scroll to the first error
    const firstError = form.querySelector('.field--error, .fieldset--error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = firstError.querySelector('input');
      if (firstInput) firstInput.focus();
    }
    return;
  }

  // === All valid: show success ===
  updateProgress(); // ensure 100%
  progressFill.style.width = '100%';
  progressLabel.textContent = '100% complete';

  form.hidden = true;
  successMessage.hidden = false;
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/* ── Reset button (show form again) ─────────────────────────── */

resetBtn.addEventListener('click', () => {
  form.reset();
  form.hidden = false;
  successMessage.hidden = true;

  // Clear all validation states
  document.querySelectorAll('.field--valid, .field--error').forEach(el => {
    el.classList.remove('field--valid', 'field--error');
  });
  document.querySelectorAll('.fieldset--error').forEach(el => {
    el.classList.remove('fieldset--error');
  });
  document.querySelectorAll('[role="alert"]').forEach(el => {
    el.textContent = '';
  });

  usernameStatus.textContent = '';
  updateStrengthMeter('');
  updateProgress();

  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Initial progress on page load ─────────────────────────── */
updateProgress();