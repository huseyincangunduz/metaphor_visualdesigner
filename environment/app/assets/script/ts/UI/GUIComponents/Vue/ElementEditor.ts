import { ViewIndex } from "../../../Utils.js";

export default Vue.component("element-editor",
{
    template: ViewIndex.getViewSync("element-editor"),
    data: function()
    {
        return {
            editingPivotElement: null,
            //Besleme verileri
            styleRule: null,
            
        }
    },
    computed:{
        elementSelectorText()
        {
            let el : HTMLElement = this.editingPivotElement;
            
            return el ?  el.tagName + "#" + el.id : "Not selected!";
            
        }
    },
    watch: {
        styleRule() {
            this.$refs.styleEditor.styleRule = this.styleRule;
            
        },
        editingPivotElement()
        {
            this.$refs.styleEditor.editingPivotElement = this.editingPivotElement;
        }
    },
    methods: {
        refreshStyleRule()
        {
            this.$refs.styleEditor.updateSelectedElementInfo();
        },
        sendChanges(data: GenericObject<any>)
        {
            if (data.editingPivotElement) this.editingPivotElement = data.editingPivotElement;
            this.styleRule = data["styleRule"]
        
            return;

        }
    }
});