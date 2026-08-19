/**
 * Maps a Party document into a TMF632 Individual resource.
 *
 * Source data is the same info ViewUserInfo documents in
 * API_Params_SLTOMNI_V2.xlsx (name, altrContact) - just mapped into
 * proper TMF632 fields instead of a flat custom shape:
 *   name        -> fullName
 *   altrContact -> contactMedium[] entry (phone)
 *
 * `id` is the party's userName (see comment in getUserInfo.route.js for
 * why - legacy system has no other identifier to use).
 */
function individualToTmf(party) {
  const id = party.userName;
  const resource = {
    id,
    href: `/tmf-api/party/v4/individual/${encodeURIComponent(id)}`,
    '@type': 'Individual',
    fullName: party.name,
    contactMedium: [],
  };

  if (party.altrContact) {
    resource.contactMedium.push({
      '@type': 'ContactMedium',
      mediumType: 'phone',
      preferred: true,
      characteristic: {
        phoneNumber: party.altrContact,
      },
    });
  }

  return resource;
}

module.exports = { individualToTmf };
