import Observable from '../framework/observable.js';
import { UpdateType } from '../constants.js';


export default class PointsModel extends Observable{
  #pointsApiService = null;
  #points = null;

  constructor(pointsApiService){
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points(){
    return this.#points;
  }


  init = async () => {
    try{
      const points = await this.#pointsApiService.points;
      this.#points = points.map((point) => this.#adaptToClient(point));
    }
    catch(error){
      this.#points = null;
    }

    this._notify(UpdateType.INIT);
  };

  updatePoint = async (updateType, update) => {
    update.basePrice = Number(update.basePrice);
    update = await this.#pointsApiService.updatePoint(this.#adaptToServer(update));

    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      this.#adaptToClient(update),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, this.#adaptToClient(update));
  };

  addPoint = (updateType, update) => {
    update.id = Math.floor(Date.now() / 1000);
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      basePrice: point.base_price,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      isFavorite: point.is_favorite,
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };

  #adaptToServer = (point) => {
    const adaptedPoint = {...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint['basePrice'];
    delete adaptedPoint['dateFrom'];
    delete adaptedPoint['dateTo'];
    delete adaptedPoint['isFavorite'];

    return adaptedPoint;
  };
}
