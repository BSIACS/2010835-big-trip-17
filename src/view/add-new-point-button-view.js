import AbstractView from '../framework/view/abstract-view.js';

const newEventButtonTemplate = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class AddNewPointButtonView extends AbstractView{

  constructor(isDisabled = true){
    super();
    this.element.disabled = isDisabled;
  }

  get template(){
    return newEventButtonTemplate();
  }

  enableButton = () => {
    this.element.disabled = false;
  };

  setNewEventButtonClickHandler = (callback) => {
    this._callback.newEventButtonClick = callback;
    this.element.addEventListener('click', this.#newEventButtonClickHandler);
  };

  #newEventButtonClickHandler = () => {
    this._callback.newEventButtonClick();
    this.element.disabled = true;
  };
}
