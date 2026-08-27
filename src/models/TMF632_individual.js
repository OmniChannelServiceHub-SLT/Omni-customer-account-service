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
  },
  name: String,
  givenName: String,
  familyName: String,
  contactMedium: [{
    mediumType: String,
    characteristic: {
      phoneNumber: String,
      email: String,
    },
    preferred: { type: Boolean, default: false },
  }],
  href: String,
  '@type': { type: String, default: 'Individual' },
  status: { type: String, default: 'active' },
  
  // Extended fields (legacy GetProfile data)
  subscriber_package: String,
  subscriber_package_display: String,
  subscriber_package_type: Number,
  first_bill_date: String,
  billing_date: String,
  blocked: { type: Boolean, default: false },
  registered: { type: Boolean, default: true },
  happy_day: String,
  privileges: {
    usage: { type: Boolean, default: false },
    extra_gb: { type: Boolean, default: false },
    purchase_history: { type: Boolean, default: false },
    profile: { type: Boolean, default: false },
    protocol_report: { type: Boolean, default: false },
    purchase_protocol_report: { type: Boolean, default: false },
    promo_code: { type: Boolean, default: false },
    data_gifting: { type: Boolean, default: false },
    data_transfer: { type: Boolean, default: false },
    data_addons: { type: Boolean, default: false },
    free_data: { type: Boolean, default: false },
    bonus_data: { type: Boolean, default: false },
    happy_day: { type: Boolean, default: false },
    my_plan: { type: Boolean, default: false },
  },
  
  '@baseType': { type: String, default: 'Individual' },
  '@schemaLocation': String,
}, { timestamps: true }
);

// Pre-save hook to generate href
individualSchema.pre('save',async function () {
  if (!this.href) {
    this.href = `/tmf-api/partyManagement/v4/individual/${this.id}`;
  }
});

module.exports = mongoose.model('TMF632_individual', individualSchema);