import { generateDestinations } from '../mock/point.js';

export default class DestinationsModel{

  #destinations = null;

  get destinations(){
    return this.#destinations;
  }

  constructor(){
    this.#destinations = generateDestinations();
  }

}
