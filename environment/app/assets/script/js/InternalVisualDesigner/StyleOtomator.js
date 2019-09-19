import { TextControlling } from "./Utils.js";
class CommitParameter {
    constructor() {
        this.styleKeys = [];
        this.styleValues = [];
        this.removeKeys = [];
    }
    addProperty(key, val, priority = "") {
        if (TextControlling.isNotEmpty(val)) {
            this.styleValues[key] = { value: val, priority: priority };
            this.addToKeys(key);
            this.removeFromWillBeRemovedArray(key);
        }
        else {
            this.styleValues[key] = null;
            this.addToKeys(key);
            this.addToWillBeRemoved(key);
        }
    }
    removeFromWillBeRemovedArray(key) {
        let removeFromWillRemovedIndex = this.removeKeys.indexOf(key);
        if (removeFromWillRemovedIndex > -1) {
            this.removeKeys.slice(removeFromWillRemovedIndex, removeFromWillRemovedIndex + 1);
        }
    }
    addToWillBeRemoved(key) {
        let removedKeys = this.removeKeys.indexOf(key);
        if (removedKeys == -1)
            this.removeKeys.push(key);
    }
    addToKeys(key) {
        if (this.styleKeys.indexOf(key) == -1) {
            this.styleKeys.push(key);
        }
    }
}
export var StyleRuleState;
(function (StyleRuleState) {
    StyleRuleState[StyleRuleState["normal"] = 0] = "normal";
    StyleRuleState[StyleRuleState["active"] = 1] = "active";
    StyleRuleState[StyleRuleState["hover"] = 2] = "hover";
})(StyleRuleState || (StyleRuleState = {}));
export class StyleOtomator {
    constructor(editingIframeWindow_, editingStyleSheet_) {
        this.editingStyleSheet = editingStyleSheet_;
        this.editingIframeDocument = editingIframeWindow_.document;
        this.editingIframeWindow = editingIframeWindow_;
    }
    commitStyleElement(editingElement, ruleState) {
        let elementInlineStyle = editingElement.style, elementRelatedStyle = this.findRule(editingElement, null, ruleState), elementComputedStyles = this.editingIframeWindow.getComputedStyle(editingElement);
        //console.log({elementInlineStyle, relatedCSSRules: elementRelatedStyle.style});
        //TODO: Stylesheet'e işlenecek olan bir object yarat ve element inline style'i sıfırla
        let commitParam = new CommitParameter();
        for (let index = 0; index < elementInlineStyle.length; index++) {
            const key = elementInlineStyle[index];
            commitParam.styleValues[key] = { value: elementInlineStyle.getPropertyValue(key), priority: elementInlineStyle.getPropertyPriority(key) };
            commitParam.styleKeys.push(key);
        }
        //@ts-ignore
        this.adaptAnchoring(elementRelatedStyle, commitParam, editingElement, elementComputedStyles);
        //TODO: Convert measure units
        //@ts-ignore
        this.commitStyles(commitParam, elementRelatedStyle, editingElement);
        // 
        // console.log({commitParam, relatedCSSRules: elementRelatedStyle.cssText});
    }
    commitStyles(commitParam, elementRelatedStyle, editingElement) {
        commitParam.styleKeys.forEach(key => {
            if (commitParam.styleValues[key] != null) {
                let styleVals = commitParam.styleValues[key];
                elementRelatedStyle.style.setProperty(key, styleVals["value"], styleVals["priority"]);
            }
            else if (commitParam.removeKeys.indexOf(key) > -1) {
                elementRelatedStyle.style.setProperty(key, null);
            }
            editingElement.style.setProperty(key, null);
        });
    }
    //#region util functions for style editing, circulation
    /**
    * Function adaptAnchoring
    * TR: Satır içinde tanımlanmış element stillerinden oluşturulan CommitParam
    * objesini Stil sayfası içindeki
    * stillere sağ/sol uzanma uyarlaması yapmaktadır.
    * Rivayetlere göre bu fonksiyon, kullanıldığında +1 güç sağlar. &#x85;
    * EN-US: CommitParam object created from element styles defined in the line makes
    * adaptations such as right / left anchoring to the styles in the Style sheet.
    * According to rumors, this function provides +1 power when used.
    * @param elementRelatedStyle element that is being edited style rule contained at edited style sheet (by id)
    * @param commitParam Styles that will be commited to Style Rule contained at Style sheet
    * @param editingElement element that is being changed style
    */
    adaptAnchoring(elementRelatedStyle, commitParam, editingElement, computedStyle) {
        //Sağa sola yaslanma olayına karar ver
        //@ts-ignore
        if (elementRelatedStyle.style.position == "absolute" || elementRelatedStyle.style.position == "fixed") {
            // document.scrol
            if (TextControlling.isNotEmpty(elementRelatedStyle.style.right)) {
                let thereWasInlineStlLeftAtStart = TextControlling.isNotEmpty(editingElement.style.left);
                if (TextControlling.isEmpty(editingElement.style.width)) {
                    editingElement.style.setProperty("width", Math.max(Number.parseInt(computedStyle.width.replace("px", "")), editingElement.clientHeight) + "px");
                }
                if (!thereWasInlineStlLeftAtStart) {
                    editingElement.style.setProperty("left", computedStyle.left);
                }
                elementRelatedStyle.style.setProperty("right", "unset", elementRelatedStyle.style.getPropertyPriority("right"));
                commitParam.addProperty("right", computedStyle.right);
                //if (elementRelatedStyle.style.width == null)
                if (TextControlling.isEmpty(elementRelatedStyle.style.left)) {
                    commitParam.addProperty("left", null);
                    commitParam.addProperty("width", editingElement.style.width);
                }
                else {
                    commitParam.addProperty("width", null);
                    commitParam.addProperty("left", editingElement.style.left);
                }
                /*elementRelatedStyle.style.setProperty("right", "unset", elementRelatedStyle.style.getPropertyPriority("right"));
                commitParam.addProperty("right", computedStyle.right);
                commitParam.addProperty("width", null);
                if (isEmpty(elementRelatedStyle.style.left)) {
                    commitParam.addProperty("left", null);
                }*/
            }
        }
    }
    findRule(editingElement, enabledMediaRule, ruleState) {
        let rulelist;
        if (TextControlling.isEmpty(editingElement.id)) {
            let newID = "";
            let doc = editingElement.ownerDocument;
            let ellist = doc.querySelectorAll(editingElement.tagName).length, trig = ellist;
            do {
                newID = editingElement.tagName + "_" + trig;
                trig++;
            } while (doc.querySelectorAll(`#${newID}`).length > 0);
            editingElement.id = newID;
        }
        let id_selector = `#${editingElement.id}`, selector;
        rulelist = (enabledMediaRule != null) ? enabledMediaRule.cssRules : this.editingStyleSheet.cssRules;
        selector = this.getRequiredSelectorsArray(id_selector, ruleState);
        let determinedRule;
        for (let i = 0; i < rulelist.length; i++) {
            const currentRule = rulelist.item(i);
            // if (determinedRule != null) break;
            let currentStyleRule;
            if (currentRule instanceof this.editingIframeWindow["CSSStyleRule"]) {
                //@ts-ignore
                currentStyleRule = currentRule;
                if (this.isSuitableStyleRule(currentStyleRule.selectorText, selector))
                    determinedRule = currentStyleRule;
            }
        }
        if (determinedRule == null) //Eğer öyle bir şey yoksa yeni ekle
         {
            determinedRule = this.insertNewRule(selector, enabledMediaRule, this.editingStyleSheet);
        }
        return determinedRule;
    }
    insertNewRule(selector, enabledMediaRule, editingStyleSheet) {
        var determinedRule;
        let cssRuleText = selector.join(", ") + " { }";
        if (enabledMediaRule != null) {
            let ni = enabledMediaRule.insertRule(cssRuleText, enabledMediaRule.cssRules.length);
            determinedRule = enabledMediaRule.cssRules.item(ni);
        }
        else
            (this.editingStyleSheet != null);
        {
            let ni = this.editingStyleSheet.insertRule(cssRuleText, editingStyleSheet.cssRules.length);
            determinedRule = this.editingStyleSheet.cssRules.item(ni);
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
