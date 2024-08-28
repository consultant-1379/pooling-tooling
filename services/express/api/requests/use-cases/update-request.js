const { BadRequestError } = require('../../../interfaces/BadRequestError');
const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeUpdateRequest(logger, flattenObject) {
  function updateRequestEntity(changes) {
    if (changes.createdOn) {
      delete changes.createdOn;
    }
    if (changes.id) {
      delete changes.id;
    }
    if (changes.requestorDetails) {
      const flattenedRequestorDetails = flattenObject(
        changes.requestorDetails,
        'requestorDetails',
      );
      delete changes.requestorDetails;
      changes = { ...changes, ...flattenedRequestorDetails };
    }

    changes.modifiedOn = new Date();

    return { $set: changes };
  }

  return function updateRequest(existingRequest, changes) {
    const loggingTags = {
      service: 'Request (use-cases)',
      action: 'updateRequest',
      actionParameters: { RequestChanges: changes },
    };
    try {
      if (!existingRequest) {
        const errorInfo = {
          message: 'Request not found',
        };
        throw new NotFoundError(errorInfo.message);
      }
      if (changes.status && ![
        'Reserved',
        'Unreserved',
        'Pending',
        'Queued',
        'Timeout',
        'Aborted',
      ].includes(changes.status)) {
        throw new BadRequestError(`Invalid status '${changes.status}' provided when making request`);
      }

      const updatedRequest = updateRequestEntity({ ...changes });
      logger.info(
        loggingTags,
        `Request entity with ID:${existingRequest.id} was successfully updated.`,
      );

      return updatedRequest;
    } catch (error) {
      logger.error(
        { errorInfo: { message: `${error.message}` }, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
      throw error;
    }
  };
}

module.exports = { makeUpdateRequest };
