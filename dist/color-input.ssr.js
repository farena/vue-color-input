'use strict';var vue=require('vue'),tinycolor=require('tinycolor2');function _interopDefaultLegacy(e){return e&&typeof e==='object'&&'default'in e?e:{'default':e}}var tinycolor__default=/*#__PURE__*/_interopDefaultLegacy(tinycolor);function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var script$1 = {
  name: 'ColorPicker',
  props: ['color', 'position', 'boxRect', 'disableAlpha', 'disableTextInputs'],
  emits: ['updateColor', 'hueInputStart', 'hueInputEnd', 'hueInput', 'alphaInputStart', 'alphaInputEnd', 'alphaInput', 'saturationInputStart', 'saturationInputEnd', 'saturationInput', 'ready', 'change'],
  inject: ['tinycolor'],
  data: function data() {
    return {
      h: undefined,
      s: undefined,
      v: undefined,
      a: undefined,
      hueTranslateX: 0,
      alphaTranslateX: 0,
      saturationTranslateX: 0,
      saturationTranslateY: 0,
      sliderPointerWidth: 0,
      saturationPointerWidth: 0,
      saturationPointerHeight: 0,
      pickerPositionA: {
        anchor: 'top',
        offset: 0
      },
      pickerPositionB: {
        anchor: 'left',
        offset: 0
      },
      pickerWidth: 0,
      pickerHeight: 0,
      textInputsFormat: 'rgb',
      textInputActive: null,
      textInputsFreeze: {},
      arrowColor: '#0f0f0f',
      sliderWidth: 0
    };
  },
  computed: {
    pureHueBackground: function pureHueBackground() {
      return {
        background: 'hsl(' + this.h + ', 100%, 50%)'
      };
    },
    hexString: function hexString() {
      return this.color.toHexString();
    },
    huePointerStyles: function huePointerStyles() {
      return {
        transform: 'translate(' + (this.hueTranslateX - this.sliderPointerWidth * .5) + 'px)'
      };
    },
    alphaPointerStyles: function alphaPointerStyles() {
      return {
        transform: 'translate(' + (this.alphaTranslateX - this.sliderPointerWidth * .5) + 'px)'
      };
    },
    alphaPointerTransparentStyles: function alphaPointerTransparentStyles() {
      return {
        backgroundPosition: -this.alphaTranslateX + 'px'
      };
    },
    alphaPointerColorStyles: function alphaPointerColorStyles() {
      return {
        opacity: this.a
      };
    },
    alphaCanvasStyles: function alphaCanvasStyles() {
      return {
        background: 'linear-gradient(90deg, transparent 0%, ' + this.color.toHexString() + ' 100%)'
      };
    },
    saturationPointerStyles: function saturationPointerStyles() {
      var translateX = this.saturationTranslateX - this.saturationPointerWidth * .5;
      var translateY = this.saturationTranslateY + this.saturationPointerHeight * .5;
      return {
        transform: 'translate(' + translateX + 'px, ' + translateY + 'px)'
      };
    },
    arrowsStyles: function arrowsStyles() {
      return {
        '--arrow-color': this.arrowColor
      };
    },
    pickerPosition: function pickerPosition() {
      var pickerPosition = {};
      var invertMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      };
      var offset;

      if (['top', 'bottom'].includes(this.position[0])) {
        pickerPosition.marginLeft = 0;
        pickerPosition.marginRight = 0;
        offset = this.boxRect.height;
      } else {
        pickerPosition.marginTop = 0;
        pickerPosition.marginBottom = 0;
        offset = this.boxRect.width;
      }

      var anchor = invertMap[this.position[0]];
      pickerPosition[anchor] = offset + 'px';

      if (this.position[1] === 'center') {
        // second position argument is 'center'
        if (['left', 'right'].includes(anchor)) {
          // centering on x-aixs
          anchor = 'top';
          offset = this.pickerHeight - this.boxRect.height;
        } else {
          // centering on y-aixs
          anchor = 'left';
          offset = this.pickerWidth - this.boxRect.width;
        }

        offset *= 0.5;
      } else {
        anchor = invertMap[this.position[1]];
        offset = 0;
      }

      pickerPosition[anchor] = -offset + 'px';
      return pickerPosition;
    },
    textInputs: function textInputs() {
      var format = this.textInputsFormat;
      var textInputs = {};

      if (['name', 'hex'].includes(format)) {
        textInputs.hex = this.color.toString('hex');
      } else {
        var stringSplit = this.color.toString(format).split('(')[1].slice(0, -1).split(', ');
        format.split('').forEach(function (k, i) {
          return textInputs[k] = stringSplit[i];
        });
      }

      if (!this.disableAlpha) {
        textInputs.a = Number(this.color.getAlpha().toFixed(2));
      } // if textInputs has hue, add it from this.h


      if (textInputs.hasOwnProperty('h')) {
        // in mode with hue, use this.h
        textInputs.h = Math.round(this.h);

        if (textInputs.hasOwnProperty('l')) {
          // we're in hsl, use this.s
          //convert s(hsv) to s(hsl)
          var s = this.s;
          var v = this.v || 0.001;
          var l = (2 - s) * v / 2;

          if (l < 0.5) {
            s *= v / (l * 2); // convert to % and use

            textInputs.s = Math.round(s * 100) + '%';
          }
        }
      }

      return textInputs;
    }
  },
  methods: {
    saturationPickStart: function saturationPickStart(e) {
      this.getCanvasRects();
      document.addEventListener('pointerup', this.saturationPickEnd);
      document.addEventListener('pointermove', this.saturationPickMove);
      this.saturationPickMove(e);
      this.emitHook('saturationInputStart', {
        s: this.s,
        v: this.v
      });
      this.colorSnapshot = this.color.toRgbString(); // this to track change
    },
    saturationPickEnd: function saturationPickEnd(e) {
      document.removeEventListener('pointerup', this.saturationPickEnd);
      document.removeEventListener('pointermove', this.saturationPickMove);
      this.emitHook('saturationInputEnd', {
        s: this.s,
        v: this.v
      });

      if (this.colorSnapshot !== this.color.toRgbString()) {
        // something changed, emit change hook
        this.emitHook('change', {
          h: this.h,
          s: this.s,
          v: this.v,
          a: this.a
        });
      }
    },
    saturationPickMove: function saturationPickMove(e) {
      if (e.clientX >= this.saturationCanvasRect.x && e.clientX <= this.saturationCanvasRect.right) {
        this.s = (e.clientX - this.saturationCanvasRect.x) / this.saturationCanvasRect.width;
      } else if (e.clientX < this.saturationCanvasRect.x) this.s = 0;else this.s = 1;

      if (e.clientY >= this.saturationCanvasRect.y && e.clientY <= this.saturationCanvasRect.bottom) {
        this.v = 1 - (e.clientY - this.saturationCanvasRect.y) / this.saturationCanvasRect.height;
      } else if (e.clientY < this.saturationCanvasRect.y) this.v = 1;else this.v = 0;
    },
    huePickStart: function huePickStart(e) {
      this.getCanvasRects();
      document.addEventListener('pointerup', this.huePickEnd);
      document.addEventListener('pointermove', this.huePickMove);
      this.huePickMove(e);
      this.emitHook('hueInputStart', {
        h: this.h
      });
      this.colorSnapshot = this.color.toRgbString(); // this to track change
    },
    huePickEnd: function huePickEnd(e) {
      document.removeEventListener('pointerup', this.huePickEnd);
      document.removeEventListener('pointermove', this.huePickMove);
      this.emitHook('hueInputEnd', {
        h: this.h
      });

      if (this.colorSnapshot !== this.color.toRgbString()) {
        // something changed, emit change hook
        this.emitHook('change', {
          h: this.h,
          s: this.s,
          v: this.v,
          a: this.a
        });
      }
    },
    huePickMove: function huePickMove(e) {
      if (e.clientX >= this.hueCanvasRect.x && e.clientX <= this.hueCanvasRect.right) {
        this.h = (e.clientX - this.hueCanvasRect.x) * 360 / this.hueCanvasRect.width;
      } else if (e.clientX < this.hueCanvasRect.x) this.h = 0;else this.h = 360;
    },
    alphaPickStart: function alphaPickStart(e) {
      this.getCanvasRects();
      document.addEventListener('pointerup', this.alphaPickEnd);
      document.addEventListener('pointermove', this.alphaPickMove);
      this.alphaPickMove(e);
      this.emitHook('alphaInputStart', {
        a: this.a
      });
      this.colorSnapshot = this.color.toRgbString(); // this to track change
    },
    alphaPickEnd: function alphaPickEnd(e) {
      document.removeEventListener('pointerup', this.alphaPickEnd);
      document.removeEventListener('pointermove', this.alphaPickMove);
      this.emitHook('alphaInputEnd', {
        a: this.a
      });

      if (this.colorSnapshot !== this.color.toRgbString()) {
        // something changed, emit change hook
        this.emitHook('change', {
          h: this.h,
          s: this.s,
          v: this.v,
          a: this.a
        });
      }
    },
    alphaPickMove: function alphaPickMove(e) {
      if (e.clientX >= this.alphaCanvasRect.x && e.clientX <= this.alphaCanvasRect.right) {
        this.a = (e.clientX - this.alphaCanvasRect.x) / this.alphaCanvasRect.width;
      } else if (e.clientX < this.alphaCanvasRect.x) this.a = 0;else this.a = 1;
    },
    emitUpdate: function emitUpdate(output) {
      output = output || {
        h: this.h,
        s: this.s,
        v: this.v,
        a: this.a
      };
      this.$emit('updateColor', output);
    },
    emitHook: function emitHook(eventName, value) {
      if (_typeof(value) === 'object') {
        for (var _i = 0, _Object$entries = Object.entries(value); _i < _Object$entries.length; _i++) {
          var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
              k = _Object$entries$_i[0],
              v = _Object$entries$_i[1];

          value[k] = Number(v.toFixed(3));
        }
      } else {
        value = Number(value.toFixed(3));
      }

      this.$emit(eventName, value); // if (eventName=='change') console.log('change')
    },
    textInputInputHandler: function textInputInputHandler(e) {
      var _this = this;

      var component = e.target.dataset.component;
      this.textInputsFreeze[component] = e.target.value;

      var output = _objectSpread2({}, this.textInputsFreeze);

      if (output.hasOwnProperty('hex')) {
        // editing hex
        var a = output.a;
        output = this.tinycolor(output.hex);

        if (output.getFormat() !== 'hex8') {
          // unless hex8 is entered use existing alpha
          output.setAlpha(a);
        }
      } else {
        output = this.tinycolor(output);
      }

      var hsv = output.toHsv();

      if (this.textInputsFormat === 'hsl') {
        // editing in hsl
        if (hsv.h === 0) {
          // hue got converted to 0, use previous value
          hsv.h = parseInt(this.textInputsFreeze.h);
        }

        if (hsv.v === 0) {
          // fix for editing s but l is 0, so it converts to 0
          var s = this.textInputsFreeze.s;
          var isPercent = s.indexOf('%') !== -1;
          s = parseFloat(s);
          if (!s || s < 0) s = 0;else if (isPercent || s > 1) {
            s = Math.min(s * 0.01, 1);
          } // convert to hsv

          var l = 0.001;
          var v = s * l + l;
          s = 2 - 2 * l / v;
          hsv.s = s;
        }
      } // assign new values with gate for the convertion noise


      var threshold = {
        h: .5,
        s: .001,
        v: .001
      };

      if (component !== 'a') {
        // editing color component (not alpha)
        // gate and assign new values if change is over threshold
        Object.keys(hsv).filter(function (k) {
          return k !== 'a';
        }).forEach(function (k) {
          var oldVal = _this[k];
          var newVal = hsv[k];

          if (Math.abs(oldVal - newVal) > threshold[k]) {
            _this[k] = newVal;
          }
        });

        if (output.getFormat() === 'hex8' && output.getOriginalInput().length > 7) {
          // hex8 was entered into hex field
          if (!this.disableAlpha) {
            // alpha enabled, update it too
            this.a = hsv.a;
            this.textInputsFreeze.a = Number(this.a.toFixed(2));
          } else {
            // alpha disabled, treat the color as invalid
            Object.assign(this.$data, {
              h: 0,
              s: 0,
              v: 0
            });
          }
        }
      } else {
        // editing alpha, assign it right away. Don't touch other components
        this.a = hsv.a;
      }
    },
    textInputFocusHandler: function textInputFocusHandler(e) {
      // if focused from blur, freeze current color
      // if focused from another text input, don't update
      if (!this.textInputActive) {
        this.textInputsFreeze = _objectSpread2({}, this.textInputs);
        this.colorSnapshot = this.color.toRgbString(); // this to track change
      }

      this.textInputActive = e.target.dataset.component;
    },
    textInputBlurHandler: function textInputBlurHandler(e) {
      var _this2 = this;

      setTimeout(function () {
        if (_this2.textInputActive === e.target.dataset.component) {
          // actually blurred, not just focused another
          // check if something actually changed
          if (_this2.colorSnapshot !== _this2.color.toRgbString()) {
            // something changed, emit change hook
            _this2.emitHook('change', {
              h: _this2.h,
              s: _this2.s,
              v: _this2.v,
              a: _this2.a
            });
          }

          _this2.textInputsFreeze = {};
          _this2.textInputActive = null;
        }
      }, 0);
    },
    textInputFormatChange: function textInputFormatChange(dir) {
      var formats = ['rgb', 'name', 'hsl'];
      this.textInputsFormat;

      var i = formats.indexOf(this.textInputsFormat) + dir;
      if (i < 0) i = formats.length - 1;else if (i === formats.length) i = 0;
      this.textInputsFormat = formats[i];
    },
    getCanvasRects: function getCanvasRects() {
      this.saturationCanvasRect = this.$refs.saturationCanvas.getBoundingClientRect();
      this.hueCanvasRect = this.$refs.hueCanvas.getBoundingClientRect();
      this.alphaCanvasRect = this.disableAlpha ? {} : this.$refs.alphaCanvas.getBoundingClientRect();
    },
    init: function init() {
      var _this3 = this;

      var pickerRoot = this.$refs.pickerRoot;
      var computedStyle = window.getComputedStyle(pickerRoot); // get color values from model value

      Object.assign(this.$data, this.color.toHsv()); // wait for picker to render (stealthy)
      // and then get all the necessary values that rely on element being displayed

      window.requestAnimationFrame(function () {
        // get picker size
        var _pickerRoot$getBoundi = pickerRoot.getBoundingClientRect(),
            width = _pickerRoot$getBoundi.width,
            height = _pickerRoot$getBoundi.height;

        _this3.pickerHeight = height;
        _this3.pickerWidth = width; // get canvas rects and set initial values

        _this3.getCanvasRects();

        _this3.hueTranslateX = _this3.h * _this3.hueCanvasRect.width / 360;
        _this3.alphaTranslateX = _this3.a * _this3.alphaCanvasRect.width;
        _this3.saturationTranslateX = _this3.s * _this3.saturationCanvasRect.width;
        _this3.saturationTranslateY = -_this3.v * _this3.saturationCanvasRect.height;
        _this3.sliderPointerWidth = _this3.$refs.huePointer.offsetWidth;
        _this3.saturationPointerWidth = _this3.$refs.saturationPointer.offsetWidth;
        _this3.saturationPointerHeight = _this3.$refs.saturationPointer.offsetHeight; // wait for it to hide
        // and then let the parent know picker is ready

        window.requestAnimationFrame(function () {
          _this3.$emit('ready');
        });
      }); // get background-color to color the arrows

      var background = computedStyle.getPropertyValue('background-color');

      if (this.tinycolor(background).isDark()) {
        this.arrowColor = '#fbfbfb';
      }
    },
    fillCanvas: function fillCanvas() {
      // fill hue canvas
      var canvas = this.$refs.hueCanvas;
      var ctx = canvas.getContext('2d');
      var gradient = ctx.createLinearGradient(canvas.width, 0, 0, 0);
      gradient.addColorStop(0, 'hsl(0,100%,50%)');
      gradient.addColorStop(.17, 'hsl(298.8, 100%, 50%)');
      gradient.addColorStop(.33, 'hsl(241.2, 100%, 50%)');
      gradient.addColorStop(.50, 'hsl(180, 100%, 50%)');
      gradient.addColorStop(.67, 'hsl(118.8, 100%, 50%)');
      gradient.addColorStop(.83, 'hsl(61.2,100%,50%)');
      gradient.addColorStop(1, 'hsl(360,100%,50%)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height); // fill saturation canvas

      canvas = this.$refs.saturationCanvas;
      ctx = canvas.getContext('2d'); // white layer

      gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, 'rgba(250,250,250,1)');
      gradient.addColorStop(1, 'rgba(250,250,250,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height); // black layer

      gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  },
  watch: {
    h: function h(newVal, oldVal) {
      this.hueTranslateX = this.h * this.hueCanvasRect.width / 360;
      if (oldVal === undefined) return;
      this.emitUpdate();
      this.emitHook('hueInput', {
        h: this.h
      });
    },
    s: function s(newVal, oldVal) {
      this.saturationTranslateX = this.s * this.saturationCanvasRect.width;
      if (oldVal === undefined) return;
      this.emitUpdate();
      this.emitHook('saturationInput', {
        s: this.s,
        v: this.v
      });
    },
    v: function v(newVal, oldVal) {
      this.saturationTranslateY = -this.v * this.saturationCanvasRect.height;
      if (oldVal === undefined) return;
      this.emitUpdate();
      this.emitHook('saturationInput', {
        s: this.s,
        v: this.v
      });
    },
    a: function a(newVal, oldVal) {
      this.alphaTranslateX = this.a * this.alphaCanvasRect.width;
      if (oldVal === undefined) return;
      this.emitUpdate();
      this.emitHook('alphaInput', {
        a: this.a
      });
    }
  },
  mounted: function mounted() {
    this.getCanvasRects(); // this.init();

    this.fillCanvas();
  },
  beforeUnmount: function beforeUnmount() {}
};var _hoisted_1$1 = {
  class: "slider-canvas",
  ref: "saturationCanvas"
};
var _hoisted_2 = {
  class: "slider-container"
};
var _hoisted_3 = {
  class: "slider-canvas",
  ref: "hueCanvas"
};
var _hoisted_4 = {
  class: "slider-active-area"
};
var _hoisted_5 = {
  class: "slider-container transparency-pattern"
};
var _hoisted_6 = {
  class: "slider-active-area"
};
var _hoisted_7 = {
  class: "text-inputs-wrapper"
};
var _hoisted_8 = ["for"];
var _hoisted_9 = ["value", "id", "data-component"];
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    ref: "pickerRoot",
    style: vue.normalizeStyle([$options.pickerPosition])
  }, [vue.createElementVNode("div", {
    class: "saturation-area",
    style: vue.normalizeStyle($options.pureHueBackground),
    onPointerdown: _cache[0] || (_cache[0] = function () {
      return $options.saturationPickStart && $options.saturationPickStart.apply($options, arguments);
    })
  }, [vue.createElementVNode("canvas", _hoisted_1$1, null, 512), vue.createElementVNode("div", {
    class: "saturation-pointer",
    ref: "saturationPointer",
    style: vue.normalizeStyle([$options.saturationPointerStyles, {
      background: $options.hexString
    }])
  }, null, 4)], 36), vue.createElementVNode("div", {
    class: "slider",
    onPointerdown: _cache[1] || (_cache[1] = function () {
      return $options.huePickStart && $options.huePickStart.apply($options, arguments);
    })
  }, [vue.createElementVNode("div", _hoisted_2, [vue.createElementVNode("canvas", _hoisted_3, null, 512)]), vue.createElementVNode("div", _hoisted_4, [vue.createElementVNode("div", {
    class: "slider-pointer",
    ref: "huePointer",
    style: vue.normalizeStyle([$options.huePointerStyles, $options.pureHueBackground])
  }, null, 4)])], 32), !$props.disableAlpha ? (vue.openBlock(), vue.createElementBlock("div", {
    key: 0,
    class: "slider",
    onPointerdown: _cache[2] || (_cache[2] = function () {
      return $options.alphaPickStart && $options.alphaPickStart.apply($options, arguments);
    })
  }, [vue.createElementVNode("div", _hoisted_5, [vue.createElementVNode("div", {
    class: "slider-canvas",
    ref: "alphaCanvas",
    style: vue.normalizeStyle($options.alphaCanvasStyles)
  }, null, 4)]), vue.createElementVNode("div", _hoisted_6, [vue.createElementVNode("div", {
    class: "slider-pointer",
    ref: "alphaPointer",
    style: vue.normalizeStyle($options.alphaPointerStyles)
  }, [vue.createElementVNode("div", {
    class: "pointer-transparent",
    style: vue.normalizeStyle($options.alphaPointerTransparentStyles)
  }, [vue.createElementVNode("div", {
    class: "pointer-color",
    style: vue.normalizeStyle([$options.alphaPointerColorStyles, {
      background: $options.hexString
    }])
  }, null, 4)], 4)], 4)])], 32)) : vue.createCommentVNode("", true), !$props.disableTextInputs ? (vue.openBlock(), vue.createElementBlock("div", {
    key: 1,
    class: "text-inputs-area",
    style: vue.normalizeStyle({
      '--outline-color': $options.hexString
    })
  }, [vue.createElementVNode("div", _hoisted_7, [(vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.textInputActive ? $data.textInputsFreeze : $options.textInputs, function (value, key) {
    return vue.openBlock(), vue.createElementBlock("div", {
      key: 'text-input-' + key,
      class: "text-input-container"
    }, [vue.createElementVNode("label", {
      for: 'text-input-' + key
    }, vue.toDisplayString(key), 9, _hoisted_8), vue.createElementVNode("input", {
      value: value,
      class: "text-input",
      autocomplete: "off",
      spellcheck: "false",
      id: 'text-input-' + key,
      "data-component": key,
      onInput: _cache[3] || (_cache[3] = vue.withModifiers(function () {
        return $options.textInputInputHandler && $options.textInputInputHandler.apply($options, arguments);
      }, ["prevent"])),
      onFocus: _cache[4] || (_cache[4] = function () {
        return $options.textInputFocusHandler && $options.textInputFocusHandler.apply($options, arguments);
      }),
      onBlur: _cache[5] || (_cache[5] = function () {
        return $options.textInputBlurHandler && $options.textInputBlurHandler.apply($options, arguments);
      }),
      onKeypress: _cache[6] || (_cache[6] = vue.withKeys(function ($event) {
        return $event.target.blur();
      }, ["enter"]))
    }, null, 40, _hoisted_9)]);
  }), 128))]), vue.createElementVNode("div", {
    class: "text-format-arrows",
    style: vue.normalizeStyle($options.arrowsStyles)
  }, [vue.createElementVNode("div", {
    class: "arrow up",
    onClick: _cache[7] || (_cache[7] = function ($event) {
      return $options.textInputFormatChange(-1);
    })
  }), vue.createElementVNode("div", {
    class: "arrow down",
    onClick: _cache[8] || (_cache[8] = function ($event) {
      return $options.textInputFormatChange(1);
    })
  })], 4)], 4)) : vue.createCommentVNode("", true)], 4);
}function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}var css_248z$1 = ".picker-popup .pointer-transparent, .picker-popup .pointer-color, .picker-popup .slider-canvas, .picker-popup .slider-container {\n  width: 100%;\n  height: 100%;\n}\n.picker-popup .text-format-arrows .arrow, .picker-popup .text-format-arrows, .picker-popup .text-inputs-wrapper {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.picker-popup .slider {\n  width: 85%;\n  height: 6px;\n  margin: 18px auto;\n  position: relative;\n}\n.picker-popup .slider-container {\n  display: block;\n  top: 50%;\n  border-radius: 3px;\n  overflow: hidden;\n  background-size: contain;\n}\n.picker-popup .slider-canvas {\n  display: block;\n}\n.picker-popup .slider-active-area {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  left: 0;\n  width: 100%;\n}\n.picker-popup .slider-pointer, .picker-popup .saturation-pointer {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  background: #fbfbfb;\n  overflow: hidden;\n  border: 2px #fbfbfb solid;\n  box-shadow: 0 0 5px rgba(15, 15, 15, 0.3);\n}\n.picker-popup .transparency-pattern, .picker-popup .pointer-transparent {\n  background-image: var(--transparent-pattern);\n}\n.picker-popup .pointer-transparent {\n  background-size: auto 100%;\n}\n.picker-popup .saturation-area {\n  width: 100%;\n  height: 125px;\n  position: relative;\n}\n.picker-popup .saturation-pointer {\n  top: auto;\n  width: 20px;\n  height: 20px;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  z-index: 10001;\n}\n.picker-popup .text-inputs-area {\n  display: flex;\n  margin: 0 7px 10px;\n}\n.picker-popup .text-inputs-wrapper {\n  flex: 1 0;\n  flex-wrap: wrap;\n}\n.picker-popup .text-inputs-wrapper .text-input-container {\n  white-space: nowrap;\n}\n.picker-popup .text-inputs-wrapper .text-input {\n  font-family: inherit;\n  color: inherit;\n  width: 4ch;\n  text-align: center;\n  margin: 0 5px;\n}\n.picker-popup .text-inputs-wrapper .text-input:focus {\n  outline-color: var(--outline-color);\n}\n.picker-popup .text-inputs-wrapper .text-input#text-input-hex {\n  width: 8ch;\n}\n.picker-popup .text-format-arrows {\n  flex: 0 1;\n  flex-direction: column;\n}\n.picker-popup .text-format-arrows .arrow {\n  width: 12px;\n  height: 10px;\n  opacity: 0.4;\n  transition: 0.3s;\n  position: relative;\n}\n.picker-popup .text-format-arrows .arrow::before {\n  display: block;\n  content: \"\";\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n}\n.picker-popup .text-format-arrows .arrow.up::before {\n  border-bottom: 5px solid var(--arrow-color);\n}\n.picker-popup .text-format-arrows .arrow.down::before {\n  border-top: 5px solid var(--arrow-color);\n}\n.picker-popup .text-format-arrows .arrow:hover {\n  opacity: 0.8;\n}";
styleInject(css_248z$1);script$1.render = render$1;var transparentPattern = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3QgaGVpZ2h0PSI1IiB3aWR0aD0iNSIgeT0iMCIgeD0iMCIgZmlsbD0iI2NjY2NjYyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+CiAgPHJlY3QgaGVpZ2h0PSI1IiB3aWR0aD0iNSIgeT0iNSIgeD0iNSIgZmlsbD0iI2NjY2NjYyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+Cjwvc3ZnPg==';var isSameNodeRecursive = function isSameNodeRecursive(elA, elB) {
  while (!/^(body|html)$/i.test(elA.tagName)) {
    if (elA === elB) return true;
    elA = elA.parentNode;
  }

  return false;
};

var script = /*#__PURE__*/vue.defineComponent({
  name: "ColorInput",
  props: {
    modelValue: [String, Object],
    position: {
      type: String,
      default: "bottom"
    },
    transition: {
      type: String,
      default: "picker-popup"
    },
    disableAlpha: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disableTextInputs: {
      type: Boolean,
      default: false
    },
    format: String,
    appendTo: [String, HTMLElement]
  },
  emits: ["mounted", "beforeUnmount", "update:modelValue", "pickStart", "pickEnd", "hueInputStart", "hueInputEnd", "hueInput", "alphaInputStart", "alphaInputEnd", "alphaInput", "saturationInputStart", "saturationInputEnd", "saturationInput", "change"],
  components: {
    ColorPicker: script$1
  },
  provide: {
    tinycolor: tinycolor__default["default"]
  },
  data: function data() {
    return {
      color: null,
      active: false,
      ready: false,
      hidePicker: false,
      parent: null,
      boxRect: {},
      innerBoxRect: {},
      textInputsFormat: "rgb",
      originalFormat: "rgb",
      originalType: null
    };
  },
  computed: {
    boxColorStyles: function boxColorStyles() {
      return {
        background: this.color.toRgbString()
      };
    },
    processedPosition: function processedPosition() {
      // array of all valid position combination
      var values = ["top", "right", "bottom", "left", "center"];
      var conflicts = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
      };
      var combinations = values.slice(0, 4).flatMap(function (v, i) {
        return values.map(function (q) {
          if (conflicts[v] === q) return false;
          return v === q ? v : v + " " + q;
        });
      }).filter(function (v) {
        return v;
      });
      var position = this.position.toLowerCase(); // allow 'bOtToM RiGHt'

      if (!combinations.includes(position)) {
        if (position) {
          // position is defined but invalid
          console.warn("[vue-color-input]: invalid position -> " + position);
        }

        position = "bottom center";
      }

      position = position.split(" ");
      position[1] = position[1] || "center";
      return position;
    },
    processedFormat: function processedFormat() {
      var formats = ["rgb", "hsv", "hsl"];
      formats = formats.concat(formats.flatMap(function (f) {
        return [f + " object", "object " + f, f + " string", "string " + f];
      }));
      formats = formats.concat(["name", "hex", "hex8"].flatMap(function (f) {
        return [f, f + " string", "string " + f];
      })); // validate and fallback to default

      var format = this.format;
      var force = false; // this will represent whether the resulting format is coming from the input or forced by user

      if (format) {
        // format is defined
        format = format.toLowerCase(); // allow 'rGb StRinG'

        if (!formats.includes(format)) {
          // format is defined but invalid
          console.warn("[vue-color-input]: invalid format -> " + format);
          format = this.originalFormat;
        } else {
          // user-defined format is valid
          force = true;
        }
      } else {
        // format is undefined
        format = this.originalFormat;
      } // extract type and format separately


      format = format.split(" ");
      var type = format.findIndex(function (f) {
        return ["string", "object"].includes(f);
      });

      if (type < 0) {
        // type not specified use type from input
        type = ["rgb", "hsv", "hsl"].includes(format[0]) ? this.originalType : "string";
      } else {
        // type specified
        type = format.splice(type, 1)[0];
      }

      format = format[0];
      return {
        type: type,
        format: format,
        force: force
      };
    },
    processedDisableAlpha: function processedDisableAlpha() {
      var format = this.processedFormat;

      if (format.force && ["hex", "name"].includes(format.format)) {
        return true;
      } else {
        return this.disableAlpha;
      }
    }
  },
  methods: {
    pickStart: function pickStart(e) {
      if (this.active || this.disabled) return;
      this.getBoxRect();
      this.active = true; // init the picker before showing in case there were some changes to its layout

      this.ready = false; // picker will emit 'ready' at the end of init

      this.hidePicker = true;
      this.$refs.picker.init();
      document.body.addEventListener("pointerdown", this.pickEnd);
      this.$emit("pickStart");
    },
    pickEnd: function pickEnd(e) {
      if (!this.active || e && isSameNodeRecursive(e.target, this.$refs.picker.$refs.pickerRoot)) return;
      document.body.removeEventListener("pointerdown", this.pickEnd);
      this.active = false;
      this.$emit("pickEnd");
    },
    init: function init() {
      // get color
      this.color = tinycolor__default["default"](this.modelValue); // original format (this is the format modelValue will be converted to)

      var format = this.color.getFormat();
      this.originalFormat = format ? format : "rgb";

      var type = _typeof(this.modelValue);

      this.originalType = ["string", "object"].includes(type) ? type : "string";
      this.processedFormat; // trigger computed processedFormat()
      // for storing output value (to react to external modelValue changes)

      this.output = null; // warn of invalid color

      if (!this.color.isValid()) {
        console.warn("[vue-color-input]: invalid color -> " + this.color.getOriginalInput());
      }
    },
    emitUpdate: function emitUpdate(hsv) {
      // if new value specified, update color, otherwise emit update with existing color
      if (hsv) this.color = tinycolor__default["default"](hsv);
      var format = this.processedFormat.format;

      if (this.color.getAlpha() < 1 && ["hex", "name"].includes(format)) {
        // alpha < 1 but output format lacks alpha channel
        if (this.processedFormat.force) {
          // format is user defined, output it anyway
          this.color.setAlpha(1);
        } else {
          // format is calculate from input, output rgb instead
          format = "rgb";
        }
      }

      if (this.processedFormat.type === "object") {
        this.output = this.color["to" + format.charAt(0).toUpperCase() + format.slice(1)]();
      } else {
        this.output = this.color.toString(format);
      }

      this.$emit("update:modelValue", this.output);
    },
    getParent: function getParent() {
      var parent;

      if (this.appendTo) {
        if (typeof this.appendTo === "string") {
          parent = document.querySelector(this.appendTo);
        } else {
          parent = this.appendTo;
        }
      }

      this.parent = parent || this.$refs.root;
    },
    getBoxRect: function getBoxRect() {
      this.boxRect = this.parent.getBoundingClientRect();
    }
  },
  created: function created() {
    this.init();
    this.cssVars = {
      "--transparent-pattern": "url(" + transparentPattern + ")"
    };
  },
  mounted: function mounted() {
    this.getParent();
    this.$emit("mounted");
  },
  beforeUnmount: function beforeUnmount() {
    this.pickEnd();
    this.$emit("beforeUnmount");
  },
  watch: {
    modelValue: function modelValue() {
      var input = _typeof(this.modelValue) === "object" ? JSON.stringify(this.modelValue) : this.modelValue;
      var output = _typeof(this.output) === "object" ? JSON.stringify(this.output) : this.output;

      if (input !== output) {
        // modelValue updated from elsewhere
        // update color data
        this.init(); // if active at the moment, update picker as well

        if (this.active) {
          this.$nextTick(function () {
            this.$refs.picker.init();
          });
        }
      }
    },
    disabled: function disabled() {
      this.pickEnd();
    },
    processedDisableAlpha: function processedDisableAlpha(newVal) {
      if (newVal) {
        // alpha disabled
        // update model value to no alpha
        this.color.setAlpha(1);
        this.emitUpdate();
      }

      if (this.active) this.$nextTick(function () {
        this.$refs.picker.init();
      });
    },
    format: function format() {
      this.emitUpdate();
    }
  }
});var _hoisted_1 = {
  class: "inner transparent"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _this = this;

  var _component_color_picker = vue.resolveComponent("color-picker");

  return vue.openBlock(), vue.createElementBlock("div", {
    class: "color-input user",
    ref: "root",
    style: vue.normalizeStyle(_ctx.cssVars)
  }, [vue.createElementVNode("div", {
    class: vue.normalizeClass(['box', {
      active: _ctx.active,
      disabled: _ctx.disabled
    }]),
    onClick: _cache[0] || (_cache[0] = vue.withModifiers(function () {
      return _ctx.pickStart && _ctx.pickStart.apply(_ctx, arguments);
    }, ["stop"])),
    ref: "box"
  }, [vue.createElementVNode("div", _hoisted_1, [vue.createElementVNode("div", {
    class: "color",
    style: vue.normalizeStyle(_ctx.boxColorStyles)
  }, null, 4)])], 2), _ctx.parent ? (vue.openBlock(), vue.createBlock(vue.Teleport, {
    key: 0,
    to: _ctx.parent
  }, [vue.createVNode(vue.Transition, {
    name: _ctx.transition
  }, {
    default: vue.withCtx(function () {
      return [vue.withDirectives(vue.createVNode(_component_color_picker, {
        class: "picker-popup user",
        color: _this.color,
        position: _ctx.processedPosition,
        "disable-alpha": _ctx.processedDisableAlpha,
        boxRect: _ctx.boxRect,
        "disable-text-inputs": _ctx.disableTextInputs,
        style: vue.normalizeStyle({
          visibility: _ctx.hidePicker ? 'hidden' : ''
        }),
        onReady: _cache[1] || (_cache[1] = function ($event) {
          return _ctx.hidePicker = false;
        }),
        onUpdateColor: _ctx.emitUpdate,
        onHueInputStart: _cache[2] || (_cache[2] = function ($event) {
          return _ctx.$emit('hueInputStart', $event);
        }),
        onHueInputEnd: _cache[3] || (_cache[3] = function ($event) {
          return _ctx.$emit('hueInputEnd', $event);
        }),
        onHueInput: _cache[4] || (_cache[4] = function ($event) {
          return _ctx.$emit('hueInput', $event);
        }),
        onAlphaInputStart: _cache[5] || (_cache[5] = function ($event) {
          return _ctx.$emit('alphaInputStart', $event);
        }),
        onAlphaInputEnd: _cache[6] || (_cache[6] = function ($event) {
          return _ctx.$emit('alphaInputEnd', $event);
        }),
        onAlphaInput: _cache[7] || (_cache[7] = function ($event) {
          return _ctx.$emit('alphaInput', $event);
        }),
        onSaturationInputStart: _cache[8] || (_cache[8] = function ($event) {
          return _ctx.$emit('saturationInputStart', $event);
        }),
        onSaturationInputEnd: _cache[9] || (_cache[9] = function ($event) {
          return _ctx.$emit('saturationInputEnd', $event);
        }),
        onSaturationInput: _cache[10] || (_cache[10] = function ($event) {
          return _ctx.$emit('saturationInput', $event);
        }),
        onChange: _cache[11] || (_cache[11] = function ($event) {
          return _ctx.$emit('change', $event);
        }),
        ref: "picker"
      }, null, 8, ["color", "position", "disable-alpha", "boxRect", "disable-text-inputs", "style", "onUpdateColor"]), [[vue.vShow, _ctx.active]])];
    }),
    _: 1
  }, 8, ["name"])], 8, ["to"])) : vue.createCommentVNode("", true)], 4);
}var css_248z = ".color-input .box .color, .color-input .box .transparent {\n  width: 100%;\n  height: 100%;\n}\n.color-input {\n  position: relative;\n  display: inline-block;\n}\n.color-input .box {\n  width: 40px;\n  height: 40px;\n  cursor: pointer;\n  border-radius: 20%;\n  overflow: hidden;\n  transition: all 0.2s, background-color 0.05s 0.15s;\n}\n.color-input .box .inner {\n  border-radius: inherit;\n  overflow: hidden;\n  transition: inherit;\n}\n.color-input .box .transparent {\n  background-image: var(--transparent-pattern);\n  background-color: #fff;\n  background-size: 100%;\n}\n.color-input .box.active {\n  background: #fbfbfb;\n  transition: all 0.2s, background-color 0.05s;\n}\n.color-input .box.active .inner {\n  transform: scale(0.9);\n}\n.color-input .box.disabled {\n  cursor: not-allowed;\n}\n.picker-popup {\n  position: absolute;\n  z-index: 9999;\n  width: auto;\n  min-width: 280px;\n  background-color: #fbfbfb;\n  box-shadow: 0px 5px 10px rgba(15, 15, 15, 0.4);\n  margin: 10px;\n  -webkit-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  color: #0f0f0f;\n}\n.picker-popup-enter-from,\n.picker-popup-leave-to {\n  transform: translateY(-10px);\n  opacity: 0;\n}\n.picker-popup-enter-active,\n.picker-popup-leave-active {\n  transition: transform 0.3s, opacity 0.3s;\n}";
styleInject(css_248z);script.render = render;// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var component = /*#__PURE__*/(function () {
  // Get component instance
  var installable = script; // Attach install function executed by Vue.use()

  installable.install = function (app) {
    app.component('ColorInput', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
var namedExports=/*#__PURE__*/Object.freeze({__proto__:null,'default':component});// only expose one global var, with named exports exposed as properties of
// that global var (eg. plugin.namedExport)

Object.entries(namedExports).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      exportName = _ref2[0],
      exported = _ref2[1];

  if (exportName !== 'default') component[exportName] = exported;
});module.exports=component;