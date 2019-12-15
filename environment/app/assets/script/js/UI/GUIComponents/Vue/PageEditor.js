import { ViewIndex } from "../../../Utils.js";
export default Vue.component("page-editor", {
    data() {
        return {
            pageCore: null,
        };
    },
    template: ViewIndex.getViewSync("page-editor", ""),
    methods: {
        setPageCore(pageCore) {
            this.pageCore = pageCore;
            this.$refs.breakpointsEditor.setPageCore(pageCore);
            //console.info(this.pageCore);
        },
    }
});
