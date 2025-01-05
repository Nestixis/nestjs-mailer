import { Module } from '@nestjs/common';
import { ConfigurableModuleClass, MailerSdkModuleOptions, MODULE_OPTIONS_TOKEN } from './mailer-sdk.module-definition';
import { EmailSender } from './sender/email.sender';
 
export const MAILER_SDK_CLIENT = 'MAILER_SDK_CLIENT';
 
@Module({
  providers: [
    {
      provide: MAILER_SDK_CLIENT,
      useFactory: (mailerSdkModuleOptions: MailerSdkModuleOptions) => {
        return new EmailSender(mailerSdkModuleOptions.auth, mailerSdkModuleOptions.from);
      },
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [MAILER_SDK_CLIENT],
})
export class MailerSdkModule extends ConfigurableModuleClass {}