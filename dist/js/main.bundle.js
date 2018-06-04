webpackJsonp([0],{

/***/ "./node_modules/css-loader/index.js?importLoaders=1!./node_modules/postcss-loader/lib/index.js!./src/common/css/common.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports
exports.i(__webpack_require__("./node_modules/css-loader/index.js?importLoaders=1!./node_modules/postcss-loader/lib/index.js!./src/common/css/flex.css"), "");

// module
exports.push([module.i, "html,body{\n  margin:0;\n  padding:0;\n}\nul,li{\n  list-style: none;\n  margin:0;\n  padding:0;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?importLoaders=1!./node_modules/postcss-loader/lib/index.js!./src/common/css/flex.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".flex-div{\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__("./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./src/app.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__("./src/common/css/common.css");

var _react = __webpack_require__("./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__("./node_modules/react-dom/index.js");

var _barrage = __webpack_require__("./src/components/barrage/index.js");

var _barrage2 = _interopRequireDefault(_barrage);

var _flexiable = __webpack_require__("./src/utils/flexiable.js");

var _flexiable2 = _interopRequireDefault(_flexiable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _flexiable2.default)(window, window['lib'] || (window['lib'] = {}));
//Mobile terminal adaptive

var list = ["我看到了一片海", "海是金色的哦哈哈哈哈哈哈", "火锅真的特别特别的好吃", "我不爱吃糖，就不会有蛀牙哦哦哦", "曾经沧海难为水，除去巫山不是云", "春天来咯一块爬山去，谁去啊？"];
var colorConfig = {
  random: false,
  colorList: ['red']
};
(0, _reactDom.render)(_react2.default.createElement(_barrage2.default, { barrageList: list, color: colorConfig }), document.getElementById('app'));

/***/ }),

/***/ "./src/common/css/common.css":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js?importLoaders=1!./node_modules/postcss-loader/lib/index.js!./src/common/css/common.css");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("./node_modules/css-loader/index.js?importLoaders=1!./node_modules/postcss-loader/lib/index.js!./src/common/css/common.css", function() {
			var newContent = __webpack_require__("./node_modules/css-loader/index.js?importLoaders=1!./node_modules/postcss-loader/lib/index.js!./src/common/css/common.css");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/components/barrage/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__("./node_modules/react/index.js");

var _react2 = _interopRequireDefault(_react);

var _flexiable = __webpack_require__("./src/utils/flexiable.js");

var _flexiable2 = _interopRequireDefault(_flexiable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Mobile terminal adaptive
(0, _flexiable2.default)(window, window['lib'] || (window['lib'] = {}));

var Barra = function (_React$Component) {
  _inherits(Barra, _React$Component);

  function Barra(props) {
    _classCallCheck(this, Barra);

    var _this2 = _possibleConstructorReturn(this, (Barra.__proto__ || Object.getPrototypeOf(Barra)).call(this, props));

    _this2.myCanvas = _react2.default.createRef();
    return _this2;
  }

  _createClass(Barra, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;
      var _this$props = _this.props,
          barrageList = _this$props.barrageList,
          color = _this$props.color;

      var canvas = this.myCanvas.current;
      var ctx = canvas.getContext("2d");
      ctx.font = "10px Courier New";
      var width = canvas.width;
      //get color of all barrage
      var colorArr = _this.getColor(color);
      //get the initial left for all barrage
      var numArrL = _this.getLeft();
      //get the initial top for all barrage
      var numArrT = _this.getTop();
      // get speed of all barrage
      var speedArr = _this.getSpeed();
      _this.timer = setInterval(function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        for (var j = 0; j < barrageList.length; j++) {
          numArrL[j] -= speedArr[j];
          ctx.fillStyle = colorArr[j];
          ctx.fillText(barrageList[j], numArrL[j], numArrT[j]);
          if (numArrL[j] <= -width) {
            numArrL[j] = canvas.width;
          }
        }
        ctx.restore();
      }, 16.7);
    }
  }, {
    key: 'getTop',
    value: function getTop() {
      var _this = this;
      var barrageList = this.props.barrageList;

      var canvas = _this.myCanvas.current;
      var height = canvas.height;
      var len = barrageList.length;
      var arr = new Array(len).fill(1);
      return arr.map(function () {
        return Math.random() * (height - 20) + 20;
      });
    }
  }, {
    key: 'getLeft',
    value: function getLeft() {
      var _this = this;
      var barrageList = _this.props.barrageList;

      var canvas = _this.myCanvas.current;
      var width = canvas.width;
      var len = barrageList.length;
      return new Array(len).fill(width);
    }
  }, {
    key: 'getColor',
    value: function getColor(color) {
      var _this = this;
      var barrageList = _this.props.barrageList;

      var len = barrageList.length;
      //random color
      //the empty will skip，so fill 1 with the all array
      var arr = new Array(len).fill(1);
      return arr.map(function () {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
      });
    }
  }, {
    key: 'getSpeed',
    value: function getSpeed() {
      var _this = this;
      var barrageList = _this.props.barrageList;

      var len = barrageList.length;
      //random speed
      var arr = new Array(len).fill(1);
      return arr.map(function () {
        return parseInt(Math.random() * 5);
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this = this;
      clearTimeInterval(_this.timer);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'm-barrage' },
        _react2.default.createElement('canvas', { className: 'm-barrage-canvas', ref: this.myCanvas })
      );
    }
  }]);

  return Barra;
}(_react2.default.Component);

exports.default = Barra;

/***/ }),

/***/ "./src/utils/flexiable.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});

    if (metaEl) {
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute('data-dpr', dpr);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        // 适配平板yuxl取消平板大小的限制
        // if (width / dpr > 540) {
        //     width = 540 * dpr;
        // }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function () {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function (e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }

    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function (d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    };
    flexible.px2rem = function (d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    };
};

/***/ })

},["./src/app.js"]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2Nzcy9jb21tb24uY3NzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vY3NzL2ZsZXguY3NzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21tb24vY3NzL2NvbW1vbi5jc3M/ZGJjZCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9iYXJyYWdlL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9mbGV4aWFibGUuanMiXSwibmFtZXMiOlsid2luZG93IiwibGlzdCIsImNvbG9yQ29uZmlnIiwicmFuZG9tIiwiY29sb3JMaXN0IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIkJhcnJhIiwicHJvcHMiLCJteUNhbnZhcyIsIlJlYWN0IiwiY3JlYXRlUmVmIiwiX3RoaXMiLCJiYXJyYWdlTGlzdCIsImNvbG9yIiwiY2FudmFzIiwiY3VycmVudCIsImN0eCIsImdldENvbnRleHQiLCJmb250Iiwid2lkdGgiLCJjb2xvckFyciIsImdldENvbG9yIiwibnVtQXJyTCIsImdldExlZnQiLCJudW1BcnJUIiwiZ2V0VG9wIiwic3BlZWRBcnIiLCJnZXRTcGVlZCIsInRpbWVyIiwic2V0SW50ZXJ2YWwiLCJjbGVhclJlY3QiLCJoZWlnaHQiLCJzYXZlIiwiaiIsImxlbmd0aCIsImZpbGxTdHlsZSIsImZpbGxUZXh0IiwicmVzdG9yZSIsImxlbiIsImFyciIsIkFycmF5IiwiZmlsbCIsIm1hcCIsIk1hdGgiLCJmbG9vciIsInRvU3RyaW5nIiwicGFyc2VJbnQiLCJjbGVhclRpbWVJbnRlcnZhbCIsIkNvbXBvbmVudCIsIndpbiIsImxpYiIsImRvYyIsImRvY0VsIiwiZG9jdW1lbnRFbGVtZW50IiwibWV0YUVsIiwicXVlcnlTZWxlY3RvciIsImZsZXhpYmxlRWwiLCJkcHIiLCJzY2FsZSIsInRpZCIsImZsZXhpYmxlIiwibWF0Y2giLCJnZXRBdHRyaWJ1dGUiLCJwYXJzZUZsb2F0IiwiY29udGVudCIsImluaXRpYWxEcHIiLCJtYXhpbXVtRHByIiwidG9GaXhlZCIsImlzQW5kcm9pZCIsIm5hdmlnYXRvciIsImFwcFZlcnNpb24iLCJpc0lQaG9uZSIsImRldmljZVBpeGVsUmF0aW8iLCJzZXRBdHRyaWJ1dGUiLCJjcmVhdGVFbGVtZW50IiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJhcHBlbmRDaGlsZCIsIndyYXAiLCJ3cml0ZSIsImlubmVySFRNTCIsInJlZnJlc2hSZW0iLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJyZW0iLCJzdHlsZSIsImZvbnRTaXplIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCJlIiwicGVyc2lzdGVkIiwicmVhZHlTdGF0ZSIsImJvZHkiLCJyZW0ycHgiLCJkIiwidmFsIiwicHgycmVtIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1DQUFvQyxhQUFhLGNBQWMsR0FBRyxRQUFRLHFCQUFxQixhQUFhLGNBQWMsR0FBRzs7QUFFN0g7Ozs7Ozs7O0FDUEE7QUFDQTs7O0FBR0E7QUFDQSxtQ0FBb0MseUJBQXlCLHlCQUF5QixvQkFBb0I7O0FBRTFHOzs7Ozs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsZ0JBQWdCO0FBQ25ELElBQUk7QUFDSjtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFD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QUFDL0J2QyxZQUFJd0MsSUFBSixDQUFTUixLQUFULENBQWVDLFFBQWYsR0FBMEIsS0FBSzNCLEdBQUwsR0FBVyxJQUFyQztBQUNILEtBRkQsTUFFTztBQUNITixZQUFJa0MsZ0JBQUosQ0FBcUIsa0JBQXJCLEVBQXlDLFVBQVNHLENBQVQsRUFBWTtBQUNqRHJDLGdCQUFJd0MsSUFBSixDQUFTUixLQUFULENBQWVDLFFBQWYsR0FBMEIsS0FBSzNCLEdBQUwsR0FBVyxJQUFyQztBQUNILFNBRkQsRUFFRyxLQUZIO0FBR0g7O0FBR0R1Qjs7QUFFQXBCLGFBQVNILEdBQVQsR0FBZVIsSUFBSVEsR0FBSixHQUFVQSxHQUF6QjtBQUNBRyxhQUFTb0IsVUFBVCxHQUFzQkEsVUFBdEI7QUFDQXBCLGFBQVNnQyxNQUFULEdBQWtCLFVBQVNDLENBQVQsRUFBWTtBQUMxQixZQUFJQyxNQUFNL0IsV0FBVzhCLENBQVgsSUFBZ0IsS0FBS1gsR0FBL0I7QUFDQSxZQUFJLE9BQU9XLENBQVAsS0FBYSxRQUFiLElBQXlCQSxFQUFFaEMsS0FBRixDQUFRLE1BQVIsQ0FBN0IsRUFBOEM7QUFDMUNpQyxtQkFBTyxJQUFQO0FBQ0g7QUFDRCxlQUFPQSxHQUFQO0FBQ0gsS0FORDtBQU9BbEMsYUFBU21DLE1BQVQsR0FBa0IsVUFBU0YsQ0FBVCxFQUFZO0FBQzFCLFlBQUlDLE1BQU0vQixXQUFXOEIsQ0FBWCxJQUFnQixLQUFLWCxHQUEvQjtBQUNBLFlBQUksT0FBT1csQ0FBUCxLQUFhLFFBQWIsSUFBeUJBLEVBQUVoQyxLQUFGLENBQVEsS0FBUixDQUE3QixFQUE2QztBQUN6Q2lDLG1CQUFPLEtBQVA7QUFDSDtBQUNELGVBQU9BLEdBQVA7QUFDSCxLQU5EO0FBUUgsQyIsImZpbGUiOiJqcy9tYWluLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikoZmFsc2UpO1xuLy8gaW1wb3J0c1xuZXhwb3J0cy5pKHJlcXVpcmUoXCItIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP2ltcG9ydExvYWRlcnM9MSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzIS4vZmxleC5jc3NcIiksIFwiXCIpO1xuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImh0bWwsYm9keXtcXG4gIG1hcmdpbjowO1xcbiAgcGFkZGluZzowO1xcbn1cXG51bCxsaXtcXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XFxuICBtYXJnaW46MDtcXG4gIHBhZGRpbmc6MDtcXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj9pbXBvcnRMb2FkZXJzPTEhLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliIS4vc3JjL2NvbW1vbi9jc3MvY29tbW9uLmNzc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9pbXBvcnRMb2FkZXJzPTEhLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzIS4vc3JjL2NvbW1vbi9jc3MvY29tbW9uLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKGZhbHNlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi5mbGV4LWRpdntcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/aW1wb3J0TG9hZGVycz0xIS4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYiEuL3NyYy9jb21tb24vY3NzL2ZsZXguY3NzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP2ltcG9ydExvYWRlcnM9MSEuL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi9zcmMvY29tbW9uL2Nzcy9mbGV4LmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cblxudmFyIHN0eWxlc0luRG9tID0ge307XG5cbnZhclx0bWVtb2l6ZSA9IGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbztcblxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH07XG59O1xuXG52YXIgaXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xuXHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcblx0Ly8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG5cdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG59KTtcblxudmFyIGdldEVsZW1lbnQgPSAoZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vID0ge307XG5cblx0cmV0dXJuIGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vW3NlbGVjdG9yXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbWVtb1tzZWxlY3Rvcl1cblx0fTtcbn0pKGZ1bmN0aW9uICh0YXJnZXQpIHtcblx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KVxufSk7XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyXHRzaW5nbGV0b25Db3VudGVyID0gMDtcbnZhclx0c3R5bGVzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG52YXJcdGZpeFVybHMgPSByZXF1aXJlKFwiLi91cmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYgKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAoIW9wdGlvbnMuc2luZ2xldG9uKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0SW50bykgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKCFvcHRpb25zLmluc2VydEF0KSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZSAobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0LCBvcHRpb25zKTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSBkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20gKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzIChsaXN0LCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKSBzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2UgbmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50IChvcHRpb25zLCBzdHlsZSkge1xuXHR2YXIgdGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cblx0aWYgKCF0YXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlc0luc2VydGVkQXRUb3Bbc3R5bGVzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmICghbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYgKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdFx0fVxuXHRcdHN0eWxlc0luc2VydGVkQXRUb3AucHVzaChzdHlsZSk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudCAoc3R5bGUpIHtcblx0aWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0c3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG5cblx0dmFyIGlkeCA9IHN0eWxlc0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZSk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhZGRBdHRycyhzdHlsZSwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZSk7XG5cblx0cmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhZGRBdHRycyhsaW5rLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmspO1xuXG5cdHJldHVybiBsaW5rO1xufVxuXG5mdW5jdGlvbiBhZGRBdHRycyAoZWwsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlIChvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlLCB1cGRhdGUsIHJlbW92ZSwgcmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgcmVzdWx0ID0gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcyk7XG5cblx0ICAgIGlmIChyZXN1bHQpIHtcblx0ICAgIFx0Ly8gSWYgdHJhbnNmb3JtIHJldHVybnMgYSB2YWx1ZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBydW5uaW5nIHJ1bnRpbWUgdHJhbnNmb3JtYXRpb25zIG9uIHRoZSBjc3MuXG5cdCAgICBcdG9iai5jc3MgPSByZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHQvLyBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeSB2YWx1ZSwgZG9uJ3QgYWRkIHRoaXMgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cblx0XHRzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cblx0fSBlbHNlIGlmIChcblx0XHRvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIlxuXHQpIHtcblx0XHRzdHlsZSA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblxuXHRcdFx0aWYoc3R5bGUuaHJlZikgVVJMLnJldm9rZU9iamVjdFVSTChzdHlsZS5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlIChuZXdPYmopIHtcblx0XHRpZiAobmV3T2JqKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdG5ld09iai5jc3MgPT09IG9iai5jc3MgJiZcblx0XHRcdFx0bmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiZcblx0XHRcdFx0bmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcFxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnIChzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlLmNoaWxkTm9kZXM7XG5cblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcgKHN0eWxlLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZS5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcblx0XHR9XG5cblx0XHRzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rIChsaW5rLCBvcHRpb25zLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdC8qXG5cdFx0SWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdFx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0XHRvbiBieSBkZWZhdWx0LiAgT3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIGNvbnZlcnRUb0Fic29sdXRlVXJscyBvcHRpb25cblx0XHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpIHtcblx0XHRjc3MgPSBmaXhVcmxzKGNzcyk7XG5cdH1cblxuXHRpZiAoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGluay5ocmVmO1xuXG5cdGxpbmsuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKSBVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC8pL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL3VybHMuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgJy4vY29tbW9uL2Nzcy9jb21tb24uY3NzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge3JlbmRlcn0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBCYXJyYWdlIGZyb20gJy4vY29tcG9uZW50cy9iYXJyYWdlJztcbi8vTW9iaWxlIHRlcm1pbmFsIGFkYXB0aXZlXG5pbXBvcnQgaW5pdGlhbFNpemUgZnJvbSAnLi91dGlscy9mbGV4aWFibGUnO1xuaW5pdGlhbFNpemUod2luZG93LCB3aW5kb3dbJ2xpYiddIHx8ICh3aW5kb3dbJ2xpYiddID0ge30pKTtcbmNvbnN0IGxpc3Q9W1xuICBcIuaIkeeci+WIsOS6huS4gOeJh+a1t1wiLFxuICBcIua1t+aYr+mHkeiJsueahOWTpuWTiOWTiOWTiOWTiOWTiOWTiFwiLFxuICBcIueBq+mUheecn+eahOeJueWIq+eJueWIq+eahOWlveWQg1wiLFxuICBcIuaIkeS4jeeIseWQg+ezlu+8jOWwseS4jeS8muacieibgOeJmeWTpuWTpuWTplwiLFxuICBcIuabvue7j+ayp+a1t+mavuS4uuawtO+8jOmZpOWOu+W3q+WxseS4jeaYr+S6kVwiLFxuICBcIuaYpeWkqeadpeWSr+S4gOWdl+eIrOWxseWOu++8jOiwgeWOu+WViu+8n1wiXG5dO1xuY29uc3QgY29sb3JDb25maWc9e1xuICByYW5kb206ZmFsc2UsXG4gIGNvbG9yTGlzdDpbJ3JlZCddXG59XG5yZW5kZXIoPEJhcnJhZ2UgYmFycmFnZUxpc3Q9e2xpc3R9IGNvbG9yPXtjb2xvckNvbmZpZ30vPixkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2FwcC5qcyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9pbXBvcnRMb2FkZXJzPTEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcyEuL2NvbW1vbi5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP2ltcG9ydExvYWRlcnM9MSEuLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzIS4vY29tbW9uLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/aW1wb3J0TG9hZGVycz0xIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanMhLi9jb21tb24uY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21tb24vY3NzL2NvbW1vbi5jc3Ncbi8vIG1vZHVsZSBpZCA9IC4vc3JjL2NvbW1vbi9jc3MvY29tbW9uLmNzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IGluaXRpYWxTaXplIGZyb20gJy4uLy4uL3V0aWxzL2ZsZXhpYWJsZSc7XG4vL01vYmlsZSB0ZXJtaW5hbCBhZGFwdGl2ZVxuaW5pdGlhbFNpemUod2luZG93LCB3aW5kb3dbJ2xpYiddIHx8ICh3aW5kb3dbJ2xpYiddID0ge30pKTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhcnJhIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50e1xuICBjb25zdHJ1Y3Rvcihwcm9wcyl7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMubXlDYW52YXM9UmVhY3QuY3JlYXRlUmVmKCk7XG4gIH1cbiAgY29tcG9uZW50RGlkTW91bnQoKXtcbiAgICBsZXQgX3RoaXM9dGhpcztcbiAgICBjb25zdCB7XG4gICAgICBiYXJyYWdlTGlzdCxcbiAgICAgIGNvbG9yXG4gICAgfT1fdGhpcy5wcm9wcztcbiAgICBsZXQgY2FudmFzPXRoaXMubXlDYW52YXMuY3VycmVudDtcbiAgICBsZXQgY3R4PWNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgY3R4LmZvbnQgPSBcIjEwcHggQ291cmllciBOZXdcIjtcbiAgICBsZXQgd2lkdGg9Y2FudmFzLndpZHRoO1xuICAgIC8vZ2V0IGNvbG9yIG9mIGFsbCBiYXJyYWdlXG4gICAgbGV0IGNvbG9yQXJyPV90aGlzLmdldENvbG9yKGNvbG9yKTtcbiAgICAvL2dldCB0aGUgaW5pdGlhbCBsZWZ0IGZvciBhbGwgYmFycmFnZVxuICAgIGxldCBudW1BcnJMPV90aGlzLmdldExlZnQoKTtcbiAgICAvL2dldCB0aGUgaW5pdGlhbCB0b3AgZm9yIGFsbCBiYXJyYWdlXG4gICAgbGV0IG51bUFyclQ9X3RoaXMuZ2V0VG9wKCk7XG4gICAgLy8gZ2V0IHNwZWVkIG9mIGFsbCBiYXJyYWdlXG4gICAgbGV0IHNwZWVkQXJyPV90aGlzLmdldFNwZWVkKCk7XG4gICAgX3RoaXMudGltZXI9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLDAsY2FudmFzLndpZHRoLGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICBmb3IobGV0IGo9MDtqPGJhcnJhZ2VMaXN0Lmxlbmd0aDtqKyspe1xuICAgICAgICAgIG51bUFyckxbal0tPXNwZWVkQXJyW2pdO1xuICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBjb2xvckFycltqXVxuICAgICAgICAgIGN0eC5maWxsVGV4dChiYXJyYWdlTGlzdFtqXSxudW1BcnJMW2pdLG51bUFyclRbal0pO1xuICAgICAgICAgIGlmKG51bUFyckxbal08PS13aWR0aCl7XG4gICAgICAgICAgICBudW1BcnJMW2pdPWNhbnZhcy53aWR0aDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcbiAgICAgfSwxNi43KTtcbiAgfVxuICBnZXRUb3AoKXtcbiAgICBsZXQgX3RoaXM9dGhpcztcbiAgICBsZXQge2JhcnJhZ2VMaXN0fT10aGlzLnByb3BzO1xuICAgIGxldCBjYW52YXM9X3RoaXMubXlDYW52YXMuY3VycmVudDtcbiAgICBsZXQgaGVpZ2h0PWNhbnZhcy5oZWlnaHQ7XG4gICAgbGV0IGxlbj1iYXJyYWdlTGlzdC5sZW5ndGg7XG4gICAgbGV0IGFycj1uZXcgQXJyYXkobGVuKS5maWxsKDEpO1xuICAgIHJldHVybiBhcnIubWFwKGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gTWF0aC5yYW5kb20oKSooaGVpZ2h0LTIwKSsyMDtcbiAgICB9KTtcbiAgfVxuICBnZXRMZWZ0KCl7XG4gICAgbGV0IF90aGlzPXRoaXM7XG4gICAgbGV0IHtiYXJyYWdlTGlzdH09X3RoaXMucHJvcHM7XG4gICAgbGV0IGNhbnZhcz1fdGhpcy5teUNhbnZhcy5jdXJyZW50O1xuICAgIGxldCB3aWR0aD1jYW52YXMud2lkdGg7XG4gICAgbGV0IGxlbj1iYXJyYWdlTGlzdC5sZW5ndGg7XG4gICAgcmV0dXJuIG5ldyBBcnJheShsZW4pLmZpbGwod2lkdGgpO1xuICB9XG4gIGdldENvbG9yKGNvbG9yKXtcbiAgICBsZXQgX3RoaXM9dGhpcztcbiAgICBsZXQge2JhcnJhZ2VMaXN0fT1fdGhpcy5wcm9wcztcbiAgICBsZXQgbGVuPWJhcnJhZ2VMaXN0Lmxlbmd0aDtcbiAgICAvL3JhbmRvbSBjb2xvclxuICAgIC8vdGhlIGVtcHR5IHdpbGwgc2tpcO+8jHNvIGZpbGwgMSB3aXRoIHRoZSBhbGwgYXJyYXlcbiAgICBsZXQgYXJyPW5ldyBBcnJheShsZW4pLmZpbGwoMSk7XG4gICAgcmV0dXJuIGFyci5tYXAoZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAnIycrTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjB4ZmZmZmZmKS50b1N0cmluZygxNik7XG4gICAgfSk7XG4gIH1cbiAgZ2V0U3BlZWQoKXtcbiAgICBsZXQgX3RoaXM9dGhpcztcbiAgICBsZXQge2JhcnJhZ2VMaXN0fT1fdGhpcy5wcm9wcztcbiAgICBsZXQgbGVuPWJhcnJhZ2VMaXN0Lmxlbmd0aDtcbiAgICAvL3JhbmRvbSBzcGVlZFxuICAgIGxldCBhcnI9bmV3IEFycmF5KGxlbikuZmlsbCgxKTtcbiAgICByZXR1cm4gYXJyLm1hcChmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIHBhcnNlSW50KE1hdGgucmFuZG9tKCkqNSlcbiAgICB9KVxuICB9XG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCl7XG4gICAgbGV0IF90aGlzPXRoaXM7XG4gICAgY2xlYXJUaW1lSW50ZXJ2YWwoX3RoaXMudGltZXIpO1xuICB9XG4gIHJlbmRlcigpe1xuICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm0tYmFycmFnZVwiPlxuICAgICAgICAgICAgIDxjYW52YXMgY2xhc3NOYW1lPVwibS1iYXJyYWdlLWNhbnZhc1wiIHJlZj17dGhpcy5teUNhbnZhc30+PC9jYW52YXM+XG4gICAgICAgICAgIDwvZGl2PlxuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY29tcG9uZW50cy9iYXJyYWdlL2luZGV4LmpzIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24od2luLCBsaWIpIHtcbiAgICB2YXIgZG9jID0gd2luLmRvY3VtZW50O1xuICAgIHZhciBkb2NFbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgdmFyIG1ldGFFbCA9IGRvYy5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJ2aWV3cG9ydFwiXScpO1xuICAgIHZhciBmbGV4aWJsZUVsID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cImZsZXhpYmxlXCJdJyk7XG4gICAgdmFyIGRwciA9IDA7XG4gICAgdmFyIHNjYWxlID0gMDtcbiAgICB2YXIgdGlkO1xuICAgIHZhciBmbGV4aWJsZSA9IGxpYi5mbGV4aWJsZSB8fCAobGliLmZsZXhpYmxlID0ge30pO1xuXG4gICAgaWYgKG1ldGFFbCkge1xuICAgICAgICB2YXIgbWF0Y2ggPSBtZXRhRWwuZ2V0QXR0cmlidXRlKCdjb250ZW50JykubWF0Y2goL2luaXRpYWxcXC1zY2FsZT0oW1xcZFxcLl0rKS8pO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIHNjYWxlID0gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gICAgICAgICAgICBkcHIgPSBwYXJzZUludCgxIC8gc2NhbGUpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChmbGV4aWJsZUVsKSB7XG4gICAgICAgIHZhciBjb250ZW50ID0gZmxleGlibGVFbC5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnKTtcbiAgICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgICAgIHZhciBpbml0aWFsRHByID0gY29udGVudC5tYXRjaCgvaW5pdGlhbFxcLWRwcj0oW1xcZFxcLl0rKS8pO1xuICAgICAgICAgICAgdmFyIG1heGltdW1EcHIgPSBjb250ZW50Lm1hdGNoKC9tYXhpbXVtXFwtZHByPShbXFxkXFwuXSspLyk7XG4gICAgICAgICAgICBpZiAoaW5pdGlhbERwcikge1xuICAgICAgICAgICAgICAgIGRwciA9IHBhcnNlRmxvYXQoaW5pdGlhbERwclsxXSk7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSBwYXJzZUZsb2F0KCgxIC8gZHByKS50b0ZpeGVkKDIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXhpbXVtRHByKSB7XG4gICAgICAgICAgICAgICAgZHByID0gcGFyc2VGbG9hdChtYXhpbXVtRHByWzFdKTtcbiAgICAgICAgICAgICAgICBzY2FsZSA9IHBhcnNlRmxvYXQoKDEgLyBkcHIpLnRvRml4ZWQoMikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFkcHIgJiYgIXNjYWxlKSB7XG4gICAgICAgIHZhciBpc0FuZHJvaWQgPSB3aW4ubmF2aWdhdG9yLmFwcFZlcnNpb24ubWF0Y2goL2FuZHJvaWQvZ2kpO1xuICAgICAgICB2YXIgaXNJUGhvbmUgPSB3aW4ubmF2aWdhdG9yLmFwcFZlcnNpb24ubWF0Y2goL2lwaG9uZS9naSk7XG4gICAgICAgIHZhciBkZXZpY2VQaXhlbFJhdGlvID0gd2luLmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgIGlmIChpc0lQaG9uZSkge1xuICAgICAgICAgICAgLy8gaU9T5LiL77yM5a+55LqOMuWSjDPnmoTlsY/vvIznlKgy5YCN55qE5pa55qGI77yM5YW25L2Z55qE55SoMeWAjeaWueahiFxuICAgICAgICAgICAgaWYgKGRldmljZVBpeGVsUmF0aW8gPj0gMyAmJiAoIWRwciB8fCBkcHIgPj0gMykpIHtcbiAgICAgICAgICAgICAgICBkcHIgPSAzO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkZXZpY2VQaXhlbFJhdGlvID49IDIgJiYgKCFkcHIgfHwgZHByID49IDIpKSB7XG4gICAgICAgICAgICAgICAgZHByID0gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZHByID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIOWFtuS7luiuvuWkh+S4i++8jOS7jeaXp+S9v+eUqDHlgI3nmoTmlrnmoYhcbiAgICAgICAgICAgIGRwciA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgc2NhbGUgPSAxIC8gZHByO1xuICAgIH1cblxuICAgIGRvY0VsLnNldEF0dHJpYnV0ZSgnZGF0YS1kcHInLCBkcHIpO1xuICAgIGlmICghbWV0YUVsKSB7XG4gICAgICAgIG1ldGFFbCA9IGRvYy5jcmVhdGVFbGVtZW50KCdtZXRhJyk7XG4gICAgICAgIG1ldGFFbC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAndmlld3BvcnQnKTtcbiAgICAgICAgbWV0YUVsLnNldEF0dHJpYnV0ZSgnY29udGVudCcsICdpbml0aWFsLXNjYWxlPScgKyBzY2FsZSArICcsIG1heGltdW0tc2NhbGU9JyArIHNjYWxlICsgJywgbWluaW11bS1zY2FsZT0nICsgc2NhbGUgKyAnLCB1c2VyLXNjYWxhYmxlPW5vJyk7XG4gICAgICAgIGlmIChkb2NFbC5maXJzdEVsZW1lbnRDaGlsZCkge1xuICAgICAgICAgICAgZG9jRWwuZmlyc3RFbGVtZW50Q2hpbGQuYXBwZW5kQ2hpbGQobWV0YUVsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB3cmFwID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgd3JhcC5hcHBlbmRDaGlsZChtZXRhRWwpO1xuICAgICAgICAgICAgZG9jLndyaXRlKHdyYXAuaW5uZXJIVE1MKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlZnJlc2hSZW0oKSB7XG4gICAgICAgIHZhciB3aWR0aCA9IGRvY0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICAvLyDpgILphY3lubPmnb95dXhs5Y+W5raI5bmz5p2/5aSn5bCP55qE6ZmQ5Yi2XG4gICAgICAgIC8vIGlmICh3aWR0aCAvIGRwciA+IDU0MCkge1xuICAgICAgICAvLyAgICAgd2lkdGggPSA1NDAgKiBkcHI7XG4gICAgICAgIC8vIH1cbiAgICAgICAgdmFyIHJlbSA9IHdpZHRoIC8gMTA7XG4gICAgICAgIGRvY0VsLnN0eWxlLmZvbnRTaXplID0gcmVtICsgJ3B4JztcbiAgICAgICAgZmxleGlibGUucmVtID0gd2luLnJlbSA9IHJlbTtcbiAgICB9XG5cbiAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aWQpO1xuICAgICAgICB0aWQgPSBzZXRUaW1lb3V0KHJlZnJlc2hSZW0sIDMwMCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdwYWdlc2hvdycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucGVyc2lzdGVkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGlkKTtcbiAgICAgICAgICAgIHRpZCA9IHNldFRpbWVvdXQocmVmcmVzaFJlbSwgMzAwKTtcbiAgICAgICAgfVxuICAgIH0sIGZhbHNlKTtcblxuICAgIGlmIChkb2MucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICBkb2MuYm9keS5zdHlsZS5mb250U2l6ZSA9IDEyICogZHByICsgJ3B4JztcbiAgICB9IGVsc2Uge1xuICAgICAgICBkb2MuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGRvYy5ib2R5LnN0eWxlLmZvbnRTaXplID0gMTIgKiBkcHIgKyAncHgnO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxuXG5cbiAgICByZWZyZXNoUmVtKCk7XG5cbiAgICBmbGV4aWJsZS5kcHIgPSB3aW4uZHByID0gZHByO1xuICAgIGZsZXhpYmxlLnJlZnJlc2hSZW0gPSByZWZyZXNoUmVtO1xuICAgIGZsZXhpYmxlLnJlbTJweCA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgdmFyIHZhbCA9IHBhcnNlRmxvYXQoZCkgKiB0aGlzLnJlbTtcbiAgICAgICAgaWYgKHR5cGVvZiBkID09PSAnc3RyaW5nJyAmJiBkLm1hdGNoKC9yZW0kLykpIHtcbiAgICAgICAgICAgIHZhbCArPSAncHgnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIGZsZXhpYmxlLnB4MnJlbSA9IGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgdmFyIHZhbCA9IHBhcnNlRmxvYXQoZCkgLyB0aGlzLnJlbTtcbiAgICAgICAgaWYgKHR5cGVvZiBkID09PSAnc3RyaW5nJyAmJiBkLm1hdGNoKC9weCQvKSkge1xuICAgICAgICAgICAgdmFsICs9ICdyZW0nO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuXG59XG5cbi8vKHdpbmRvdywgd2luZG93WydsaWInXSB8fCAod2luZG93WydsaWInXSA9IHt9KSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvdXRpbHMvZmxleGlhYmxlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==