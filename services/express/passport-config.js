const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;
const { authenticate } = require('ldap-authentication');
const { BadRequestError } = require('./interfaces/BadRequestError');

const LDAP_DN = 'ou=CA,ou=User,ou=P001,ou=ID,ou=Data,dc=ericsson,dc=se';
const LDAP_DN_EXTERNAL_1 = 'ou=External,ou=P017,ou=ID,ou=Data,dc=ericsson,dc=se';
const LDAP_DN_EXTERNAL_2 = 'ou=CA,ou=SvcAccount,ou=P001,ou=ID,ou=Data,dc=ericsson,dc=se';
const LDAP_URL = 'ldaps://ldap-egad.internal.ericsson.com:3269';
const ERROR_MESSAGE = 'signum and password are not provided';

passport.use('ldap', new CustomStrategy(
  async (req, done) => {
    try {
      if (!req.body.signum || !req.body.password) {
        throw new BadRequestError(ERROR_MESSAGE);
      }
      const options = {
        ldapOpts: {
          url: LDAP_URL,
        },
        userDn: `cn=${req.body.signum},${LDAP_DN}`,
        userPassword: req.body.password,
        userSearchBase: LDAP_DN,
        usernameAttribute: 'cn',
        username: req.body.signum,
      };
      const user = await authenticate(options);
      return done(null, user, 'success');
    } catch (error) {
      return done(null, null, `ldap_ERROR: ${error}`);
    }
  },
));

passport.use('ldap_external_1', new CustomStrategy(
  async (req, done) => {
    try {
      if (!req.body.signum || !req.body.password) {
        throw new BadRequestError(ERROR_MESSAGE);
      }
      const options = {
        ldapOpts: {
          url: LDAP_URL,
        },
        userDn: `cn=${req.body.signum},${LDAP_DN_EXTERNAL_1}`,
        userPassword: req.body.password,
        userSearchBase: LDAP_DN_EXTERNAL_1,
        usernameAttribute: 'cn',
        username: req.body.signum,
      };
      const user = await authenticate(options);
      return done(null, user, 'success');
    } catch (error) {
      return done(null, null, `ldap_external_1_ERROR: ${error}`);
    }
  },
));

passport.use('ldap_external_2', new CustomStrategy(
  async (req, done) => {
    try {
      if (!req.body.signum || !req.body.password) {
        throw new BadRequestError(ERROR_MESSAGE);
      }
      const options = {
        ldapOpts: {
          url: LDAP_URL,
        },
        userDn: `cn=${req.body.signum},${LDAP_DN_EXTERNAL_2}`,
        userPassword: req.body.password,
        userSearchBase: LDAP_DN_EXTERNAL_2,
        usernameAttribute: 'cn',
        username: req.body.signum,
      };
      const user = await authenticate(options);
      return done(null, user, 'success');
    } catch (error) {
      return done(null, null, `ldap_external_2_ERROR: ${error}`);
    }
  },
));
