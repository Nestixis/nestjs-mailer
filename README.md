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
import { MailerSdkModule } from '@nestixis/nestjs-mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MailerSdkModule.register({
      auth: {
        user: '',
        password: '',
        host: 'sandbox-smtp.mailcatch.app',
        port: 2525,
        ssl: false,
      },
      from: 'your-email@example.com',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
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
import {
  EmailSenderInterface,
  MAILER_SDK_CLIENT,
} from '@nestixis/nestjs-mailer';
import { Inject, Injectable } from '@nestjs/common';
import InviteAdminWithAccountTemplate from './invite-admin-with-account-template';

@Injectable()
export class AppService {
  constructor(
    @Inject(MAILER_SDK_CLIENT)
    private readonly emailSender: EmailSenderInterface,
  ) {}
  async getHello(): Promise<void> {
    const translations = {
      titleInside: { subpart1: 'Welcome', subpart2: ' to the platform!' },
      contentPart1: 'Hello',
      contentPart2: 'Your admin account has been created.',
      contentPart3: {
        subpart1: 'Click here to activate your account: ',
        subpart2: 'Activate',
        subpart3: '.',
      },
      contentPart4: {
        subpart1: 'To set your password, click here: ',
        subpart2: 'Set password',
      },
    };

    const emailContent = await InviteAdminWithAccountTemplate({
      translation: translations,
      language: 'en',
      invitationHref: 'xxx',
      passwordHref: 'xxx',
      logoUrl: 'logo.png',
    });

    await this.emailSender.sendEmail(
      'test@test.com',
      'Admin Invitation',
      emailContent,
    );
  }
}
```

### Example React Email Template

Below is an example of a React email template using @react-email/components to structure your email content:

```typescript
import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export default function InviteAdminWithAccountTemplate({
  translation,
  language,
  invitationHref,
  passwordHref,
  logoUrl,
}) {
  return (
    <Html lang={language}>
      <Head>
        <style>{/* Your custom styles here */}</style>
      </Head>
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Section>
          <Container>
            {logoUrl ? (
              <Img src={logoUrl} alt="Logo" />
            ) : (
              <Text>{translation.titleInside}</Text>
            )}
            <Text>{translation.contentPart1}</Text>
            <Text>{translation.contentPart2}</Text>
            <Text>
              {translation.contentPart3.subpart1}
              <Link href={invitationHref}>
                {translation.contentPart3.subpart2}
              </Link>
              {translation.contentPart3.subpart3}
            </Text>
            <Text>
              {translation.contentPart4.subpart1}
              <Link href={passwordHref}>
                {translation.contentPart4.subpart2}
              </Link>
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
