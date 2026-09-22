const Account = require('../../../models/TMF666_account');

exports.findProductsByTelephone = async (telephoneNo) => {
  return await Account.find({
    characteristic: {
      $elemMatch: { name: 'telephoneNo', value: telephoneNo }
    }
  });
};

exports.getProductById = async (id) => {
  return await Account.findOne({ id });
};