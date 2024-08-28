const nodemailer = require('nodemailer');
const { buildSendEmail } = require('./send-email');
const failureEmail = require('../templates/failure-template');
const successEmail = require('../templates/success-template');

const mailTransport = nodemailer.createTransport({
  host: 'smtp.internal.ericsson.com',
  secure: false,
  port: 25,
});

const sendEmail = buildSendEmail({
  mailTransport,
  successEmail,
  failureEmail,
});

const sendEmailService = Object.freeze({
  sendEmail,
});

module.exports = {
  sendEmailService,
  sendEmail,
};
