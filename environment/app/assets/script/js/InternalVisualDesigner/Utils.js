import * as Constants from "./VisualDesignerConst.js";
export class TextControlling {
    static isNotEmpty(str) {
        return (str != "" && str != null);
    }
    static isEmpty(str) {
        return !this.isNotEmpty(str);
    }
}
export class Range {
    constructor(min, max) {
        this.min = min;
        this.max = max;
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
