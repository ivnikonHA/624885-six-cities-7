import { config } from 'dotenv';

import { Logger } from '../logger/logger.interface.js';
import { Config, configRestSchema,RestSchema } from './index.js';

export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor(
    private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if(parsedOutput.error) {
      const error = new Error('Can\'t read .env file.');
      this.logger.error('Can\'t read .env file.', error);
      throw error;
    }

    configRestSchema.load({});
    configRestSchema.validate({allowed: 'strict', output: this.logger.info});
    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed.');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
