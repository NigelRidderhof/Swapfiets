/**
 * Make sure we
 * @param input
 * @returns {string|boolean|*}
 */
const convertDate = (input) => {
  if (!input) {
    return false;
  }

  const value = input.value.split('-');

  if (value.length !== 3) {
    return false;
  }

  if (value[2].length !== 4) {
    return input.value;
  }

  return `${value[2]}-${value[1]}-${value[0]}`;
};

/**
 * Init
 * A date object needs to have a shadow item with YYYY-MM-DD format.
 * Convert and copy input to given shadow element
 */
const init = () => {
  const sources = document.querySelectorAll('[data-field-birthdate-output]');

  if (!sources.length) {
    return;
  }

  // Loop over items
  sources.forEach((item) => {
    const output = document.querySelector(item.dataset.fieldBirthdateOutput);

    if (!output) {
      return;
    }

    item.addEventListener('change', () => {
      output.value = convertDate(item);
    });
  });
};

export default init;
