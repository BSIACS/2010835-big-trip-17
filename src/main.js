import TripEventsPresenter from './presenter/trip-events-presenter.js';
import { render, RenderPosition } from './render.js';
import NewEventButtonView from './view/new-event-button-view.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const destinationsModel = new DestinationsModel();
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();

render(new NewEventButtonView(), tripMainElement, RenderPosition.BEFOREEND);

const tripEventsPresenter = new TripEventsPresenter(pointsModel, filterModel, offersModel, destinationsModel, tripEventsElement);
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);

tripEventsPresenter.init();
filterPresenter.init();
