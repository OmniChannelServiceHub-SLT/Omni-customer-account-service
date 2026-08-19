const service = require('../services/getUserInfo.service');

/**
 * TMF632-compliant GET /individual/{id}
 * Returns pure TMF resource – NO legacy envelope.
 */
exports.getIndividual = async (req, res, next) => {
  try {
    const { id } = req.params;
    const individual = await service.getIndividualById(id);

    // Build TMF632 resource shape
    const resource = {
      id: individual.id,
      href: individual.href || `/tmf-api/partyManagement/v4/individual/${individual.id}`,
      '@type': individual['@type'] || 'Individual',
      name: individual.name,
      givenName: individual.givenName,
      familyName: individual.familyName,
      contactMedium: individual.contactMedium,
      status: individual.status,
      '@baseType': individual['@baseType'] || 'Individual',
      '@schemaLocation': individual['@schemaLocation'],
    };

    // ✅ CTK expects 200 with pure JSON resource
    res.status(200).json(resource);
  } catch (err) {
    next(err);
  }
};

/**
 * Legacy wrapper for mobile client:
 * GET /api/Account/ViewUserInfo?userName=XXX
 * Returns the legacy { isSuccess, dataBundle } envelope.
 */
exports.getViewUserInfoLegacy = async (req, res, next) => {
  try {
    const { userName } = req.query;
    if (!userName) {
      return res.status(400).json({
        isSuccess: false,
        errorMessege: 'Missing userName query parameter',
        exceptionDetail: null,
        dataBundle: null,
        errorShow: null,
        errorCode: 'MISSING_USERNAME',
      });
    }

    // Reuse the same service
    const individual = await service.getIndividualById(userName);

    // Map to legacy flat shape (as per ViewUserInfo sample)
    const dataBundle = {
      name: individual.name,
      altrContact: individual.contactMedium?.find(c => c.mediumType === 'Phone')
        ?.characteristic?.phoneNumber || null,
      // Add other legacy fields if needed
    };

    res.json({
      isSuccess: true,
      errorMessege: null,
      exceptionDetail: null,
      dataBundle,
      errorShow: null,
      errorCode: null,
    });
  } catch (err) {
    // For 404, return legacy failure envelope
    if (err.statusCode === 404) {
      return res.status(404).json({
        isSuccess: false,
        errorMessege: err.message,
        exceptionDetail: null,
        dataBundle: null,
        errorShow: null,
        errorCode: 'NOT_FOUND',
      });
    }
    next(err);
  }
};