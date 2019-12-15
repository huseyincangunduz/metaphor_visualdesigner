import { PageCore } from "./PageCore";

export interface IWidthBreakpoint{

}
export class WidthBreakpoint implements IWidthBreakpoint {

    

    public static APPROACH_MIN = 0;
    public static APPROACH_MAX = 1;


    public get widthApproach() {
        
        return this.width > 992 ? WidthBreakpoint.APPROACH_MAX : WidthBreakpoint.APPROACH_MIN;
    }

    public constructor (public width : number,  public relatedRule : CSSMediaRule,public secondWidth? : number){
     
    }
    
    public toString()
    {
        return this.width + "px";
    }

}
export class DefaultWidthBreakpoint implements IWidthBreakpoint{
    public toString()
    {
        return "default";
    }
}

export class WidthBreakpointsManager {
    getSelectedBreakpoint() {
        return this.selectedBreakpoint;
    }


    public constructor(public editingIframeWindow : Window, 
        public editingStylesheet : CSSStyleSheet,
        public pageCore : PageCore)
    {
        this.refreshBreakpoints();
    }
    protected selectedBreakpoint : IWidthBreakpoint;

    public widthBreakpoints;
    public refreshBreakpoints()
    {
        let mediaRulesArray = [ new DefaultWidthBreakpoint() ];
        for (let index = 0; index < this.editingStylesheet.cssRules.length; index++) {
            const styleRule = this.editingStylesheet.cssRules[index];
            if (styleRule instanceof CSSMediaRule || styleRule instanceof this.editingIframeWindow["CSSMediaRule"])
            {
                //@ts-ignore
                let mediaRule : CSSMediaRule = styleRule;
                let regexResult  = mediaRule.conditionText.match(/\((.*?)\)[ ]*((and[ ]*\((.*?)\))|)/);
                if (regexResult && regexResult[1])
                {
                    let ilkSonuc = regexResult[1];
                    let ilkSonucRegex = ilkSonuc.match(/(max|min)-(width)[\s]*:[\s]*([0-9]*)([A-Za-z]*)/);
                    if (ilkSonucRegex && ilkSonucRegex[2] == "width" &&  ilkSonucRegex[4] == "px")
                    {
                        let widthInt = parseInt(ilkSonucRegex[3]);
                        if (!isNaN(widthInt))
                        mediaRulesArray.push(new WidthBreakpoint(widthInt,mediaRule));
                    }
                    
                }
           
            }
        }
        this.widthBreakpoints =  mediaRulesArray;
    }

    public selectBreakpoint(b : IWidthBreakpoint)
    {
        this.selectedBreakpoint = b;
        this.pageCore.internalVisualDesigner.onBreakpointSelected(b);
       //this.page
    }

    /* 
    Alan başlangıçları
    $scr-width-phone-xs: 320px;
    $scr-width-phone-s: 400px;
    $scr-width-phone-m: 450px;
    $scr-width-phone-l: 600px;
    $scr-width-tablet: 768px;
    $scr-width-tablet-l: 810px;   //0819
    $scr-width-desktop: 992px;    //0993
    $scr-width-desktop-m: 1080px; //1081
    $scr-width-desktop-l: 1222px; //1223
    
    
    */

    /**
     * Aktif en: şu anda kullanılan en'i ifade eder
     * Telefon 
     */



}