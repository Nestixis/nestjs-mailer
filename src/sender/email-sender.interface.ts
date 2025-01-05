import React from 'react';

export const EMAIL_SENDER = 'EMAIL_SENDER';

export interface EmailSenderInterface {
  sendEmail(to: string, subject: string, template: React.ReactElement<any, string | React.JSXElementConstructor<any>>): Promise<void>;
}