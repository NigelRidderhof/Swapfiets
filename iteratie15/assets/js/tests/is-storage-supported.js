/**
 * Check if local- or sessionstorage is available
 * @param storage
 * @returns {boolean}
 */
const isStorageSupported = (storage) => {
  try {
    const storageObject = window[`${storage}Storage`];
    const testKey = 'test';

    storageObject.setItem(testKey, '1');
    storageObject.removeItem(testKey);

    return true;
  } catch (error) {
    return false;
  }
};

export default isStorageSupported;
