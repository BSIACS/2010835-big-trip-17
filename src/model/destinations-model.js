import { UpdateType } from '../constants.js';
import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable{

  #pointsApiService = null;

  #destinations = null;

  get destinations(){
    return this.#destinations;
  }

  constructor(pointsApiService){
    super();
    this.#pointsApiService = pointsApiService;
  }

  init = async () => {
    try{
      const destinations = await this.#pointsApiService.destinations;
      this.#destinations = destinations;
    }
    catch(error){
      this.#destinations = null;
    }

    this._notify(UpdateType.INIT);
  };

}
