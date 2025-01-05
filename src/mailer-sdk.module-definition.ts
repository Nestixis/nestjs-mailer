import { ConfigurableModuleBuilder } from '@nestjs/common';

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

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<MailerSdkModuleOptions>().build();
