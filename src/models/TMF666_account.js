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
  // Related Party reference (links to Individual)
  relatedParty: [{
    id: String,        // Individual id (NIC or userName)
    href: String,
    name: String,
    role: String,      // e.g., 'Owner', 'User'
    '@referredType': { type: String, default: 'Individual' },
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

module.exports = mongoose.model('TMF666_Account', accountSchema);