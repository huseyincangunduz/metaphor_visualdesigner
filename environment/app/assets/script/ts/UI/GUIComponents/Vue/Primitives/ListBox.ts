import { ViewIndex } from "../../../../Utils.js";

export default Vue.component("list-box", {
    template: ViewIndex.getViewSync("list-box","",true),
    data: () => {
        return {
            list: [],
            selectedItem: null,
            dataShowString : (list : [], index : number) : string => {
                return list[index]; 
            }


        }
    },

    methods:{
        selectItem(i : number)
        {
            this.selectedItem = this.list[i];
            this.$emit("item-selected",this.list,i);
        },
        setList(list : Array<any>)
        {
            this.list = list;
            this.selectedItem = null;
        },
        weightBySelection(item)
        {
            return this.selectedItem == item ? 700 : 400
        },
        removeItemByIndex(index : number)
        {
            let list : [] = this.list;
            let item = list[index];
            list.splice(index,1);
            this.$emit("item-removed",item,index);
        },
        setDataToString(callback : (list : [], index : number) => string)
        {
            this.dataShowString = callback;
        }
    }
});