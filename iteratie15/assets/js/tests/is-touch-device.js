/**
 * Useful environment variable to see if we're dealing with a touch device
 *
 * @type {Boolean}
 */
const isTouchDevice = () => {
  const msGesture = window.navigator && window.navigator.msMaxTouchPoints && window.MSGesture;
  const touch = (('ontouchstart' in window) || msGesture || (window.DocumentTouch && document instanceof window.DocumentTouch));

  return !!touch;
};

export default isTouchDevice;
