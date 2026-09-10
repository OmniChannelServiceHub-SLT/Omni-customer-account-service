/**
 * TMF666 Account Mapper – TMF Dialect (pure BillingAccount resource)
 */
exports.toTmfResponse = (account) => {
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
      // presentationMedia is an array of plain strings in TMF666, not ref objects
      presentationMedia: ['Electronic'],
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
};

/**
 * TMF error shape
 */
exports.toTmfError = (err) => {
  return {
    code: err.code || 'INTERNAL_ERROR',
    reason: err.reason || err.message,
    message: err.message,
    status: err.statusCode || 500,
  };
};
/*
exports.toTmfResponse = (account) => {
  return {
    id: account.id,
    href: account.href || `/tmf-api/accountManagement/v4/account/${account.id}`,
    '@type': account['@type'] || 'Account',
    name: account.name,
    description: account.description,
    state: account.state || 'active',
    relatedParty: account.relatedParty || [],
    contact: account.contact || [],
    '@baseType': account['@baseType'] || 'Account',
    '@schemaLocation': account['@schemaLocation']
  };
};

exports.toTmfError = (err) => {
  return {
    code: err.code || 'INTERNAL_ERROR',
    reason: err.reason || err.message,
    message: err.message,
    status: err.statusCode || 500
  };
};
*/