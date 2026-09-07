const service = require('../services/service');

/**
 * TMF632-compliant GET /individual/dashboard
 * Returns a list of all Individuals (or filtered) for dashboard distribution.
 */
exports.getDashboard = async (req, res) => {
  try {
    // You can add filters via query params if needed, e.g., ?status=active
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const individuals = await service.getAllIndividuals(filter);

    // Map to pure TMF632 Individual resources
    const resources = individuals.map(ind => ({
      id: ind.id,
      href: ind.href || `/tmf-api/partyManagement/v4/individual/${ind.id}`,
      '@type': ind['@type'] || 'Individual',
      name: ind.name,
      givenName: ind.givenName,
      familyName: ind.familyName,
      contactMedium: ind.contactMedium || [],
      status: ind.status || 'active',
      // Include extended fields if needed for dashboard
      subscriber_package: ind.subscriber_package,
      subscriber_package_display: ind.subscriber_package_display,
      subscriber_package_type: ind.subscriber_package_type,
      first_bill_date: ind.first_bill_date,
      billing_date: ind.billing_date,
      blocked: ind.blocked,
      registered: ind.registered,
      privileges: ind.privileges || {},
      happy_day: ind.happy_day,
      '@baseType': ind['@baseType'] || 'Individual',
      '@schemaLocation': ind['@schemaLocation']
    }));

    res.status(200).json(resources);
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: 'Failed to fetch dashboard data'
    });
  }
};