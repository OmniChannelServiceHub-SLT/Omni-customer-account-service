const service = require('../services/service');

exports.patchAccount = async (req, res) => {
  const { id } = req.params;

  const existing = await service.getAccountById(id);
  if (!existing) {
    return res.status(404).json({
      code: 'NOT_FOUND',
      message: `Account with id ${id} not found`,
    });
  }

  const updated = await service.updateAccount(id, req.body || {});

  const href = updated.href || `http://localhost:3002/tmf-api/accountManagement/v4/billingAccount/${updated.id}`;

  res.status(200).json({
    id: updated.id,
    href,
    '@type': updated['@type'] || 'BillingAccount',
    '@baseType': updated['@baseType'] || 'Account',
    '@schemaLocation': updated['@schemaLocation'],
    name: updated.name,
    description: updated.description,

    accountBalance: updated.accountBalance || [
      {
        '@type': 'AccountBalance',
        id: `${updated.id}-balance-1`,
        balanceType: 'current',
        amount: { unit: 'USD', value: 0 },
        validFor: { startDateTime: new Date().toISOString() },
      },
    ],
    accountRelationship: updated.accountRelationship || [
      {
        '@type': 'AccountRelationship',
        id: `${updated.id}-rel-1`,
        href: `${href}/relationship/1`,
        relationshipType: 'associated',
        account: {
          '@type': 'AccountRef',
          '@referredType': 'BillingAccount',
          id: updated.id,
          href,
          name: updated.name,
        },
      },
    ],
    billStructure: updated.billStructure || {
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
      presentationMedia: [
        {
          '@type': 'BillPresentationMediaRef',
          id: 'default-media',
          href: 'http://localhost:3002/tmf-api/accountManagement/v4/billPresentationMedia/default-media',
        },
      ],
    },
    contact: updated.contact || [
      {
        '@type': 'Contact',
        id: `${updated.id}-contact-1`,
        contactMedium: [{ '@type': 'ContactMedium', id: `${updated.id}-medium-1` }],
        relatedParty: {
          '@type': 'RelatedPartyRefOrPartyRoleRef',
          role: 'contact',
          partyOrPartyRole: {},
        },
      },
    ],
    creditLimit: updated.creditLimit || { unit: 'USD', value: 0 },
    defaultPaymentMethod: updated.defaultPaymentMethod || {
      '@type': 'PaymentMethodRef',
      '@referredType': 'PaymentMethod',
      id: `${updated.id}-payment-method`,
      href: `http://localhost:3002/tmf-api/paymentMethodManagement/v4/paymentMethod/${updated.id}-payment-method`,
    },
    financialAccount: updated.financialAccount || {
      '@type': 'FinancialAccountRef',
      '@referredType': 'FinancialAccount',
      id: `${updated.id}-financial-account`,
      name: 'Linked Financial Account',
      href: `http://localhost:3002/tmf-api/accountManagement/v4/financialAccount/${updated.id}-financial-account`,
    },
    paymentPlan: updated.paymentPlan || [
      {
        '@type': 'PaymentPlan',
        id: `${updated.id}-plan-1`,
        paymentMethod: {
          '@type': 'PaymentMethodRef',
          '@referredType': 'PaymentMethod',
          id: `${updated.id}-plan-payment-method`,
          href: `http://localhost:3002/tmf-api/paymentMethodManagement/v4/paymentMethod/${updated.id}-plan-payment-method`,
        },
        totalAmount: { unit: 'USD', value: 0 },
      },
    ],
    relatedParty: updated.relatedParty || [],
    taxExemption: updated.taxExemption || [
      {
        '@type': 'TaxExemption',
        id: `${updated.id}-tax-1`,
        taxDefinition: { '@type': 'TaxDefinitionRef', id: 'default-tax-def' },
      },
    ],
  });
};