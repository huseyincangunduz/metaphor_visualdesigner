import { ViewIndex } from "../../../Utils.js"
import { PageCore } from "../../../InternalVisualDesigner/PageCore/PageCore.js"
import { WidthBreakpointsManager } from "../../../InternalVisualDesigner/PageCore/WidthBreakpointsManager.js";

export default Vue.component("page-editor",{
    data() {
        return {
            pageCore : null,
            // widthBreakpointsManager : null,
            // internalVisualDesigner : null
        }

    },
    template: ViewIndex.getViewSync("page-editor",""),
    methods:{
        setPageCore(pageCore : PageCore)
        {
            this.pageCore = pageCore;
            this.$refs.breakpointsEditor.setPageCore(pageCore);
   
            //console.info(this.pageCore);
        },
        // witdthBreakpointsManager(witdthBreakpointsManager : WidthBreakpointsManager)
        // {
        //     this.witdthBreakpointsManager = witdthBreakpointsManager;
        // },
    }
})