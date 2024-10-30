import nodemailer, { SendMailOptions } from 'nodemailer';
import { mailConfig } from '../config/mail';
import * as exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

interface SendMailProps extends SendMailOptions {
  subject: string;
  body?: string;
  template?: 'createOrder' | 'makePayment';
  context?: unknown;
}
const transporter = nodemailer.createTransport(mailConfig);

const viewPath = resolve(__dirname, '..', 'views', 'emails');
transporter.use(
  'compile',
  nodemailerhbs({
    viewEngine: exphbs.create({
      defaultLayout: 'default',
      extname: '.hbs',
      layoutsDir: resolve(viewPath, 'layouts'),
      partialsDir: resolve(viewPath, 'partials')
    }),
    viewPath,
    extName: '.hbs'
  })
);

export async function sendMail(data: SendMailProps) {
  // send mail with defined transport object
  const options: SendMailProps = {
    html: data.body,
    ...data
  };
  const info = await transporter.sendMail(options);

  console.log('Message sent: %s', info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
