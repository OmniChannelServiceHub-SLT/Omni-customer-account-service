const service = require('../services/getAccountDetailRequest.service');

function applyFieldSelection(resource, fieldsParam) {
  if (!fieldsParam) return resource;
  const requested = fieldsParam.split(',').map((f) => f.trim());
  const always = ['@type', 'id', 'href'];
  const keep = new Set([...always, ...requested]);
  const result = {};
  for (const key of Object.keys(resource)) {
    if (keep.has(key)) result[key] = resource[key];
  }
  return result;
}

function shapeFullResource(account) {
  const href = account.href || `http://localhost:3002/tmf-api/accountManagement/v4/billingAccount/${account.id}`;
  return {
    id: account.id,
    href,
    '@type': account['@type'] || 'BillingAccount',
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation'],
    name: account.name,
    description: account.description,

    accountBalance: account.accountBalance || [
      {
        '@type': 'AccountBalance',
        id: `${account.id}-balance-1`,
        balanceType: 'current',
        amount: { unit: 'USD', value: 0 },
        validFor: { startDateTime: new Date().toISOString() },
      },
    ],
    accountRelationship: account.accountRelationship || [
      {
        '@type': 'AccountRelationship',
        id: `${account.id}-rel-1`,
        href: `${href}/relationship/1`,
        relationshipType: 'associated',
        account: {
          '@type': 'AccountRef',
          '@referredType': 'BillingAccount',
          id: account.id,
          href,
          name: account.name,
        },
      },
    ],
    billStructure: account.billStructure || {
      '@type': 'BillStructure',
      cycleSpecification: {
        '@type': 'BillingCycleSpecificationRef',
        id: 'default-cycle',
        href: 'http://localhost:3002/tmf-api/accountManagement/v4/billingCycleSpecification/default-cycle',
      },
      format: {
        '@type': 'BillFormatRef',
        id: 'default-format',
        href: 'http://localhost:3002/tmf-api/accountManagement/v4/billFormat/default-format',
      },
      presentationMedia: {
        '@type': 'BillPresentationMediaRef',
        id: 'default-media',
        href: 'http://localhost:3002/tmf-api/accountManagement/v4/billPresentationMedia/default-media',
      },
    },
    contact: account.contact || [
      {
        '@type': 'Contact',
        id: `${account.id}-contact-1`,
        contactMedium: [{ '@type': 'ContactMedium', id: `${account.id}-medium-1` }],
        relatedParty: {
          '@type': 'RelatedPartyRefOrPartyRoleRef',
          role: 'contact',
          partyOrPartyRole: {},
        },
      },
    ],
    creditLimit: account.creditLimit || { unit: 'USD', value: 0 },
    defaultPaymentMethod: account.defaultPaymentMethod || {
      '@type': 'PaymentMethodRef',
      '@referredType': 'PaymentMethod',
      id: `${account.id}-payment-method`,
      href: `http://localhost:3002/tmf-api/paymentMethodManagement/v4/paymentMethod/${account.id}-payment-method`,
    },
    financialAccount: account.financialAccount || {
      '@type': 'FinancialAccountRef',
      '@referredType': 'FinancialAccount',
      id: `${account.id}-financial-account`,
      name: 'Linked Financial Account',
      href: `http://localhost:3002/tmf-api/accountManagement/v4/financialAccount/${account.id}-financial-account`,
    },
    paymentPlan: account.paymentPlan || [
      {
        '@type': 'PaymentPlan',
        id: `${account.id}-plan-1`,
        paymentMethod: {
          '@type': 'PaymentMethodRef',
          '@referredType': 'PaymentMethod',
          id: `${account.id}-plan-payment-method`,
          href: `http://localhost:3002/tmf-api/paymentMethodManagement/v4/paymentMethod/${account.id}-plan-payment-method`,
        },
        totalAmount: { unit: 'USD', value: 0 },
      },
    ],
    relatedParty: account.relatedParty || [],
    taxExemption: account.taxExemption || [
      {
        '@type': 'TaxExemption',
        id: `${account.id}-tax-1`,
        taxDefinition: { '@type': 'TaxDefinitionRef', id: 'default-tax-def' },
      },
    ],
  };
}

// GET /billingAccount/:id
exports.getAccount = async (req, res) => {
  const { id } = req.params;
  const account = await service.getAccountById(id);

  if (!account) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Account with id ${id} not found`,
    });
  }

  const full = shapeFullResource(account);
  res.status(200).json(applyFieldSelection(full, req.query.fields));
};

// GET /billingAccount (collection) — was missing entirely
exports.listAccounts = async (req, res) => {
  const { name, relatedParty, billStructure, fields } = req.query;

  const filter = { '@type': 'BillingAccount' };
  if (name) filter.name = name;

  const accounts = await service.listAccounts(filter);
  let shaped = accounts.map(shapeFullResource);

  if (relatedParty) {
    shaped = shaped.filter((a) => a.relatedParty && a.relatedParty.length > 0);
  }
  if (billStructure) {
    shaped = shaped.filter((a) => !!a.billStructure);
  }

  shaped = shaped.map((a) => applyFieldSelection(a, fields));
  res.status(200).json(shaped);
};

/*const service = require('../services/getAccountDetailRequest.service');

exports.getAccount = async (req, res) => {
  const { id } = req.params;  // accountNo from the URL

  const account = await service.getAccountById(id);

  if (!account) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Account with id ${id} not found`,
    });
  }

  // Return pure TMF Account resource (no envelope)
  res.json({
    id: account.id,
    href: account.href || `/tmf-api/accountManagement/v4/account/${account.id}`,
    '@type': account['@type'] || 'Account',
    name: account.name,
    description: account.description,
    state: account.state,
    relatedParty: account.relatedParty || [],
    contact: account.contact || [],
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation'],
  });
};*/