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
            let addedCorrect = parent.insertRule(newSelector + `{${text}}`, parent.rules.length);
            parent.removeRule(this.getRuleIndexFromStylesheet(rule, parent));
            return addedCorrect;
        }
    }
    insertNewRule(selector, enabledMediaRule, editingStyleSheet) {
        var determinedRule;
        let cssRuleText = selector.join(", ") + " { }";
        if (enabledMediaRule != null) {
            let ni = enabledMediaRule.insertRule(cssRuleText, enabledMediaRule.cssRules.length);
            determinedRule = enabledMediaRule.cssRules.item(ni);
        }
        else
            (editingStyleSheet != null);
        {
            let ni = editingStyleSheet.insertRule(cssRuleText, editingStyleSheet.cssRules.length);
            determinedRule = editingStyleSheet.cssRules.item(ni);
        }
        return determinedRule;
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
