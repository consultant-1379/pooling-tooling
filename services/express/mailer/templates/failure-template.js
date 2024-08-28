module.exports = {
  failureEmailTemplate(emailSubject, reasonForFailure) {
    return `<!DOCTYPE html>

  <html>

  <head>
  </head>

  <body>
      <table width="100%" cellpadding="0" cellspacing="0" style="min-width:100%">
          <tbody>
              <tr>
                  <td style="background-color:#bb2124; padding:20px">
                      <img src="cid:logo@ericsson.com" alt="Ericsson logo"/>
                      <h3 style="color:white; font-size:22px">Resource Pooling Tool</h3>
                      <h4 style="color:white; font-size:18px">${emailSubject}</h4>
                  </td>
              </tr>
              <tr>
                  <td style="background-color:#ededed; padding:20px">
                      <span style="color:black">
                          <p>Hi CUSTOMER,</p>
                          <p>Resource Pooling Tool is notifying you about the recent failure:</p>
                          <p>${reasonForFailure}</p>
                          <p>
                              Kind Regards, <br>
                              Resource Pooling Tool
                          </p>
                      </span>
                      <br>
                  </td>
              </tr>
              <tr>
                  <td style="background-color:#0C0C0C; padding:20px">
                      <table>
                          <tr>
                              <td>
                                  <p style="color:#F2F2F2">For questions, comments or suggestions on RPT please contact
                                      <br>
                                      <a href="mailto:PDLENMCOUN@pdl.internal.ericsson.com?subject=RPT Notification Mail">ENM/Thunderbee</a>
                                  </p>
                              </td>
                          </tr>
                      </table>

                  </td>
              </tr>
          </tbody>
      </table>
  </body>

  </html>`;
  },
};
