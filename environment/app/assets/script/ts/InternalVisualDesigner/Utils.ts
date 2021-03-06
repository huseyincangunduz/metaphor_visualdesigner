import * as Constants from "./VisualDesignerConst.js";

export class TextControlling
{
    public static isNotEmpty(str : string)
    {
        return (str != "" && str != null )
    }
    public static isEmpty(str : string)
    {
        return !this.isNotEmpty(str);
    }
}


export class Range
{
    public min : number;
    public max : number;
    public constructor(min : number, max : number)
    {
        this.min = min;
        this.max = max;
    }
}

export class MovementUtils {

    static inRange1(min : number, value : number, max : number) : boolean
    {
        return (min < value) && (value < max);
    }
    static inRange2( value : number, range : Range) : boolean
    {
        return (range.min < value) && (value < range.max);
    }

    static setPosition(pivot: HTMLElement, last: { X: number; Y: number; }) {

        jQuery(pivot).offset({ left: last.X, top: last.Y });
        //https://code.jquery.com/jquery-3.4.1.slim.js
    }


    public static position(x: number, y: number) {
        return { X: x, Y: y };
    }

    public static size(width: number, height: number) {
        return { Width: width, Height: height };
    }
}
export class ConversionUtils
{
    public static ConvertPXToPercent (max, val) {
        return (100 * (val / max))
    }
    public static ConvertPercentToPX (percentVal, max) {
        return (max * (percentVal / 100))
    }

}

export class AncestorParentUtils
{
    static ancestoringHandle(element: HTMLElement, callback: Function) {
        if (element != null)
        {
            let parentEditingElement = element;
            if (!callback(parentEditingElement)) {
                while (parentEditingElement.parentElement != null) {
                    parentEditingElement = parentEditingElement.parentElement;
                    if (callback(parentEditingElement)) break;
                }
            }
        } 
    }

    static goParentToReachable (nonReachableElement : HTMLElement)
    {
        let determinedElement :HTMLElement;

        let cllbck = (element : HTMLElement) => {
            let metaphorAttrVal = element.getAttribute(Constants.METAPHOR_ATTRIBUTE_NAME);
            if (TextControlling.isNotEmpty(metaphorAttrVal) && metaphorAttrVal.indexOf(Constants.METAPHOR_NOT_REACHABLE) == -1 || element.parentElement == element.ownerDocument.body)
            {
                determinedElement = element;
                return true;
            }
        }
        this.ancestoringHandle(nonReachableElement,cllbck);
        return determinedElement;
    }
    static goParentToTextElement (nonReachableElement : HTMLElement)
    {
        let determinedElement :HTMLElement;

        let cllbck = (element : HTMLElement) => {
            let metaphorAttrVal = element.getAttribute(Constants.METAPHOR_ATTRIBUTE_NAME);
            if (TextControlling.isNotEmpty(metaphorAttrVal) && metaphorAttrVal.indexOf(Constants.METAPHOR_TEXT_ELEMENT) > -1)
            {
                determinedElement = element;
                return true;
            }
        }
        this.ancestoringHandle(nonReachableElement,cllbck);
        return determinedElement;
    }

    
}

export class TagsOnAnAttribute
{
    public static addTag(element:HTMLElement, attribute:string, tag:string)
    {
        let str = element.getAttribute(attribute);
        if (str.indexOf(`${tag} `) == -1 && str.indexOf(` ${tag}`) == -1)
        {
            str = `${str} ${tag}`;
        }
        element.setAttribute(attribute,tag);
    }
    public static removeTag(element:HTMLElement, attribute:string, tag:string)
    {
        let str = element.getAttribute(attribute);
        if (str.indexOf(`${tag} `) > -1 || str.indexOf(` ${tag}`) > -1) 
        {
            str = str.replace(tag,"");
        }
        element.setAttribute(attribute,tag);
    }
}