import { openBlock, createElementBlock, normalizeStyle, createElementVNode, createCommentVNode, Fragment, renderList, toDisplayString, withModifiers, withKeys, defineComponent, resolveComponent, normalizeClass, createBlock, Teleport, createVNode, Transition, withCtx, withDirectives, vShow } from 'vue';
import tinycolor from 'tinycolor2';

var script$1 = {
  name: 'ColorPicker',
  props: ['color', 'position', 'boxRect', 'disableAlpha', 'disableTextInputs'],
  emits: ['updateColor', 'hueInputStart', 'hueInputEnd', 'hueInput', 'alphaInputStart', 'alphaInputEnd', 'alphaInput', 'saturationInputStart', 'saturationInputEnd', 'saturationInput', 'ready', 'change'],
  inject: ['tinycolor'],

  data() {
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
    pureHueBackground() {
      return {
        background: 'hsl(' + this.h + ', 100%, 50%)'
      };
    },

    hexString() {
      return this.color.toHexString();
    },

    huePointerStyles() {
      return {
        transform: 'translate(' + (this.hueTranslateX - this.sliderPointerWidth * .5) + 'px)'
      };
    },

    alphaPointerStyles() {
      return {
        transform: 'translate(' + (this.alphaTranslateX - this.sliderPointerWidth * .5) + 'px)'
      };
    },

    alphaPointerTransparentStyles() {
      return {
        backgroundPosition: -this.alphaTranslateX + 'px'
      };
    },

    alphaPointerColorStyles() {
      return {
        opacity: this.a
      };
    },

    alphaCanvasStyles() {
      return {
        background: 'linear-gradient(90deg, transparent 0%, ' + this.color.toHexString() + ' 100%)'
      };
    },

    saturationPointerStyles() {
      const translateX = this.saturationTranslateX - this.saturationPointerWidth * .5;
      const translateY = this.saturationTranslateY + this.saturationPointerHeight * .5;
      return {
        transform: 'translate(' + translateX + 'px, ' + translateY + 'px)'
      };
    },

    arrowsStyles() {
      return {
        '--arrow-color': this.arrowColor
      };
    },

    pickerPosition() {
      const pickerPosition = {};
      const invertMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      };
      let offset;

      if (['top', 'bottom'].includes(this.position[0])) {
        pickerPosition.marginLeft = 0;
        pickerPosition.marginRight = 0;
        offset = this.boxRect.height;
      } else {
        pickerPosition.marginTop = 0;
        pickerPosition.marginBottom = 0;
        offset = this.boxRect.width;
      }

      let anchor = invertMap[this.position[0]];
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

    textInputs() {
      const format = this.textInputsFormat;
      const textInputs = {};

      if (['name', 'hex'].includes(format)) {
        textInputs.hex = this.color.toString('hex');
      } else {
        const stringSplit = this.color.toString(format).split('(')[1].slice(0, -1).split(', ');
        format.split('').forEach((k, i) => textInputs[k] = stringSplit[i]);
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
          let s = this.s;
          const v = this.v || 0.001;
          const l = (2 - s) * v / 2;

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
    saturationPickStart(e) {
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

    saturationPickEnd(e) {
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

    saturationPickMove(e) {
      if (e.clientX >= this.saturationCanvasRect.x && e.clientX <= this.saturationCanvasRect.right) {
        this.s = (e.clientX - this.saturationCanvasRect.x) / this.saturationCanvasRect.width;
      } else if (e.clientX < this.saturationCanvasRect.x) this.s = 0;else this.s = 1;

      if (e.clientY >= this.saturationCanvasRect.y && e.clientY <= this.saturationCanvasRect.bottom) {
        this.v = 1 - (e.clientY - this.saturationCanvasRect.y) / this.saturationCanvasRect.height;
      } else if (e.clientY < this.saturationCanvasRect.y) this.v = 1;else this.v = 0;
    },

    huePickStart(e) {
      this.getCanvasRects();
      document.addEventListener('pointerup', this.huePickEnd);
      document.addEventListener('pointermove', this.huePickMove);
      this.huePickMove(e);
      this.emitHook('hueInputStart', {
        h: this.h
      });
      this.colorSnapshot = this.color.toRgbString(); // this to track change
    },

    huePickEnd(e) {
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

    huePickMove(e) {
      if (e.clientX >= this.hueCanvasRect.x && e.clientX <= this.hueCanvasRect.right) {
        this.h = (e.clientX - this.hueCanvasRect.x) * 360 / this.hueCanvasRect.width;
      } else if (e.clientX < this.hueCanvasRect.x) this.h = 0;else this.h = 360;
    },

    alphaPickStart(e) {
      this.getCanvasRects();
      document.addEventListener('pointerup', this.alphaPickEnd);
      document.addEventListener('pointermove', this.alphaPickMove);
      this.alphaPickMove(e);
      this.emitHook('alphaInputStart', {
        a: this.a
      });
      this.colorSnapshot = this.color.toRgbString(); // this to track change
    },

    alphaPickEnd(e) {
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

    alphaPickMove(e) {
      if (e.clientX >= this.alphaCanvasRect.x && e.clientX <= this.alphaCanvasRect.right) {
        this.a = (e.clientX - this.alphaCanvasRect.x) / this.alphaCanvasRect.width;
      } else if (e.clientX < this.alphaCanvasRect.x) this.a = 0;else this.a = 1;
    },

    emitUpdate(output) {
      output = output || {
        h: this.h,
        s: this.s,
        v: this.v,
        a: this.a
      };
      this.$emit('updateColor', output);
    },

    emitHook(eventName, value) {
      if (typeof value === 'object') {
        for (let [k, v] of Object.entries(value)) value[k] = Number(v.toFixed(3));
      } else {
        value = Number(value.toFixed(3));
      }

      this.$emit(eventName, value); // if (eventName=='change') console.log('change')
    },

    textInputInputHandler(e) {
      const component = e.target.dataset.component;
      this.textInputsFreeze[component] = e.target.value;
      let output = { ...this.textInputsFreeze
      };

      if (output.hasOwnProperty('hex')) {
        // editing hex
        const a = output.a;
        output = this.tinycolor(output.hex);

        if (output.getFormat() !== 'hex8') {
          // unless hex8 is entered use existing alpha
          output.setAlpha(a);
        }
      } else {
        output = this.tinycolor(output);
      }

      const hsv = output.toHsv();

      if (this.textInputsFormat === 'hsl') {
        // editing in hsl
        if (hsv.h === 0) {
          // hue got converted to 0, use previous value
          hsv.h = parseInt(this.textInputsFreeze.h);
        }

        if (hsv.v === 0) {
          // fix for editing s but l is 0, so it converts to 0
          let s = this.textInputsFreeze.s;
          const isPercent = s.indexOf('%') !== -1;
          s = parseFloat(s);
          if (!s || s < 0) s = 0;else if (isPercent || s > 1) {
            s = Math.min(s * 0.01, 1);
          } // convert to hsv

          const l = 0.001;
          const v = s * l + l;
          s = 2 - 2 * l / v;
          hsv.s = s;
        }
      } // assign new values with gate for the convertion noise


      const threshold = {
        h: .5,
        s: .001,
        v: .001
      };

      if (component !== 'a') {
        // editing color component (not alpha)
        // gate and assign new values if change is over threshold
        Object.keys(hsv).filter(k => k !== 'a').forEach(k => {
          const oldVal = this[k];
          const newVal = hsv[k];

          if (Math.abs(oldVal - newVal) > threshold[k]) {
            this[k] = newVal;
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

    textInputFocusHandler(e) {
      // if focused from blur, freeze current color
      // if focused from another text input, don't update
      if (!this.textInputActive) {
        this.textInputsFreeze = { ...this.textInputs
        };
        this.colorSnapshot = this.color.toRgbString(); // this to track change
      }

      this.textInputActive = e.target.dataset.component;
    },

    textInputBlurHandler(e) {
      setTimeout(() => {
        if (this.textInputActive === e.target.dataset.component) {
          // actually blurred, not just focused another
          // check if something actually changed
          if (this.colorSnapshot !== this.color.toRgbString()) {
            // something changed, emit change hook
            this.emitHook('change', {
              h: this.h,
              s: this.s,
              v: this.v,
              a: this.a
            });
          }

          this.textInputsFreeze = {};
          this.textInputActive = null;
        }
      }, 0);
    },

    textInputFormatChange(dir) {
      const formats = ['rgb', 'name', 'hsl'];
      this.textInputsFormat;

      let i = formats.indexOf(this.textInputsFormat) + dir;
      if (i < 0) i = formats.length - 1;else if (i === formats.length) i = 0;
      this.textInputsFormat = formats[i];
    },

    getCanvasRects() {
      this.saturationCanvasRect = this.$refs.saturationCanvas.getBoundingClientRect();
      this.hueCanvasRect = this.$refs.hueCanvas.getBoundingClientRect();
      this.alphaCanvasRect = this.disableAlpha ? {} : this.$refs.alphaCanvas.getBoundingClientRect();
    },

    init() {
      const pickerRoot = this.$refs.pickerRoot;
      const computedStyle = window.getComputedStyle(pickerRoot); // get color values from model value

      Object.assign(this.$data, this.color.toHsv()); // wait for picker to render (stealthy)
      // and then get all the necessary values that rely on element being displayed

      window.requestAnimationFrame(() => {
        // get picker size
        const {
          width,
          height
        } = pickerRoot.getBoundingClientRect();
        this.pickerHeight = height;
        this.pickerWidth = width; // get canvas rects and set initial values

        this.getCanvasRects();
        this.hueTranslateX = this.h * this.hueCanvasRect.width / 360;
        this.alphaTranslateX = this.a * this.alphaCanvasRect.width;
        this.saturationTranslateX = this.s * this.saturationCanvasRect.width;
        this.saturationTranslateY = -this.v * this.saturationCanvasRect.height;
        this.sliderPointerWidth = this.$refs.huePointer.offsetWidth;
        this.saturationPointerWidth = this.$refs.saturationPointer.offsetWidth;
        this.saturationPointerHeight = this.$refs.saturationPointer.offsetHeight; // wait for it to hide
        // and then let the parent know picker is ready

        window.requestAnimationFrame(() => {
          this.$emit('ready');
        });
      }); // get background-color to color the arrows

      const background = computedStyle.getPropertyValue('background-color');

      if (this.tinycolor(background).isDark()) {
        this.arrowColor = '#fbfbfb';
      }
    },

    fillCanvas() {
      // fill hue canvas
      let canvas = this.$refs.hueCanvas;
      let ctx = canvas.getContext('2d');
      let gradient = ctx.createLinearGradient(canvas.width, 0, 0, 0);
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
    h(newVal, oldVal) {
      this.hueTranslateX = this.h * this.hueCanvasRect.width / 360;
      if (oldVal === undefined) return;
      this.emitUpdate();
      this.emitHook('hueInput', {
        h: this.h
      });
    },

    s(newVal, oldVal) {
      this.saturationTranslateX = this.s * this.saturationCanvasRect.width;
      if (oldVal === undefined) return;
      this.emitUpdate();
      this.emitHook('saturationInput', {
        s: this.s,
        v: this.v
      });
    },

    v(newVal, oldVal) {
      this.saturationTranslateY = -this.v * this.saturationCanvasRect.height;
      if (oldVal === undefined) return;
      this.emitUpdate();
      this.emitHook('saturationInput', {
        s: this.s,
        v: this.v
      });
    },

    a(newVal, oldVal) {
      this.alphaTranslateX = this.a * this.alphaCanvasRect.width;
      if (oldVal === undefined) return;
      this.emitUpdate();
      this.emitHook('alphaInput', {
        a: this.a
      });
    }

  },

  mounted() {
    this.getCanvasRects(); // this.init();

    this.fillCanvas();
  },

  beforeUnmount() {}

};

const _hoisted_1$1 = {
  class: "slider-canvas",
  ref: "saturationCanvas"
};
const _hoisted_2 = {
  class: "slider-container"
};
const _hoisted_3 = {
  class: "slider-canvas",
  ref: "hueCanvas"
};
const _hoisted_4 = {
  class: "slider-active-area"
};
const _hoisted_5 = {
  class: "slider-container transparency-pattern"
};
const _hoisted_6 = {
  class: "slider-active-area"
};
const _hoisted_7 = {
  class: "text-inputs-wrapper"
};
const _hoisted_8 = ["for"];
const _hoisted_9 = ["value", "id", "data-component"];
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "pickerRoot",
    style: normalizeStyle([$options.pickerPosition])
  }, [createElementVNode("div", {
    class: "saturation-area",
    style: normalizeStyle($options.pureHueBackground),
    onPointerdown: _cache[0] || (_cache[0] = (...args) => $options.saturationPickStart && $options.saturationPickStart(...args))
  }, [createElementVNode("canvas", _hoisted_1$1, null, 512), createElementVNode("div", {
    class: "saturation-pointer",
    ref: "saturationPointer",
    style: normalizeStyle([$options.saturationPointerStyles, {
      background: $options.hexString
    }])
  }, null, 4)], 36), createElementVNode("div", {
    class: "slider",
    onPointerdown: _cache[1] || (_cache[1] = (...args) => $options.huePickStart && $options.huePickStart(...args))
  }, [createElementVNode("div", _hoisted_2, [createElementVNode("canvas", _hoisted_3, null, 512)]), createElementVNode("div", _hoisted_4, [createElementVNode("div", {
    class: "slider-pointer",
    ref: "huePointer",
    style: normalizeStyle([$options.huePointerStyles, $options.pureHueBackground])
  }, null, 4)])], 32), !$props.disableAlpha ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: "slider",
    onPointerdown: _cache[2] || (_cache[2] = (...args) => $options.alphaPickStart && $options.alphaPickStart(...args))
  }, [createElementVNode("div", _hoisted_5, [createElementVNode("div", {
    class: "slider-canvas",
    ref: "alphaCanvas",
    style: normalizeStyle($options.alphaCanvasStyles)
  }, null, 4)]), createElementVNode("div", _hoisted_6, [createElementVNode("div", {
    class: "slider-pointer",
    ref: "alphaPointer",
    style: normalizeStyle($options.alphaPointerStyles)
  }, [createElementVNode("div", {
    class: "pointer-transparent",
    style: normalizeStyle($options.alphaPointerTransparentStyles)
  }, [createElementVNode("div", {
    class: "pointer-color",
    style: normalizeStyle([$options.alphaPointerColorStyles, {
      background: $options.hexString
    }])
  }, null, 4)], 4)], 4)])], 32)) : createCommentVNode("", true), !$props.disableTextInputs ? (openBlock(), createElementBlock("div", {
    key: 1,
    class: "text-inputs-area",
    style: normalizeStyle({
      '--outline-color': $options.hexString
    })
  }, [createElementVNode("div", _hoisted_7, [(openBlock(true), createElementBlock(Fragment, null, renderList($data.textInputActive ? $data.textInputsFreeze : $options.textInputs, (value, key) => {
    return openBlock(), createElementBlock("div", {
      key: 'text-input-' + key,
      class: "text-input-container"
    }, [createElementVNode("label", {
      for: 'text-input-' + key
    }, toDisplayString(key), 9, _hoisted_8), createElementVNode("input", {
      value: value,
      class: "text-input",
      autocomplete: "off",
      spellcheck: "false",
      id: 'text-input-' + key,
      "data-component": key,
      onInput: _cache[3] || (_cache[3] = withModifiers((...args) => $options.textInputInputHandler && $options.textInputInputHandler(...args), ["prevent"])),
      onFocus: _cache[4] || (_cache[4] = (...args) => $options.textInputFocusHandler && $options.textInputFocusHandler(...args)),
      onBlur: _cache[5] || (_cache[5] = (...args) => $options.textInputBlurHandler && $options.textInputBlurHandler(...args)),
      onKeypress: _cache[6] || (_cache[6] = withKeys($event => $event.target.blur(), ["enter"]))
    }, null, 40, _hoisted_9)]);
  }), 128))]), createElementVNode("div", {
    class: "text-format-arrows",
    style: normalizeStyle($options.arrowsStyles)
  }, [createElementVNode("div", {
    class: "arrow up",
    onClick: _cache[7] || (_cache[7] = $event => $options.textInputFormatChange(-1))
  }), createElementVNode("div", {
    class: "arrow down",
    onClick: _cache[8] || (_cache[8] = $event => $options.textInputFormatChange(1))
  })], 4)], 4)) : createCommentVNode("", true)], 4);
}

function styleInject(css, ref) {
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
}

var css_248z$1 = ".picker-popup .pointer-transparent, .picker-popup .pointer-color, .picker-popup .slider-canvas, .picker-popup .slider-container {\n  width: 100%;\n  height: 100%;\n}\n.picker-popup .text-format-arrows .arrow, .picker-popup .text-format-arrows, .picker-popup .text-inputs-wrapper {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.picker-popup .slider {\n  width: 85%;\n  height: 6px;\n  margin: 18px auto;\n  position: relative;\n}\n.picker-popup .slider-container {\n  display: block;\n  top: 50%;\n  border-radius: 3px;\n  overflow: hidden;\n  background-size: contain;\n}\n.picker-popup .slider-canvas {\n  display: block;\n}\n.picker-popup .slider-active-area {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  left: 0;\n  width: 100%;\n}\n.picker-popup .slider-pointer, .picker-popup .saturation-pointer {\n  width: 12px;\n  height: 12px;\n  border-radius: 50%;\n  background: #fbfbfb;\n  overflow: hidden;\n  border: 2px #fbfbfb solid;\n  box-shadow: 0 0 5px rgba(15, 15, 15, 0.3);\n}\n.picker-popup .transparency-pattern, .picker-popup .pointer-transparent {\n  background-image: var(--transparent-pattern);\n}\n.picker-popup .pointer-transparent {\n  background-size: auto 100%;\n}\n.picker-popup .saturation-area {\n  width: 100%;\n  height: 125px;\n  position: relative;\n}\n.picker-popup .saturation-pointer {\n  top: auto;\n  width: 20px;\n  height: 20px;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  z-index: 10001;\n}\n.picker-popup .text-inputs-area {\n  display: flex;\n  margin: 0 7px 10px;\n}\n.picker-popup .text-inputs-wrapper {\n  flex: 1 0;\n  flex-wrap: wrap;\n}\n.picker-popup .text-inputs-wrapper .text-input-container {\n  white-space: nowrap;\n}\n.picker-popup .text-inputs-wrapper .text-input {\n  font-family: inherit;\n  color: inherit;\n  width: 4ch;\n  text-align: center;\n  margin: 0 5px;\n}\n.picker-popup .text-inputs-wrapper .text-input:focus {\n  outline-color: var(--outline-color);\n}\n.picker-popup .text-inputs-wrapper .text-input#text-input-hex {\n  width: 8ch;\n}\n.picker-popup .text-format-arrows {\n  flex: 0 1;\n  flex-direction: column;\n}\n.picker-popup .text-format-arrows .arrow {\n  width: 12px;\n  height: 10px;\n  opacity: 0.4;\n  transition: 0.3s;\n  position: relative;\n}\n.picker-popup .text-format-arrows .arrow::before {\n  display: block;\n  content: \"\";\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n}\n.picker-popup .text-format-arrows .arrow.up::before {\n  border-bottom: 5px solid var(--arrow-color);\n}\n.picker-popup .text-format-arrows .arrow.down::before {\n  border-top: 5px solid var(--arrow-color);\n}\n.picker-popup .text-format-arrows .arrow:hover {\n  opacity: 0.8;\n}";
styleInject(css_248z$1);

script$1.render = render$1;

var transparentPattern = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3QgaGVpZ2h0PSI1IiB3aWR0aD0iNSIgeT0iMCIgeD0iMCIgZmlsbD0iI2NjY2NjYyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+CiAgPHJlY3QgaGVpZ2h0PSI1IiB3aWR0aD0iNSIgeT0iNSIgeD0iNSIgZmlsbD0iI2NjY2NjYyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIi8+Cjwvc3ZnPg==';

const isSameNodeRecursive = (elA, elB) => {
  while (!/^(body|html)$/i.test(elA.tagName)) {
    if (elA === elB) return true;
    elA = elA.parentNode;
  }

  return false;
};

var script = /*#__PURE__*/defineComponent({
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
    tinycolor
  },

  data() {
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
    boxColorStyles() {
      return {
        background: this.color.toRgbString()
      };
    },

    processedPosition() {
      // array of all valid position combination
      const values = ["top", "right", "bottom", "left", "center"];
      const conflicts = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right"
      };
      const combinations = values.slice(0, 4).flatMap((v, i) => values.map(q => {
        if (conflicts[v] === q) return false;
        return v === q ? v : v + " " + q;
      })).filter(v => v);
      let position = this.position.toLowerCase(); // allow 'bOtToM RiGHt'

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

    processedFormat() {
      let formats = ["rgb", "hsv", "hsl"];
      formats = formats.concat(formats.flatMap(f => {
        return [f + " object", "object " + f, f + " string", "string " + f];
      }));
      formats = formats.concat(["name", "hex", "hex8"].flatMap(f => {
        return [f, f + " string", "string " + f];
      })); // validate and fallback to default

      let format = this.format;
      let force = false; // this will represent whether the resulting format is coming from the input or forced by user

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
      let type = format.findIndex(f => ["string", "object"].includes(f));

      if (type < 0) {
        // type not specified use type from input
        type = ["rgb", "hsv", "hsl"].includes(format[0]) ? this.originalType : "string";
      } else {
        // type specified
        type = format.splice(type, 1)[0];
      }

      format = format[0];
      return {
        type,
        format,
        force
      };
    },

    processedDisableAlpha() {
      const format = this.processedFormat;

      if (format.force && ["hex", "name"].includes(format.format)) {
        return true;
      } else {
        return this.disableAlpha;
      }
    }

  },
  methods: {
    pickStart(e) {
      if (this.active || this.disabled) return;
      this.getBoxRect();
      this.active = true; // init the picker before showing in case there were some changes to its layout

      this.ready = false; // picker will emit 'ready' at the end of init

      this.hidePicker = true;
      this.$refs.picker.init();
      document.body.addEventListener("pointerdown", this.pickEnd);
      this.$emit("pickStart");
    },

    pickEnd(e) {
      if (!this.active || e && isSameNodeRecursive(e.target, this.$refs.picker.$refs.pickerRoot)) return;
      document.body.removeEventListener("pointerdown", this.pickEnd);
      this.active = false;
      this.$emit("pickEnd");
    },

    init() {
      // get color
      this.color = tinycolor(this.modelValue); // original format (this is the format modelValue will be converted to)

      let format = this.color.getFormat();
      this.originalFormat = format ? format : "rgb";
      let type = typeof this.modelValue;
      this.originalType = ["string", "object"].includes(type) ? type : "string";
      this.processedFormat; // trigger computed processedFormat()
      // for storing output value (to react to external modelValue changes)

      this.output = null; // warn of invalid color

      if (!this.color.isValid()) {
        console.warn("[vue-color-input]: invalid color -> " + this.color.getOriginalInput());
      }
    },

    emitUpdate(hsv) {
      // if new value specified, update color, otherwise emit update with existing color
      if (hsv) this.color = tinycolor(hsv);
      let format = this.processedFormat.format;

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

    getParent() {
      let parent;

      if (this.appendTo) {
        if (typeof this.appendTo === "string") {
          parent = document.querySelector(this.appendTo);
        } else {
          parent = this.appendTo;
        }
      }

      this.parent = parent || this.$refs.root;
    },

    getBoxRect() {
      this.boxRect = this.parent.getBoundingClientRect();
    }

  },

  created() {
    this.init();
    this.cssVars = {
      "--transparent-pattern": "url(" + transparentPattern + ")"
    };
  },

  mounted() {
    this.getParent();
    this.$emit("mounted");
  },

  beforeUnmount() {
    this.pickEnd();
    this.$emit("beforeUnmount");
  },

  watch: {
    modelValue() {
      let input = typeof this.modelValue === "object" ? JSON.stringify(this.modelValue) : this.modelValue;
      let output = typeof this.output === "object" ? JSON.stringify(this.output) : this.output;

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

    disabled() {
      this.pickEnd();
    },

    processedDisableAlpha(newVal) {
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

    format() {
      this.emitUpdate();
    }

  }
});

const _hoisted_1 = {
  class: "inner transparent"
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_color_picker = resolveComponent("color-picker");

  return openBlock(), createElementBlock("div", {
    class: "color-input user",
    ref: "root",
    style: normalizeStyle(_ctx.cssVars)
  }, [createElementVNode("div", {
    class: normalizeClass(['box', {
      active: _ctx.active,
      disabled: _ctx.disabled
    }]),
    onClick: _cache[0] || (_cache[0] = withModifiers((...args) => _ctx.pickStart && _ctx.pickStart(...args), ["stop"])),
    ref: "box"
  }, [createElementVNode("div", _hoisted_1, [createElementVNode("div", {
    class: "color",
    style: normalizeStyle(_ctx.boxColorStyles)
  }, null, 4)])], 2), _ctx.parent ? (openBlock(), createBlock(Teleport, {
    key: 0,
    to: _ctx.parent
  }, [createVNode(Transition, {
    name: _ctx.transition
  }, {
    default: withCtx(() => [withDirectives(createVNode(_component_color_picker, {
      class: "picker-popup user",
      color: this.color,
      position: _ctx.processedPosition,
      "disable-alpha": _ctx.processedDisableAlpha,
      boxRect: _ctx.boxRect,
      "disable-text-inputs": _ctx.disableTextInputs,
      style: normalizeStyle({
        visibility: _ctx.hidePicker ? 'hidden' : ''
      }),
      onReady: _cache[1] || (_cache[1] = $event => _ctx.hidePicker = false),
      onUpdateColor: _ctx.emitUpdate,
      onHueInputStart: _cache[2] || (_cache[2] = $event => _ctx.$emit('hueInputStart', $event)),
      onHueInputEnd: _cache[3] || (_cache[3] = $event => _ctx.$emit('hueInputEnd', $event)),
      onHueInput: _cache[4] || (_cache[4] = $event => _ctx.$emit('hueInput', $event)),
      onAlphaInputStart: _cache[5] || (_cache[5] = $event => _ctx.$emit('alphaInputStart', $event)),
      onAlphaInputEnd: _cache[6] || (_cache[6] = $event => _ctx.$emit('alphaInputEnd', $event)),
      onAlphaInput: _cache[7] || (_cache[7] = $event => _ctx.$emit('alphaInput', $event)),
      onSaturationInputStart: _cache[8] || (_cache[8] = $event => _ctx.$emit('saturationInputStart', $event)),
      onSaturationInputEnd: _cache[9] || (_cache[9] = $event => _ctx.$emit('saturationInputEnd', $event)),
      onSaturationInput: _cache[10] || (_cache[10] = $event => _ctx.$emit('saturationInput', $event)),
      onChange: _cache[11] || (_cache[11] = $event => _ctx.$emit('change', $event)),
      ref: "picker"
    }, null, 8, ["color", "position", "disable-alpha", "boxRect", "disable-text-inputs", "style", "onUpdateColor"]), [[vShow, _ctx.active]])]),
    _: 1
  }, 8, ["name"])], 8, ["to"])) : createCommentVNode("", true)], 4);
}

var css_248z = ".color-input .box .color, .color-input .box .transparent {\n  width: 100%;\n  height: 100%;\n}\n.color-input {\n  position: relative;\n  display: inline-block;\n}\n.color-input .box {\n  width: 40px;\n  height: 40px;\n  cursor: pointer;\n  border-radius: 20%;\n  overflow: hidden;\n  transition: all 0.2s, background-color 0.05s 0.15s;\n}\n.color-input .box .inner {\n  border-radius: inherit;\n  overflow: hidden;\n  transition: inherit;\n}\n.color-input .box .transparent {\n  background-image: var(--transparent-pattern);\n  background-color: #fff;\n  background-size: 100%;\n}\n.color-input .box.active {\n  background: #fbfbfb;\n  transition: all 0.2s, background-color 0.05s;\n}\n.color-input .box.active .inner {\n  transform: scale(0.9);\n}\n.color-input .box.disabled {\n  cursor: not-allowed;\n}\n.picker-popup {\n  position: absolute;\n  z-index: 9999;\n  width: auto;\n  min-width: 280px;\n  background-color: #fbfbfb;\n  box-shadow: 0px 5px 10px rgba(15, 15, 15, 0.4);\n  margin: 10px;\n  -webkit-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  color: #0f0f0f;\n}\n.picker-popup-enter-from,\n.picker-popup-leave-to {\n  transform: translateY(-10px);\n  opacity: 0;\n}\n.picker-popup-enter-active,\n.picker-popup-leave-active {\n  transition: transform 0.3s, opacity 0.3s;\n}";
styleInject(css_248z);

script.render = render;

// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = script; // Attach install function executed by Vue.use()

  installable.install = app => {
    app.component('ColorInput', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export { entry_esm as default };
