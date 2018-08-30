import reducer, {
  toggleFilter,
  toggleMobileFacets,
  setMobileFacetToggle
} from './reducer';

describe('[redux] facets', function() {
  it('should have no filters applied by default', function() {
    const state = reducer();
    expect(Object.keys(state.filters)).toHaveLength(0);
  });

  it('should be possible to toggle filters on / off', function() {
    // When provided with correct value, it should add a filter
    let action = toggleFilter('filterKey', 'TEST_VALUE');
    expect(action).toHaveProperty('type', 'app/facets/ADD_FILTER');
    expect(action).toHaveProperty('attribute', 'filterKey');
    expect(action).toHaveProperty('value', 'TEST_VALUE');

    // When provided with falsy value, it should remove the filter
    action = toggleFilter('filterKey', null);
    expect(action).toHaveProperty('type', 'app/facets/REMOVE_FILTER');
    expect(action).toHaveProperty('attribute', 'filterKey');

    action = toggleFilter('filterKey');
    expect(action).toHaveProperty('type', 'app/facets/REMOVE_FILTER');

    action = toggleFilter('filterKey', []);
    expect(action).toHaveProperty('type', 'app/facets/REMOVE_FILTER');
  });

  it('should be able to add new filters', function() {
    let action = toggleFilter('filterKey', 'TEST_VALUE');
    let state = reducer(undefined, action);
    expect(state).toHaveProperty('filters');
    expect(state.filters).toHaveProperty('filterKey', 'TEST_VALUE');

    action = toggleFilter('anotherFilter', 'ANOTHER_VALUE');
    state = reducer({ filters: state.filters }, action);
    expect(state).toHaveProperty('filters');
    expect(state.filters).toHaveProperty('filterKey', 'TEST_VALUE');
    expect(state.filters).toHaveProperty('anotherFilter', 'ANOTHER_VALUE');
  });

  it('should be able to remove filters', function() {
    const filters = { xxx: '111', yyy: '222' };
    // At first there's 2 filters; 'xxx' and 'yyy'
    let state = reducer({ filters });
    expect(state).toHaveProperty('filters');
    expect(state.filters).toHaveProperty('xxx', '111');
    expect(state.filters).toHaveProperty('yyy', '222');

    // Removing key with 'xxx', should leave us only the 'yyy'
    let action = toggleFilter('xxx');
    state = reducer(state, action);
    expect(state).toHaveProperty('filters');
    expect(state.filters).not.toHaveProperty('xxx');
    expect(state.filters).toHaveProperty('yyy', '222');
  });
});
