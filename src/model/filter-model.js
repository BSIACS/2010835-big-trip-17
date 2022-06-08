import Observable from '../framework/observable.js';
import { FilterType } from '../constants.js';

export default class FilterModel extends Observable {
  #filter = null;

  constructor(){
    super();
    this.#filter = FilterType.EVERYTHING;
  }

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    //console.log(filter);
    this.#filter = filter;
    this._notify(updateType, filter);
  };
}
