import { generatePoints } from '../mock/point.js';
import { getAvailableOffers } from '../mock/offer.js';

export default class PointsModel{

  constructor(){
    this.points = generatePoints();
    this.availableOffers = getAvailableOffers();
  }

  getPoints(){
    return this.points;
  }

  getAvailableOffers(){
    return this.availableOffers;
  }
}
