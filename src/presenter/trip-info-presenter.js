import { remove, render, RenderPosition, replace } from '../framework/render';
import TripInfoModel from '../model/trip-info-model';
import TripInfoView from '../view/trip-info-view';


export default class TripInfoPresenter{

  #container = null;
  #tripInfoComponent = null;
  #pointsModel = null;
  #offersModel = null;
  #tripInfoModel = null;

  constructor(container, pointsModel, offersModel){
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#pointsModel.addObserver(this.#pointsModelStateChanged);
    this.#tripInfoModel = new TripInfoModel(this.#pointsModel.points);
    this.#tripInfoModel.addObserver(this.#tripInfoModelStateChanged);
  }

  init = (tripInfoData) => {
    const prevTripInfoComponent = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView(tripInfoData);

    if(!prevTripInfoComponent){
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

  #pointsModelStateChanged = () => {
    this.#tripInfoModel.init(this.#pointsModel.points, this.#offersModel.offers);
  };

  #tripInfoModelStateChanged = (tripInfoData) => {
    this.init(tripInfoData);
  };
}
