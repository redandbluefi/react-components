import React from 'react';
import Facet from './Facet';

// @Facet('attributeName')
// class TestFacet extends React.Component {
//   render() {
//     return (<div>TEST</div>);
//   }
// }

describe('Facet', function() {
  it('should be a higher-order component', function() {
    expect(typeof Facet).toBe('function');

    const facetHOC = new Facet('testfacet');
    expect(typeof facetHOC).toBe('function');

    const TestComponent = <span>Test</span>;
    const component = facetHOC(TestComponent);
    expect(typeof component).toBe('function');
  });

  // TODO Test: componentWillMount
  // TODO Test: initialValue
  // TODO Test: applyFilter
  // TODO Test: doSearch
  // TODO Test: Array usage
});
