import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

const filterItemTemplate = (config, filterType) => {
  let template = '';

  for(const [key,value] of Object.entries(config)){
    const isDisabled = value ? '' : 'disabled';
    const isChecked = filterType === key.toUpperCase() ? 'checked' : '';
    template += `
        <div class="trip-filters__filter">
          <input id="filter-${key}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${key}" ${isChecked} ${isDisabled}>
          <label class="trip-filters__filter-label" for="filter-${key}">${key}</label>
        </div>`;
  }

  return template;
};

const filterFormTemplate = (config, filterType) => `
<form class="trip-filters" action="#" method="get">
  ${filterItemTemplate(config, filterType)}

  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;

export default class FilterView extends AbstractView{

  #filterType = null;

  filtersConfig = {
    everything: true,
    future: false,
    past: false
  };

  constructor(points, filterType){
    super();
    this.points = points;
    this.#filterType = filterType;
  }

  get template(){
    let i = 0;

    while(i < this.points.length && !this.isAllFiltersNecessary()){
      const dateFrom = dayjs(this.points[i].dateFrom);
      const dateTo = dayjs(this.points[i].dateTo);
      const dateNow = dayjs();

      if(
        dateTo.isBefore(dateNow, 'day') ||
        (dateFrom.isBefore(dateNow, 'day') && dateTo.isAfter(dateNow, 'day'))
      )
      {
        this.filtersConfig.past = true;
      }

      if(
        dateFrom.isAfter(dateNow, 'day') || dateFrom.isSame(dateNow, 'day') ||
        (dateFrom.isBefore(dateNow, 'day') && dateTo.isAfter(dateNow, 'day'))
      ){
        this.filtersConfig.future = true;
      }

      i++;
    }

    return filterFormTemplate(this.filtersConfig, this.#filterType);
  }

  isAllFiltersNecessary(){
    const filterValues = Object.values(this.filtersConfig);

    return !filterValues.includes(false);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
