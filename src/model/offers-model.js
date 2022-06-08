import { getAvailableOffers } from '../mock/offer.js';

export default class OffersModel{

  #offers = null;

  get offers(){
    return this.#offers;
  }

  constructor(){
    this.#offers = getAvailableOffers();
  }

}
