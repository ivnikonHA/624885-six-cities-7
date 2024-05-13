import { inject, injectable} from 'inversify';

import { getMongoURI } from '../shared/helpers/database.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient
  ) {}

  private async initDB() {
    const mongoURI = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    return this.databaseClient.connect(mongoURI);
  }

  public async init() {
    this.logger.info('Application initialization.');

    this.logger.info('Init database...');
    await this.initDB();
    this.logger.info('Init database completed.');
  }
}