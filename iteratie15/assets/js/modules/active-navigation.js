/* global addClass */
const selectors = {
  base: '.header__navigation a',
  hasSubs: '.header__navigation__listitem--has-sub',
};
const activeClassname = 'header__navigation__listitem--active';
const currentUrl = window.location.origin + window.location.pathname;
let activeItemMatched = false;

/**
 * Addclass from activeClassname
 * @param item
 */
const makeNavItemActive = (item) => {
  addClass(item, activeClassname);
};

/**
 * Give a link and match the first one who's active
 * @param item
 */
const matchActiveNavItems = (item) => {
  const replacedCurrentUrl = currentUrl.replace(window.location.origin, '');
  const replacedUrl = item.href.replace(window.location.origin, '');

  // eslint-disable-next-line no-mixed-operators
  if (replacedUrl === '/' && (replacedCurrentUrl !== replacedUrl || activeItemMatched)) {
    return;
  }

  if (replacedCurrentUrl.indexOf(replacedUrl) === -1 || activeItemMatched) {
    return;
  }

  makeNavItemActive(item.parentElement);

  const closestParent = item.closest(selectors.hasSubs);

  if (closestParent) {
    makeNavItemActive(closestParent);
    closestParent.setAttribute('open', '');
  }

  activeItemMatched = true;
};

/**
 * Loop over all base-matched elements
 */
const init = () => {
  document.querySelectorAll(selectors.base).forEach((item) => {
    matchActiveNavItems(item);
  });
};

export default init;
