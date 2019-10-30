
import { MovementUtils, Range } from "../Utils.js";
export class ElementMovementHandler {
    eventHandlers = {
        onMoved: (elements: Array<HTMLElement | EventTarget>, pivot: HTMLElement) => {

        }
    }

    eventHandlerSetter = {
        setOnMovedCallback: (callback) => {
            this.eventHandlers.onMoved = callback;
        }
    }

    pivot: HTMLElement;
    selectedElements: Array<HTMLElement | EventTarget>
    private leftMouseBtnIsDown: boolean;
    isHolded() : boolean{
        return this.leftMouseBtnIsDown;
    }

    DesigningPageIframeDoc: Document;
    startedLocation: { X: number; Y: number; } = { X: 0, Y: 0 };
    DesigningPageIframeWin: Window;

    pivotjq: JQuery<HTMLElement>;
    pivotOffset: any;


    public constructor(designingPageIframe: HTMLIFrameElement) {
        this.DesigningPageIframeDoc = designingPageIframe.contentDocument;
        this.DesigningPageIframeWin = designingPageIframe.contentWindow;

    }

    setClickedLocation(arg0: { X: number, Y: number }) {
        /*TODO: Eğer haraket ettirme alakalı sınıfı kullanırsak 
        arg0'ı o sınıfa da aktarmalıyız. 
        Aynı şekilde de tekrar boyutlandırma işleminde de*/
        this.startedLocation = arg0;

    }
    hold(ev: MouseEvent, holdedElements: Array<Element>) {
        //@ts-ignore
        if (ev.target instanceof this.DesigningPageIframeWin.HTMLElement) {
            ev.preventDefault();
            this.selectedElements = holdedElements.copyWithin(0, 0, holdedElements.length);
            //@ts-ignore
            this.pivot = ev.target;
            this.pivotjq = jQuery(this.pivot);
            this.setClickedLocation(MovementUtils.position(ev.pageX, ev.pageY));
            this.pivotOffset = this.pivotjq.offset();//{left: this.pivot.offsetLeft, top: this.pivot.offsetTop} ;
            this.leftMouseBtnIsDown = true;

        }
     
    }
    move(ev: MouseEvent) {

        if (this.leftMouseBtnIsDown && this.pivot != null) {

            let last = {
                X: ev.pageX - this.startedLocation.X + this.pivotOffset.left,
                Y: ev.pageY - this.startedLocation.Y + this.pivotOffset.top
            }
            MovementUtils.setPosition(this.pivot, last);
            return true;
        } else 
            return false;
    }

    release() {
        if (this.leftMouseBtnIsDown)
        {
            this.leftMouseBtnIsDown = false;
            this.eventHandlers.onMoved(this.selectedElements, this.pivot);
        }

    }

    

}