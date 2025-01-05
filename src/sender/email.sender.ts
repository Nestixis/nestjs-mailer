import { render } from '@react-email/render';
import { createTransport, Transporter } from 'nodemailer';
import React from 'react';
import { EmailSenderInterface } from './email-sender.interface';

export class EmailSender implements EmailSenderInterface {
  private transporter: Transporter;
  constructor(
    private readonly auth: {
      user: string;
      password: string;
      host: string;
      port: number;
      ssl: boolean;
    },
    private readonly from: string,
  ) {
    this.transporter = createTransport({
      host: auth.host,
      port: auth.port,
      auth: {
        user: auth.user,
        pass: auth.password,
      },
    });
  }

  async sendEmail(to: string, subject: string, template: React.ReactElement<any, string | React.JSXElementConstructor<any>>): Promise<void> {
    return this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      html: render(template),
    });
  }
}