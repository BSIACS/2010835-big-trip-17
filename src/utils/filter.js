import dayjs from 'dayjs';
import { FilterType } from '../constants';


const filterFuture = (points) => points.filter(
  (point) => {
    const dateFrom = dayjs(point.dateFrom);
    const dateTo = dayjs(point.dateTo);
    const dateNow = dayjs();

    return  dateFrom.isAfter(dateNow, 'day') || dateFrom.isSame(dateNow, 'day') ||
    (dateFrom.isBefore(dateNow, 'day') && dateTo.isAfter(dateNow, 'day'));
  }
);

const filterPast = (points) => points.filter(
  (point) => {
    const dateFrom = dayjs(point.dateFrom);
    const dateTo = dayjs(point.dateTo);
    const dateNow = dayjs();

    return dateTo.isBefore(dateNow, 'day') || (dateFrom.isBefore(dateNow, 'day') && dateTo.isAfter(dateNow, 'day'));
  }
);


const filterApply = (points, filterType) => {
  switch(filterType){
    case FilterType.EVERYTHING:
      return points;
    case FilterType.PAST:
      return filterPast(points);
    case FilterType.FUTURE:
      return filterFuture(points);
  }
};


export { filterApply, filterFuture };
