/**
 * Return window.innerwidth in <em> format based on font-size
 *
 * @returns {number}
 */
const screenWidthEm = () => window.innerWidth / parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);

export default screenWidthEm;
