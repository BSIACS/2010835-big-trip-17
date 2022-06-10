import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import AddNewPointButtonPresenter from './presenter/add-new-point-button-presenter.js';
import NewEventButtonModel from './model/new-event-button-model.js';
import PointsApiService from './api/points-api-service.js';

const AUTHORIZATION = 'Basic er856jdzbdz';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip/';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const destinationsModel = new DestinationsModel(pointsApiService);
const pointsModel = new PointsModel(pointsApiService);
const offersModel = new OffersModel(pointsApiService);
const filterModel = new FilterModel();
const newEventButtonModel = new NewEventButtonModel();

const tripEventsPresenter = new TripEventsPresenter(tripEventsElement, pointsModel, filterModel, newEventButtonModel, offersModel, destinationsModel);
const filterPresenter = new FilterPresenter(tripControlsFiltersElement, filterModel, pointsModel);
const addNewPointButtonPresenter = new AddNewPointButtonPresenter (tripMainElement, newEventButtonModel);


tripEventsPresenter.init();
filterPresenter.init();
//addNewPointButtonPresenter.init();
//pointsModel.init();

destinationsModel.init()
  .then(() => {
    offersModel.init();
  })
  .then(() => {
    pointsModel.init();
  })
  .then(() => {
    addNewPointButtonPresenter.init();
  });

// const p1 = destinationsModel.init();
// const p2 = offersModel.init();

// Promise.all([p1, p2]).then(pointsModel.init());

