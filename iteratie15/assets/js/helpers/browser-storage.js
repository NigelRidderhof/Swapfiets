/* global app */
const storage = (method) => {
  if (method === 'local') {
    if (app.test.isLocalStorageSupported) {
      return window.localStorage;
    }
  } else if (app.test.isSessionStorageSupported) {
    return window.sessionStorage;
  }

  return {
    data: {},
    setItem(id, val) {
      this.data[id] = String(val);
      return this.data[id];
    },
    getItem(id) {
      return Object.prototype.hasOwnProperty.call(this.data, id) ? this.data[id] : undefined;
    },
    removeItem(id) {
      return delete this.data[id];
    },
    clear() {
      this.data = {};
      return this.data;
    },
  };
};

export default storage;
