import { ElementResizeHandler } from "./ElementResizerHandler.js";
import { MovementUtils, Range } from "../Utils.js";
import { ElementMovementHandler } from "./ElementMovementHandler.js";
import { ElementTextEditHandler } from "./ElementTextEditHandler"

class ElementSelectionAndMovementManager {


    MainWinDocument: Document;
    designerIframeDocument: Document;
    designerIframeWindow: Window;
    iframeElement: Element;
    elementMovementHandler: ElementMovementHandler;
    selectedElements: Array<Element> = [];
    resizeHandler: ElementResizeHandler;
    movementEnabled = true;

    mouseDownEvent: (this: Document, ev: MouseEvent) => any = (ev) => {
        if (this.movementEnabled) {

            //@ts-ignore iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
            if (ev.target instanceof this.designerIframeWindow.HTMLElement && ev.target != this.designerIframeDocument.documentElement) {
     
                this.clearSelectedElements();
                //@ts-ignore iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
                let targetElement_: HTMLElement = ev.target;
                let targetElementComputedStyle = this.designerIframeWindow.getComputedStyle(targetElement_);
                this.selectIFrameElement(targetElement_);
                let sadeceVurgulama = false;
                if (targetElement_ != this.designerIframeDocument.body && targetElement_ != this.designerIframeDocument.documentElement && targetElementComputedStyle.position != "static") {
                    this.elementMovementHandler.hold(ev, this.selectedElements);
                    
                }
                else sadeceVurgulama = true;
                this.resizeHandler.select(targetElement_,sadeceVurgulama);
                this.eventHandlers.onSelected(this.selectedElements,targetElement_,null);
                this.resizeHandler.hideDots();
            }
            
        }

    };
    mouseMoveEvent: (this: Document, ev: MouseEvent) => boolean = (ev) => {
        if (this.elementMovementHandler.isHolded())
        {
            let moved = this.elementMovementHandler.move(ev);
            if (moved)
            {
                this.resizeHandler.updateDots();
            }
            return true; //Eğer moved ise true dönecek. text seçilebilmesi için false dönmesi gerekmekte. Text editing sıkıntı olmasın diye
            
        }
        return false;

    };
    mouseUpEvent: (this: Document, ev: MouseEvent) => any = (ev) => {
        
        this.elementMovementHandler.release();
        this.resizeHandler.updateDots();
    };


    eventHandlers = {
        onResized: (elements: HTMLElement[], pivot: HTMLElement) => {

        },
        onSelected: (element, pivot, styleSheet) => {

        },
        onMoved: (elements: HTMLElement[], pivot: HTMLElement) => {

        }
    }

    eventHandlerSetter = {
        setOnResizedCallback: (callback) => {
            this.eventHandlers.onResized = callback;
        },

        setOnMovedCallback: (callback) => {
            this.eventHandlers.onMoved = callback;
        },
        setOnSelectedCallback: (callback : (element, pivot, styleSheet) => any) => {
            this.eventHandlers.onSelected = callback;
        }
    }

    /** MovementHandler devre dışı bırakır
     * That makes Movement Handler disabled
     */
    public pause() {
        this.movementEnabled = false;
        this.resizeHandler.select(null);
    }

    /** MovementHandler'ı tekrar devreye girmesini sağlar
     * That makes Movement Handler enabled again
     */
    public continue() {
        this.movementEnabled = true;
    }


    public constructor(designerIframe: HTMLIFrameElement, foregroundElement: HTMLDivElement) {
        this.designerIframeDocument = designerIframe.contentDocument;
        this.designerIframeWindow = designerIframe.contentWindow;
        this.elementMovementHandler = new ElementMovementHandler(designerIframe);
        this.elementMovementHandler.eventHandlerSetter.setOnMovedCallback(
            (elements: HTMLElement[], pivot: HTMLElement) => {
                this.eventHandlers.onMoved(elements, pivot);
            }
        )




        this.resizeHandler = new ElementResizeHandler(designerIframe, foregroundElement);
        this.resizeHandler.eventHandlerSetter.setOnResizedCallback((elements: HTMLElement[], pivot: HTMLElement) => {
            this.eventHandlers.onResized(elements, pivot)
        })


        this.addEventsOnDocument();
    }


    clearSelectedElements() {
        while (this.selectedElements.length > 0) {
            this.selectedElements.pop();
        }
    }

    addEventsOnDocument() {

        this.designerIframeDocument.addEventListener("mousedown", this.mouseDownEvent);
        this.designerIframeDocument.addEventListener("mousemove", this.mouseMoveEvent);
        this.designerIframeDocument.addEventListener("mouseup", this.mouseUpEvent);
        this.designerIframeDocument.addEventListener("scroll", () => {
            this.resizeHandler.updateDots();
        });
    }


    selectIFrameElement(el: Element): void {
        this.selectedElements.push(el);
    }





}

export { ElementSelectionAndMovementManager };