const ADD_FILTER = 'app/facets/ADD_FILTER';
const REMOVE_FILTER = 'app/facets/REMOVE_FILTER';

const initialState = {
  filters: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_FILTER: {
      return {
        ...state,
        // Add or update the filter to the filters list, for the given key
        filters: Object.assign({}, state.filters, {
          [action.attribute]: action.value
        })
      };
    }
    case REMOVE_FILTER: {
      const updatedFilters = Object.assign({}, state.filters);
      delete updatedFilters[action.attribute];

      return {
        ...state,
        filters: updatedFilters
      };
    }
    default:
      return state;
  }
}

export function toggleFilter(attribute, value) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return { type: REMOVE_FILTER, attribute };
  }
  return { type: ADD_FILTER, attribute, value };
}
