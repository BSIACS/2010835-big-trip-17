import SortView from '../view/sort-view.js';
import { render, RenderPosition } from '../render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import MessageView from '../view/message-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';


export default class TripEventsPresenter{

  tripEventsListView = null;
  model = null;
  #points = null;

  #tripEventsListComponent = null;
  #sortComponent = null;
  #emptyListMessageComponent = null;

  #pointsPresenters = new Map();

  constructor(model, container){
    this.model = model;
    this.#points = [...this.model.getPoints()];
    this.availableOffers = [...this.model.getAvailableOffers()];
    this.container = container;
    this.#tripEventsListComponent = new TripEventsListView();
    this.#sortComponent = new SortView();
    this.#emptyListMessageComponent = new MessageView();
  }

  init = () => {
    this.#renderPointsList();
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#tripEventsListComponent.element, this.availableOffers, this.#handlePointChange);
    this.#pointsPresenters.set(point.id, pointPresenter);
    pointPresenter.init(point);
  };

  #renderPoints = () => {
    render(this.#tripEventsListComponent, this.container, RenderPosition.BEFOREEND);
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #renderNoPoints = () => {
    render(this.#emptyListMessageComponent, this.container, RenderPosition.BEFOREEND);
  };

  #renderPointsList = () => {
    render(this.#sortComponent, this.container, RenderPosition.BEFOREEND);

    if(this.#points.length === 0){
      this.#renderNoPoints();
    }
    else{
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
}

