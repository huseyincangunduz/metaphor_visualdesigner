export class WidthBreakpoint {
    constructor(width, secondWidth, relatedRule) {
        this.width = width;
        this.secondWidth = secondWidth;
        this.relatedRule = relatedRule;
    }
    get APPROACH_MIN() {
        return 0;
    }
    get APPROACH_MAX() {
        return 1;
    }
    get widthApproach() {
        return this.width > 992 ? this.APPROACH_MAX : this.APPROACH_MIN;
    }
}
export class WitdthBreakpointsManager {
    constructor(editingIframeWindow) {
        this.editingIframeWindow = editingIframeWindow;
    }
    get widthBreakpoints() {
        let mediaRulesArray = [];
        for (let index = 0; index < this.stylesheet.cssRules.length; index++) {
            const styleRule = this.stylesheet.cssRules[index];
            if (styleRule instanceof CSSMediaRule || styleRule instanceof this.editingIframeWindow["CSSMediaRule"]) {
                //@ts-ignore
                let mediaRule = styleRule;
                //mediaRule.media
                //screen and \((.*)\) ((and \((.*)\))|) 1 ve 4. grup
            }
        }
        return mediaRulesArray;
    }
}
