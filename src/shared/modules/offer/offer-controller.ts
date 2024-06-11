import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/index.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, HttpError } from '../../libs/rest/index.js';
import { Component, HttpMethod } from '../../types/index.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { CreateOfferDTO, DEFAULT_OFFER_COUNT, DetailOffersRdo, OfferService, OffersRdo, ParamOfferId, UpdateOfferDto } from './index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ){
    super(logger);

    this.logger.info('Register routes for OfferController');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:id', method: HttpMethod.Get, handler: this.details});
    this.addRoute({path: '/:id', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:id', method: HttpMethod.Delete, handler: this.delete});
  }

  public async index(req: Request, res: Response): Promise<void> {
    const count = req.query.count ?? DEFAULT_OFFER_COUNT;
    const offers = await this.offerService.find(+count);
    this.ok(res, fillDTO(OffersRdo, offers));
  }

  public async create({ body }: Request<unknown, unknown, CreateOfferDTO>, res: Response): Promise<void> {
    const result = await this.offerService.create(body);

    this.created(res, fillDTO(OffersRdo, result));
  }

  public async details({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const result = await this.offerService.findById(params.id);
    if(!result) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', 'OfferController');
    }
    this.ok(res, fillDTO(DetailOffersRdo, result));
  }

  public async update({ body, params}: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const result = await this.offerService.updateById(params.id, body);

    if(!result) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }
    this.ok(res, fillDTO(DetailOffersRdo, result));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const result = await this.offerService.deleteById(params.id);
    if(!result) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', 'OfferController');
    }
    await this.commentService.deleteByOfferId(params.id);
    this.noContent(res, result);
  }
}