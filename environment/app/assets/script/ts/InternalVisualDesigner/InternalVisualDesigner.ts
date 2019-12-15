



import { ElementSelectionAndMovementManager } from './ElementSelectionAndMovementManager.js';
import { StyleOtomator } from "./PageCore/StyleOtomator.js"
import { ElementTextEditHandler } from "./ElementTextEditHandler.js";
import { PageCore } from './PageCore/PageCore.js';
import { StyleRuleState } from './PageCore/StylesheetRuleOperations.js';
import { WidthBreakpoint,DefaultWidthBreakpoint,IWidthBreakpoint } from './PageCore/WidthBreakpointsManager.js';

const EDITING_STYLESHEET_ID = "metaphor-main-editing-stylesheet";
export class InternalVisualDesigner {

    /** Internal Visual Designer (İç görsel tasarımcı) başlatıldı mı? */
    initialized: boolean = false;
    /** Bağlı olunan Vue Componenti */
    public internalDesignerComponent : VueComponent;
    /** İçerisinde IVD(İGT) saklanan element */
    public containerHTMLElement: HTMLDivElement;
    /**Varsayılan olarak düzenlenen CSS Sayfası dosyası.  */
    mainEditingStyleSheet: CSSStyleSheet;
    /** Düzenlenen Iframe Dökümanı */
    editingIframeDocument: HTMLDocument;
    /** Düzenlenen Iframe globalleri */
    editingIframeWindow: Window;
    /** Element seçimleri ve hareket ettirme, yeniden boyutlandırma gibi olaylarla ilgili olan özel sınıftır. Bu sınıfın içerisinde; Iframe'de açılan elementlere bir takım görev
     * yükleyerek bazı eventlara sahip olacaktır.
     */
    elementSelectionMovementHandler: ElementSelectionAndMovementManager;

    /** HTML İçindeki metinleri düzenlemek ile görevli sınıftır. Bu Iframe içerisindeki elementlere event ekleyerek çalışmaktadır. */
    textEditingHandler: ElementTextEditHandler;
    /** PageCore */
    public pageCore: PageCore;
    /** Yeniden boyutlandığında */
    private onResized = (element, pivot) => {
        //console.info("resized: ");
        //console.info(pivot);
        //Resize'dan sonra işleme (committing, her hareketten sonra satıriçi stilleri, ana stil sayfasına uygun hale getirilip taşınması) gerçekleştirilir 
        this.pageCore.commitStyleElement(pivot,StyleRuleState.normal);
        
        //onResized olarak emit edilir (üst sınıflar tarafından ayarlanan onResized eventi çalıştırılır)
        this.eventHandlers.onResized(element,pivot);
    }
    /**Haraket ettirildiğinde */
    private onMoved = (element, pivot) => {
        console.info("moved: ");
        console.info(pivot);
        //Haraket ettirmeden sonra işleme (committing, her hareketten sonra satıriçi stilleri, ana stil sayfasına uygun hale getirilip taşınması) gerçekleştirilir
        this.pageCore.commitStyleElement(pivot,StyleRuleState.normal);
        
        // if (pivot.id == "mabel") {
        //     this.styleOtomation.commitStyleElement(pivot, StyleRuleState.hover);
        // }
        //onMoved olarak emit edilir (üst sınıflar tarafından ayarlanan onMoved eventi çalıştırılır)
        this.eventHandlers.onMoved(element,pivot);
    }
    private onSelected = (element, pivot) => {
        //onSelected olarak emit edilir (üst sınıflar tarafından ayarlanan onSelected eventi çalıştırılır)
        this.eventHandlers.onSelected(element,pivot)
    }
    private onEnteredTextChangeMode = (editingElement) => {
        this.elementSelectionMovementHandler.pause()
        this.eventHandlers.onEnteredTextChangeMode(editingElement);
    }
    private onExitedTextChangeMode = (editingElement) => {
        this.elementSelectionMovementHandler.continue()
        this.eventHandlers.onExitedTextChangeMode(editingElement);
    }
    
    eventHandlers = {
        onResized: (element, pivot) => {

        },
        onMoved: (element, pivot) => {

        },
        onSelected: (element, pivot) => {

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
        onSelected: (callback : (element, pivot) => any) => {
            this.eventHandlers.onSelected = callback;
        },
        onEnteredTextChangeMode: (callback : (editingElement) => any) => {
            this.eventHandlers.onEnteredTextChangeMode = callback;
        },
        onExitedTextChangeMode: (callback : (editingElement) => any) => {
            this.eventHandlers.onExitedTextChangeMode = callback;
        },
        setOnSelectedCallback:  (callback : (element, pivot) => any)  =>
        {
            this.eventHandlers.onSelected = callback;
        }
    }
     




    public constructor(bckgDivisionElement: HTMLDivElement, iframeElement: HTMLIFrameElement, frgDivisionElement: HTMLDivElement) {
        if (frgDivisionElement != null && iframeElement != null)
        this.initialize(bckgDivisionElement,iframeElement,frgDivisionElement);
    }


    /** IVD'yi asıl başlatan fonksiyondur
     * inşa edilirken eğer foreground div ve background div null gelmediyse zaten otomatik olarak başlatılacaktır.
     */
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

        this.pageCore = new PageCore(this);


        //this.mainEditingStyleSheet = this.getMainEditingStyleSheet();
        //this.styleOtomation = new StyleOtomator(this.editingIframeWindow, this.mainEditingStyleSheet);
        this.initialized = true;
    }

    onBreakpointSelected(b: IWidthBreakpoint) {
        if (b instanceof WidthBreakpoint)
        {
            this.containerHTMLElement.style.setProperty("width",b.width+"px");
        }
        else  if (b instanceof DefaultWidthBreakpoint)
        {
            this.containerHTMLElement.style.setProperty("width","1200px");
        }
        this.internalDesignerComponent.selectedElementUpdate();
     }

    public static createByDivAndCreate(containerElement: HTMLDivElement, 
                                        internalDesignerComponent = null, 
                                        secondarySrc = "about:blank",
                                        afterCreated : (ivd : InternalVisualDesigner) => any) {
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
            //Sayfa yüklenmeden kurulum yapılmaması daha iyi...
            ivd.initialize(bckDivElement, iframeElement, foregroundDivElement);
            ivd.internalDesignerComponent = internalDesignerComponent;
            ivd.containerHTMLElement = containerElement;
            internalDesignerComponent.internalVisualDesigner = ivd; 
            afterCreated(ivd);
        }
   
    }
 

    


}