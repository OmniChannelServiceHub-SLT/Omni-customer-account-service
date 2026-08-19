const service = require('../services/service');

exports.checkExistCustomer = async (req, res) => {
  const { nic } = req.query;

  if (!nic) {
    return res.status(400).json({
      code: 'MISSING_PARAMETER',
      message: 'NIC query parameter is required',
    });
  }

  const customer = await service.findCustomerByNIC(nic);

  if (!customer) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Customer with NIC ${nic} not found`,
    });
  }

  // Return TMF629 Customer resource (using Individual data)
  res.json({
    id: customer.id,
    href: customer.href || `/tmf-api/customerManagement/v4/customer/${customer.id}`,
    '@type': 'Customer',  // TMF629 resource type
    name: customer.name,
    givenName: customer.givenName,
    familyName: customer.familyName,
    contactMedium: customer.contactMedium || [],
    status: customer.status || 'active',
    // Extended legacy fields
    subscriber_package: customer.subscriber_package,
    subscriber_package_display: customer.subscriber_package_display,
    subscriber_package_type: customer.subscriber_package_type,
    first_bill_date: customer.first_bill_date,
    billing_date: customer.billing_date,
    blocked: customer.blocked,
    registered: customer.registered,
    privileges: customer.privileges,
    happy_day: customer.happy_day,
    '@baseType': 'Customer',
    '@schemaLocation': customer['@schemaLocation'],
  });
};