import SortView from '../view/sort-view.js';
import { render, RenderPosition } from '../render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import { isEscapeKey } from '../utils.js';
import MessageView from '../view/message-view.js';
import { replace } from '../framework/render.js';


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

    if(this.points.length === 0){
      render(new MessageView(), this.container, RenderPosition.BEFOREEND);
    }
    else{
      render(this.tripEventsListComponent, this.container, RenderPosition.BEFOREEND);
      for (let i = 0; i < this.points.length; i++) {
        this.#renderPoint(this.points[i], this.tripEventsListComponent.element);
      }
    }

  };

  #renderPoint = (point, container) => {
    const pointComponent = new PointView(point, this.availableOffers);
    const editPointComponent = new EditPointView(point, this.availableOffers, false);

    const switchToPointView = () => {
      replace(pointComponent, editPointComponent);
      editPointComponent.unsetRollupButtonClickHandler();
      document.removeEventListener('keydown', onEscapeKeydown);
      editPointComponent.unsetFormSubmitHandler();
    };

    function onRollup(){
      switchToPointView();
    }

    function onEscapeKeydown(evt){
      if(isEscapeKey(evt)){
        switchToPointView();
      }
    }

    const onRolldownButtonClick = () => {
      editPointComponent.setRollupButtonClickHandler(onRollup);
      document.addEventListener('keydown', onEscapeKeydown);
      editPointComponent.setFormSubmitHandler(onRollup);
      replace(editPointComponent, pointComponent);
    };

    pointComponent.setRolldownButtonClickHandler(onRolldownButtonClick);

    render(pointComponent, container, RenderPosition.BEFOREEND);
  };
}

