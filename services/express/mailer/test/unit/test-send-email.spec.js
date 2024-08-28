const expect = require('expect');
const sinon = require('sinon');
const { buildSendEmail } = require('../../use-cases/send-email');
const failureEmail = require('../../templates/failure-template');
const successEmail = require('../../templates/success-template');

describe('Unit Test: (Express Mailer Service) Testing buildSendEmail creates mail sender', () => {
  it('should create sendMail when transport provided', async () => {
    const mailTransport = {};

    const sendMail = buildSendEmail({
      mailTransport,
      successEmail,
      failureEmail,
    });

    expect(sendMail.sendEmail)
      .not
      .toBeNull();
  });
  it('should invoke sendMail on mail transport when transport provided', async () => {
    const mailTransport = { sendMail() {} };
    const mailTransportMock = sinon.mock(mailTransport);
    mailTransportMock.expects('sendMail').once();

    const sendEmail = buildSendEmail({
      mailTransport,
      successEmail,
      failureEmail,
    });

    const emailSubject = 'Subject';
    const reason = 'Test';
    const recipients = ['test@mail.com'];
    const successfulResult = true;

    await sendEmail(emailSubject, reason, recipients, successfulResult);

    expect(mailTransportMock.verify());
  });
});
