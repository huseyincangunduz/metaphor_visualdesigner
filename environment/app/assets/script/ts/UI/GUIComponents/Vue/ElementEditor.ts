import { ViewIndex } from "../../../Utils.js";

import { InternalVisualDesigner } from "../../../InternalVisualDesigner/InternalVisualDesigner.js";

export default Vue.component("element-editor",
    {
        template: ViewIndex.getViewSync("element-editor"),
        data: function () {
            return {
                editingPivotElement: null,
                //Besleme verileri
                styleRule: null,
                internalVisualDesigner: null,
                pageCore: null
            }
        },
        computed: {
            elementSelectorText() {
                var internalVisualDesigner: InternalVisualDesigner = this.internalVisualDesigner;
                let el: HTMLElement = this.editingPivotElement;

                return el ? el.tagName + "#" + el.id : "Not selected!";

            }
        },
        watch: {
            styleRule() {
                this.$refs.styleEditor.styleRule = this.styleRule;

            },
            editingPivotElement() {
                this.$refs.styleEditor.editingPivotElement = this.editingPivotElement;
                this.$refs.elementIDChanger.selectedElement = this.editingPivotElement;
            }
        },
        methods: {
            refreshStyleRule() {
                this.$refs.styleEditor.updateSelectedElementInfo();
            },
            sendChanges(data: GenericObject<any>) {
                if (data.editingPivotElement) this.editingPivotElement = data.editingPivotElement;
                this.styleRule = data["styleRule"]

                return;

            },
            setInternalVisualDesigner(ivd: InternalVisualDesigner) {
                this.internalVisualDesigner = ivd;
                this.pageCore = ivd.pageCore;
                this.$refs.elementIDChanger.internalVisualDesigner = ivd;
            }
        }
    });