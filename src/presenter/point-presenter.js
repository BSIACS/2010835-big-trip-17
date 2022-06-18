import PointView from '../view/point-view.js';
import { RenderPosition, render, replace, remove } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import { isEscapeKey } from '../utils.js';
import { UserAction, UpdateType } from '../constants.js';
import { isMinor } from '../utils/point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter{
  #point = null;
  #availableOffers = null;
  #availableDestinations = null;
  #mode = Mode.DEFAULT;

  #pointComponent = null;
  #editPointComponent = null;

  #pointsContainer = null;

  #changeMode = null;
  #changeData = null;

  constructor(pointsContainer, availableOffers, availableDestinations, changeData, changeMode){
    this.#pointsContainer = pointsContainer;
    this.#availableOffers = availableOffers;
    this.#availableDestinations = availableDestinations;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point, this.#availableOffers);
    this.#editPointComponent = new EditPointView(point, this.#availableOffers, this.#availableDestinations, false);

    this.#pointComponent.setRolldownButtonClickHandler(this.#handleRolldownButtonClick);
    this.#pointComponent.setFavoriteButtonClickHandler(this.#handleFavoriteButtonClick);
    this.#editPointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClick);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setDeleteButtonClickHandler(this.#handleDeleteButtonClick);

    if(prevPointComponent === null || prevEditPointComponent === null){
      render(this.#pointComponent, this.#pointsContainer, RenderPosition.BEFOREEND);

      return;
    }

    if(this.#pointsContainer.contains(prevPointComponent.element)){
      replace(this.#pointComponent, prevPointComponent);
    }

    if(this.#pointsContainer.contains(prevEditPointComponent.element)){
      replace(this.#pointComponent, prevEditPointComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevEditPointComponent);
    remove(prevPointComponent);

  };

  setSaving = () => {
    if(this.#mode === Mode.EDITING){
      this.#editPointComponent.updateElement({ isSaving: true, isDisabled: true });
    }
  };

  setDeleting = () => {
    if(this.#mode === Mode.EDITING){
      this.#editPointComponent.updateElement({ isDeleting : true, isDisabled: true });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#editPointComponent.shake();
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#switchToPointView();
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  #switchToEditView = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#editPointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClick);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setDeleteButtonClickHandler(this.#handleDeleteButtonClick);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #switchToPointView = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#editPointComponent.unsetRollupButtonClickHandler();
    this.#editPointComponent.unsetFormSubmitHandler();
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if(isEscapeKey(evt)){
      this.#editPointComponent.reset(this.#point);
      this.#switchToPointView();
    }
  };

  #handleRolldownButtonClick = () => {
    this.#switchToEditView();
  };

  #handleRollupButtonClick = () => {
    this.#editPointComponent.reset(this.#point);
    this.#switchToPointView();
  };

  #handleFormSubmit = (point) => {
    const isUpdateTypeMinor = isMinor(this.#point, point);

    this.#changeData(
      UserAction.UPDATE_POINT,
      isUpdateTypeMinor ? UpdateType.MINOR : UpdateType.PATCH,
      point
    );
  };

  #handleDeleteButtonClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleFavoriteButtonClick = () => {
    this.#changeData(
      UserAction.UPDATE_IS_FAVORITE,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };
}
