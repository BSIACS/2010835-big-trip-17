import PointView from '../view/point-view.js';
import { RenderPosition, render, replace, remove } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import { isEscapeKey } from '../utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter{
  #point = null;
  #availableOffers = null;
  #mode = Mode.DEFAULT;

  #pointComponent = null;
  #editPointComponent = null;

  #pointsContainer = null;

  #changeMode = null;
  #submit = null;
  #changeData = null;

  constructor(pointsContainer, availableOffers, changeData){
    this.#pointsContainer = pointsContainer;
    this.#availableOffers = availableOffers;
    this.#changeData = changeData;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point, this.#availableOffers);
    this.#editPointComponent = new EditPointView(point, this.#availableOffers, false);

    this.#pointComponent.setRolldownButtonClickHandler(this.#handleRolldownButtonClick);
    this.#pointComponent.setFavoriteButtonClickHandler(this.#handleFavoriteButtonClick);
    this.#editPointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClick);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);

    if(prevPointComponent === null || prevEditPointComponent === null){
      render(this.#pointComponent, this.#pointsContainer, RenderPosition.BEFOREEND);

      return;
    }

    if(this.#pointsContainer.contains(prevPointComponent.element)){
      replace(this.#pointComponent, prevPointComponent);
    }

    if(this.#pointsContainer.contains(prevEditPointComponent.element)){
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
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
      this.#switchToPointView();
    }
  };

  #handleRolldownButtonClick = () => {
    this.#switchToEditView();
  };

  #handleRollupButtonClick = () => {
    this.#switchToPointView();
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();
    this.#switchToPointView();
  };

  #handleFavoriteButtonClick = () => {
    this.#changeData({...this.#point, isFavorite: this.#point.isFavorite === 'true' ? 'false' : 'true'});
  };
}
