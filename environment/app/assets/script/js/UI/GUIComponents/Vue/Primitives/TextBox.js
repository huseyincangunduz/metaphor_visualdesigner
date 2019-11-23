import { ViewIndex } from "../../../../Utils.js";
export default Vue.component("text-box", {
    template: ViewIndex.getViewSync("text-box"),
    props: {
        initialText: { type: String, default: "Text" },
        initialPlaceholder: { type: String, default: "" },
        initialChangeByPressEnter: { type: Boolean, default: false }
    },
    data: function () {
        return {
            text: this.initialText,
            placeHolder: this.initialPlaceholder,
            changeByPressEnter: this.initialChangeByPressEnter
        };
    },
    watch: {
        initialText(newVal) {
            this.text = newVal;
            this.dipper;
        },
        text(newText, oldText) {
            this.$emit("textchanged", newText, oldText);
            this.setInputWidth();
        }
        // contentEditable(newVal, oldVal)
        // {
        //     this.setTextBoxMinWidth();
        //     console.info({oldVal, newVal});
        // }
    }, mounted() {
        this.setInputWidth();
    },
    methods: {
        //EMITS: OnTextChanged, OnTextChangeCancelled, KeyDown, KeyUp
        //FUNS
        setTextBoxMinWidth() {
            let editingSpan = this.$refs.textEditSpan;
            if (editingSpan != null) {
                if (this.contentEditable) {
                    editingSpan.styles.minHeight = getComputedStyle(editingSpan).fontSize;
                }
                else {
                    editingSpan.styles.minHeight = null;
                }
            }
        },
        setText(newText) {
            this.text = newText;
            //Artık text değiştiğinde otomatik olark emitleniyor. this.emit burada yok
            //this.$emit("textchanged", newText, oldText);
        },
        //EVENTS
        lostFocus(e) {
            e.target.value = this.text;
            // this.exitTextEditing();
        },
        onKeyDown: function (e) {
            let target;
            if (e.target instanceof HTMLInputElement) {
                target = e.target;
                let oldText = this.text;
                if (this.changeByPressEnter) {
                    if (e.keyCode == 13) {
                        this.setText(target.value);
                        this.$emit("user-textchanged", this.text, oldText);
                    }
                    else if (e.keyCode == 27) {
                        target.value = this.text;
                    }
                }
                else {
                    this.$emit("user-textchanged", this.text, oldText);
                    this.setInputWidth();
                }
            }
        },
        setInputWidth() {
            let target = this.$refs.inp;
            target.size = 1 + (target.value.length > 5 ? target.value.length : 5);
        },
        onDoubleClick: function (e) {
            this.contentEditable = true;
            this.setTextBoxMinWidth();
            //this.$refs.textEditSpan.focus();
            e.preventDefault();
        },
        onFocusLost(e) {
            // this.exitTextEditing();
        }
    }
});
