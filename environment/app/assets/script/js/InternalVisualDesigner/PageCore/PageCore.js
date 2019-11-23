const EDITING_STYLESHEET_ID = "metaphor-main-editing-stylesheet";
import { StyleOtomator } from "./StyleOtomator.js";
import { StylesheetRuleOperations } from "./StylesheetRuleOperations.js";
import { TextUtils, cssSelectorPunctation } from "../../Utils.js";
/**
 * PageCore sınıfı, döküman düzenlemekten çok dökümanın
 * tam olarak genel görünümünü düzenleyen (Width Breakpoints)
 * CSS sınıf kuralları, değişken ekleme çıkarma gibi angarya işler ile
 * ilgilenen sınıftır
 */
export class PageCore {
    constructor(ivd) {
        this.internalVisualDesigner = ivd;
        this.editingIframeDocument = ivd.editingIframeDocument;
        this.editingIframeWindow = ivd.editingIframeWindow;
        this.stylesheetRuleOps = new StylesheetRuleOperations(this.editingIframeWindow);
        this.mainEditingStyleSheet = this.getMainEditingStyleSheet();
        this.styleOtomation = new StyleOtomator(this.editingIframeWindow, this.mainEditingStyleSheet, this.stylesheetRuleOps);
    }
    /**
     * Stil kurallarını gezen ve gezerken gezdiği kuralı callback'i o kuralla çalıştıran fonksiyon
     * @param stlSheet Düzenlenen stilşit
     * @param callback Her iterasyonda çalışan fonksiyon. Döngünün devamı için false döndürtün, durdurmak için true döndürtün
     */
    styleRuleCirculation(stlSheet, callback) {
        let rules = stlSheet.rules;
        for (let i = 0; i < rules.length; i++) {
            let rule = rules.item(i);
            //@ts-ignore
            if (rule instanceof this.editingIframeWindow["CSSStyleRule"] && callback(rule))
                break;
        }
    }
    setIDRequest(element, newElementId) {
        //gelen id geçerlimi diye bakmak
        console.info("SETIDREQUEST x");
        let isValidId = newElementId.match(new RegExp("(^(([a-z]+)([-_][a-z]+)*)$)"));
        if (isValidId) {
            let newIdSelector = "#" + newElementId;
            let idSelector = "#" + element.id;
            let oldIDexpression = new RegExp(`#+(${element.id})(.+?[^A-Za-z0-9-_])`);
            //let newIDexpression = new RegExp(`#+(${newElementId})+[\s*]`,"igm");
            if (this.editingIframeDocument.querySelector(newIdSelector)) {
                return { success: false, message: "There is same ID in document. So, no." };
            }
            else {
                this.styleRuleCirculation(this.mainEditingStyleSheet, (r) => {
                    let selectorText = r.selectorText;
                    let i = selectorText.indexOf(idSelector);
                    if (i > -1) {
                        //Gerçekten burada element id'si olan bir şey istiyoruz.
                        //yani #mabel ararken #mabel-matiz ya da #mabelxsd bulmayalım
                        //o nedenle amele gibi burada uğraşacağız, orospu çocuğu regex
                        let flag = true;
                        // if (i - 1 != -1)
                        // {
                        //     flag = TextUtils.charEqualAllOfOne(selectorText[i-1],cssSelectorPunctation);
                        // }
                        if (flag && i + idSelector.length < selectorText.length) {
                            flag = TextUtils.charEqualAllOfOne(selectorText[i + idSelector.length], cssSelectorPunctation);
                        }
                        if (flag) {
                            let newSel = r.selectorText.replace(idSelector, newIdSelector);
                            this.stylesheetRuleOps.changeSelector(r, newSel);
                        }
                    }
                    // r.selectorText.replace(oldIDexpression,newIdSelector);
                    return false;
                });
                element.id = newElementId;
                return { success: true, message: "TODO: ID'yi değiştir" };
            }
            // this.mainEditingStyleSheet.cssText = this.mainEditingStyleSheet..replace(expression,newIdSelector);
            // element.id = newIdSelector;
            // this.mainEditingStyleSheet.cssText = this.mainEditingStyleSheet..replace(expression,newIdSelector);
            // element.id = newIdSelector;
        }
        else {
            return { success: false, message: "Invalid ID" };
        }
    }
    /**
     * getMainEditingStyleSheet
     */
    getMainEditingStyleSheet() {
        let stlsheets = this.editingIframeDocument.styleSheets;
        for (let i = 0; i < stlsheets.length; i++) {
            let stylesheet = stlsheets.item(i);
            //@ts-ignore FIXME: iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
            if (stylesheet instanceof this.editingIframeWindow.CSSStyleSheet && stylesheet.ownerNode["id"] == EDITING_STYLESHEET_ID) {
                //@ts-ignore FIXME: iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
                return stylesheet;
            }
        }
        //TODO: Add inserting stylesheet and save code
        throw new Error(`id='${EDITING_STYLESHEET_ID}' tagged sheet is not found`);
    }
    commitStyleElement(pivot, ruleState) {
        this.styleOtomation.commitStyleElement(pivot, ruleState);
    }
}
