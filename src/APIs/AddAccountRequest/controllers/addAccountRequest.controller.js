const service = require('../services/addAccountRequest.service');
const crypto = require('crypto');

exports.createAccount = async (req, res) => {
  const accountData = req.body;

  accountData.id = accountData.id || crypto.randomUUID();

  const existingAccount = await service.findAccountByAccountNo(accountData.id);
  if (existingAccount) {
    return res.status(409).json({
      code: 'DUPLICATE_ACCOUNT',
      message: `Account with id ${accountData.id} already exists`,
    });
  }

  const account = await service.createAccount(accountData);

  const href = account.href || `http://localhost:3002/tmf-api/accountManagement/v4/billingAccount/${account.id}`;

  res.status(201).json({
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
      presentationMedia: [{
        '@type': 'BillPresentationMediaRef',
        id: 'default-media',
        href: 'http://localhost:3002/tmf-api/accountManagement/v4/billPresentationMedia/default-media',
      }],
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
  });
};


/*const service = require('../services/addAccountRequest.service');

exports.createAccount = async (req, res) => {
  const accountData = req.body;  // ← Use request body, not query

  // Check for required fields (TMF standard)
  if (!accountData.id) {
    return res.status(400).json({
      code: 'MISSING_ID',
      message: 'Account id is required'
    });
  }

  // Check if account already exists
  const existingAccount = await service.findAccountByAccountNo(accountData.id);
  if (existingAccount) {
    return res.status(409).json({
      code: 'DUPLICATE_ACCOUNT',
      message: `Account with id ${accountData.id} already exists`,
    });
  }

  // Create the account (accountData is already TMF-shaped)
  const account = await service.createAccount(accountData);

  // Return pure TMF Account resource (no envelope)
  res.status(201).json({
    id: account.id,
    href: account.href || `/tmf-api/accountManagement/v4/account/${account.id}`,
    '@type': account['@type'] || 'Account',
    name: account.name,
    description: account.description,
    state: account.state || 'active',
    relatedParty: account.relatedParty || [],
    contact: account.contact || [],
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation'],
  });
};*/