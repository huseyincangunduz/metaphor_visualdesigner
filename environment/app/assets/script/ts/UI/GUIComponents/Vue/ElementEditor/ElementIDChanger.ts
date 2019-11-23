import { ViewIndex } from "../../../../Utils.js";
import { PageCore } from "../../../../InternalVisualDesigner/PageCore/PageCore.js";
import { InternalVisualDesigner } from "../../../../InternalVisualDesigner/InternalVisualDesigner.js";

//REGEX Vue\.component\(".*.",\{.[A-Za-z0-9 0.\(\)\{\}",=\?_\*$/`\+\-\=\;\:\\-\s']*.\}\)

export let ElementIDChanger = Vue.component("element-id-changer", {
    template: ViewIndex.getViewSync("element-id-changer"),
    data() {
        return {

                selectedElement: null,
            internalVisualDesigner: null

        }
    },
    computed: {
        elementID() {
            let selectedElement: HTMLElement = this.selectedElement;

            return selectedElement ? selectedElement.id : "";

        },
        pageCore() {
            let ivd: InternalVisualDesigner = this.internalVisualDesigner;
            return ivd.pageCore;

        }
    },
    methods:
    {
        IDtxtBox_onTextChanged(txt: string, old: string) {

        },
        IDtxtBox_onUserTextChanged(txt: string, old: string) {
            var pageCore: PageCore = this.pageCore;
            let k: { success: boolean, message: string } = pageCore.setIDRequest(this.selectedElement, txt);
            alert(k.message);
            //alert(`Change ID Request:  ${old} to ${txt}`);
        }
    }
})