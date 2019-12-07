import { ViewIndex } from "../../../../Utils.js";
export default Vue.component("list-box", {
    template: ViewIndex.getViewSync("list-box", "", true),
    data: () => {
        return {
            list: [1, 2, 3, 4, 5],
            selectedItem: null,
        };
    },
    methods: {
        selectItem(i) {
            this.selectedItem = this.list[i];
        },
        setList(list) {
            this.list = list;
            this.selectedItem = null;
        },
        weightBySelection(item) {
            return this.selectedItem == item ? 700 : 400;
        }
    }
});
