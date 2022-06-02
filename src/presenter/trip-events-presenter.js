import SortView from '../view/sort-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import MessageView from '../view/message-view.js';
import PointPresenter from './point-presenter.js';
import dayjs from 'dayjs';
import { SortKeys, UpdateType, UserAction } from '../constants.js';


export default class TripEventsPresenter{

  tripEventsListView = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #currentSortKey = SortKeys.DAY;
  #prevSortKey = SortKeys.DAY;

  #tripEventsListComponent = null;
  #sortComponent = null;
  #emptyListMessageComponent = null;

  #pointsPresenters = new Map();

  constructor(pointsModel, offersModel, destinationsModel, container){
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.availableOffers = [...this.#offersModel.offers];
    this.availableDestinations = [...this.#destinationsModel.destinations];
    this.container = container;
    this.#tripEventsListComponent = new TripEventsListView();
    this.#sortComponent = null;
    this.#emptyListMessageComponent = null;
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points(){
    switch(this.#currentSortKey){
      case SortKeys.DAY:
        return this.#sortByDay([...this.#pointsModel.points]);
      case SortKeys.TIME:
        return this.#sortByTimeDuration([...this.#pointsModel.points]);
      case SortKeys.PRICE:
        return this.#sortByPrice([...this.#pointsModel.points]);
    }

    return this.model.points;
  }

  init = () => {
    this.#renderTripEventsSection();
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripEventsListComponent.element, this.availableOffers, this.availableDestinations, this.#handleViewAction, this.#handleModeChange);
    this.#pointsPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point);
  };

  #renderPoints = (points) => {
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderNoPoints = () => {
    this.#emptyListMessageComponent = new MessageView();
    render(this.#emptyListMessageComponent, this.container, RenderPosition.BEFOREEND);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortKey);
    this.#sortComponent.setSortButtonClickHandler(this.#handleSortButtonClick);
    render(this.#sortComponent, this.container, RenderPosition.BEFOREEND);
  };

  #renderTripEventsSection = () => {
    const points = this.points;

    if(points.length === 0){
      this.#renderNoPoints();

      return;
    }

    this.#renderSort();
    render(this.#tripEventsListComponent, this.container, RenderPosition.BEFOREEND);
    this.#renderPoints(points);
  };

  #clearTripEventsSection = () => {
    this.#pointsPresenters.forEach((pointPresenter) => {
      pointPresenter.destroy();
    });
    this.#pointsPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#emptyListMessageComponent);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.points.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripEventsSection();
        this.#renderTripEventsSection();
        break;
      case UpdateType.MAJOR:
        this.#clearTripEventsSection();
        this.#renderTripEventsSection();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #handleSortButtonClick = (sortKey) => {
    if(!sortKey){
      return;
    }

    this.#currentSortKey = sortKey;

    if (this.#currentSortKey === this.#prevSortKey) {
      return;
    }

    this.#clearTripEventsSection();
    this.#renderTripEventsSection();
    this.#prevSortKey = this.#currentSortKey;
  };

  #sortByPrice = (points) => points.sort((prev, next) => next.basePrice - prev.basePrice);

  #sortByDay = (points) => points.sort((prev, next) => dayjs(next.dateFrom).isBefore(dayjs(prev.dateFrom)) ? 1 : -1);

  #sortByTimeDuration = (points) => points.sort((prev, next) => dayjs(next.dateTo).diff(next.dateFrom, 'minute') - dayjs(prev.dateTo).diff(prev.dateFrom, 'minute'));
}

