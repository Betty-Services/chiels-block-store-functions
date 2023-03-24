import templayed from './templayed';

const sendEmail = async ({
  host,
  port,
  username,
  password,
  secure,
  senderEmail,
  senderName,
  toEmail,
  toName,
  subject,
  body,
  variables,
  attachments,
}) => {
  const smtpCredentials = {
    host,
    port,
    username,
    password,
    secure,
  };

  const parsedBody = body;
  // throw JSON.stringify(variables);
  const variableMap = variables.reduce((previousValue, currentValue) => {
    previousValue[currentValue.key] = currentValue.value;
    return previousValue;
  }, {});

  const mail = {
    sender: {
      from: senderName ? `"${senderName}" ${senderEmail}` : senderEmail,
      name: senderName,
    },
    recipient: {
      to: toName ? `"${toName}" ${toEmail}` : toEmail,
    },
    subject,
    body: templayed(parsedBody)(variableMap),
    attachments: attachments.map(({ key, value }) => {
      return { filename: key, path: value && value.url ? value.url : value };
    }),
  };

  const sentMail = await smtp(smtpCredentials, mail);

  return {
    result: sentMail,
  };
};

export default sendEmail;
