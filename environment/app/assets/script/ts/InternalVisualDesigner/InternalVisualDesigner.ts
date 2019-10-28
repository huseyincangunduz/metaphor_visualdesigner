



import { ElementSelectionAndMovementManager } from './ElementSelectionAndMovementManager.js';
import { StyleOtomator, StyleRuleState } from "./StyleOtomator.js"
import { ElementTextEditHandler } from "./ElementTextEditHandler.js";
const EDITING_STYLESHEET_ID = "metaphor-main-editing-stylesheet";
export class InternalVisualDesigner {
    initialized: boolean = false;
    public internalDesignerComponent : VueComponent;
    public containerHTMLElement: HTMLDivElement;
    mainEditingStyleSheet: CSSStyleSheet;
    editingIframeDocument: HTMLDocument;
    editingIframeWindow: Window;
    elementSelectionMovementHandler: ElementSelectionAndMovementManager;
    styleOtomation: StyleOtomator;
    textEditingHandler: ElementTextEditHandler;
    
    onResized = (element, pivot) => {
        console.info("resized: ");
        console.info(pivot);
        this.styleOtomation.commitStyleElement(pivot, StyleRuleState.normal);
        this.eventHandlers.onResized(element,pivot);
    }
    onMoved = (element, pivot) => {
        console.info("moved: ");
        console.info(pivot);

        this.styleOtomation.commitStyleElement(pivot, StyleRuleState.normal);
        // if (pivot.id == "mabel") {
        //     this.styleOtomation.commitStyleElement(pivot, StyleRuleState.hover);
        // }
        this.eventHandlers.onMoved(element,pivot);
    }
    onSelected = (element, pivot, styleRule) => {
        this.eventHandlers.onSelected(element,pivot,styleRule)
    }
    onEnteredTextChangeMode = (editingElement) => {
        this.elementSelectionMovementHandler.pause()
        this.eventHandlers.onEnteredTextChangeMode(editingElement);
    }
    onExitedTextChangeMode = (editingElement) => {
        this.elementSelectionMovementHandler.continue()
        this.eventHandlers.onExitedTextChangeMode(editingElement);
    }
    
    eventHandlers = {
        onResized: (element, pivot) => {

        },
        onMoved: (element, pivot) => {

        },
        onSelected: (element, pivot, stylerule) => {

        },
        onEnteredTextChangeMode: (editingElement) => {

        },
        onExitedTextChangeMode: (editingElement) => {

        },
        
    }
    eventHandlerSetters  = {
        onResized: (callback : (element, pivot) => any) => {
            this.eventHandlers.onResized = callback;
        },
        onMoved: (callback : (element, pivot) => any) => {
            this.eventHandlers.onMoved = callback;
        },
        onSelected: (callback : (element, pivot, stylerule) => any) => {
            this.eventHandlers.onSelected = callback;
        },
        onEnteredTextChangeMode: (callback : (editingElement) => any) => {
            this.eventHandlers.onEnteredTextChangeMode = callback;
        },
        onExitedTextChangeMode: (callback : (editingElement) => any) => {
            this.eventHandlers.onExitedTextChangeMode = callback;
        },
        setOnSelectedCallback:  (callback : (element, pivot, styleSheet) => any)  =>
        {
            this.eventHandlers.onSelected = callback;
        }
    }




    public constructor(bckgDivisionElement: HTMLDivElement, iframeElement: HTMLIFrameElement, frgDivisionElement: HTMLDivElement) {
        if (frgDivisionElement != null && iframeElement != null)
        this.initialize(bckgDivisionElement,iframeElement,frgDivisionElement);
    }



    initialize(bckgDivisionElement: HTMLDivElement, iframeElement: HTMLIFrameElement, frgDivisionElement: HTMLDivElement) {
        this.editingIframeWindow = iframeElement.contentWindow;
        this.editingIframeDocument = this.editingIframeWindow.document;

        this.elementSelectionMovementHandler = new ElementSelectionAndMovementManager(iframeElement, frgDivisionElement);
        this.elementSelectionMovementHandler.eventHandlerSetter.setOnMovedCallback(this.onMoved);
        this.elementSelectionMovementHandler.eventHandlerSetter.setOnResizedCallback(this.onResized);
        this.elementSelectionMovementHandler.eventHandlerSetter.setOnSelectedCallback(this.onSelected);
        this.textEditingHandler = new ElementTextEditHandler(iframeElement);
        this.textEditingHandler.eventHandlerSetter.setOnEnteredTextChangeMode(this.onEnteredTextChangeMode);
        this.textEditingHandler.eventHandlerSetter.setOnExitedTextChangeMode(this.onExitedTextChangeMode);

        this.mainEditingStyleSheet = this.getMainEditingStyleSheet();
        this.styleOtomation = new StyleOtomator(this.editingIframeWindow, this.mainEditingStyleSheet);
        this.initialized = true;
    }

    getMainEditingStyleSheet(): CSSStyleSheet {

        let stlsheets = this.editingIframeDocument.styleSheets;

        for (let i = 0; i < stlsheets.length; i++) {
            let stylesheet = stlsheets.item(i);
            //@ts-ignore iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
            if (stylesheet instanceof this.editingIframeWindow.CSSStyleSheet && stylesheet.ownerNode["id"] == EDITING_STYLESHEET_ID) {
                //@ts-ignore iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
                return stylesheet;
            }

        }
        //TODO: Add inserting stylesheet and save code
        throw new Error(`id='${EDITING_STYLESHEET_ID}' tagged sheet is not found`)
    }
    refreshElementEditEvents() {
        
    }
    public static createByDivAndCreate(containerElement: HTMLDivElement, internalDesignerComponent = null, secondarySrc = "about:blank") {
        let setPositionAbs = (el) => {
            el.style.setProperty("position", "absolute");
        }

        let applyStyle = (elements: HTMLDivElement[]) => {

            elements.forEach(element => {
                setPositionAbs(element);
                element.style.setProperty("height", "100%");
                element.style.setProperty("width", "100%");
            });
        };
        let bckDivElement: HTMLDivElement = document.createElement("div")
        let iframeElement: HTMLIFrameElement = document.createElement("iframe");
        iframeElement.setAttribute("frameborder", "0");
        let foregroundDivElement: HTMLDivElement = document.createElement("div");
        foregroundDivElement.classList.add("visualdesigner_foreground");
        applyStyle([bckDivElement, iframeElement]);
        setPositionAbs(foregroundDivElement);



        containerElement.append(bckDivElement, iframeElement, foregroundDivElement);

        let src = (containerElement.getAttribute("src") != null) ? containerElement.getAttribute("src") : secondarySrc ;
        iframeElement.setAttribute("src", src);
        let ivd = new InternalVisualDesigner(null, null, null);
        iframeElement.onload = () => {
            //ivd.refreshElementEditEvents();
            ivd.initialize(bckDivElement, iframeElement, foregroundDivElement);
            ivd.internalDesignerComponent = internalDesignerComponent;
            ivd.containerHTMLElement = containerElement;
            internalDesignerComponent.internalVisualDesigner = ivd; 
        }
        return ivd;
    }
 

    


}