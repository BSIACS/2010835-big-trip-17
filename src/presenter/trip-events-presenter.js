import SortView from '../view/sort-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import MessageView from '../view/message-view.js';
import PointPresenter from './point-presenter.js';
import dayjs from 'dayjs';
import { FilterType, NoPointsMessage, SortKeys, UpdateType, UserAction } from '../constants.js';
import { filterApply } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';


export default class TripEventsPresenter{

  tripEventsListView = null;
  #pointsModel = null;
  #filterModel = null;
  #newEventButtonModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #currentSortKey = SortKeys.DAY;
  #prevSortKey = SortKeys.DAY;

  #tripEventsListComponent = null;
  #sortComponent = null;
  #emptyListMessageComponent = null;
  #loadingComponent = null;

  #pointsPresenters = new Map();
  #newPointPresenter = null;

  #isLoading = null;

  constructor(container, pointsModel, filterModel, newEventButtonModel, offersModel, destinationsModel){
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.container = container;
    this.#tripEventsListComponent = new TripEventsListView();
    this.#loadingComponent = new LoadingView();
    this.#sortComponent = null;
    this.#emptyListMessageComponent = null;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#newEventButtonModel = newEventButtonModel;
    this.#newEventButtonModel.addObserver(this.#handleAddNewButtonEvent);
    this.#isLoading = true;
  }

  get points(){
    switch(this.#currentSortKey){
      case SortKeys.DAY:
        return filterApply(this.#sortByDay([...this.#pointsModel.points]), this.#filterModel.filter);
      case SortKeys.TIME:
        return filterApply(this.#sortByTimeDuration([...this.#pointsModel.points]), this.#filterModel.filter);
      case SortKeys.PRICE:
        return filterApply(this.#sortByPrice([...this.#pointsModel.points]), this.#filterModel.filter);
    }

    return this.model.points;
  }

  init = () => {
    this.#renderTripEventsSection();
  };

  #createNewPoint = () => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter = new NewPointPresenter(this.#tripEventsListComponent.element, this.#offersModel.offers, this.#destinationsModel.destinations, this.#handleViewAction);
    this.#newPointPresenter.init();
    this.#newPointPresenter.setEscKeyDownHandler(this.#destroyNewPoint);
  };

  #destroyNewPoint = () => {
    if(this.#newPointPresenter){
      this.#newPointPresenter.clearView();
      this.#newPointPresenter = null;
      this.#newEventButtonModel.isPressed = false;
    }
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripEventsListComponent.element, this.#offersModel.offers, this.#destinationsModel.destinations, this.#handleViewAction, this.#handleModeChange);
    this.#pointsPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point);
  };

  #renderPoints = (points) => {
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderNoPoints = (messageContent) => {
    this.#emptyListMessageComponent = new MessageView(messageContent);
    render(this.#emptyListMessageComponent, this.container, RenderPosition.BEFOREEND);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortKey);
    this.#sortComponent.setSortButtonClickHandler(this.#handleSortButtonClick);
    render(this.#sortComponent, this.container, RenderPosition.BEFOREEND);
  };

  #renderLoadingSection = () => {
    render(this.#loadingComponent, this.container, RenderPosition.BEFOREEND);
  };

  #renderTripEventsSection = () => {
    if(this.#isLoading){
      this.#renderLoadingSection();
      return;
    }

    const points = this.points;

    if(points.length === 0){
      this.#renderNoPoints(NoPointsMessage[this.#filterModel.filter]);

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
    remove(this.#loadingComponent);
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        this.#destroyNewPoint();
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
      case UserAction.DELETE_NEW_POINT:
        this.#destroyNewPoint();
        break;

    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#destroyNewPoint();
        this.#clearTripEventsSection();
        this.#renderTripEventsSection();
        break;
      case UpdateType.MAJOR:
        this.#currentSortKey = SortKeys.DAY;
        this.#prevSortKey = SortKeys.DAY;
        this.#destroyNewPoint();
        this.#clearTripEventsSection();
        this.#renderTripEventsSection();
        break;
      case UpdateType.INIT:
        //Событие инициализации модели
        console.log('Событие инициализации модели (UpdateType = INIT)');
        if(this.#pointsModel.points === null || this.#offersModel.offers === null || this.#destinationsModel.destinations === null){
          return;
        }
        remove(this.#loadingComponent);
        this.#isLoading = false;
        this.#renderTripEventsSection();
        this.#newEventButtonModel.isPressed = false;
        break;
    }
  };

  #handleAddNewButtonEvent = (isPressed) => {
    if(isPressed){
      this.#createNewPoint();
    }
  };

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((pointPresenter) => pointPresenter.resetView());
    this.#destroyNewPoint();
  };

  #handleSortButtonClick = (sortKey) => {
    if(!sortKey){
      return;
    }

    this.#currentSortKey = sortKey;

    if (this.#currentSortKey === this.#prevSortKey) {
      return;
    }

    this.#destroyNewPoint();
    this.#clearTripEventsSection();
    this.#renderTripEventsSection();
    this.#prevSortKey = this.#currentSortKey;
  };

  #sortByPrice = (points) => points.sort((prev, next) => next.basePrice - prev.basePrice);

  #sortByDay = (points) => points.sort((prev, next) => dayjs(next.dateFrom).isBefore(dayjs(prev.dateFrom)) ? 1 : -1);

  #sortByTimeDuration = (points) => points.sort((prev, next) => dayjs(next.dateTo).diff(next.dateFrom, 'minute') - dayjs(prev.dateTo).diff(prev.dateFrom, 'minute'));
}

