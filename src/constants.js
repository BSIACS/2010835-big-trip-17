const SortKeys = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
  DELETE_NEW_POINT: 'DELETE_NEW_POINT',
  UPDATE_IS_FAVORITE: 'UPDATE_IS_FAVORITE',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  GLOBAL: 'GLOBAL',
  INIT: 'INIT',
};

const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PAST: 'PAST',
};

const NoPointsMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PAST: 'There are no past events now',
};

const MonthsAcronyms = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
];

export {SortKeys, UserAction, UpdateType, FilterType, NoPointsMessage, MonthsAcronyms};
