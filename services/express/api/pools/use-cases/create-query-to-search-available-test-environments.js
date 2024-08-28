const { BadRequestError } = require('../../../interfaces/BadRequestError');

function makeCreateQueryToSearchAvailableTestEnvironments() {
  return function createQueryToSearchAvailableTestEnvironments(searchQuery) {
    if (Object.keys(searchQuery).length === 0) {
      throw new BadRequestError('You must specify a search query.');
    }
    // Example of searchQuery object
    //  {
    //    id: [ '297', '306' ],
    //    status: 'Available'
    //  }
    // We want to group all ORs into one array and all ANDs into another array
    // From above: Give me all test environment ids 297 OR 306 AND status 'Available'

    let firstPartOfQuery = '';
    let secondPartOfQuery = '';
    // Go through each property e.g. assignedTestEnvironments
    for (const poolProperty in searchQuery) {
      // If its an Array we're talking multiple ORs if not its a single AND
      // E.g. 297 or 306 vs ongoing AND 1.2.3
      if (searchQuery[poolProperty] instanceof Array) {
        secondPartOfQuery = `${secondPartOfQuery}"$or": [`;
        // Go through the array e.g. [ '297', '306' ]
        const poolPropertyValues = searchQuery[poolProperty];
        for (const poolPropertyValue in poolPropertyValues) {
          if (poolPropertyValue !== null) {
            // Example  "$or": [{ "id": "297" },
            secondPartOfQuery = `${secondPartOfQuery}{ "${poolProperty}": "${poolPropertyValues[poolPropertyValue]}" },`;
          }
        }
        // Get rid of last comma
        secondPartOfQuery = secondPartOfQuery.slice(0, -1);
        // Close off the OR
        secondPartOfQuery = `${secondPartOfQuery}],`;
      } else {
        // Add to the AND part - e.g { "status": "Available" },
        firstPartOfQuery = `${firstPartOfQuery}{ "${poolProperty}": "${searchQuery[poolProperty]}" },`;
      }
    }
    firstPartOfQuery = firstPartOfQuery.slice(0, -1);
    secondPartOfQuery = secondPartOfQuery.slice(0, -1);

    // If there is both an 'AND' and 'OR' part then a comma will be put between them
    if (firstPartOfQuery !== '') {
      firstPartOfQuery = `"$and": [${firstPartOfQuery}]`;
    }
    if (firstPartOfQuery !== '' && secondPartOfQuery !== '') {
      secondPartOfQuery = `, ${secondPartOfQuery}`;
    }

    // Example of a finalQuery: {"$and": [{ "status": "Available" }], "$or": [{ "id": "297" },{ "id": "306" }]}
    const query = `{${firstPartOfQuery}${secondPartOfQuery}}`;
    // Remove backslashes in front of quotation marks (otherwise, unit tests will fail!)
    const finalQuery = JSON.parse(query);
    return finalQuery;
  };
}

module.exports = { makeCreateQueryToSearchAvailableTestEnvironments };
