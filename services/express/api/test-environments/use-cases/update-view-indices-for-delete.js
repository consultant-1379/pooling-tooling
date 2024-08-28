function makeUpdateViewIndices() {
  return function updateViewIndices(environments, viewName, indexToBeRemoved) {
    for (let i = indexToBeRemoved; i < environments.length; i += 1) {
      environments[i].priorityInfo.viewIndices[viewName] -= 1;
    }
    return environments;
  };
}

module.exports = { makeUpdateViewIndices };
