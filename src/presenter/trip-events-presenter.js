import SortView from '../view/sort-view.js';
import { render, RenderPosition } from '../render.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import { isEscapeKey } from '../utils.js';


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

    for (let i = 1; i < 20; i++) {
      this.#renderPoint(this.points[i], this.tripEventsListComponent.element);
    }
  };

  #renderPoint = (point, container) => {
    const pointComponent = new PointView(point, this.availableOffers);
    const editPointComponent = new EditPointView(point, this.availableOffers, false);

    const onRollupButtonClick = () => {
      container.replaceChild(pointComponent.element, editPointComponent.element);
      editPointComponent.element.querySelector('.event__rollup-btn').removeEventListener('click', onRollupButtonClick);
      document.removeEventListener('keydown', onEscapeKeydown);
      editPointComponent.element.querySelector('.event--edit').removeEventListener('submit', onFormSubmit);
    };

    function onEscapeKeydown(evt){
      if(isEscapeKey(evt)){
        container.replaceChild(pointComponent.element, editPointComponent.element);
        editPointComponent.element.querySelector('.event__rollup-btn').removeEventListener('click', onRollupButtonClick);
        document.removeEventListener('keydown', onEscapeKeydown);
        editPointComponent.element.querySelector('.event--edit').removeEventListener('submit', onFormSubmit);
      }
    }

    const onRolldownButtonClick = () => {
      editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', onRollupButtonClick);
      document.addEventListener('keydown', onEscapeKeydown);
      editPointComponent.element.querySelector('.event--edit').addEventListener('submit', onFormSubmit);
      container.replaceChild(editPointComponent.element, pointComponent.element);
    };

    function onFormSubmit(evt){
      evt.preventDefault();
      container.replaceChild(pointComponent.element, editPointComponent.element);
      editPointComponent.element.querySelector('.event__rollup-btn').removeEventListener('click', onRollupButtonClick);
      document.removeEventListener('keydown', onEscapeKeydown);
      editPointComponent.element.querySelector('.event--edit').removeEventListener('submit', onFormSubmit);
    }

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', onRolldownButtonClick);

    render(pointComponent, container, RenderPosition.BEFOREEND);
  };
}

