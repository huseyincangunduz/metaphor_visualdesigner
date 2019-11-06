import { StyleSetterComponents } from "../UIEditIntegrationUtils/StyleSetterDefinitions.js";
import { ViewIndex } from "../../../Utils.js";

export default Vue.component("style-adder",
    {
        template: ViewIndex.getViewSync("style-adder"),

            data: function()
            {
                return {
                    color: "green",
                    editingMode: false,
                }
            },
            methods:
            {
   
                addStyle()
                {
                
                    this.$emit("style-added", {
                        styleKey: this.$refs.styleKeyTextSpan.innerText,
                        styleVal: "inherit",
                        component: this
                    });

                    this.editingMode = false;
                },
                enterEditing(e)
                {
                    this.editingMode = true 
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
                        console.info("Değişim iptali: " + this.styleValue)
                    }
                }
            }
    }
    
    )