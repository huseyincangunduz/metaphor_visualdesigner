import { InternalVisualDesigner } from "../../../InternalVisualDesigner/InternalVisualDesigner.js";
import { StyleOtomator } from "../../../InternalVisualDesigner/PageCore/StyleOtomator.js";
import { StyleRuleState } from "../../../InternalVisualDesigner/PageCore/StylesheetRuleOperations.js";
import { ViewIndex } from "../../../Utils.js";
import { WidthBreakpoint } from "../../../InternalVisualDesigner/PageCore/WidthBreakpointsManager.js";
// StyleRuleState
export default Vue.component("internal-visual-designer", {
    template: ViewIndex.getViewSync("internal-visual-designer"),
    props:
    {
        initialSrc: String
    },
    data()
    {
        
        return{
            _src: this.initialSrc,
            _rootElement: document.createElement("div"),
            internalVisualDesigner : null
        }
    },
    mounted()
    {
        let readyToGo = (ivd : InternalVisualDesigner) => {
   
            //
   
            var select = (element, pivot) => {
                //Stil Mod Kontrolü
                let medRul : CSSMediaRule = null;
                let selectedBreakpoint =  ivd.pageCore.widthBreakpointsManager.getSelectedBreakpoint();
                if (selectedBreakpoint instanceof WidthBreakpoint 
                    && 
                    selectedBreakpoint.width && selectedBreakpoint.relatedRule)
                {
                    medRul = selectedBreakpoint.relatedRule;
                }
                
                let rule = ivd.pageCore.styleOtomation.findRule(pivot,medRul,StyleRuleState.normal);

                this.selectElement(element, pivot, rule);
            };
            var update = (element, pivot) => {
                //let rule = ivd.styleOtomation.findRule(pivot,null,StyleRuleState.normal);
                this.selectedElementUpdate();
            };
            
            ivd.eventHandlerSetters.onSelected(select);
            ivd.eventHandlerSetters.onMoved(update);
            ivd.eventHandlerSetters.onResized(update);
            this.internalVisualDesigner = ivd;
            this.$emit("ivd-created", ivd);
        }
        InternalVisualDesigner.createByDivAndCreate(this.$refs.ivsRootEl, this, this.$data._src,readyToGo);
    },
    methods: 
    {
        selectElement(element, pivot : HTMLElement, rule)
        {       
            this.$emit("element-selected", element, pivot, rule)
        },
        selectedElementUpdate()
        {       
            this.$emit("element-updated")
        }
        //elementUpdated
    }
    });