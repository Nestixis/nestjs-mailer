# NestJS Mailer

@nestixis/nestjs-mailer is a NestJS module that integrates nodemailer for sending emails and uses React to render email templates. 

## Features

- React-based templates: Allows you to use React components to create dynamic and customizable email templates.
- Nodemailer integration: Leverages nodemailer for reliable email delivery.

## Installation

To install the package, run the following command:

```
npm install @nestixis/nestjs-mailer
```

## Configuration

### Mailer SDK Module Configuration

```typescript
import { Module } from '@nestjs/common';
import { MailerSdkModule, MAILER_SDK_CLIENT } from '@nestixis/nestjs-mailer';

@Module({
  imports: [
    MailerSdkModule.forRoot({
      auth: {
        user: 'your-smtp-user',
        password: 'your-smtp-password',
        host: 'smtp.example.com',
        port: 587,
        ssl: false,
      },
      from: 'your-email@example.com',
    }),
  ],
  providers: [
    {
      provide: MAILER_SDK_CLIENT,
      useFactory: (mailerSdkModuleOptions) => {
        return new EmailSender(mailerSdkModuleOptions.auth, mailerSdkModuleOptions.from);
      },
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [MAILER_SDK_CLIENT],
})
export class AppModule {}
```

### MailerSdkModuleOptions

```typescript
export class MailerSdkModuleOptions {
  auth: {
    user: string;
    password: string;
    host: string;
    port: number;
    ssl: boolean;
  };
  from: string;
}
```

## Usage

### Sending Emails with React Templates

You can now use the EmailSender to send emails by passing a React component as the email template. Here's an example of how you would send an email using a React-based template:

```typescript
import { Inject } from '@nestjs/common';
import { EmailSenderInterface } from '@nestixis/nestjs-mailer';
import InviteAdminWithAccountTemplate from './templates/invite-admin-with-account-template';

@Injectable()
export class EmailService {
  constructor(
    @Inject(MAILER_SDK_CLIENT) private readonly emailSender: EmailSenderInterface,
  ) {}

  async sendInvitation(adminEmail: string, adminLogin: string, invitationHref: string, passwordHref: string) {
    const translation = {
      titleInside: { subpart1: 'Welcome', subpart2: ' to the platform!' },
      contentPart1: 'Hello',
      contentPart2: 'Your admin account has been created.',
      contentPart3: { subpart1: 'Click here to activate your account: ', subpart2: 'Activate', subpart3: '.' },
      contentPart4: { subpart1: 'To set your password, click here: ', subpart2: 'Set password' },
    };

    const emailContent = <InviteAdminWithAccountTemplate
      translation={translation}
      language="en"
      adminLogin={adminLogin}
      invitationHref={invitationHref}
      passwordHref={passwordHref}
      logoUrl="logo.png"
      mainImageUrl="image.png"
    />;

    await this.emailSender.sendEmail(adminEmail, 'Admin Invitation', emailContent);
  }
}
```

### Example React Email Template

Below is an example of a React email template using @react-email/components to structure your email content:

```typescript
import * as React from 'react';
import { Html, Head, Body, Container, Section, Text, Link, Img } from '@react-email/components';

export default function InviteAdminWithAccountTemplate({ translation, language, adminLogin, invitationHref, passwordHref, logoUrl, mainImageUrl }) {
  return (
    <Html lang={language}>
      <Head>
        <style>{/* Your custom styles here */}</style>
      </Head>
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Section>
          <Container>
            {logoUrl ? <Img src={logoUrl} alt="Logo" /> : <Text>{translation.titleInside}</Text>}
            <Text>{translation.contentPart1}</Text>
            <Text>{translation.contentPart2}</Text>
            <Text>
              {translation.contentPart3.subpart1}
              <Link href={invitationHref}>{translation.contentPart3.subpart2}</Link>
              {translation.contentPart3.subpart3}
            </Text>
            <Text>
              {translation.contentPart4.subpart1}
              <Link href={passwordHref}>{translation.contentPart4.subpart2}</Link>
            </Text>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}
```

## API Reference

### EmailSenderInterface

The EmailSenderInterface defines the method sendEmail for sending emails:

```typescript
export interface EmailSenderInterface {
  sendEmail(to: string, subject: string, template: React.ReactElement<any, string | React.JSXElementConstructor<any>>): Promise<void>;
}
```
