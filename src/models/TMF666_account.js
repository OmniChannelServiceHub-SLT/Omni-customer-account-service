const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  // TMF666 core fields
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    description: 'Maps to legacy accountNo',
  },
  href: {
    type: String,
    description: 'Self-reference URL',
  },
  '@type': {
    type: String,
    default: 'Account',
  },
  name: {
    type: String,
    description: 'Account name (could be customer name or account type)',
  },
  description: String,
  state: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'terminated'],
    default: 'active',
  },
  // Related Party — Mixed so both the legacy shape (id/href/name/role/
  // @referredType) and the TMF666 BillingAccount shape (role/@type/
  // partyOrPartyRole) can be stored without either one stripping fields.
  relatedParty: [mongoose.Schema.Types.Mixed],
  // Contact — same reasoning: legacy (mediumType/characteristic/preferred)
  // vs BillingAccount (@type/contactMedium/relatedParty) shapes both need
  // to pass through untouched depending on which resource created the doc.
  contact: [mongoose.Schema.Types.Mixed],
  userKey: String,
  '@baseType': { type: String, default: 'Account' },
  '@schemaLocation': { type: String },

  // --- BillingAccount-only fields (unused by the legacy Account flow) ---
  accountBalance: [mongoose.Schema.Types.Mixed],
  accountRelationship: [mongoose.Schema.Types.Mixed],
  billStructure: mongoose.Schema.Types.Mixed,
  creditLimit: mongoose.Schema.Types.Mixed,
  defaultPaymentMethod: mongoose.Schema.Types.Mixed,
  financialAccount: mongoose.Schema.Types.Mixed,
  paymentPlan: [mongoose.Schema.Types.Mixed],
  taxExemption: [mongoose.Schema.Types.Mixed],
}, { timestamps: true });

// Pre-save hook to generate href — path depends on which resource this
// document represents, so both the legacy /account endpoints and the new
// /billingAccount endpoints get a correct self-reference from one model.
accountSchema.pre('save', function () {
  if (!this.href) {
    const resourcePath = this['@type'] === 'BillingAccount' ? 'billingAccount' : 'account';
    this.href = `http://localhost:3002/tmf-api/accountManagement/v4/${resourcePath}/${this.id}`;
  }
 // next();
});

module.exports = mongoose.model('TMF666_Account', accountSchema);

/*const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  // TMF666 core fields
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    description: 'Maps to legacy accountNo',
  },
  href: {
    type: String,
    description: 'Self-reference URL',
  },
  '@type': {
    type: String,
    default: 'Account',
  },
  name: {
    type: String,
    description: 'Account name (could be customer name or account type)',
  },
  description: String,
  state: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'terminated'],
    default: 'active',
  },
  // Related Party reference (links to Individual)
  relatedParty: [{
    id: String,        // Individual id (NIC or userName)
    href: String,
    name: String,
    role: String,      // e.g., 'Owner', 'User'
    '@referredType': { type: String, default: 'TMF632_individual' },
  }],
  // Contact information (telephone from legacy)
  contact: [{
    mediumType: String,  // 'Phone', 'Email'
    characteristic: {
      phoneNumber: String,
      email: String,
    },
    preferred: { type: Boolean, default: false },
  }],
  userKey: String,
  '@baseType': { type: String, default: 'Account' },
  '@schemaLocation': { type: String },
}, { timestamps: true });

// Pre-save hook to generate href
accountSchema.pre('save', function () {
  if (!this.href) {
    this.href = `/tmf-api/accountManagement/v4/account/${this.id}`;
  }
 // next();
});

module.exports = mongoose.model('TMF666_Account', accountSchema);*/