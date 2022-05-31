import { generatePoints, generateDestinations } from '../mock/point.js';
import { getAvailableOffers } from '../mock/offer.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable{
  #points = null;
  #availableOffers = null;
  #availableDestinations = null;

  constructor(){
    super();
    this.#availableDestinations = generateDestinations();
    this.#points = generatePoints();
    this.#availableOffers = getAvailableOffers();
  }

  get points(){
    return this.#points;
  }

  get availableOffers(){
    return this.#availableOffers;
  }

  get availableDestinations(){
    return this.#availableDestinations;
  }
}
