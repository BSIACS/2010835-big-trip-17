import FilterView from './view/filter-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import { render, RenderPosition } from './render.js';
import NewEventButtonView from './view/new-event-button-view.js';
import PointsModel from './model/PointsModel.js';
import OffersModel from './model/OffersModel.js';
import DestinationsModel from './model/DestinationsModel.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const destinationsModel = new DestinationsModel();
const pointsModel = new PointsModel();
const offersModel = new OffersModel();

render(new FilterView(pointsModel.points), tripControlsFiltersElement, RenderPosition.BEFOREEND);
render(new NewEventButtonView(), tripMainElement, RenderPosition.BEFOREEND);

const tripEventsPresenter = new TripEventsPresenter(pointsModel, offersModel, destinationsModel, tripEventsElement);

tripEventsPresenter.init();
