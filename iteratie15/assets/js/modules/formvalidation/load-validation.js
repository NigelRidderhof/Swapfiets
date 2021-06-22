const loadValidation = () => new Promise((resolve, reject) => {
  import('formbouncerjs' /* webpackChunkName: "bouncer-validation" */).then((fn) => {
    window.Bouncer = fn.default;

    if (typeof window.Bouncer === 'function') {
      resolve(this);
    } else {
      reject(Error('can\'t load Bouncer...'));
    }
  });
});

export default loadValidation;
