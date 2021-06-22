const hasClass = (element, classname) => (` ${element.className} `).indexOf(` ${classname} `) > -1;

export default hasClass;
