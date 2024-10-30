import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_USER } from '../utils/env';

export const mailConfig: SMTPTransport.Options = {
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: false,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
};
