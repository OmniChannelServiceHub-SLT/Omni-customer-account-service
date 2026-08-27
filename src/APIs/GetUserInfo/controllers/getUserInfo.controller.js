const service = require('../services/getUserInfo.service');

/**
 * TMF632-compliant GET /individual
 * Supports:
 *   - GET /individual/{id} (by ID)
 *   - GET /individual?familyName=xxx (filter by familyName)
 *   - GET /individual?givenName=xxx (filter by givenName)
 *   - GET /individual?id=xxx (filter by id)
 *   - GET /individual?fields=familyName,givenName (field selection)
 */
exports.getIndividual = async (req, res, next) => {
  try {
    // Case 1: GET /individual/:id (path param)
    if (req.params.id) {
      const { id } = req.params;
      const individual = await service.getIndividualById(id);

      if (!individual) {
        return res.status(404).json({
          code: 'NOT_FOUND',
          message: `Individual with id ${id} not found`
        });
      }

      // Return single TMF632 resource
      return res.status(200).json({
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
      });
    }

    // Case 2: GET /individual? (query filters)
    const { id, familyName, givenName, fields, subscriberID } = req.query;

    // Build filter object
    let filter = {};
    
    // TMF standard filters
    if (id) filter.id = id;
    if (familyName) filter.familyName = familyName;
    if (givenName) filter.givenName = givenName;
    
    // Legacy support (subscriberID)
    if (subscriberID) filter.id = subscriberID;

    // If no filters provided, return 400 (CTK expects this)
    if (Object.keys(filter).length === 0) {
      return res.status(200).json([]);
    }

    // Query database
    const individuals = await service.findIndividuals(filter);

    if (!individuals || individuals.length === 0) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'No Individuals found matching criteria'
      });
    }

    // Handle field selection (CTK uses this)
    const selectedFields = fields ? fields.split(',') : null;

    // Map to TMF resources
    const resources = individuals.map(ind => {
      const resource = {
        id: ind.id,
        href: ind.href || `/tmf-api/partyManagement/v4/individual/${ind.id}`,
        '@type': ind['@type'] || 'Individual',
        name: ind.name,
        givenName: ind.givenName,
        familyName: ind.familyName,
        contactMedium: ind.contactMedium || [],
        status: ind.status || 'active',
        '@baseType': ind['@baseType'] || 'Individual',
        '@schemaLocation': ind['@schemaLocation']
      };

      // Apply field selection if requested
      if (selectedFields) {
        const filtered = {};
        selectedFields.forEach(field => {
          if (field in resource) {
            filtered[field] = resource[field];
          }
        });
        return filtered;
      }

      return resource;
    });

    res.status(200).json(resources);

  } catch (err) {
    next(err);
  }
};

exports.createIndividual = async (req, res) => {
  const individualData = req.body;

  // Validate required fields
  if (!individualData.id) {
    return res.status(400).json({
      code: 'MISSING_ID',
      message: 'Individual id is required'
    });
  }

  // Check if already exists
  const existing = await service.findIndividualById(individualData.id);
  if (existing) {
    return res.status(409).json({
      code: 'DUPLICATE_INDIVIDUAL',
      message: `Individual with id ${individualData.id} already exists`
    });
  }

  // Create new Individual
  const newIndividual = await service.createIndividual(individualData);

  // Return 201 Created with the resource
  res.status(201).json({
    id: newIndividual.id,
    href: newIndividual.href || `/tmf-api/partyManagement/v4/individual/${newIndividual.id}`,
    '@type': newIndividual['@type'] || 'Individual',
    name: newIndividual.name,
    givenName: newIndividual.givenName,
    familyName: newIndividual.familyName,
    contactMedium: newIndividual.contactMedium || [],
    status: newIndividual.status || 'active',
    '@baseType': newIndividual['@baseType'] || 'Individual',
    '@schemaLocation': newIndividual['@schemaLocation']
  });
};

/**
 * Legacy wrapper for mobile client:
 * GET /api/Account/ViewUserInfo?userName=XXX
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

    const individual = await service.getIndividualById(userName);

    const dataBundle = {
      name: individual.name,
      altrContact: individual.contactMedium?.find(c => c.mediumType === 'Phone')
        ?.characteristic?.phoneNumber || null,
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