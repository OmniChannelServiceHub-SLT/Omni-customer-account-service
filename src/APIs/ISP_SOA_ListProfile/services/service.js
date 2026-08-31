const Individual = require('../../../models/TMF632_individual');

const Account = require('../../models/TMF666_Account');

exports.getIndividualByAccountNo = async (accountNo) => {
  // Find the account by id (accountNo)
  const account = await Account.findOne({ id: accountNo });

  if (!account) {
    return null;
  }

  // Get the related individual id from the first relatedParty
  const party = account.relatedParty?.[0];

  if (!party || !party.id) {
    return null;
  }

  // Find the Individual by that id
  return await Individual.findOne({ id: party.id });
};