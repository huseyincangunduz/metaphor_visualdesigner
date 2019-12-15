import { ViewIndex } from "../../../../Utils.js"
import { PageCore } from "../../../../InternalVisualDesigner/PageCore/PageCore.js";
import { WidthBreakpointsManager } from "../../../../InternalVisualDesigner/PageCore/WidthBreakpointsManager.js";
import { InternalVisualDesigner } from "../../../../InternalVisualDesigner/InternalVisualDesigner.js";

export default Vue.component("width-breakpoints-editor",{
    data() {
        return {
            pageCore : null,
            witdthBreakpointsManager : null,
            internalVisualDesigner : null,
  
        }

    },

computed: {
    widthList(){
        return this.pageCore.widthBreakpointsManager.widthBreakpoints;
    }
}
    ,
    
    template: ViewIndex.getViewSync("width-breakpoints-editor",""),
    methods: {
        setPageCore(pageCore : PageCore)
        {
            const listComponent = this.$refs.widthListRef;

            this.pageCore = pageCore;
           
            listComponent.setList(this.widthList);
            listComponent.selectItem(0);

        },

        onItemSelected(array : [], index : number)
        {
            const item = array[index];
            const pageCore : PageCore = this.pageCore;
            pageCore.widthBreakpointsManager.selectBreakpoint(item);
            console.info(item);
        },
        
        onItemRemoved(item : any, index : number)
        {

        }
    }
})