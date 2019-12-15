import InternalVisualDesignerComponent from "./InternalVisualDesignerView.js";
import { ViewIndex } from "../../../Utils.js";
import { InternalVisualDesigner } from "../../../InternalVisualDesigner/InternalVisualDesigner.js";
export default Vue.component("visual-designer", {
    template:
       ViewIndex.getViewSync("visual-designer-environment"),
    components: {
        InternalVisualDesignerComponent
    },
    data() {
        return {
            rightPanelVisibility: false,
            internalVisualDesigner: null,
            pageCore: null
        };
    },
    // computed:{
    //     pageCore(){
    //         const  ivd : InternalVisualDesigner = this.internalVisualDesigner;
    //         return ivd ? ivd.pageCore : null;
    //     }
    // },
    watch: {

    },
    methods: {
        toggleOptionsToggleBtnClicked() {
            this.rightPanelVisibility = !this.rightPanelVisibility;
        },
        updateGUIChilds(containerElement, guiContentElement: HTMLElement) {
            while (containerElement.childElementCount > 0) {
                containerElement.removeChild(containerElement.childElementCount - 1);
            }
            containerElement.appendChild(guiContentElement);
        },
        onElementSelected(element: Array<HTMLElement>, pivot: HTMLElement, styleRule) {
            console.info(element, pivot, styleRule);
            this.$refs.elementEditor.sendChanges({
                editingPivotElement: pivot,
                styleRule: styleRule.style,
                elementSelectorText :pivot.tagName + "#" + pivot.id
            })
            
        },
        onElementUpdated() {

            this.$refs.elementEditor.refreshStyleRule();
        },
        registerInternalVisualDesigner(ivd : InternalVisualDesigner)
        {
            this.InternalVisualDesigner = ivd;
            this.$refs.elementEditor.setInternalVisualDesigner(ivd);
            this.$refs.pageEditor.setPageCore(ivd.pageCore);
       
        }
        
    }
});

