export var StyleRuleState;
(function (StyleRuleState) {
    StyleRuleState[StyleRuleState["normal"] = 0] = "normal";
    StyleRuleState[StyleRuleState["active"] = 1] = "active";
    StyleRuleState[StyleRuleState["hover"] = 2] = "hover";
})(StyleRuleState || (StyleRuleState = {}));
export class StylesheetRuleOperations {
    getRelatedStyleRule(editingStyleSheet, editingIframeWindow, editingElement, enabledMediaRule, ruleState) {
        let rulelist;
        let id_selector = `#${editingElement.id}`, selector;
        rulelist = (enabledMediaRule != null) ? enabledMediaRule.cssRules : editingStyleSheet.cssRules;
        selector = this.getRequiredSelectorsArray(id_selector, ruleState);
        let determinedRule;
        for (let i = 0; i < rulelist.length; i++) {
            const currentRule = rulelist.item(i);
            // if (determinedRule != null) break;
            let currentStyleRule;
            if (currentRule instanceof editingIframeWindow["CSSStyleRule"]) {
                //@ts-ignore
                currentStyleRule = currentRule;
                if (this.isSuitableStyleRule(currentStyleRule.selectorText, selector))
                    determinedRule = currentStyleRule;
            }
        }
        if (determinedRule == null) //Eğer öyle bir şey yoksa yeni ekle
         {
            determinedRule = this.insertNewRule(selector, enabledMediaRule, editingStyleSheet);
        }
        return determinedRule;
    }
    constructor(iframeWindow) {
        this.iframeWindow = iframeWindow;
    }
    getRuleIndexFromStylesheet(rule, parent) {
        for (let index = 0; index < parent.cssRules.length; index++) {
            const element = parent.cssRules.item(index);
            if (element == rule)
                return index;
        }
        return -1;
    }
    changeSelector(rule, newSelector) {
        let parentRule;
        if (rule.parentRule && (rule instanceof this.iframeWindow["CSSGroupingRule"])) {
            // let r : CSSGroupingRule = rule;
            // r.
            /* TODO: Sub rule editing*/
            return -1;
        }
        else if (rule.parentStyleSheet) {
            let parent = rule.parentStyleSheet;
            let text = rule.style.cssText;
            //let selector = rule.selectorText;
            let newIndex = parent.rules.length;
            if (rule instanceof this.iframeWindow["CSSStyleRule"]) {
                newIndex = this.getLastStyleRule(parent.rules);
            }
            let addedCorrect = parent.insertRule(newSelector + `{${text}}`, newIndex);
            parent.removeRule(this.getRuleIndexFromStylesheet(rule, parent));
            return addedCorrect;
        }
    }
    insertNewRule(selector, enabledMediaRule, editingStyleSheet) {
        var determinedRule;
        let cssRuleText = selector.join(", ") + " { }";
        let lastStyleRule = 0, ni = 0;
        let cssRules;
        let p;
        if (enabledMediaRule != null) {
            cssRules = enabledMediaRule.cssRules;
            p = enabledMediaRule;
        }
        else if (editingStyleSheet != null) {
            cssRules = editingStyleSheet.cssRules;
            p = editingStyleSheet;
        }
        lastStyleRule = this.getLastStyleRule(cssRules);
        ni = p.insertRule(cssRuleText, lastStyleRule);
        // if (enabledMediaRule != null) {
        // }
        // else if (editingStyleSheet != null)
        // {
        //     ni = editingStyleSheet.insertRule(cssRuleText, lastStyleRule);
        // }
        determinedRule = cssRules.item(ni);
        return determinedRule;
    }
    getLastStyleRule(cssRules) {
        let lastStyleRule = 0;
        for (let i = 0; i < cssRules.length; i++) {
            const el = cssRules.item(i);
            if (el instanceof CSSStyleRule) {
                lastStyleRule = i;
            }
        }
        return lastStyleRule;
    }
    isSuitableStyleRule(selectorText, selector) {
        let determine;
        if (selector.length == 1) {
            var str = selector[0];
            determine = (selectorText == `${str}`);
        }
        else {
            selector.forEach(str => {
                determine = ((selectorText.indexOf(`${str},`) > -1 || selectorText.indexOf(`, ${str}`) > -1));
            });
        }
        return determine;
    }
    getRequiredSelectorsArray(id_selector, ruleState) {
        let selector;
        switch (ruleState) {
            case StyleRuleState.active:
                selector = [`${id_selector}:active`, `${id_selector}[metaphor-internal-design-state="active"]`];
                break;
            case StyleRuleState.hover:
                selector = [`${id_selector}:hover`, `${id_selector}[metaphor-internal-design-state="hover"]`];
                break;
            default:
                selector = [`${id_selector}`];
        }
        return selector;
    }
}
