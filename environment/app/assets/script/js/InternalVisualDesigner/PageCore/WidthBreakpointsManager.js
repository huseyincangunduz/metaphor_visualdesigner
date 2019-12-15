export class WidthBreakpoint {
    constructor(width, relatedRule, secondWidth) {
        this.width = width;
        this.relatedRule = relatedRule;
        this.secondWidth = secondWidth;
    }
    get widthApproach() {
        return this.width > 992 ? WidthBreakpoint.APPROACH_MAX : WidthBreakpoint.APPROACH_MIN;
    }
    toString() {
        return this.width + "px";
    }
}
WidthBreakpoint.APPROACH_MIN = 0;
WidthBreakpoint.APPROACH_MAX = 1;
export class DefaultWidthBreakpoint {
    toString() {
        return "default";
    }
}
export class WidthBreakpointsManager {
    constructor(editingIframeWindow, editingStylesheet, pageCore) {
        this.editingIframeWindow = editingIframeWindow;
        this.editingStylesheet = editingStylesheet;
        this.pageCore = pageCore;
        this.refreshBreakpoints();
    }
    getSelectedBreakpoint() {
        return this.selectedBreakpoint;
    }
    refreshBreakpoints() {
        let mediaRulesArray = [new DefaultWidthBreakpoint()];
        for (let index = 0; index < this.editingStylesheet.cssRules.length; index++) {
            const styleRule = this.editingStylesheet.cssRules[index];
            if (styleRule instanceof CSSMediaRule || styleRule instanceof this.editingIframeWindow["CSSMediaRule"]) {
                //@ts-ignore
                let mediaRule = styleRule;
                let regexResult = mediaRule.conditionText.match(/\((.*?)\)[ ]*((and[ ]*\((.*?)\))|)/);
                if (regexResult && regexResult[1]) {
                    let ilkSonuc = regexResult[1];
                    let ilkSonucRegex = ilkSonuc.match(/(max|min)-(width)[\s]*:[\s]*([0-9]*)([A-Za-z]*)/);
                    if (ilkSonucRegex && ilkSonucRegex[2] == "width" && ilkSonucRegex[4] == "px") {
                        let widthInt = parseInt(ilkSonucRegex[3]);
                        if (!isNaN(widthInt))
                            mediaRulesArray.push(new WidthBreakpoint(widthInt, mediaRule));
                    }
                }
            }
        }
        this.widthBreakpoints = mediaRulesArray;
    }
    selectBreakpoint(b) {
        this.selectedBreakpoint = b;
        this.pageCore.internalVisualDesigner.onBreakpointSelected(b);
        //this.page
    }
}
