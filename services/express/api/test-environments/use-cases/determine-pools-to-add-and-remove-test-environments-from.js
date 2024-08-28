function makeAddOrRemoveTestEnvironmentFromPool() {
  function getDifferencesBetweenTwoArrays(previousStateOfArray, newStateOfArray) {
    return previousStateOfArray.filter((arrayItems) => !newStateOfArray.includes(arrayItems))
      .concat(newStateOfArray.filter((arrayItems) => !previousStateOfArray.includes(arrayItems)));
  }

  return function addOrRemoveTestEnvironmentFromPool(previousTestEnvironmentsPools, updatedTestEnvironmentsPools) {
    const poolsToAddTestEnvironmentTo = [];
    const poolsToRemoveTestEnvironmentFrom = [];
    const differenceInEnvironmentsPools = getDifferencesBetweenTwoArrays(previousTestEnvironmentsPools, updatedTestEnvironmentsPools);

    if (differenceInEnvironmentsPools.length > 0) {
      for (const difference of differenceInEnvironmentsPools) {
        if (previousTestEnvironmentsPools.includes(difference)) {
          poolsToRemoveTestEnvironmentFrom.push(difference);
        } else {
          poolsToAddTestEnvironmentTo.push(difference);
        }
      }
      return {
        poolsToAddTestEnvironmentTo,
        poolsToRemoveTestEnvironmentFrom,
      };
    }
  };
}

module.exports = { makeAddOrRemoveTestEnvironmentFromPool };
