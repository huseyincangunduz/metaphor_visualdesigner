import { InternalVisualDesigner } from "../../../InternalVisualDesigner/InternalVisualDesigner.js";
import { StyleRuleState } from "../../../InternalVisualDesigner/StyleOtomator.js";
export default Vue.component("internal-visual-designer", {
    template: `<div ref="ivsRootEl"> </div>`,
    props: {
        initialSrc: String
    },
    data() {
        return {
            _src: this.initialSrc,
            _rootElement: document.createElement("div"),
            internalVisualDesigner: null
        };
    },
    mounted() {
        console.info(this.$refs.ivsRootEl);
        let ivd = InternalVisualDesigner.createByDivAndCreate(this.$refs.ivsRootEl, this, this.$data._src);
        //
        var select = (element, pivot) => {
            let rule = ivd.styleOtomation.findRule(pivot, null, StyleRuleState.normal);
            this.elementSelection(element, pivot, rule);
        };
        var update = (element, pivot) => {
            //let rule = ivd.styleOtomation.findRule(pivot,null,StyleRuleState.normal);
            this.selectedElementUpdate();
        };
        ivd.eventHandlerSetters.onSelected(select);
        ivd.eventHandlerSetters.onMoved(update);
        ivd.eventHandlerSetters.onResized(update);
        this.internalVisualDesigner = ivd;
    },
    methods: {
        elementSelection(element, pivot, rule) {
            this.$emit("element-selected", element, pivot, rule);
        },
        selectedElementUpdate() {
            this.$emit("element-updated");
        }
        //elementUpdated
    }
});
