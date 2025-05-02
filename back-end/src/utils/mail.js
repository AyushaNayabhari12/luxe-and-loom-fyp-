import nodemailer from 'nodemailer';
import { FROM_EMAIL, FROM_EMAIL_PASS } from '../config/index.js';

const transporterConfig = {
  service: 'gmail',
  auth: {
    user: FROM_EMAIL,
    pass: FROM_EMAIL_PASS,
  },
};

const mailMessageFormat = {
  from: FROM_EMAIL,

  // Email or array of email
  to: 'demo@gmail.com',

  subject: 'Subject of the mail',

  // Mail Message should be here in html format
  html: `        `,
};

export const sendMail = async mailMessage => {
  try {
    const transporter = nodemailer.createTransport(transporterConfig);
    await transporter.sendMail(mailMessage);
  } catch (error) {
    console.log(error);
  }
};

