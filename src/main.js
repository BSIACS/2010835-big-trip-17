import FilterView from './view/filter-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import { render, RenderPosition } from './render.js';
import NewEventButtonView from './view/new-event-button-view.js';
import PointsModel from './model/PointsModel.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const pointModel = new PointsModel();

render(new FilterView(pointModel.points), tripControlsFiltersElement, RenderPosition.BEFOREEND);
render(new NewEventButtonView(), tripMainElement, RenderPosition.BEFOREEND);

const tripEventsPresenter = new TripEventsPresenter(pointModel, tripEventsElement);

tripEventsPresenter.init();
