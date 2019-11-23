import { UnitTester } from "./AncientCreature/TestCore.js";
import { ColorConversionHelper, HSL, HSV } from "../UI/GUIComponents/Vue/StyleSetters/ColorSetter/ColorConversions.js";
import { TextControlling } from "../Utils.js";



let allTests = [
    function () {
        return UnitTester.test(
            "HSV(204°, 86%, 27%)'yı hsl dönüşümü 204°, 75%, 15% olmalı",
            { h: 204, s: 0.75, l: 0.15 },

            function init() {
                let inputColorObj: HSV = { h: 204, s: 0.86, v: 0.27 };
                return { inputColorObj };
            },
            function run() {

                return ColorConversionHelper.hsv2hsl(this.inputColorObj);
            },

            function assert(outputColor: HSL, excepted) {
                return outputColor.h == 204 && outputColor.s == 0.75 && outputColor.l == 0.15;
            }, null);

    },
    function () {
        let str = "mehmet";
        return UnitTester.test(
            "'Mehmet' stringinin dolu dönmesi gerek",
            true,

            function init() {
              
                return {  };
            },
            function run() {

                return TextControlling.isNotEmpty(str);
            },

            function assert(out, expected) {
                return out == expected;
            }, null);
    },
    function () {
        let str = "";
        return UnitTester.test(
            "boş stringinin boş  dönmesi gerek",
            true,

            function init() {
              
                return {  };
            },
            function run() {

                return TextControlling.isEmpty(str);
            },

            function assert(out, expected) {
                return out == expected;
            }, null);
    },
]

let testAll = function()
{
    return allTests.map((f) => {return f()});
    
}

window["testAll"] = testAll;