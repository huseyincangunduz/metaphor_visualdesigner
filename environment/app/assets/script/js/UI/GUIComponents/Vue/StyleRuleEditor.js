import StyleChanger from "./StyleChanger.js";
import StyleAdder from "./StyleAdder.js";
import { StyleObjectCollector } from "../UIEditIntegrationUtils/StyleArrange.js";
export default Vue.component("style-rule-editor", {
    template: `<div>
                    <h1> {{ elementSelectorText }} </h1>
                            <div v-for="{StyleKey, StyleValue, subModifiers} in styleObject">                          
                                
                            <style-changer 
                                :show-expand-sub-modifier-btn="subModifiers != null && subModifiers.length > 0"
                                    :initialStylekey="StyleKey" 
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
        };
    },
    watch: {
        styleRule() {
            console.info("styleRule değişti");
            if (!this.subModifier)
                this.styleObject = this.StyleObject(this.styleRule);
        }
    },
    methods: {
        showModifier(a) {
            var dizi = this.showingSubModifiers;
            var dizi_index = dizi.indexOf(a);
            if (dizi_index == -1) {
                dizi.push(a);
            }
            else {
                dizi.splice(dizi_index, 1);
            }
        },
        subModifierIsShowing(k) {
            var dizi = this.showingSubModifiers;
            var dizi_index = dizi.indexOf(k);
            return (dizi_index > -1);
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
