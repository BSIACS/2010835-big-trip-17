import AbstractView from '../framework/view/abstract-view.js';


const createTripInfoTemplate = (tripInfoData) => {
  const {totalPrice, tripRoute, tripDate} = tripInfoData;

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripRoute}</h1>

        <p class="trip-info__dates">${tripDate}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>
  `;
};

export default class TripInfoView extends AbstractView{

  #tripInfoData = null;

  constructor(tripInfoData){
    super();
    this.#tripInfoData = tripInfoData;
  }

  get template(){
    return createTripInfoTemplate(this.#tripInfoData);
  }

}
