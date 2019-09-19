import { InternalVisualDesigner } from "../../InternalVisualDesigner/InternalVisualDesigner.js";
import { StyleRuleState } from "../../InternalVisualDesigner/StyleOtomator.js";
var StyleAdder = Vue.component("style-adder", {
    template: `
        <div class="card style-rule" :style="{backgroundColor: color}">
            <div>
                <div v-show="editingMode">
                    <span>
                        <span class="btn" @click="addStyle">Add</span>
                        <span ref="styleKeyTextSpan" class="style-rule-code style-value style-value-edit" contentEditable="true" @blur="lostFocusWithoutStyleApply" @keydown="valueKeyDown"></span>
                    </span>    
                </div>
                <div v-show="!editingMode">
                    <span>                       
                        <span style="min-width: 200px; font-style: oblique" v-show="!editingMode" @click="enterEditing" @keydown="enterEditing">Type style key for add</span>
                    </span>
        
                </div>
            </div>
        </div>`,
    data: function () {
        return {
            color: "green",
            editingMode: false,
        };
    },
    methods: {
        addStyle() {
            this.$emit("style-added", {
                styleKey: this.$refs.styleKeyTextSpan.innerText,
                styleVal: "inherit",
                component: this
            });
            this.editingMode = false;
        },
        enterEditing(e) {
            this.editingMode = true;
            this.$refs.styleKeyTextSpan.focus();
            console.info(e);
        },
        lostFocusWithoutStyleApply(e) {
            this.editingMode = false;
        },
        valueKeyDown(e /*: KeyboardEvent*/) {
            if (e.keyCode == 13) /*enter*/ {
                this.addStyle();
                // console.info("enter")
                e.preventDefault();
            } /* esc */
            else if (e.keyCode == 27) {
                this.lostFocusWithoutStyleApply(e);
                console.info("Değişim iptali: " + this.styleValue);
            }
        }
    }
});
var StyleChanger = Vue.component("style-changer", {
    template: `<div>
                        <div class="card style-rule" :style="{backgroundColor: color}">
                                <div>
                                    <span class="btn" @click ="removeStyle">Remove</span>
                                    <span class="style-rule-code">
                                        <span>
                                            <span class="style-modifier">{{styleKey}}</span>: 
                                            <span v-show="editingMode" ref="valueInputElement" contentEditable="true" class="style-value style-value-edit"  @blur="lostFocusWithoutStyleApply" @keydown="valueKeyDown">{{styleValue}}</span> 
                                            <span v-show="!editingMode" class="style-value"  @dblclick="valueDoubleClick">{{styleValue}}</span>
                                            <span>;</span>       
                                        </span>                                  
                                    </span>
                            </div>
                        </div> 
                    </div>`,
    props: {
        color: {
            type: String,
            default: "gray",
        },
        initialStylekey: {
            type: String,
            required: true,
        },
        initialStyleval: {
            type: String,
            required: true
        }
    },
    watch: /*değişiklikleri inceleme*/ {
        initialStylekey() {
            this.styleKey = this.initialStylekey;
        },
        initialStyleval() {
            this.styleValue = this.initialStyleval;
        },
        editingMode() {
            this.$refs.valueInputElement.innerText = this.styleValue;
            //console.info("Düzenleme modu değişti");
        }
    },
    data: function () {
        return {
            editingMode: false,
            styleKey: this.initialStylekey,
            styleValue: this.initialStyleval
        };
    },
    methods: {
        removeStyle(e) {
            console.info("remove style");
            this.$emit("style-removed", {
                styleKey: this.styleKey,
                styleVal: this.styleValue,
                component: this
            });
        },
        valueDoubleClick(e) {
            e.preventDefault();
            this.editingMode = true;
        },
        lostFocusWithoutStyleApply(e) {
            this.editingMode = false;
        },
        valueKeyDown(e /*: KeyboardEvent*/) {
            if (e.keyCode == 13) /*enter*/ {
                this.$emit("style-changed", {
                    styleKey: this.styleKey,
                    styleOldVal: this.styleValue,
                    styleVal: e.target.innerText,
                    component: this
                });
                this.styleValue = e.target.innerText;
                this.editingMode = false;
                // console.info("enter")
                e.preventDefault();
            } /* esc */
            else if (e.keyCode == 27) {
                this.lostFocusWithoutStyleApply(e);
                console.info("Değişim iptali: " + this.styleValue);
            }
        }
    }
});
var StylesComponent = Vue.component("style-rule-editing-component", {
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
var InternalVisualDesignerComponent = Vue.component("internal-visual-designer", {
    template: `<div ref="ivsRootEl"> </div>`,
    props: {
        initialSrc: String
    },
    data() {
        return {
            _src: this.initialSrc,
            _rootElement: document.createElement("div"),
            internalVisualDesigner: null
        };
    },
    mounted() {
        console.info(this.$refs.ivsRootEl);
        let ivd = InternalVisualDesigner.createByDivAndCreate(this.$refs.ivsRootEl, this, this.$data._src);
        //
        var select = (element, pivot) => {
            let rule = ivd.styleOtomation.findRule(pivot, null, StyleRuleState.normal);
            this.elementSelection(element, pivot, rule);
        };
        var update = (element, pivot) => {
            //let rule = ivd.styleOtomation.findRule(pivot,null,StyleRuleState.normal);
            this.selectedElementUpdate();
        };
        ivd.eventHandlerSetters.onSelected(select);
        ivd.eventHandlerSetters.onMoved(update);
        ivd.eventHandlerSetters.onResized(update);
        this.internalVisualDesigner = ivd;
    },
    methods: {
        elementSelection(element, pivot, rule) {
            this.$emit("element-selected", element, pivot, rule);
        },
        selectedElementUpdate() {
            this.$emit("element-updated");
        }
        //elementUpdated
    }
});
let VisualDesignerEnvironment = Vue.component("visual-designer", {
    template: `    
        <div class="metaphor-designer-root">
          <div class="metaphor-designer" :right-panel-visible="rightPanelVisibility">
            <div ref="uiContentAreaContainer" class="internal-designer-area">
                <internal-visual-designer ref="ivsComponent" @element-selected="onElementSelected" @element-updated="onElementUpdated" initialSrc="../editortests/anchoring.html"/>
            </div>
            <div ref="uiRightPanelContainer" class="right-panel">
            <style-rule-editing-component ref="elementSelectionEditor"/>
            </div>
          </div>
        </div>`,
    components: {
        InternalVisualDesignerComponent
    },
    data() {
        return {
            rightPanelVisibility: false
        };
    },
    watch: {},
    methods: {
        updateGUIChilds(containerElement, guiContentElement) {
            while (containerElement.childElementCount > 0) {
                containerElement.removeChild(containerElement.childElementCount - 1);
            }
            containerElement.appendChild(guiContentElement);
        },
        onElementSelected(element, pivot, ruleStyle) {
            console.info(element, pivot, ruleStyle);
            this.$refs.elementSelectionEditor.styleRule = ruleStyle.style;
            this.$refs.elementSelectionEditor.elementSelectorText = pivot.tagName + "#" + pivot.id;
            console.info({ ruleStyle });
        },
        onElementUpdated() {
            this.$refs.elementSelectionEditor.updateSelectedElementInfo();
        }
    }
});
//@ts-ignorets
window.Morphosium = {
    Metaphor: {
        Components: {
            StyleAdder, StyleChanger, StylesComponent, InternalVisualDesignerComponent, VisualDesignerEnvironment
        }
    }
};
