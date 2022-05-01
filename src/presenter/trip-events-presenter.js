import SortView from '../view/sort-view.js';
import { render, RenderPosition } from '../render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';


export default class TripEventsPresenter{

  constructor(model, container){
    this.model = model;
    this.points = [...this.model.getPoints()];
    this.availableOffers = [...this.model.getAvailableOffers()];
    this.container = container;
    this.tripEventsListComponent = new TripEventsListView();
  }

  init = () => {
    render(new SortView(), this.container, RenderPosition.BEFOREEND);
    render(this.tripEventsListComponent, this.container, RenderPosition.BEFOREEND);
    render(new EditPointView(this.points[0], this.availableOffers, false), this.tripEventsListComponent.getElement(), RenderPosition.BEFOREEND);

    for (let i = 1; i < 20; i++) {
      render(new PointView(this.points[i], this.availableOffers), this.tripEventsListComponent.getElement(), RenderPosition.BEFOREEND);
    }
  };
}


