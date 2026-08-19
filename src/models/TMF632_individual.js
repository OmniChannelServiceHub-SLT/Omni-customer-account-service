const mongoose = require('mongoose');

const contactMediumSchema = new mongoose.Schema({
  mediumType: {
    type: String,
    enum: ['Phone', 'Email', 'Post', 'SMS'],
    required: true,
  },
  characteristic: {
    phoneNumber: String,
    email: String,
    // add other contact types if needed
  },
  preferred: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const individualSchema = new mongoose.Schema({
  // TMF632 core fields
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    description: 'Maps to legacy userName (e.g., mobile number)',
  },
  href: {
    type: String,
    description: 'Self-reference URL',
  },
  '@type': {
    type: String,
    default: 'Individual',
  },
  name: {
    type: String,
    required: true,
  },
  givenName: String,
  familyName: String,
  contactMedium: [contactMediumSchema],
  status: {
    type: String,
    enum: ['active', 'inactive', 'terminated'],
    default: 'active',
  },
  // Optional TMF fields for completeness
  '@baseType': { type: String, default: 'Individual' },
  '@schemaLocation': { type: String },
}, {
  timestamps: true,
});

// Pre-save hook to generate href
individualSchema.pre('save', function (next) {
  if (!this.href) {
    this.href = `/tmf-api/partyManagement/v4/individual/${this.id}`;
  }
  next();
});

module.exports = mongoose.model('TMF632_individual', individualSchema);