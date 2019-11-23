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
            rightPanelVisibility: false

        };
    },
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
        onElementSelected(element: Array<HTMLElement>, pivot: HTMLElement, ruleStyle) {
            console.info(element, pivot, ruleStyle);
            this.$refs.elementEditor.sendChanges({
                editingPivotElement: pivot,
                styleRule: ruleStyle.style,
                elementSelectorText :pivot.tagName + "#" + pivot.id
            })
            console.info({ ruleStyle });
        },
        onElementUpdated() {

            this.$refs.elementEditor.refreshStyleRule();
        },
        registerInternalVisualDesigner(ivd : InternalVisualDesigner)
        {
            this.InternalVisualDesigner = ivd;
            this.$refs.elementEditor.setInternalVisualDesigner(ivd);
        }
        
    }
});

