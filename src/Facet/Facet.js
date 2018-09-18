import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { parse } from 'qs';

/*
  Higher Order Component that adds filtering functionality for the wrapped component.

  Initializing: Currently it's easiest to create small wrapper for this:
      import { Facet } from '@redandblue/components';
      import { toggleFilter } from '@redandblue/components/lib/Facet/reducer';

      export default function facetFactory(attribute) {
        return function facetHoC(WrappedComponent) {
          const ConnectedFacet = connect(
            state => ({
              filters: state.facets.filters
            }),
            {
              toggleFilter
            }
          )(Facet(attribute)(WrappedComponent));

          return withRouter(ConnectedFacet);
        };
      }


  Example usage #1
      @facet('attributeName')
      export default class MyFacet extends Component {

  Example usage #2: Define attribute dynamically
      @facet(null)
      export default class MyFacet extends Component {
  then in another component
      <MyComponent attribute="dynamicAttributeName" />

  Example usage #3: Read and set multiple values from one Facet
      @facet(['attribute1', 'attribute2'])
      export default class MyFacet extends Component {
        ...
        this.props.applyFilters([value1, value2])

  Example usage #3: You can also use this class just to perform the search
      @facet()
      export default class MyFacet extends Component {
          render() {
              <button onClick={this.props.doSearch}>Search</button>
          }
      }
*/
export default function facetFactory(attribute, searchRoot = '/') {
  return function facet(WrappedComponent) {
    // TODO Handle undefined attributes gracefully; happens when using this class only to search
    return class Facet extends Component {
      static propTypes = {
        attribute: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        filters: PropTypes.object,
        toggleFilter: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      };
      static displayName = `Facet(${WrappedComponent.name})`;

      // On server-side; Read the location query for this attribute and set it to initial filters
      // By doing this here, each child Facet do not need to worry about setting this
      componentWillMount() {
        this.matchFiltersToLocation(this.props.location);
      }

      componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.key !== this.props.location.key) {
          this.matchFiltersToLocation(this.props.location);
        }
      }

      // Let this component update only when URL for the given attributes changed.
      // By managing the updates, children can safely subscribe to 'componentWillReceiveProps'
      // and update when ever that method is called.
      shouldComponentUpdate(nextProps) {
        const query = parse(this.props.location.search.substring(1));
        const newQuery = parse(nextProps.location.search.substring(1));

        let attr = attribute || this.props.attribute;
        attr = Array.isArray(attr) ? attr : [attr];
        // Go through all the attribute keys and compare if any of them has changed
        const changedAttrs = attr.filter(key => query[key] !== newQuery[key]);
        // If something has changed, we should update this component and the children
        return changedAttrs.length > 0;
      }

      // Initial value for single attribute facet is a string
      // For array-type it's an object with key for each attribute and value matching the attribute
      getInitialValue() {
        const { location } = this.props;
        const attr = attribute || this.props.attribute;
        const query = parse(location.search.substring(1));

        if (Array.isArray(attr)) {
          const result = {};
          attr.forEach(key => {
            result[key] = query[key];
          });
          return result;
        }
        return query[attr];
      }

      // Search by combining all the filters into an URL query and pushing it to URL
      doSearch(filters = null) {
        const searchFilters = Object.assign({}, this.props.filters, filters);
        const searchParams = Object.keys(searchFilters).map(
          key => `${key}=${searchFilters[key]}`
        );
        let searchPath = searchRoot;
        if (typeof searchRoot === 'object') {
          if (searchRoot.currentPage === true) {
            searchPath = this.props.location.pathname;
          }
        }
        this.props.history.push(`${searchPath}?${searchParams.join('&')}`);
      }

      applyFilter(values, search) {
        let attr = attribute || this.props.attribute;
        attr = Array.isArray(attr) ? attr : [attr];
        const temporaryFilters = {};
        attr.forEach((key, i) => {
          if (!values) {
            this.props.toggleFilter(key, null);
            return;
          }
          // When value, read the value for each attribute key and set filter
          const value = Array.isArray(values) ? values[i] : values;
          this.props.toggleFilter(key, value);
          temporaryFilters[key] = value;
        });
        if (search) {
          this.doSearch(temporaryFilters);
        }
      }

      // When changing filters and searching, location and filters will match
      // However, when URL was changed without the filters changing, they will be out-of-sync
      // In that case, we update the filters to match the URL
      matchFiltersToLocation(location) {
        let attr = attribute || this.props.attribute;
        attr = Array.isArray(attr) ? attr : [attr];
        const query = parse(location.search.substring(1));

        attr.forEach(key => {
          // Update all the filters to match the URL query, there can be values or not
          const urlValue = query[key];
          this.props.toggleFilter(key, urlValue);
        });
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            initialValue={this.getInitialValue()}
            applyFilter={(value, search) => this.applyFilter(value, search)}
            doSearch={() => this.doSearch()}
          />
        );
      }
    };
  };
}
