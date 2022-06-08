import FilterView from '../view/filter-view.js';
import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { FilterType, UpdateType } from '../constants.js';

export default class FilterPresenter{

  #filterComponent = null;
  #filterModel = null;
  #pointsModel = null;
  #container = null;

  constructor(container, filterModel, pointsModel){
    this.#container = container;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(this.#pointsModel.points, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if(prevFilterComponent === null){
      render(this.#filterComponent, this.#container, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleFilterTypeChange = (filter) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType[filter.toUpperCase()]);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
