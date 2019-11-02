import { ElementSelectionAndMovementManager } from './ElementSelectionAndMovementManager.js';
import { StyleOtomator, StyleRuleState } from "./StyleOtomator.js";
import { ElementTextEditHandler } from "./ElementTextEditHandler.js";
const EDITING_STYLESHEET_ID = "metaphor-main-editing-stylesheet";
export class InternalVisualDesigner {
    constructor(bckgDivisionElement, iframeElement, frgDivisionElement) {
        /** Internal Visual Designer (İç görsel tasarımcı) başlatıldı mı? */
        this.initialized = false;
        /** Yeniden boyutlandığında */
        this.onResized = (element, pivot) => {
            console.info("resized: ");
            console.info(pivot);
            //Resize'dan sonra işleme (committing, her hareketten sonra satıriçi stilleri, ana stil sayfasına uygun hale getirilip taşınması) gerçekleştirilir 
            this.styleOtomation.commitStyleElement(pivot, StyleRuleState.normal);
            //onResized olarak emit edilir (üst sınıflar tarafından ayarlanan onResized eventi çalıştırılır)
            this.eventHandlers.onResized(element, pivot);
        };
        /**Haraket ettirildiğinde */
        this.onMoved = (element, pivot) => {
            console.info("moved: ");
            console.info(pivot);
            //Haraket ettirmeden sonra işleme (committing, her hareketten sonra satıriçi stilleri, ana stil sayfasına uygun hale getirilip taşınması) gerçekleştirilir
            this.styleOtomation.commitStyleElement(pivot, StyleRuleState.normal);
            // if (pivot.id == "mabel") {
            //     this.styleOtomation.commitStyleElement(pivot, StyleRuleState.hover);
            // }
            //onMoved olarak emit edilir (üst sınıflar tarafından ayarlanan onMoved eventi çalıştırılır)
            this.eventHandlers.onMoved(element, pivot);
        };
        this.onSelected = (element, pivot, styleRule) => {
            //onSelected olarak emit edilir (üst sınıflar tarafından ayarlanan onSelected eventi çalıştırılır)
            this.eventHandlers.onSelected(element, pivot, styleRule);
        };
        this.onEnteredTextChangeMode = (editingElement) => {
            this.elementSelectionMovementHandler.pause();
            this.eventHandlers.onEnteredTextChangeMode(editingElement);
        };
        this.onExitedTextChangeMode = (editingElement) => {
            this.elementSelectionMovementHandler.continue();
            this.eventHandlers.onExitedTextChangeMode(editingElement);
        };
        this.eventHandlers = {
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
        };
        this.eventHandlerSetters = {
            onResized: (callback) => {
                this.eventHandlers.onResized = callback;
            },
            onMoved: (callback) => {
                this.eventHandlers.onMoved = callback;
            },
            onSelected: (callback) => {
                this.eventHandlers.onSelected = callback;
            },
            onEnteredTextChangeMode: (callback) => {
                this.eventHandlers.onEnteredTextChangeMode = callback;
            },
            onExitedTextChangeMode: (callback) => {
                this.eventHandlers.onExitedTextChangeMode = callback;
            },
            setOnSelectedCallback: (callback) => {
                this.eventHandlers.onSelected = callback;
            }
        };
        if (frgDivisionElement != null && iframeElement != null)
            this.initialize(bckgDivisionElement, iframeElement, frgDivisionElement);
    }
    initialize(bckgDivisionElement, iframeElement, frgDivisionElement) {
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
    getMainEditingStyleSheet() {
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
        throw new Error(`id='${EDITING_STYLESHEET_ID}' tagged sheet is not found`);
    }
    refreshElementEditEvents() {
    }
    static createByDivAndCreate(containerElement, internalDesignerComponent = null, secondarySrc = "about:blank") {
        let setPositionAbs = (el) => {
            el.style.setProperty("position", "absolute");
        };
        let applyStyle = (elements) => {
            elements.forEach(element => {
                setPositionAbs(element);
                element.style.setProperty("height", "100%");
                element.style.setProperty("width", "100%");
            });
        };
        let bckDivElement = document.createElement("div");
        let iframeElement = document.createElement("iframe");
        iframeElement.setAttribute("frameborder", "0");
        let foregroundDivElement = document.createElement("div");
        foregroundDivElement.classList.add("visualdesigner_foreground");
        applyStyle([bckDivElement, iframeElement]);
        setPositionAbs(foregroundDivElement);
        containerElement.append(bckDivElement, iframeElement, foregroundDivElement);
        let src = (containerElement.getAttribute("src") != null) ? containerElement.getAttribute("src") : secondarySrc;
        iframeElement.setAttribute("src", src);
        let ivd = new InternalVisualDesigner(null, null, null);
        iframeElement.onload = () => {
            //ivd.refreshElementEditEvents();
            ivd.initialize(bckDivElement, iframeElement, foregroundDivElement);
            ivd.internalDesignerComponent = internalDesignerComponent;
            ivd.containerHTMLElement = containerElement;
            internalDesignerComponent.internalVisualDesigner = ivd;
        };
        return ivd;
    }
}
