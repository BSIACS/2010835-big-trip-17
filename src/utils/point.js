const isMinor = (point, update) => {
  if(point.basePrice !== update.basePrice || point.dateFrom !== update.dateFrom || point.dateTo !== update.dateTo){
    return true;
  }

  return false;
};

export {isMinor};
