
export class WidthBreakpoint {

    

    public get APPROACH_MIN() {
        return 0;
    }
    public get APPROACH_MAX() {
        return 1;
    }


    public get widthApproach() {
        
        return this.width > 992 ? this.APPROACH_MAX : this.APPROACH_MIN;
    }

    public constructor (public width : number, public secondWidth : number, public relatedRule : CSSMediaRule){

    }
    

}


export class WitdthBreakpointsManager {

    stylesheet: CSSStyleSheet;
    public constructor(public editingIframeWindow : Window)
    {

    }
    get widthBreakpoints()
    {
        let mediaRulesArray = [];
        for (let index = 0; index < this.stylesheet.cssRules.length; index++) {
            const styleRule = this.stylesheet.cssRules[index];
            if (styleRule instanceof CSSMediaRule || styleRule instanceof this.editingIframeWindow["CSSMediaRule"])
            {
                //@ts-ignore
                let mediaRule : CSSMediaRule = styleRule;
                //mediaRule.media
                //screen and \((.*)\) ((and \((.*)\))|) 1 ve 4. grup
            }
        }


        return mediaRulesArray;
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