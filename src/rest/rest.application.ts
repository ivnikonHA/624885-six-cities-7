import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable} from 'inversify';

import { getMongoURI } from '../shared/helpers/database.js';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/middleware/parse-token.middleware.js';
import { AuthExceptionFilter } from '../shared/modules/auth/auth-exception-filter.js';
import { Component } from '../shared/types/index.js';
import { UPLOAD_PATH } from './consts.js';

@injectable()
export class RestApplication {
  private readonly server: Express;
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: AuthExceptionFilter
  ) {
    this.server = express();
  }

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

  private async initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(express.json());
    this.server.use(
      UPLOAD_PATH,
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(express.urlencoded({extended: false}));
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.server.use(cors());
  }

  private async initControllers() {
    this.server.use('/comments', this.commentController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
  }

  private async initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  private async initServer() {
    const port = this.config.get('PORT');

    this.server.listen(port);
  }


  public async init() {
    this.logger.info('Application initialization.');

    this.logger.info('Init database...');
    await this.initDB();
    this.logger.info('Init database completed.');

    this.logger.info('Init middleware...');
    await this.initMiddleware();
    this.logger.info('Init middleware completed.');

    this.logger.info('Init controllers...');
    await this.initControllers();
    this.logger.info('Init controllers completed.');

    this.logger.info('Init exceptionFilters...');
    await this.initExceptionFilters();
    this.logger.info('Init exceptionFilters completed.');

    this.logger.info('Starting server...');
    await this.initServer();
    this.logger.info(`Server started on http://${this.config.get('HOST')}:${this.config.get('PORT')}`);
  }
}
