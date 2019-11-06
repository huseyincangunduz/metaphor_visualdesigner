import InternalVisualDesignerComponent from "./InternalVisualDesigner.js";
import { ViewIndex } from "../../../Utils.js";
export default Vue.component("visual-designer", {
    template: ViewIndex.getViewSync("visual-designer-environment"),
    components: {
        InternalVisualDesignerComponent
    },
    data() {
        return {
            rightPanelVisibility: false
        };
    },
    watch: {},
    methods: {
        toggleOptionsToggleBtnClicked() {
            this.rightPanelVisibility = !this.rightPanelVisibility;
        },
        updateGUIChilds(containerElement, guiContentElement) {
            while (containerElement.childElementCount > 0) {
                containerElement.removeChild(containerElement.childElementCount - 1);
            }
            containerElement.appendChild(guiContentElement);
        },
        onElementSelected(element, pivot, ruleStyle) {
            console.info(element, pivot, ruleStyle);
            this.$refs.elementEditor.sendChanges({
                editingPivotElement: pivot,
                styleRule: ruleStyle.style,
                elementSelectorText: pivot.tagName + "#" + pivot.id
            });
            console.info({ ruleStyle });
        },
        onElementUpdated() {
            this.$refs.elementEditor.refreshStyleRule();
        }
    }
});
