import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }: any) => {
  const transporter: any = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const messageContent = {
    //sender email
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    //receiver email
    to: email,
    //email subject
    subject: subject,
    //html content
    html: message,
  };
  await transporter.sendMail(messageContent);
};
