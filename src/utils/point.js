const isMinor = (point, update) => {
  if(point.basePrice !== update.basePrice){
    return true;
  }

  return false;
};

export {isMinor};
