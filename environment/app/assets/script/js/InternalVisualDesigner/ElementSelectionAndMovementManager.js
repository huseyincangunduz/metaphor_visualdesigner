import { ElementResizeHandler } from "./ElementResizerHandler.js";
import { ElementMovementHandler } from "./ElementMovementHandler.js";
class ElementSelectionAndMovementManager {
    constructor(designerIframe, foregroundElement) {
        this.selectedElements = [];
        this.movementEnabled = true;
        this.mouseDownEvent = (ev) => {
            if (this.movementEnabled) {
                //@ts-ignore iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
                if (ev.target instanceof this.designerIframeWindow.HTMLElement) {
                    this.clearSelectedElements();
                    //@ts-ignore iframe sınıflarına normal instanceof verdiğim zaman exception çıkıyordu. tek çarem window'tan sınıflara erişmek
                    let targetElement_ = ev.target;
                    let targetElementComputedStyle = this.designerIframeWindow.getComputedStyle(targetElement_);
                    this.selectIFrameElement(targetElement_);
                    let sadeceVurgulama = false;
                    if (targetElement_ != this.designerIframeDocument.body && targetElement_ != this.designerIframeDocument.documentElement && targetElementComputedStyle.position != "static") {
                        this.elementMovementHandler.hold(ev, this.selectedElements);
                    }
                    else
                        sadeceVurgulama = true;
                    this.resizeHandler.select(targetElement_, sadeceVurgulama);
                    this.eventHandlers.onSelected(this.selectedElements, targetElement_, null);
                    this.resizeHandler.hideDots();
                }
            }
        };
        this.mouseMoveEvent = (ev) => {
            if (this.elementMovementHandler.isHolded()) {
                let moved = this.elementMovementHandler.move(ev);
                if (moved) {
                    this.resizeHandler.updateDots();
                }
                return true; //Eğer moved ise true dönecek. text seçilebilmesi için false dönmesi gerekmekte. Text editing sıkıntı olmasın diye
            }
            return false;
        };
        this.mouseUpEvent = (ev) => {
            this.elementMovementHandler.release();
            this.resizeHandler.updateDots();
        };
        this.eventHandlers = {
            onResized: (elements, pivot) => {
            },
            onSelected: (element, pivot, styleSheet) => {
            },
            onMoved: (elements, pivot) => {
            }
        };
        this.eventHandlerSetter = {
            setOnResizedCallback: (callback) => {
                this.eventHandlers.onResized = callback;
            },
            setOnMovedCallback: (callback) => {
                this.eventHandlers.onMoved = callback;
            },
            setOnSelectedCallback: (callback) => {
                this.eventHandlers.onSelected = callback;
            }
        };
        this.designerIframeDocument = designerIframe.contentDocument;
        this.designerIframeWindow = designerIframe.contentWindow;
        this.elementMovementHandler = new ElementMovementHandler(designerIframe);
        this.elementMovementHandler.eventHandlerSetter.setOnMovedCallback((elements, pivot) => {
            this.eventHandlers.onMoved(elements, pivot);
        });
        this.resizeHandler = new ElementResizeHandler(designerIframe, foregroundElement);
        this.resizeHandler.eventHandlerSetter.setOnResizedCallback((elements, pivot) => {
            this.eventHandlers.onResized(elements, pivot);
        });
        this.addEventsOnDocument();
    }
    /** MovementHandler devre dışı bırakır
     * That makes Movement Handler disabled
     */
    pause() {
        this.movementEnabled = false;
        this.resizeHandler.select(null);
    }
    /** MovementHandler'ı tekrar devreye girmesini sağlar
     * That makes Movement Handler enabled again
     */
    continue() {
        this.movementEnabled = true;
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
    selectIFrameElement(el) {
        this.selectedElements.push(el);
    }
}
export { ElementSelectionAndMovementManager };
