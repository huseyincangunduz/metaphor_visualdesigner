import { ViewIndex } from "../../../../Utils.js";
//REGEX Vue\.component\(".*.",\{.[A-Za-z0-9 0.\(\)\{\}",=\?_\*$/`\+\-\=\;\:\\-\s']*.\}\)
export let ElementIDChanger = Vue.component("element-id-changer", {
    template: ViewIndex.getViewSync("element-id-changer"),
    data() {
        return {
            selectedElement: null,
            internalVisualDesigner: null
        };
    },
    computed: {
        elementID() {
            let selectedElement = this.selectedElement;
            return selectedElement ? selectedElement.id : "";
        },
        pageCore() {
            let ivd = this.internalVisualDesigner;
            return ivd.pageCore;
        }
    },
    methods: {
        IDtxtBox_onTextChanged(txt, old) {
        },
        IDtxtBox_onUserTextChanged(txt, old) {
            var pageCore = this.pageCore;
            let k = pageCore.setIDRequest(this.selectedElement, txt);
            alert(k.message);
            //alert(`Change ID Request:  ${old} to ${txt}`);
        }
    }
});
