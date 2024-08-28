function makeDb({ dbConnector, Id, logger }) {
  async function findAll(collection) {
    let connection;
    try {
      connection = await dbConnector();
      if (connection) {
        const result = await connection.db.collection(collection).find();
        return (await result.toArray()).map(({ _id: id, ...found }) => ({
          id,
          ...found,
        }));
      }
      throw new Error('DB connection error');
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'findAll',
        actionParameters: { collection },
      };
      logger.error(loggingTags, `Error while fetching data from the database: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  /**
   * Provided to allow for local sorting of MongoDB results.
   *
   * @param collection collection being queried
   * @param sortCompareFunction function used to sort MongoDB results
   * @return {Promise<(*&{id: *})[]>} results of the query sorted locally
   */
  async function findAllSorted(collection, sortCompareFunction) {
    let connection;
    try {
      connection = await dbConnector();
      if (connection) {
        const result = await connection.db.collection(collection).find();
        const resultArray = await result.toArray();
        return resultArray
          .sort(sortCompareFunction)
          .map(({ _id: id, ...found }) => ({
            id,
            ...found,
          }));
      }
      throw new Error('DB connection error');
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'findAllSorted',
        actionParameters: { collection },
      };
      logger.error(loggingTags, `Error while fetching sorted data from the database: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async function findById(entityId, collection) {
    let connection;
    try {
      connection = await dbConnector();
      if (connection) {
        const result = await connection.db
          .collection(collection)
          .find({ _id: entityId });
        return (await result.toArray()).map(({ _id: id, ...found }) => ({
          id,
          ...found,
        }));
      }
      throw new Error('DB connection error');
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'findById',
        actionParameters: { collection },
      };

      logger.error(loggingTags, `Error while fetching data by ID from the database: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async function findBySearchQuery(searchCriteria, collection) {
    let connection;
    try {
      connection = await dbConnector();
      if (connection) {
        const searchResults = await connection.db
          .collection(collection)
          .find(searchCriteria);
        return (await searchResults.toArray()).map(({ _id: id, ...found }) => ({
          id,
          ...found,
        }));
      }
      throw new Error('DB connection error');
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'findBySearchQuery',
        actionParameters: { collection },
      };
      logger.error(loggingTags, `Error while fetching data by search query from the database: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  /**
   * Provided to allow for MongoDB aggregation of results.
   *
   * @param pipeline pipeline to be used for aggregation
   * @param collection name of the collection to be queried
   * @return {Promise<(*&{id: *})[]>} results of the aggregation
   */
  async function findByAggregation(pipeline, collection) {
    let connection;
    try {
      connection = await dbConnector();
      if (connection) {
        const searchResults = await connection.db
          .collection(collection)
          .aggregate(pipeline);
        const result = (await searchResults.toArray()).map(({ _id: id, ...found }) => ({
          id,
          ...found,
        }));
        return result;
      }
      throw new Error('DB connection error');
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'findByAggregation',
        actionParameters: { collection },
      };
      logger.error(loggingTags, `Error while fetching data by aggregation from the database: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  /**
   * Provided to allow for local sorting of MongoDB results.
   *
   * @param searchCriteria criteria by which to search
   * @param collection name of the collection to be queried
   * @param sortCompareFunction function used to sort MongoDB results
   * @return {Promise<(*&{id: *})[]>} results of the query sorted locally
   */
  async function findBySearchQuerySorted(
    searchCriteria,
    collection,
    sortCompareFunction,
  ) {
    let connection;
    try {
      connection = await dbConnector();
      if (connection) {
        const searchResults = await connection.db
          .collection(collection)
          .find(searchCriteria);
        const searchResultsArray = await searchResults.toArray();
        return searchResultsArray
          .sort(sortCompareFunction)
          .map(({ _id: id, ...found }) => ({
            id,
            ...found,
          }));
      }
      throw new Error('DB connection error');
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'findBySearchQuerySorted',
        actionParameters: { collection },
      };
      logger.error(loggingTags, `Error while fetching sorted data by search query from the database: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async function findOneAndUpdate(collection, filterParams, updates) {
    let connection;
    try {
      connection = await dbConnector();
      if (connection) {
        const result = await connection.db
          .collection(collection)
          .findOneAndUpdate(
            filterParams,
            updates,
            {
              returnDocument: 'after',
            },
          );
        if (Object.prototype.hasOwnProperty.call(result, 'value') && result.value) {
          const id = result.value._id;
          delete result.value._id;
          return { id, ...result.value };
        }
        throw new Error('Failed to update entity');
      }
      throw new Error('DB connection error');
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'findOneAndUpdate',
        actionParameters: { collection, filterParams, updates },
      };
      logger.error(loggingTags, `Error while updating data by search query from the database: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async function insert({ id: _id = Id.makeId(), ...entityInfo }, collection) {
    let connection;
    try {
      connection = await dbConnector();
      if (connection) {
        const result = await connection.db
          .collection(collection)
          .insertOne({ _id, ...entityInfo });
        const id = result.insertedId;
        return { id, ...entityInfo };
      }
      throw new Error('DB connection error');
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'insert',
        actionParameters: { collection },
      };
      logger.error(loggingTags, `Error while inserting data into the database: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async function update({ id: _id, ...entityInfo }, collection) {
    let connection;
    try {
      connection = await dbConnector();
      if (connection) {
        const result = await connection.db
          .collection(collection)
          .updateOne({ _id }, { $set: { ...entityInfo } });
        return result.modifiedCount > 0 ? { id: _id, ...entityInfo } : null;
      }
      throw new Error('DB connection error');
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'update',
        actionParameters: { collection },
      };
      logger.error(loggingTags, `Error while updating data in the database: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async function remove({ id: _id }, collection) {
    let connection;
    try {
      connection = await dbConnector();
      if (connection) {
        const result = await connection.db
          .collection(collection)
          .deleteOne({ _id });
        return result.deletedCount > 0 ? { id: _id } : null;
      }
      throw new Error('DB connection error');
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'remove',
        actionParameters: { collection },
      };
      logger.error(loggingTags, `Error while removing data from the database: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async function dropCollection(collection) {
    let connection;
    try {
      if (process.env.NODE_ENV !== 'PROD' && process.env.NODE_ENV !== 'STAG') {
        connection = await dbConnector();
        if (connection) {
          const collections = await connection.db.listCollections().toArray();
          for (const dbCollection of collections) {
            if (dbCollection.name === collection) {
              const result = await connection.db.dropCollection(collection);
              return result;
            }
          }
          return false;
        }
        throw new Error('DB connection error');
      }
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'dropCollection',
        actionParameters: { collection },
      };
      logger.error(loggingTags, `Error while dropping collection from the database: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  /**
   * Provided to create an index on a collection.
   *  idempotent operation. I.e creates the index only if it does not already exist
   *  might fail if index is invalid I.e if duplicate names exist when setting name as {name:1}{unique:true}
   *
   * @param collection name of the collection to be queried
   * @param args arguments passed to createIndex
   * @return {Promise<Boolean>} If index exists.
   */
  async function createCollectionIndex(collection, ...args) {
    let connection;
    try {
      connection = await dbConnector();
      if (connection) {
        const indexName = await connection.db
          .collection(collection)
          .createIndex(...args);
        const result = await connection.db
          .collection(collection)
          .indexExists(indexName);
        return result;
      }
      throw new Error('DB connection error');
    } catch (error) {
      const loggingTags = {
        service: 'Data Access',
        action: 'createCollectionIndex',
        actionParameters: { collection },
      };

      logger.error(loggingTags, `Error while creating index on collection: ${error.message}`);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  return Object.freeze({
    createCollectionIndex,
    dropCollection,
    findAll,
    findAllSorted,
    findById,
    findBySearchQuery,
    findByAggregation,
    findBySearchQuerySorted,
    findOneAndUpdate,
    insert,
    remove,
    update,
  });
}

module.exports = { makeDb };
