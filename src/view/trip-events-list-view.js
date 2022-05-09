import AbstractView from '../framework/view/abstract-view.js';

const tripEventsListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripEventsListView extends AbstractView{

  get template(){
    return tripEventsListTemplate();
  }
}
