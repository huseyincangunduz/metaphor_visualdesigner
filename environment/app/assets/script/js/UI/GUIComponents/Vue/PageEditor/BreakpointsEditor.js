import { ViewIndex } from "../../../../Utils.js";
export default Vue.component("width-breakpoints-editor", {
    data() {
        return {
            pageCore: null,
            witdthBreakpointsManager: null,
            internalVisualDesigner: null,
        };
    },
    computed: {
        widthList() {
            return this.pageCore.widthBreakpointsManager.widthBreakpoints;
        }
    },
    template: ViewIndex.getViewSync("width-breakpoints-editor", ""),
    methods: {
        setPageCore(pageCore) {
            const listComponent = this.$refs.widthListRef;
            this.pageCore = pageCore;
            listComponent.setList(this.widthList);
            listComponent.selectItem(0);
        },
        onItemSelected(array, index) {
            const item = array[index];
            const pageCore = this.pageCore;
            pageCore.widthBreakpointsManager.selectBreakpoint(item);
            console.info(item);
        },
        onItemRemoved(item, index) {
        }
    }
});
