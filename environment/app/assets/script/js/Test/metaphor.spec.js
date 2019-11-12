import { UnitTester } from "./AncientCreature/TestCore.js";
import { ColorConversionHelper } from "../UI/GUIComponents/Vue/StyleSetters/ColorSetter/ColorConversions.js";
var testFunction = window["testFunction"] =
    function () {
        let testResult = UnitTester.test("HSV(204°, 86%, 27%)'yı hsl dönüşümü 204°, 75%, 15% olmalı", { h: 204, s: 0.75, l: 0.15 }, function init() {
            let inputColorObj = { h: 204, s: 0.86, v: 0.27 };
            return { inputColorObj };
        }, function run() {
            return ColorConversionHelper.hsv2hsl(this.inputColorObj);
        }, function assert(outputColor, excepted) {
            return outputColor.h == 204 && outputColor.s == 0.75 && outputColor.l == 0.15;
        }, null);
        return testResult;
    };
