import { ColorConversionHelper } from "./ColorConversions.js";
import { Range, ViewIndex } from "../../../../../Utils.js";
export let ColorPicker = Vue.component("color-picker", {
    template: ViewIndex.getViewSync("color-picker"),
    data: function () {
        return {
            colorData: {
                hue: 20,
                saturation: 100,
                value: 100
            },
            colorReadyData: {
                hsl: null
            },
            selectorData: {
                hold: false
            },
        };
    },
    computed: {},
    methods: {
        sliderValueChanged() {
            let slider = this.$refs.slider;
            let hue_bar = this.$refs.hueSquare;
            let hueInt = parseInt(slider.value);
            hue_bar.style.setProperty("background-color", `hsl(${hueInt},100%,50%)`);
            this.colorChange(hueInt, this.colorData.saturation, this.colorData.value);
        },
        colorChange(h, s, v) {
            this.colorData.hue = h;
            this.colorData.saturation = s;
            this.colorData.value = v;
            let hsvPercent = { h, s, v };
            let hsv = { h, s: s / 100, v: v / 100 };
            //to HSL float Conversion
            let hsl = ColorConversionHelper.hsv2hsl(hsv, this.colorReadyData.hsl);
            this.colorReadyData.hsl = hsl;
            this.$emit("color-selected", { hsv, hsl });
            //document.body.style.setProperty("background-color", `hsl(${hsl.h},${hsl.s * 100 + "%"},${hsl.l * 100 + "%"})`)
            //hsl.s = SL.l && SL.l < 1 ? SB.s * SB.b / (SL.l < 0.5 ? SL.l * 2 : (2 - SL.l)*2) : SL.s;
        },
        selectorOnMsDown(e) {
            this.selectorData.hold = true;
            this.selectorData.positions = { x: e.pageX, y: e.pageY };
        },
        selectorOnMsUp(e) {
            this.selectorData.hold = false;
        },
        selectorMsMove(e) {
            if (this.selectorData.hold) {
                let sel = this.$refs.selector;
                let bck = this.$refs.bck;
                let sel_height_mid = sel.offsetHeight / 2;
                let sel_width_mid = sel.offsetWidth / 2;
                let width = bck.offsetWidth;
                let height = bck.offsetHeight;
                let x = e.target == sel ? e.offsetX + sel.offsetLeft : e.offsetX;
                let y = e.target == sel ? e.offsetY + sel.offsetTop : e.offsetY;
                let saturation = Range.limit(0, x / width, 1) * 100;
                let val = Range.limit(0, 1 - y / height, 1) * 100; //Math.min(1, 1 - y / height) * 100;
                let deltas = {
                    x: e.pageX - this.selectorData.positions.x,
                    y: e.pageY - this.selectorData.positions.y,
                };
                sel.style.setProperty("left", x - sel_width_mid + "px");
                sel.style.setProperty("top", y - sel_height_mid + "px");
                this.colorChange(this.colorData.hue, saturation, val);
            }
        }
    }
});
