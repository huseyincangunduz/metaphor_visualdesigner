export default Vue.component("style-adder", {
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
