import { ViewIndex } from "../../../../Utils.js";

export default Vue.component("text-box", {
    template: ViewIndex.getViewSync("text-box"),
    props: {
        initialText: { type: String, default: "Text" },
        initialPlaceholder: { type: String, default: "" },
        initialChangeToPressEnter: { type: Boolean, default: false }
    },
    data: function () {
        return {
            text: this.initialText,
            placeHolder: this.initialPlaceholder,
            changeToPressEnter: this.initialChangeToPressEnter
        }
    },
    watch:
    {
        initialText(newVal) {
            this.text = newVal;
        },
        text(newText: string, oldText: string) {
            this.$emit("textchanged", newText, oldText);
        }
        // contentEditable(newVal, oldVal)
        // {
        //     this.setTextBoxMinWidth();
        //     console.info({oldVal, newVal});
        // }
    }, mounted()
    {
        this.setInputWidth();
    },
    
    
    
    methods:
    {
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
        exitTextEditing() {

        },
        setText(newText) {


            this.text = newText;
            //Artık text değiştiğinde otomatik olark emitleniyor. this.emit burada yok
            //this.$emit("textchanged", newText, oldText);
        },
        //EVENTS
        lostFocus(e) {
            e.target.value = this.text;
            this.exitTextEditing();
        }
        ,

        onKeyDown: function (e: KeyboardEvent) {
            let target: HTMLInputElement;
            if (e.target instanceof HTMLInputElement) {
                target = e.target;
                if (e.keyCode == 13) {

                    this.setText(target.value);
                    this.exitTextEditing();
                }
                else if (e.keyCode == 27) {
                    target.value = this.text;
                    this.exitTextEditing();

                }
                this.setInputWidth();
                
            }

        },
        setInputWidth() {
            let target = this.$refs.inp;
            target.size = 1 + (target.value.length > 5 ? target.value.length : 5)
        }
        ,
        onDoubleClick: function (e: MouseEvent) {
            this.contentEditable = true;
            this.setTextBoxMinWidth();

            //this.$refs.textEditSpan.focus();
            e.preventDefault();
        },
        onFocusLost(e) {
            this.exitTextEditing();
        }
    }
});
