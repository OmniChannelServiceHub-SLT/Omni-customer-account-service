const Product = require('../../../models/TMF666_account');

exports.findProductsByTelephone = async (telephoneNo) => {
  // Search characteristic where name='telephoneNo' and value matches
  // Or we can store telephoneNo as a top-level field for simplicity.
  // For demonstration, we'll query the characteristic array.
  return await Product.find({
    'characteristic': {
      $elemMatch: { name: 'telephoneNo', value: telephoneNo }
    }
  });
};

exports.getProductById = async (id) => {
  return await Product.findOne({ id });
};