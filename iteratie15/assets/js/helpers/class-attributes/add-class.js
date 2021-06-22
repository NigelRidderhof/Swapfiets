/* eslint no-param-reassign: ["error", { "props": false }] */
import hasClass from './has-class';

const addClass = (element, classname) => {
  if (!element) {
    return;
  }

  if (!hasClass(element, classname)) {
    element.className += ` ${classname}`;
  }
};

export default addClass;
