function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var BrightnessAltLow = forwardRef(function (_ref, ref) {
  var color = _ref.color,
      size = _ref.size,
      rest = _objectWithoutProperties(_ref, ["color", "size"]);

  return React.createElement("svg", _extends({
    ref: ref,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 16 16",
    width: size,
    height: size,
    fill: color
  }, rest), React.createElement("path", {
    d: "M8.5 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm5 6a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm-11 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9.743-4.036a.5.5 0 1 1-.707-.707.5.5 0 0 1 .707.707zm-8.486 0a.5.5 0 1 1 .707-.707.5.5 0 0 1-.707.707z"
  }), React.createElement("path", {
    fillRule: "evenodd",
    d: "M5.041 10.5h5.918a3 3 0 0 0-5.918 0zM4 11a4 4 0 1 1 8 0 .5.5 0 0 1-.5.5h-7A.5.5 0 0 1 4 11z"
  }));
});
BrightnessAltLow.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
BrightnessAltLow.defaultProps = {
  color: 'currentColor',
  size: '1em'
};
export default BrightnessAltLow;