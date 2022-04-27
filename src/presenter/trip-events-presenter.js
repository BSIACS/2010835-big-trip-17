import SortView from '../view/sort-view.js';
import { render, RenderPosition } from '../render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import PointConfuguratorView from '../view/point-configurator-view.js';
import PointView from '../view/point-view.js';


export default class TripEventsPresenter{

  constructor(container){
    this.container = container;
    this.tripEventsListComponent = new TripEventsListView();
  }

  init = () => {
    render(new SortView(), this.container, RenderPosition.BEFOREEND);
    render(this.tripEventsListComponent, this.container, RenderPosition.BEFOREEND);
    render(new PointConfuguratorView(), this.tripEventsListComponent.getElement(), RenderPosition.BEFOREEND);

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.tripEventsListComponent.getElement(), RenderPosition.BEFOREEND);
    }
  };
}


