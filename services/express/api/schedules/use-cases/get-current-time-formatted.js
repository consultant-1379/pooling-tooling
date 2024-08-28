function makeGetCurrentTimeFormatted() {
  return function getCurrentTimeFormatted() {
    const currentTimeUnformatted = new Date();
    return currentTimeUnformatted.toISOString().substring(11, 16);
  };
}

module.exports = { makeGetCurrentTimeFormatted };
