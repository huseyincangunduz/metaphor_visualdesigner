export default Vue.component("style-changer",
    {
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
            }
        },
        data: function () {
            return {
                editingMode: false,
                styleKey: this.initialStylekey,
                styleValue: this.initialStyleval
            }
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
                    console.info("Değişim iptali: " + this.styleValue)
                }
            }
        }

    }
);
