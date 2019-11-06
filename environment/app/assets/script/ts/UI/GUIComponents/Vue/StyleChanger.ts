import { StyleSetterComponents } from "../UIEditIntegrationUtils/StyleSetterDefinitions.js";
import { ViewIndex } from "../../../Utils.js";

export default Vue.component("style-changer",
    {
        template: 
        ViewIndex.getViewSync("style-changer"),
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
            },
            isSubModifier: {
                type: Boolean,
                default: false
            },
            showExpandSubModifierBtn: {
                type: Boolean,
                default: false
            }
        },
        watch: /*değişiklikleri inceleme*/{
            initialStylekey() {
                this.styleKey = this.initialStylekey;
            },
            initialStyleval() {
                this.styleValue = this.initialStyleval;
            },
            editingMode() {
                this.$refs.valueInputElement.innerText = this.styleValue;
                //console.info("Düzenleme modu değişti");
            },

        },
        data: function () {
            return {
                editingMode: false,
                styleKey: this.initialStylekey,
                styleValue: this.initialStyleval,

            }
        },
        methods: {
            styleUISet(key,val)
            {
                this.valueChanged(val);
            },
            determineStyleSetter()
            {
                return StyleSetterComponents[this.styleKey] ? StyleSetterComponents[this.styleKey]  : "default"
            },
            valueChanged: function (newText) {
                this.$emit("style-changed", {
                    styleKey: this.styleKey,
                    styleOldVal: this.styleValue,
                    styleVal: newText,
                    component: this
                });
            },
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
            cardOnClick() {
                this.$emit("click")
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
                    console.info("Değişim iptali: " + this.styleValue)
                }
            }
        }

    }
);
