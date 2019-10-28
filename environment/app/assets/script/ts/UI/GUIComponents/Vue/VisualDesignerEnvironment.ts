import InternalVisualDesignerComponent from "./InternalVisualDesignerComponent.js";
export default Vue.component("visual-designer", {
    template: `<div class="metaphor-designer-root">
    <div class="topbar">
        <span class="topbar-right">
            <span @click="toggleOptionsToggleBtnClicked">Toggle Options</span>
        </span>
    </div>
    <div class="editor-content-area">
        <div class="metaphor-designer" :right-panel-visible="rightPanelVisibility">

            <div ref="uiContentAreaContainer" class="internal-designer-area">
    
                <internal-visual-designer ref="ivsComponent" @element-selected="onElementSelected"
                    @element-updated="onElementUpdated" initialSrc="../editortests/anchoring.html" />
            </div>
            <div ref="uiRightPanelContainer" class="right-panel">

                <style-rule-editing-component ref="elementSelectionEditor" />
                
            </div>
        </div>
    </div>
</div>`,
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
        updateGUIChilds(containerElement, guiContentElement) {
            while (containerElement.childElementCount > 0) {
                containerElement.removeChild(containerElement.childElementCount - 1);
            }
            containerElement.appendChild(guiContentElement);
        },
        onElementSelected(element: Array<HTMLElement>, pivot: HTMLElement, ruleStyle) {
            console.info(element, pivot, ruleStyle);
            this.$refs.elementSelectionEditor.editingPivotElement = pivot;
            this.$refs.elementSelectionEditor.styleRule = ruleStyle.style;
            this.$refs.elementSelectionEditor.elementSelectorText = pivot.tagName + "#" + pivot.id;
            console.info({ ruleStyle });
        },
        onElementUpdated() {

            this.$refs.elementSelectionEditor.updateSelectedElementInfo();
        }
    }
});