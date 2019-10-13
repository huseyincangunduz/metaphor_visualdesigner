import StyleChanger from "./StyleChanger.js";
import StyleAdder from "./StyleAdder.js";
import { TextControlling } from "../../../InternalVisualDesigner/Utils.js";

class StyleObject {
    constructor(stylekey_, styleval_) {
        this.StyleKey = stylekey_;
        this.StyleValue = styleval_;
    }
    StyleKey: string;
    StyleValue: string;
}

class StyleObjectGroup {
    mainStyleKey: string;
    mainStyleValue: string;
    styleModifiers: Array<StyleObject>;

}

class StyleOverrideManager {
    static modifiersHash = {};

    static mainModifiers = {
        background: [
            "background-image",
            "background-position-x",
            "background-position-y",
            "background-size",
            "background-repeat-x",
            "background-repeat-y",
            "background-attachment",
            "background-origin",
            "background-clip",
            "background-color",
        ],
         // font:
        // [
        //     "font-size"
        // ],
        margin:[
            "margin-top",
            "margin-bottom",
            "margin-left",
            "margin-right"
        ],
        // overflow: [
        //     "overflow-x",
        //     "overflow-y"
        // ]
    }
    static initialized: boolean = false;

    public static getMainModifier(styleKey: string) {
        this.initialize();
        let k1 = this.modifiersHash[styleKey];
        if (k1) {
            let k2 = this.modifiersHash[k1]
            return k2 ? k1 : false;
        }
    }
    protected static initialize() {
        if (!this.initialized) {
            let hash = this.modifiersHash;
            let keys = Object.keys(this.mainModifiers);
            //TODO: For yerine hazır fonksiyonları incele ve varsa onlara uyarla
            for (let index = 0; index < keys.length; index++) {
                const mainModifNm = keys[index];
                const subModifiersArray = this.mainModifiers[mainModifNm];
                hash[mainModifNm] = subModifiersArray;
                for (let j = 0; j < subModifiersArray.length; j++) {
                    const subModifier = subModifiersArray[j];
                    hash[subModifier] = mainModifNm;
                }
            }
            this.initialized = true;
        }

    }


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

        }
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
            data.component.styleVal = data.styleVal
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
            data.component.styleVal = data.styleVal
        },
        StyleObject(stl) {
            console.info("styleObject çalışıyor");
            //let stl = this.styleRule;

            let obj = [];
            let addedKeys = [];
            for (let key_index = 0; key_index < stl.length; key_index++) {
                const key = stl[key_index];
                let mainMod = StyleOverrideManager.getMainModifier(key);

                if (mainMod == false || TextControlling.isEmpty(stl[mainMod])) {

                    let value = stl[key];

                    obj.push(new StyleObject(key, value));
                    addedKeys.push(key);
                }
                else {
                    if (addedKeys.indexOf(mainMod) == -1) {
                        obj.push(new StyleObject(mainMod, stl[mainMod]));
                        addedKeys.push(mainMod);
                    }
                }


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
            console.info("styleRule değişti")
            this.styleObject = this.StyleObject(this.styleRule);
        }
    },


});
