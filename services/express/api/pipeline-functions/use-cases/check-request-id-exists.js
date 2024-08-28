function makeCheckRequestIdExists() {
  return function checkRequestIdExists(testEnvObj) {
    if (testEnvObj.requestId === '') {
      return false;
    }
    return true;
  };
}

module.exports = { makeCheckRequestIdExists };
