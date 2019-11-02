import { MovementUtils } from "../Utils.js";
export class ElementMovementHandler {
    constructor(designingPageIframe) {
        /**
         * Bir işlemin bitişinde tetiklenecek callback fonksiyonlarını tutan objedir
         */
        this.eventHandlers = {
            /**
             * Elementin haraket ettirdikten sonra tetiklenecek metoddur.
             */
            onMoved: (elements, pivot) => {
            }
        };
        /**
          * Bir işlemin bitişinde tetiklenecek callback fonksiyonlarını değiştirmeye yarayan metodları saklar
          */
        this.eventHandlerSetter = {
            setOnMovedCallback: (callback) => {
                this.eventHandlers.onMoved = callback;
            }
        };
        this.startedLocation = { X: 0, Y: 0 };
        this.DesigningPageIframeDoc = designingPageIframe.contentDocument;
        this.DesigningPageIframeWin = designingPageIframe.contentWindow;
    }
    isHolded() {
        return this.leftMouseBtnIsDown;
    }
    setClickedLocation(arg0) {
        /*TODO: Eğer haraket ettirme alakalı sınıfı kullanırsak
        arg0'ı o sınıfa da aktarmalıyız.
        Aynı şekilde de tekrar boyutlandırma işleminde de*/
        this.startedLocation = arg0;
    }
    /** Eleman seçimi yapılan işlemdir. Bu işlemde gerekli eleman seçilir, tutulur. */
    hold(ev, holdedElements) {
        //@ts-ignore
        if (ev.target instanceof this.DesigningPageIframeWin.HTMLElement) {
            ev.preventDefault();
            this.selectedElements = holdedElements.copyWithin(0, 0, holdedElements.length);
            //@ts-ignore
            this.pivot = ev.target;
            this.pivotjq = jQuery(this.pivot);
            this.setClickedLocation(MovementUtils.position(ev.pageX, ev.pageY));
            this.pivotOffset = this.pivotjq.offset(); //{left: this.pivot.offsetLeft, top: this.pivot.offsetTop} ;
            this.leftMouseBtnIsDown = true;
        }
    }
    move(ev) {
        if (this.leftMouseBtnIsDown && this.pivot != null) {
            let last = {
                X: ev.pageX - this.startedLocation.X + this.pivotOffset.left,
                Y: ev.pageY - this.startedLocation.Y + this.pivotOffset.top
            };
            MovementUtils.setPosition(this.pivot, last);
            return true;
        }
        else
            return false;
    }
    release() {
        if (this.leftMouseBtnIsDown) {
            this.leftMouseBtnIsDown = false;
            this.eventHandlers.onMoved(this.selectedElements, this.pivot);
        }
    }
}
