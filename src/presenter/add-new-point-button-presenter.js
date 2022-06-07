import { RenderPosition, render } from '../framework/render';
import AddNewPointButtonView from '../view/add-new-point-button-view';

export default class AddNewPointButtonPresenter{
  #container = null;
  #addNewPointButtonComponent = null;
  #newEventButtonModel = null;

  constructor(container, newEventButtonModel){
    this.#container = container;
    this.#newEventButtonModel = newEventButtonModel;
    this.#addNewPointButtonComponent = new AddNewPointButtonView();
    this.#newEventButtonModel.addObserver(this.#handleModelEvent);
    this.#addNewPointButtonComponent.setNewEventButtonClickHandler(this.#newEventButtonClickHandler);
  }

  init = () => {
    render(this.#addNewPointButtonComponent, this.#container, RenderPosition.BEFOREEND);
  };

  #newEventButtonClickHandler = () => {
    this.#newEventButtonModel.isPressed = true;
  };

  #handleModelEvent = (isPressed) => {
    if(!isPressed){
      this.#addNewPointButtonComponent.enableButton();
    }
  };
}
