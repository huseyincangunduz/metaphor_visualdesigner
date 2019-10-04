import StyleChanger from "./StyleChanger.js";
import StyleAdder from "./StyleAdder.js";
export default Vue.component("style-rule-editing-component", {
    template: `<div>
                    <h1> {{ elementSelectorText }} </h1>
                            <div v-for="{StyleKey, StyleValue} in styleObject">                          
                                <style-changer  :initialStylekey="StyleKey" 
                                    :initialStyleval="StyleValue" 
                                    :key="StyleKey" @style-changed="styleIsChanged" @style-removed="styleIsRemoved"
                                    at_style-change-cancellation="styleChangingCancelled">
                                </style-changer>
                            </div>
                            <style-adder @style-added="styleIsChanged" />
                </div>`,
    components: { StyleChanger, StyleAdder },
    data: function () {
        return {
            //@ts-ignore
            styleRule: null,
            //@ts-ignore
            styleObject: null,
            elementSelectorText: "*"
        };
    },
    methods: {
        styleIsRemoved(data) {
            Vue.set(this.styleRule, data.styleKey, null);
            this.updateStyles();
            console.info("stylescomponent stil kaldırma");
        },
        styleIsChanged(data) {
            console.info({ type: "styleIsChanged", data });
            this.styleRule.setProperty(data.styleKey, data.styleVal);
            //Vue.set(this.styleRule, data.styleKey, data.styleVal);
            this.updateStyles();
            data.component.styleVal = data.styleVal;
        },
        StyleObject(stl) {
            console.info("styleObject çalışıyor");
            //let stl = this.styleRule;
            let obj = [];
            for (let index = 0; index < stl.length; index++) {
                const key = stl[index];
                obj.push({ StyleKey: key, StyleValue: stl[key] });
            }
            return obj;
        }, updateStyles() {
            this.styleObject = this.StyleObject(this.styleRule);
        },
        updateSelectedElementInfo() {
            this.updateStyles();
        }
    },
    watch: {
        styleRule() {
            console.info("styleRule değişti");
            this.styleObject = this.StyleObject(this.styleRule);
        }
    },
});
