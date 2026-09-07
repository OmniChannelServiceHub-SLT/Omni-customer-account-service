const Account = require('../../../models/TMF666_account');
const Individual = require('../../../models/TMF632_individual');

/**
 * Find Individual by accountNo
 * Tries: 1. Direct match (id == accountNo)
 *        2. Via Account -> relatedParty.id
 *        3. Via Account -> contact.phoneNumber
 */
exports.findIndividualByAccountNo = async (accountNo) => {
  // 1. Direct lookup: Individual.id == accountNo
  let individual = await Individual.findOne({ id: accountNo });
  if (individual) return individual;

  // 2. Get the account
  const account = await Account.findOne({ id: accountNo });
  if (!account) return null;

  // 3. Try via relatedParty
  const party = account.relatedParty?.[0];
  if (party && party.id) {
    individual = await Individual.findOne({ id: party.id });
    if (individual) return individual;
  }

  // 4. Try via phone number
  const phoneContact = account.contact?.find(c => c.mediumType === 'Phone');
  if (phoneContact && phoneContact.characteristic?.phoneNumber) {
    const phone = phoneContact.characteristic.phoneNumber;
    individual = await Individual.findOne({
      'contactMedium.characteristic.phoneNumber': phone
    });
    if (individual) return individual;
  }

  // 5. Try via email
  const emailContact = account.contact?.find(c => c.mediumType === 'Email');
  if (emailContact && emailContact.characteristic?.email) {
    const email = emailContact.characteristic.email;
    individual = await Individual.findOne({
      'contactMedium.characteristic.email': email
    });
    if (individual) return individual;
  }

  return null;
};

/**
 * Partial update (PATCH) Individual by ID
 */
exports.updateIndividual = async (id, updateData) => {
  return await Individual.findOneAndUpdate(
    { id },
    updateData,
    { new: true, runValidators: true }
  );
};