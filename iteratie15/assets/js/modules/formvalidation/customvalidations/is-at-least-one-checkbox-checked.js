import config from '../config';

/**
 * Validate field. At leaste one checkbox is checked
 * @param field
 * @returns {boolean}
 */
export default (field) => {
  const wrapper = field.closest('[data-bouncer-at-least-one-checkbox]');

  if (!wrapper) {
    return false;
  }

  const checkboxesRequired = wrapper.hasAttribute('data-bouncer-checkboxes-required');

  if (!checkboxesRequired) {
    return false;
  }

  const checkboxes = wrapper.querySelectorAll('[type="checkbox"]');

  if (!checkboxes.length) {
    return false;
  }

  const errorWrapper = wrapper.querySelector(checkboxes[0].dataset.bouncerTarget);
  let checkedCount = 0;

  for (let i = 0; i < checkboxes.length; i += 1) {
    if (checkboxes[i].checked) {
      checkedCount += 1;
    }
  }

  if (errorWrapper) {
    while (errorWrapper.childNodes.length > 0) {
      errorWrapper.removeChild(errorWrapper.lastChild);
    }
  }

  if (checkedCount > 0) {
    for (let i = 0; i < checkboxes.length; i += 1) {
      window.removeClass(checkboxes[i], config.inputFieldErrorClass);
    }
  }

  return checkedCount === 0;
};
