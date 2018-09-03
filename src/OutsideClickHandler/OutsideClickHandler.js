import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { addEventListener, removeEventListener } from 'consolidated-events';

/*
  Usage:
    const fn = () => this.setState({ visible: false });
    <OutsideClickHandler onOutsideClick={fn}>
      <MyComponent visible={this.state.visible}/>
    </OutsideClickHandler>
*/
export default class OutsideClickHandler extends Component {
  static propTypes = {
    children: PropTypes.node,
    as: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onOutsideClick: PropTypes.func
  };
  static defaultProps = {
    onOutsideClick() {},
    as: 'div'
  };
  constructor(props) {
    super(props);
    this.onOutsideClick = this.onOutsideClick.bind(this);
  }

  componentDidMount() {
    // `capture` flag is set to true so that a `stopPropagation` in the children
    // will not prevent all outside click handlers from firing
    this.clickHandle = addEventListener(
      document,
      'click',
      this.onOutsideClick,
      { capture: true }
    );
  }

  componentWillUnmount() {
    if (this.clickHandle) {
      removeEventListener(this.clickHandle);
    }
  }

  onOutsideClick(e) {
    if (!this.childNode) {
      return;
    }
    const isDescendantOfRoot = this.childNode.contains(e.target);
    if (!isDescendantOfRoot) {
      this.props.onOutsideClick(e);
    }
  }

  render() {
    if (!this.props.children) {
      return null;
    }
    const Element = this.props.as;
    return (
      <Element
        ref={ref => {
          this.childNode = ref;
        }}
      >
        {this.props.children}
      </Element>
    );
  }
}
