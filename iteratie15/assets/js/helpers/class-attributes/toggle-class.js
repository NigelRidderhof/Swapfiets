import hasClass from './has-class';
import removeClass from './remove-class';
import addClass from './add-class';

const toggleClass = (element, classname) => {
  if (hasClass(element, classname)) {
    removeClass(element, classname);
  } else {
    addClass(element, classname);
  }
};

export default toggleClass;
