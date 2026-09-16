exports.fromLegacyRequest = (req) => {
  // Read from query, body, or fall back to empty object
  const source = { ...req.query, ...req.body };

  const { accountNo, TelephoneNo, nic, userKey } = source;

  const accountData = {
    id: accountNo,
    name: `Account ${accountNo}`,
    description: `Account for telephone ${TelephoneNo}`,
    state: 'active',
    contact: TelephoneNo
      ? [{
          mediumType: 'Phone',
          characteristic: { phoneNumber: TelephoneNo },
          preferred: true
        }]
      : [],
    '@type': 'BillingAccount',
    '@baseType': 'Account',
    '@schemaLocation': null
  };

  if (userKey) accountData.userKey = userKey;
  if (nic) accountData._nicForLinking = nic;

  return accountData;
};