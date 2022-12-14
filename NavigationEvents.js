import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import React from 'react';
import withNavigation from './withNavigation';
var EventNameToPropName = {
    willFocus: 'onWillFocus',
    didFocus: 'onDidFocus',
    willBlur: 'onWillBlur',
    didBlur: 'onDidBlur'
};
var EventNames = Object.keys(EventNameToPropName);
var NavigationEvents = function (_React$Component) {
    _inherits(NavigationEvents, _React$Component);

    function NavigationEvents() {
        var _getPrototypeOf2;
        var _this;
        _classCallCheck(this, NavigationEvents);
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }
        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(NavigationEvents)).call.apply(_getPrototypeOf2, [this].concat(args)));
        _this.getPropListener = function (eventName) {
            return _this.props[EventNameToPropName[eventName]];
        };
        return _this;
    }
    _createClass(NavigationEvents, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this2 = this;
            this.subscriptions = {};
            EventNames.forEach(function (eventName) {
                _this2.subscriptions[eventName] = _this2.props.navigation.addListener(eventName, function () {
                    var propListener = _this2.getPropListener(eventName);
                    return propListener && typeof propListener.apply === "function" && propListener.apply(void 0, arguments);
                });
            });
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            var _this3 = this;
            EventNames.forEach(function (eventName) {
                _this3.subscriptions[eventName].remove();
            });
        }
    }, {
        key: "render",
        value: function render() {
            return null;
        }
    }]);
    return NavigationEvents;
}(React.Component);
export default withNavigation(NavigationEvents);
//# sourceMappingURL=NavigationEvents.js.map
//node_modules@react-navigation\core\lib\module\views\NavigationEvents.js