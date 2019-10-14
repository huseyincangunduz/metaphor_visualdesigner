import StyleChanger from "./StyleChanger.js";
import StyleAdder from "./StyleAdder.js";
import { TextControlling } from "../../../InternalVisualDesigner/Utils.js";
class StyleOverrideManager {
    static modifiersHash = {};

    static mainModifiers = {
        "background": [
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
        ], "padding": [
            "padding-left",
            "padding-top",
            "padding-right",
            "padding-bottom"
        ],
        "border-radius": [
            "border-top-left-radius",
            "border-top-right-radius",
            "border-bottom-right-radius",
            "border-bottom-left-radius"
        ], "border": [
            "border-top-color",
            "border-top-style",
            "border-top-width",
            "border-right-color",
            "border-right-style",
            "border-right-width",
            "border-bottom-color",
            "border-bottom-style",
            "border-bottom-width",
            "border-left-color",
            "border-left-style",
            "border-left-width",
            "border-image-outset",
            "border-image-repeat",
            "border-image-slice",
            "border-image-source",
            "border-image-width",
        ],
        // font:
        // [
        //     "font-size"
        // ],
        "margin": [
            "margin-top",
            "margin-bottom",
            "margin-left",
            "margin-right"
        ],
        "overflow": [
            "overflow-x",
            "overflow-y"
        ],

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
class StyleObject {
    constructor(stylekey_, styleval_) {
        this.StyleKey = stylekey_;
        this.StyleValue = styleval_;
        this.subModifiers = [];

    }
    StyleKey: string;
    StyleValue: string;
    subModifiers: Array<StyleObject>;

}

class StyleObjectCollector {


    public styleObjects: Array<StyleObject> = [];
    public keys: Array<string> = [];
    points = {};
    public transferFromStyleDecleration(relatedStyleDecleration: CSSStyleDeclaration) {
        for (let i = 0; i < relatedStyleDecleration.length; i++) {
            const styleKey = relatedStyleDecleration[i],
                styleVal = relatedStyleDecleration[styleKey];

            this.insertKey(relatedStyleDecleration, styleKey, styleVal);

        }
    }
    addToArrays(stl_object: StyleObject) {
        let key = stl_object.StyleKey;

        this.styleObjects.push(stl_object);
        this.keys.push(key);

        this.points[key] = stl_object;
    }
    addToArrayAsSubModifier(mainMod: any, key: string, value: string) {
        this.points[mainMod].subModifiers.push(new StyleObject(key, value));
    }
    public insertKey(relatedStyleDecleration: CSSStyleDeclaration, key: string, value: string) {
        let mainMod = StyleOverrideManager.getMainModifier(key);
        if (mainMod == false || TextControlling.isEmpty(relatedStyleDecleration[mainMod])) {

            let value = relatedStyleDecleration[key];
            let stl_object = new StyleObject(key, value);
            this.addToArrays(stl_object);

        }
        else {
            if (this.keys.indexOf(mainMod) == -1) {
                let stl_object = new StyleObject(mainMod, relatedStyleDecleration[mainMod]);
                this.addToArrays(stl_object);
            }
            this.addToArrayAsSubModifier(mainMod, key, value);

        }
    }


}



export default Vue.component("style-rule-editing-component", {
    template: `<div>
                    <h1> {{ elementSelectorText }} </h1>
                            <div v-for="{StyleKey, StyleValue, subModifiers} in styleObject">                          
                                <style-changer  :initialStylekey="StyleKey" 
                                    :initialStyleval="StyleValue" 
                                    :key="StyleKey"
                                     @style-changed="styleIsChanged" @style-removed="styleIsRemoved"
                                    at_style-change-cancellation="styleChangingCancelled"
                                    @click="() => showModifier(StyleKey)">
                                </style-changer>

                                <div v-if="subModifiers != null && subModifiers.length > 0" 
                                v-show="subModifierIsShowing(StyleKey)">
                                    <div v-for="{StyleKey, StyleValue} in subModifiers">                          
                                        <style-changer :is-sub-modifier="true" :initialStylekey="StyleKey" 
                                            :initialStyleval="StyleValue" 
                                            :key="StyleKey" @style-changed="styleIsChanged" @style-removed="styleIsRemoved"
                                            at_style-change-cancellation="styleChangingCancelled">
                                        </style-changer>
                                    </div>
                                </div>

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
            elementSelectorText: "*",
            showingSubModifiers: []

        }
    },
    watch: {
        styleRule() {
            console.info("styleRule değişti")
            if (!this.subModifier) this.styleObject = this.StyleObject(this.styleRule);
        }
    },
    methods: {
        
        showModifier(a) {
            var dizi : Array<string> = this.showingSubModifiers;
            var dizi_index = dizi.indexOf(a);
            if (dizi_index == -1)
            {
                dizi.push(a);
            }
            else
            {
                dizi.splice(dizi_index,1);
            }

        },
        subModifierIsShowing(k)
        {
            var dizi : Array<string> = this.showingSubModifiers;
            var dizi_index = dizi.indexOf(k);
            return (dizi_index > -1)
        },
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

            let styleCollection = new StyleObjectCollector();
            styleCollection.transferFromStyleDecleration(stl);
            return styleCollection.styleObjects;
        }, updateStyles() {
            this.styleObject = this.StyleObject(this.styleRule);

        },
        updateSelectedElementInfo() {
            this.updateStyles();
        }

    }



});
