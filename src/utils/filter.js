import dayjs from 'dayjs';
import { FilterType } from '../constants';

const filterFuture = (points) => (points.filter(
  (point) =>
    dayjs(point.dateFrom).date() >= dayjs().date() ||
    (dayjs(point.dateFrom).date() < dayjs().date() && dayjs(point.dateTo).date() > dayjs().date())
)
);

const filterPast = (points) => (points.filter(
  (point) =>
    dayjs(point.dateTo).date() < dayjs().date() ||
    (dayjs(point.dateFrom).date() < dayjs().date() && dayjs(point.dateTo).date() > dayjs().date())
)
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
