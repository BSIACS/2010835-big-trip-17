import { generatePoint } from '../mock/point.js';
import { getAvailableOffers } from '../mock/offer.js';

export default class PointsModel{

  constructor(){
    this.points = Array.from({length: 4}, generatePoint);
    this.availableOffers = getAvailableOffers();
  }

  getPoints(){
    return this.points;
  }

  getAvailableOffers(){
    return this.availableOffers;
  }
}
