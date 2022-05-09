import SortView from '../view/sort-view.js';
import { render, RenderPosition } from '../render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import { isEscapeKey } from '../utils.js';
import MessageView from '../view/message-view.js';


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
      for (let i = 1; i < this.points.length; i++) {
        this.#renderPoint(this.points[i], this.tripEventsListComponent.element);
      }
    }

  };

  #renderPoint = (point, container) => {
    const pointComponent = new PointView(point, this.availableOffers);
    const editPointComponent = new EditPointView(point, this.availableOffers, false);

    const switchToEditPointView = () => {
      container.replaceChild(pointComponent.element, editPointComponent.element);
      editPointComponent.unsetRollupButtonClickHandler(onRollupButtonClick);
      document.removeEventListener('keydown', onEscapeKeydown);
      editPointComponent.unsetFormSubmitHandler(onFormSubmit);
    };

    function onRollupButtonClick(){
      switchToEditPointView();
    }

    function onEscapeKeydown(evt){
      if(isEscapeKey(evt)){
        switchToEditPointView();
      }
    }

    function onFormSubmit(evt){
      evt.preventDefault();
      switchToEditPointView();
    }

    const onRolldownButtonClick = () => {
      editPointComponent.setRollupButtonClickHandler(onRollupButtonClick);
      document.addEventListener('keydown', onEscapeKeydown);
      editPointComponent.setFormSubmitHandler(onFormSubmit);
      container.replaceChild(editPointComponent.element, pointComponent.element);
    };

    pointComponent.setRolldownButtonClickHandler(onRolldownButtonClick);

    render(pointComponent, container, RenderPosition.BEFOREEND);
  };
}

