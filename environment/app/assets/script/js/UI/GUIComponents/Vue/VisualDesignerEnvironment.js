import InternalVisualDesignerComponent from "./InternalVisualDesigner.js";
export default Vue.component("visual-designer", {
    template: `
<div class="metaphor-designer-root">
    <div class="topbar">
        <span class="topbar-right">
            <span @click="toggleOptionsToggleBtnClicked">Toggle Options</span>
        </span>
    </div>
    <div class="editor-content-area">
        <div class="metaphor-designer" :right-panel-visible="rightPanelVisibility">
            <div ref="uiContentAreaContainer" class="internal-designer-area">
    
                <internal-visual-designer 
                    ref="ivsComponent" 
                    @element-selected="onElementSelected"
                    @element-updated="onElementUpdated" 
                    initialSrc="../editortests/anchoring.html" 
                    
                    />
            </div>
            <div ref="uiRightPanelContainer" class="right-panel">

                <!-- TODO: ELEMENT SELECTION EDITOR 
                           Görevler:
                            -Element ID değiştirme
                                seçilmiş element bilgisini tutan component bunu çalıştıracak
                                    this.$emit("rename-element",newIDRequest,oldID);
                                Visual Designer Environment'ta da şu tarz bir şey çalıştıracak
                                    this.$refs.ivsComponent.renameElement = newId
                            -Element attribute'leri değiştirme
                            -Element Hızlı düzenleyici (Stil, Attribute, Stil sınıfı ekleme çıkarma) -->

                <!-- TODO: PAGE META EDITOR 
                            Görevler
                                -Bağlılıklar ve NPM Paketleri kurulumu / kaldırılması
                                -Stil değişkenleri
                                -Stil sınıflarının düzenlenmesi
                                -Dökümandaki elemanların ağaç gösterimi
                                -->

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
