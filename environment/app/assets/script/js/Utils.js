import * as Constants from "./InternalVisualDesigner/VisualDesignerConst.js";
export class TextControlling {
    static isNotEmpty(str) {
        return (str != "" && str != null);
    }
    static isEmpty(str) {
        return !this.isNotEmpty(str);
    }
}
export const lettersUpper = "ABCDEFGHIJKLMNOPQRSTUVWYXZ";
export const lettersLower = "abcdefghijklmnopqrstuvwyxz";
export const letters = lettersLower + lettersUpper;
export const cssSelectorPunctation = "#. []{}";
export class TextUtils {
    static charEqualAllOfOne(str, control) {
        for (let i = 0; i < control.length; i++) {
            const char = control[i];
            if (str == char)
                return true;
        }
        return false;
    }
}
export class Range {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    limit(value) {
        return Range.limit(this.min, value, this.max);
    }
    static limit(min, val, max) {
        return Math.min(max, Math.max(min, val));
    }
}
export class MovementUtils {
    static inRange1(min, value, max) {
        return (min < value) && (value < max);
    }
    static inRange2(value, range) {
        return (range.min < value) && (value < range.max);
    }
    static setPosition(pivot, last) {
        jQuery(pivot).offset({ left: last.X, top: last.Y });
        //https://code.jquery.com/jquery-3.4.1.slim.js
    }
    static position(x, y) {
        return { X: x, Y: y };
    }
    static size(width, height) {
        return { Width: width, Height: height };
    }
}
export class ConversionUtils {
    static ConvertPXToPercent(max, val) {
        return (100 * (val / max));
    }
    static ConvertPercentToPX(percentVal, max) {
        return (max * (percentVal / 100));
    }
}
export class AncestorParentUtils {
    static ancestoringHandle(element, callback) {
        if (element != null) {
            let parentEditingElement = element;
            if (!callback(parentEditingElement)) {
                while (parentEditingElement.parentElement != null) {
                    parentEditingElement = parentEditingElement.parentElement;
                    if (callback(parentEditingElement))
                        break;
                }
            }
        }
    }
    static goParentToReachable(nonReachableElement) {
        let determinedElement;
        let cllbck = (element) => {
            let metaphorAttrVal = element.getAttribute(Constants.METAPHOR_ATTRIBUTE_NAME);
            if (TextControlling.isNotEmpty(metaphorAttrVal) && metaphorAttrVal.indexOf(Constants.METAPHOR_NOT_REACHABLE) == -1 || element.parentElement == element.ownerDocument.body) {
                determinedElement = element;
                return true;
            }
        };
        this.ancestoringHandle(nonReachableElement, cllbck);
        return determinedElement;
    }
    static goParentToTextElement(nonReachableElement) {
        let determinedElement;
        let cllbck = (element) => {
            let metaphorAttrVal = element.getAttribute(Constants.METAPHOR_ATTRIBUTE_NAME);
            if (TextControlling.isNotEmpty(metaphorAttrVal) && metaphorAttrVal.indexOf(Constants.METAPHOR_TEXT_ELEMENT) > -1) {
                determinedElement = element;
                return true;
            }
        };
        this.ancestoringHandle(nonReachableElement, cllbck);
        return determinedElement;
    }
}
export class TagsOnAnAttribute {
    static addTag(element, attribute, tag) {
        let str = element.getAttribute(attribute);
        if (str.indexOf(`${tag} `) == -1 && str.indexOf(` ${tag}`) == -1) {
            str = `${str} ${tag}`;
        }
        element.setAttribute(attribute, tag);
    }
    static removeTag(element, attribute, tag) {
        let str = element.getAttribute(attribute);
        if (str.indexOf(`${tag} `) > -1 || str.indexOf(` ${tag}`) > -1) {
            str = str.replace(tag, "");
        }
        element.setAttribute(attribute, tag);
    }
}
export class ViewIndex {
    static importCSSAsyncIfThereIs(name, doc = document) {
        try {
            let cssLink = doc.createElement("link");
            cssLink.setAttribute("rel", "stylesheet");
            cssLink.id = "stylesheet-" + name.replace(" ", "-").replace("\n", "-");
            cssLink.setAttribute("href", "assets/css/component/" + name + ".css");
            doc.head.appendChild(cssLink);
        }
        catch (e) {
            console.error(e);
        }
    }
    static getViewSync(name, defaultValue = "", importStyle = true) {
        if (importStyle)
            this.importCSSAsyncIfThereIs(name);
        if (TextControlling.isNotEmpty(ViewIndex.indexes[name])) {
            return ViewIndex.indexes[name];
        }
        else {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "./assets/view/" + name + ".html", false);
            /* HACK:  Senkron AJAX'lar 'deprecated' olarak işaretlendi. */
            xhr.send("sesa");
            if (TextControlling.isNotEmpty(xhr.responseText)) {
                ViewIndex.indexes[name] = xhr.responseText;
                return xhr.responseText;
            }
            else {
                return defaultValue;
            }
        }
        // xhr.timeout = 10000;
    }
    static getViewAsync(name, callback, defaultValue = "") {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "assets/view/" + name + ".html", true);
        xhr.send("sesa");
        xhr.onload = (e) => {
            // if (e.)
        };
        return xhr.responseText ? xhr.responseText : defaultValue;
    }
}
ViewIndex.indexes = {};
