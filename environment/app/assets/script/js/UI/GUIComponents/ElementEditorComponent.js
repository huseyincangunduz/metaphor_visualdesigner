let ElementEditorComponentData = {
    template: `    
        <div class="metaphor-element-edit">
            <style-changer/>
        </div>`,
    data() {
        return {
            selectedElement: null,
            activeStyleRule: null
        };
    },
    watch: {
        selectedElement() {
        },
        activeStyleRule() {
        }
    },
    methods: {
        setGUIContent(divisionElement) {
            this.GUIContent = divisionElement;
            this.updateGUIChilds(this.$refs.uiContentAreaContainer, this.GUIContent);
        },
        updateGUIChilds(containerElement, guiContentElement) {
            while (containerElement.childElementCount > 0) {
                containerElement.removeChild(containerElement.childElementCount - 1);
            }
            containerElement.appendChild(guiContentElement);
        }
    }
};
export let ElementEditorComponent = Vue.component("element-editor", ElementEditorComponentData);
