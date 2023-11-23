id: '1139035663624607',
  username: undefined,
  displayName: 'Nirav Gorasiya',
  name: { familyName: 'Gorasiya', givenName: 'Nirav', middleName: undefined },
  gender: undefined,
  profileUrl: undefined,
  photos: [
    {
      value: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1139035663624607&height=50&width=50&ext=1663307331&hash=AeRFeWwd9AUkpG_apNU'
    }
  ],
  provider: 'facebook',
  _raw: '{"id":"1139035663624607","name":"Nirav Gorasiya","picture":{"data":{"height":50,"is_silhouette":false,"url":"https:\\/\\/platform-lookaside.fbsbx.com\\/platform\\/profilepic\\/?asid=1139035663624607&height=50&width=50&ext=1663307331&hash=AeRFeWwd9AUkpG_apNU","width":50}},"last_name":"Gorasiya","first_name":"Nirav"}',
  _json: {
    id: '1139035663624607',
    name: 'Nirav Gorasiya',
    picture: { data: [Object] },
    last_name: 'Gorasiya',
    first_name: 'Nirav'
  }
}


{
  provider: 'google',
  sub: '106282944487775658388',
  id: '106282944487775658388',
  displayName: 'Nirav Gorasiya',
  name: { givenName: 'Nirav', familyName: 'Gorasiya' },
  given_name: 'Nirav',
  family_name: 'Gorasiya',
  email_verified: true,
  verified: true,
  language: 'en-GB',
  locale: undefined,
  email: 'niravgorasiya10@gmail.com',
  emails: [ { value: 'niravgorasiya10@gmail.com', type: 'account' } ],     
  photos: [
    {
      value: 'https://lh3.googleusercontent.com/a/AItbvmlFGpqRr7MOZmo78nWEgo7y1wOdJdKw6eLgTDCTTQ=s96-c',
      type: 'default'
    }
  ],
  picture: 'https://lh3.googleusercontent.com/a/AItbvmlFGpqRr7MOZmo78nWEgo7y1wOdJdKw6eLgTDCTTQ=s96-c',
  _raw: '{\n' +
    '  "sub": "106282944487775658388",\n' +
    '  "name": "Nirav Gorasiya",\n' +
    '  "given_name": "Nirav",\n' +
    '  "family_name": "Gorasiya",\n' +
    '  "picture": "https://lh3.googleusercontent.com/a/AItbvmlFGpqRr7MOZmo78nWEgo7y1wOdJdKw6eLgTDCTTQ\\u003ds96-c",\n' +
    '  "email": "niravgorasiya10@gmail.com",\n' +
    '  "email_verified": true,\n' +
    '  "locale": "en-GB"\n' +
    '}',
  _json: {
    sub: '106282944487775658388',
    name: 'Nirav Gorasiya',
    given_name: 'Nirav',
    family_name: 'Gorasiya',
    picture: 'https://lh3.googleusercontent.com/a/AItbvmlFGpqRr7MOZmo78nWEgo7y1wOdJdKw6eLgTDCTTQ=s96-c',
    email: 'niravgorasiya10@gmail.com',
    email_verified: true,
    locale: 'en-GB'
  }
} 










db.profiles.updateOne( { _id: 1 }, { $pull: { votes: { $lte: 6 } } } )