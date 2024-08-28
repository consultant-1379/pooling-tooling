const express = require('express');

const router = express.Router();
const passport = require('passport');

router.post('/login', (req, res, next) => {
  if ((process.env.NODE_ENV === 'DEV' || process.env.NODE_ENV === 'STAG') && req.body.signum === 'cypress_test_username'
  && req.body.password === 'cypress_test_password') {
    const response = {
      message: 'Login Success',
      success: true,
      username: 'cypressTest',
      email: 'cypresstest@mail.ie',
      forename: 'cypress',
      surname: 'test',
    };
    res.status(200).json(response);
    return (req, res);
  }
  passport.authenticate(['ldap', 'ldap_external_1', 'ldap_external_2'], (authErr, user, info) => {
    if (info !== 'success') { return res.status(200).json({ message: 'Login Failed', success: false, err: info }); }
    const response = {
      message: 'Login Success',
      success: true,
      username: user.cn,
      email: user.mail,
      forename: user.givenName,
      surname: user.sn,
    };
    res.status(200).json(response);
    return (req, res);
  })(req, res, next);
});

module.exports = router;
