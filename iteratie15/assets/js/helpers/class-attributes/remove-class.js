/* eslint no-param-reassign: ["error", { "props": false }] */
import hasClass from './has-class';

const removeClass = (element, classname) => {
  if (hasClass(element, classname)) {
    const reg = new RegExp(`(\\s|^)${classname}(\\s|$)`);

    element.className = element.className.replace(reg, ' ');
  }
};

export default removeClass;
