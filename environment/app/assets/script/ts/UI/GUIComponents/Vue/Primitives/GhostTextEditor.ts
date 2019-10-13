export default Vue.component("ghost-text-box", {
    template:
        `
<span class="ghost-text-box">

    <span v-show="!contentEditable" @dblclick="onDoubleClick">
        <span v-if="!text && !contentEditable" style="opacity: .6"> {{ placeholder }}</span>
        <span v-show="text">{{ text }}</span>
    
    </span>
    
    <span ref="textEditSpan" class="text-editing-area" v-if="contentEditable" 
                contenteditable="true" 
                @keydown="onKeyDown" @blur="onFocusLost">{{ text }}</span>
                <span v-if="!text && !contentEditable" style="opacity: .6" @blur="lostFocus"> {{ placeholder }}</span>
    </span>
</span>

`,
    props: {
        initialText: { type: String, default: "Text" },
        initialPlaceholder: { type: String, default: "" }
    },
    data: function () {
        return {
            text: this.initialText,
            placeHolder: this.initialPlaceholder,
            contentEditable: false
        }
    },
    watch:
    {
        initialText(newVal) {
            this.text = newVal;
        }
        // contentEditable(newVal, oldVal)
        // {
        //     this.setTextBoxMinWidth();
        //     console.info({oldVal, newVal});
        // }
    },
    methods:
    {
        loadtextEditSpan : function(d)
        {
            alert(d);
        },
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
            //console.info("text is changed: " + this.text);

            this.contentEditable = false;
        },
        setText(newText) {
            let oldText = this.text;

            this.text = newText;
            this.$emit("textchanged", newText, oldText);
        },
        //EVENTS
        lostFocus()
        {
         this.exitTextEditing();   
        }
        ,

        onKeyDown: function (e/* : KeyboardEvent*/) {
            if (e.keyCode == 13) {
                this.setText(e.target.innerText);
                this.exitTextEditing();
            }
            else if (e.keyCode == 27) {

                this.exitTextEditing();

            }
        },
        onDoubleClick: function (e : MouseEvent) {
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
