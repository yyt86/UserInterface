function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
var Lamp = forwardRef(function (_ref, ref) {
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
    fillRule: "evenodd",
    d: "M13 3H3v4h10V3zM3 2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3zm4.5-1l.276-.553a.25.25 0 0 1 .448 0L8.5 1h-1zm-.012 9c-.337.646-.677 1.33-.95 1.949-.176.396-.318.75-.413 1.042a3.904 3.904 0 0 0-.102.36c-.01.047-.016.083-.02.11L6 13.5c0 .665.717 1.5 2 1.5s2-.835 2-1.5c0 0 0-.013-.004-.039a1.347 1.347 0 0 0-.02-.11 3.696 3.696 0 0 0-.1-.36 11.747 11.747 0 0 0-.413-1.042A34.827 34.827 0 0 0 8.513 10H7.487zm1.627-1h-2.23C6.032 10.595 5 12.69 5 13.5 5 14.88 6.343 16 8 16s3-1.12 3-2.5c0-.81-1.032-2.905-1.885-4.5z"
  }));
});
Lamp.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
Lamp.defaultProps = {
  color: 'currentColor',
  size: '1em'
};
export default Lamp;