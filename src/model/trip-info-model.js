import Observable from '../framework/observable.js';
import dayjs from 'dayjs';
import { MonthsAcronyms } from '../constants.js';

export default class TripInfoModel extends Observable {
  #points = null;
  #offers = null;
  #sortedPoints = null;

  constructor(){
    super();
  }

  init = (points, offers) => {
    this.#points = points;
    this.#offers = offers;

    this.#sortedPoints = this.#sortByDate([...this.#points]);

    const totalPrice = this.#calculateTripPrice();
    const tripRoute = this.#getTripRoute();
    const tripDate = this.#getTripDate();

    this._notify({ totalPrice, tripRoute, tripDate });
  };

  #calculateTripPrice = () => {
    let totalPrice = 0;

    this.#points.forEach((point) => {
      totalPrice += point.basePrice;
      const index = this.#offers.findIndex((offer) => point.type === offer.type);
      point.offers.forEach((offerId) => {
        const selectedOffers = this.#offers[index].offers.filter((offer) => offer.id === offerId);
        totalPrice += selectedOffers.reduce((sum, current) => sum + current.price, 0);
      });
    });

    return totalPrice;
  };

  #getTripRoute = () => {
    if(!this.#sortedPoints || this.#sortedPoints.length === 0){
      return '';
    }

    const firstDestinationName = this.#sortedPoints[0].destination.name;

    const lastDestinationName = this.#sortedPoints.length >= 2 ? `&mdash; ${ this.#sortedPoints[this.#sortedPoints.length - 1].destination.name }` : '';

    let middleDestinationName = '';
    if(this.#sortedPoints.length > 3){
      middleDestinationName = '&mdash; &nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;.&nbsp;&nbsp;';
    }
    else if(this.#sortedPoints.length === 3){
      middleDestinationName = `&mdash; ${ this.#sortedPoints[1].destination.name }`;
    }

    return `${ firstDestinationName } ${ middleDestinationName } ${ lastDestinationName }`;
  };

  #getTripDate = () => {
    if(!this.#sortedPoints || this.#sortedPoints.length === 0){
      return '';
    }

    const dateStart = dayjs(this.#sortedPoints[0].dateFrom);
    const monthStart = MonthsAcronyms[dateStart.month()];

    if(this.#sortedPoints.length <= 1){
      return `${ monthStart } ${ dateStart.date() }`;
    }

    const dateEnd = dayjs(this.#sortedPoints[this.#sortedPoints.length - 1].dateFrom);
    const monthEnd = MonthsAcronyms[dateEnd.month()] === monthStart ? '' : `${MonthsAcronyms[dateEnd.month()]}&nbsp`;

    return `${ monthStart } ${ dateStart.date() }&nbsp;&mdash;&nbsp;${monthEnd}${ dateEnd.date() }`;
  };

  #sortByDate = (points) => points.sort((prev, next) => dayjs(next.dateFrom).isBefore(dayjs(prev.dateFrom)) ? 1 : -1);
}
