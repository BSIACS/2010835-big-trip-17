import { UpdateType, UserAction } from '../constants.js';
import { RenderPosition, render, remove } from '../framework/render.js';
import { isEscapeKey } from '../utils.js';
import EditPointView from '../view/edit-point-view.js';


export default class NewPointPresenter{
  #container = null;
  #editPointComponent = null;
  #availableOffers = null;
  #availableDestinations = null;
  #changeData = null;
  #callback = {};

  constructor(container, availableOffers, availableDestinations, changeData){
    this.#container = container;
    this.#editPointComponent = null;
    this.#availableOffers = availableOffers;
    this.#availableDestinations = availableDestinations;
    this.#changeData = changeData;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  init = () => {
    this.#editPointComponent = new EditPointView(null, this.#availableOffers, this.#availableDestinations, true);
    render(this.#editPointComponent, this.#container, RenderPosition.AFTERBEGIN);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setDeleteButtonClickHandler(this.#handleDeleteButtonClick);
  };

  setSaving = () => {
    this.#editPointComponent.updateElement({ isSaving: true, isDisabled: true });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  };

  setEscKeyDownHandler = (callback) => {
    this.#callback.escKeyDown = callback;
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleDeleteButtonClick = () => {
    this.#changeData(
      UserAction.DELETE_NEW_POINT,
    );
  };

  #escKeyDownHandler = (evt) => {
    if(isEscapeKey(evt)){
      this.#callback.escKeyDown();
    }
  };

  clearView = () => {
    remove(this.#editPointComponent);
  };
}
