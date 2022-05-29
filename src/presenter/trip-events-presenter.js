import SortView from '../view/sort-view.js';
import { render, RenderPosition } from '../render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import MessageView from '../view/message-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';
import dayjs from 'dayjs';
import { SortKeys } from '../constants.js';


export default class TripEventsPresenter{

  tripEventsListView = null;
  model = null;
  #points = null;
  #currentSortKey = SortKeys.DAY;

  #tripEventsListComponent = null;
  #sortComponent = null;
  #emptyListMessageComponent = null;

  #pointsPresenters = new Map();

  constructor(model, container){
    this.model = model;
    this.#points = [...this.model.getPoints()];
    this.availableOffers = [...this.model.getAvailableOffers()];
    this.availableDestinations = [...this.model.getAvailableDestinations()];
    this.container = container;
    this.#tripEventsListComponent = new TripEventsListView();
    this.#sortComponent = new SortView();
    this.#emptyListMessageComponent = new MessageView();
  }

  init = () => {
    this.#renderPointsList();
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripEventsListComponent.element, this.availableOffers, this.availableDestinations, this.#handlePointChange, this.#handleModeChange);
    this.#pointsPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point);
  };

  #renderPoints = () => {
    this.#clearPointsList();
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderNoPoints = () => {
    render(this.#emptyListMessageComponent, this.container, RenderPosition.BEFOREEND);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.container, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortButtonClickHandler(this.#handleSortButtonClick);
  };

  #renderPointsList = () => {
    this.#renderSort();

    if(this.#points.length === 0){
      this.#renderNoPoints();
    }
    else{
      render(this.#tripEventsListComponent, this.container, RenderPosition.BEFOREEND);
      this.#renderPoints();
    }
  };

  #clearPointsList(){
    this.#pointsPresenters.forEach((pointPresenter) => {
      pointPresenter.destroy();
    });
    this.#pointsPresenters.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointsPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #handleSortButtonClick = (sortKey) => {
    switch(sortKey){
      case SortKeys.DAY:
        this.#sortByDay();
        break;
      case SortKeys.TIME:
        this.#sortByTimeDuration();
        break;
      case SortKeys.PRICE:
        this.#sortByPrice();
        break;
    }
  };

  #sortByPrice = () => {
    if(this.#currentSortKey === SortKeys.PRICE){
      return;
    }
    this.#points.sort((prev, next) => next.basePrice - prev.basePrice);
    this.#renderPoints();
    this.#currentSortKey = SortKeys.PRICE;
  };

  #sortByDay = () => {
    if(this.#currentSortKey === SortKeys.DAY){
      return;
    }
    this.#points.sort((prev, next) => dayjs(next.dateFrom).isBefore(dayjs(prev.dateFrom)) ? 1 : -1);
    this.#renderPoints();
    this.#currentSortKey = SortKeys.DAY;
  };

  #sortByTimeDuration = () => {
    if(this.#currentSortKey === SortKeys.TIME){
      return;
    }
    this.#points.sort((prev, next) => dayjs(next.dateTo).diff(next.dateFrom, 'minute') - dayjs(prev.dateTo).diff(prev.dateFrom, 'minute'));
    this.#renderPoints();
    this.#currentSortKey = SortKeys.TIME;
  };
}

