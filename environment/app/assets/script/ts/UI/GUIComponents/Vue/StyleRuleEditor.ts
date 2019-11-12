import StyleChanger from "./StyleChanger.js";
import StyleAdder from "./StyleAdder.js";
import { TextControlling, ViewIndex } from "../../../Utils.js";
import { StyleObjectCollector, StyleOverrideManager, StyleObject } from "../UIEditIntegrationUtils/StyleArrange.js";



export default Vue.component("style-rule-editor", {
    template: ViewIndex.getViewSync("style-rule-editor"),
    components: { StyleChanger, StyleAdder },
    data: function () {
        return {
            editingPivotElement: null,
            //@ts-ignore
            styleRule: null,

            elementSelectorText: "*",
            showingSubModifiers: [],
            styleCollection: new StyleObjectCollector()
        }
    },
    watch: {
        styleRule() {
            console.info("styleRule değişti")
            if (!this.subModifier) 
                this.refreshStyles();
        }
    },
    methods: {
        
        showModifier(a: string) {
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
            this.refreshStyles();
            console.info("stylescomponent stil kaldırma");
        },
        styleIsChanged(data : { styleKey, styleVal,component }) {
            console.info({ type: "styleIsChanged", data });
            this.styleRule.setProperty(data.styleKey, data.styleVal);
            //Vue.set(this.styleRule, data.styleKey, data.styleVal);
            var styleCollection : StyleObjectCollector = this.styleCollection;
            styleCollection.points[data.styleKey].StyleValue = data.styleVal
            //this.styleCollection.
            //this.refreshStyles();
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
            this.refreshStyles();
            data.component.styleVal = data.styleVal
        },
        refreshStyles() {
            this.StyleObject(this.styleRule);

        },
        updateSelectedElementInfo() {
            this.refreshStyles();
        },
        StyleObject(stl) {

            this.styleCollection = new StyleObjectCollector();
            this.styleCollection.transferFromStyleDecleration(stl);
            //return this.styleCollection.styleObjects;
        }, 

    }



});
