import StyleChanger from "./StyleChanger.js";
import StyleAdder from "./StyleAdder.js";
class StyleObject {
    constructor(stylekey_, styleval_) {
        this.StyleKey = stylekey_;
        this.StyleValue = styleval_;
    }
}
class StyleObjectGroup {
}
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
                            <style-adder @style-added="styleIsAdded" />
                </div>`,
    components: { StyleChanger, StyleAdder },
    data: function () {
        return {
            editingPivotElement: null,
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
        styleIsAdded(data) {
            // var this.editingPivotElement : 
            let styleVal = data.styleVal;
            if (this.editingPivotElement != null && styleVal != "initial") {
                var iframeWin = this.editingPivotElement.ownerDocument.defaultView;
                var computedStyle = iframeWin.getComputedStyle(this.editingPivotElement);
                styleVal = computedStyle[data.styleKey] ? computedStyle[data.styleKey] : styleVal;
            }
            console.info({ type: "styleIsAdded", data });
            this.styleRule.setProperty(data.styleKey, styleVal);
            //Vue.set(this.styleRule, data.styleKey, data.styleVal);
            this.updateStyles();
            data.component.styleVal = data.styleVal;
        },
        StyleObject(stl) {
            console.info("styleObject çalışıyor");
            //let stl = this.styleRule;
            let obj = [];
            for (let key_index = 0; key_index < stl.length; key_index++) {
                const key = stl[key_index];
                let value = stl[key];
                obj.push(new StyleObject(key, value));
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
