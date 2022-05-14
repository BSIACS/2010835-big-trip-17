import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

const filterItemTemplate = (config) => {
  let template = '';

  for(const [key,value] of Object.entries(config)){
    const isDisabled = value ? '' : 'disabled';
    template += `
        <div class="trip-filters__filter">
          <input id="filter-${key}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${key}" ${isDisabled}>
          <label class="trip-filters__filter-label" for="filter-${key}">${key}</label>
        </div>`;
  }

  return template;
};

const filterFormTemplate = (config) => `
<form class="trip-filters" action="#" method="get">
  ${filterItemTemplate(config)}

  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;

export default class FilterView extends AbstractView{

  filtersConfig = {
    everything: false,
    future: false,
    past: false
  };

  constructor(points){
    super();
    this.points = points;
  }

  get template(){
    let i = 0;

    this.filtersConfig.everything = this.points.length > 0;

    while(i < this.points.length && !this.isAllFiltersNecessary()){
      const dateFrom = dayjs(this.points[i].dateFrom);
      const dateTo = dayjs(this.points[i].dateTo);
      const dateNow = dayjs();

      if(dateTo.isBefore(dateNow, 'day')){
        this.filtersConfig.past = true;
      }

      if(dateFrom.isAfter(dateNow, 'day') || dateFrom.isSame(dateNow, 'day')){
        this.filtersConfig.future = true;
      }

      i++;
    }

    return filterFormTemplate(this.filtersConfig);
  }

  isAllFiltersNecessary(){
    const filterValues = Object.values(this.filtersConfig);

    return !filterValues.includes(false);
  }
}
