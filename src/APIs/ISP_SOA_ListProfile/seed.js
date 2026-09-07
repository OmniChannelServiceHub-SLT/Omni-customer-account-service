const mongoose = require('mongoose');
const Individual = require('../../../src/models/TMF632_individual');
const Account = require('../../../src/models/TMF666_Account');

// Connection URI – adjust if needed
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://OminiChannel:OminiChannel@cluster0.jhxpotk.mongodb.net/customer_account_db?appName=Cluster0';

async function seedISPSoa() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // === 1. Create Individual ===
    const individualData = {
      id: 'ISP-SOA-001',
      name: 'ISP SOA Customer',
      givenName: 'ISP',
      familyName: 'SOA',
      contactMedium: [
        {
          mediumType: 'Phone',
          characteristic: { phoneNumber: '0112345678' },
          preferred: true
        },
        {
          mediumType: 'Email',
          characteristic: { email: 'isp.soa@example.com' },
          preferred: false
        }
      ],
      href: '/tmf-api/partyManagement/v4/individual/ISP-SOA-001',
      '@type': 'Individual',
      status: 'active',
      subscriber_package: 'ISP PREMIUM',
      subscriber_package_display: 'ISP PREMIUM',
      subscriber_package_type: 1.0,
      first_bill_date: '20240901',
      billing_date: '01',
      blocked: false,
      registered: true,
      happy_day: null,
      privileges: {
        usage: true,
        extra_gb: true,
        purchase_history: true,
        profile: true,
        protocol_report: false,
        purchase_protocol_report: true,
        promo_code: true,
        data_gifting: true,
        data_transfer: false,
        data_addons: true,
        free_data: true,
        bonus_data: true,
        happy_day: false,
        my_plan: false
      },
      '@baseType': 'Individual',
      '@schemaLocation': null
    };

    // Check if Individual already exists
    const existingIndividual = await Individual.findOne({ id: individualData.id });
    if (existingIndividual) {
      console.log(`⚠️ Individual with id ${individualData.id} already exists. Skipping.`);
    } else {
      await Individual.create(individualData);
      console.log(`✅ Individual created: ${individualData.id}`);
    }

    // === 2. Create Account ===
    const accountData = {
      id: 'ISP-ACC-001',
      href: '/tmf-api/accountManagement/v4/account/ISP-ACC-001',
      '@type': 'Account',
      name: 'ISP SOA Account',
      description: 'ISP SOA account for testing',
      state: 'active',
      relatedParty: [
        {
          id: 'ISP-SOA-001', // ← Links to the Individual
          href: '/tmf-api/partyManagement/v4/individual/ISP-SOA-001',
          name: 'ISP SOA Customer',
          role: 'Owner',
          '@referredType': 'Individual'
        }
      ],
      contact: [
        {
          mediumType: 'Phone',
          characteristic: { phoneNumber: '0112345678' },
          preferred: true
        },
        {
          mediumType: 'Email',
          characteristic: { email: 'isp.soa@example.com' },
          preferred: false
        }
      ],
      userKey: 'ISP-SOA-KEY-001',
      '@baseType': 'Account',
      '@schemaLocation': null
    };

    // Check if Account already exists
    const existingAccount = await Account.findOne({ id: accountData.id });
    if (existingAccount) {
      console.log(`⚠️ Account with id ${accountData.id} already exists. Skipping.`);
    } else {
      await Account.create(accountData);
      console.log(`✅ Account created: ${accountData.id}`);
    }

    console.log('\n🎉 Seeding complete!');
    console.log(`🔗 Account ${accountData.id} linked to Individual ${individualData.id}`);

  } catch (err) {
    console.error('❌ Error seeding data:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
seedISPSoa();