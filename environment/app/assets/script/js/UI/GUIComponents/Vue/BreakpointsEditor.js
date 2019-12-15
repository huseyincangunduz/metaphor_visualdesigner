import { ViewIndex } from "../../../Utils";
export default Vue.component("width-breakpoints-editor", {
    data() {
        return {
            pageCore: null,
            witdthBreakpointsManager: null,
            internalVisualDesigner: null
        };
    },
    template: ViewIndex.getViewSync("page-editor", ""),
    methods: {
        setPageCore(pageCore) {
            this.pageCore = pageCore;
        },
        witdthBreakpointsManager(witdthBreakpointsManager) {
            this.witdthBreakpointsManager = witdthBreakpointsManager;
            this.$refs.widthList = witdthBreakpointsManager.widthBreakpoints;
        },
        // setInternalVisualDesigner(internalVisualDesigner : InternalVisualDesigner)
        // {
        //     this.internalVisualDesigner = internalVisualDesigner;
        // },
        onItemSelected(array, index) {
        },
        onItemRemoved(item, index) {
        }
    }
});
