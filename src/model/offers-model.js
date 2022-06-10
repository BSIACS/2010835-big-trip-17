import { UpdateType } from '../constants.js';
import Observable from '../framework/observable.js';

export default class OffersModel extends Observable{

  #pointsApiService = null;
  #offers = null;

  get offers(){
    return this.#offers;
  }

  constructor(pointsApiService){
    super();
    this.#pointsApiService = pointsApiService;
  }

  init = async () => {
    try{
      const offers = await this.#pointsApiService.offers;
      this.#offers = offers;
    }
    catch(error){
      this.#offers = null;
    }

    this._notify(UpdateType.INIT);
  };

}
