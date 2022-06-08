import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import AddNewPointButtonPresenter from './presenter/add-new-point-button-presenter.js';
import NewEventButtonModel from './model/new-event-button-model.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');


const destinationsModel = new DestinationsModel();
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();
const newEventButtonModel = new NewEventButtonModel();

const tripEventsPresenter = new TripEventsPresenter(pointsModel, filterModel, newEventButtonModel, offersModel, destinationsModel, tripEventsElement);
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);
const addNewPointButtonPresenter = new AddNewPointButtonPresenter (tripMainElement, newEventButtonModel);


tripEventsPresenter.init();
filterPresenter.init();
addNewPointButtonPresenter.init();
