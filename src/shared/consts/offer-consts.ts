const enum NAME_LENGTH {
  MIN = 10,
  MAX = 100
}

const enum DESCRIPTION_LENGTH {
  MIN = 20,
  MAX = 1024
}

const enum PRICE {
  MIN = 100,
  MAX = 100000
}

const enum WEEK_DAY {
  FIRST = 1,
  LAST = 7
}

const enum INDEX {
  FIRST = 1,
  LAST = 100
}

const NUMBER_OF_PHOTOS = 6;

const enum RATING {
  MIN = 1,
  MAX = 5
}

const RATING_DECIMAL_NUMBERS_COUNT = 1;

const enum ROOMS_COUNT {
  MIN = 1,
  MAX = 8
}

const enum ADULTS_COUNT {
  MIN = 1,
  MAX = 10
}

const enum COMMENTS_COUNT {
  MIN = 0,
  MAX = 100
}

const enum COMMENTS_LENGTH {
  MIN = 5,
  MAX = 1024
}

const enum LOCATION_SHIFT {
  START = -10000,
  END = 10000,
  DIV = 100000
}


export {
  ADULTS_COUNT, COMMENTS_COUNT, COMMENTS_LENGTH,
  DESCRIPTION_LENGTH, INDEX, LOCATION_SHIFT, NAME_LENGTH, NUMBER_OF_PHOTOS, PRICE, RATING, RATING_DECIMAL_NUMBERS_COUNT,
  ROOMS_COUNT, WEEK_DAY};
