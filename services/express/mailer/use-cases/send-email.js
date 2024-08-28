function buildSendEmail({
  mailTransport,
  successEmail,
  failureEmail,
}) {
  return async function sendEmail(emailSubject, reason, recipients, successfulResult) {
    const emailBody = successfulResult
      ? successEmail.successEmailTemplate(emailSubject, reason) : failureEmail.failureEmailTemplate(emailSubject, reason);
    if (process.env.NODE_ENV !== 'PROD') {
      emailSubject = `${process.env.NODE_ENV} ENV: ${emailSubject}`;
    }

    const message = {
      from: 'RPT <resource.pooling.tool@ericsson.com>',
      to: recipients,
      subject: emailSubject,
      html: emailBody,
      attachments: [{
        filename: 'ericsson_logo.png',
        path: 'mailer/assets/ericsson_logo.png',
        cid: 'logo@ericsson.com',
      }],
    };

    return mailTransport.sendMail(message);
  };
}

module.exports = { buildSendEmail };
