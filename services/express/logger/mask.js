class Mask {
  constructor(log) {
    this.log = log;
    this.logDict = {};
  }

  info(...args) {
    return this.log.info(...args);
  }

  debug(...args) {
    return this.log.info(...args);
  }

  error(...args) {
    return this.log.info(...args);
  }

  logFormatter(logs) {
    this.logDict = {};
    for (let i = 0; i < logs.length; i += 1) {
      this.logDict[i] = logs[i];
    }
    return this.logDict;
  }
}

module.exports = Mask;
