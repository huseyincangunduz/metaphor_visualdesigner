const METAPHOR_SUBTEXT = "metaphor-subtext";
import * as Constants from "./VisualDesignerConst.js"
import { AncestorParentUtils } from "../Utils.js"

export class ElementTextEditHandler {
    iframeWindow: Window;
    iframeDocument: Document;
    onTextEditing: boolean;
    textEditingElement: any;
    constructor(iframeElement: HTMLIFrameElement) {
        this.iframeWindow = iframeElement.contentWindow;
        this.iframeDocument = this.iframeWindow.document;
        this.iframeDocument.addEventListener("dblclick", (e) => {
            this.enterTextEditing(e.target);
        });
        this.iframeDocument.addEventListener("click", (e) => {
            if (this.onTextEditing) {
                //@ts-ignore
                let targetEl: HTMLElement = e.target, mainEditElement = null;
                let clbck = (currentParent) => {
                    if (currentParent == this.textEditingElement) {
                        mainEditElement = currentParent;
                        return true;
                    }
                }
                this.ancestoringHandle(targetEl, clbck);

                if (mainEditElement == null) {
                    this.setTextEditingElement(null);
                }

            }

        });
    }
    enterTextEditing(editingElement) {

        if (editingElement.tagName.toUpperCase() == "DIV" || editingElement.tagName.toUpperCase() == "SPAN") {
        
            let textEditingElement = this.getReachableClickedElement(editingElement);

            this.setTextEditingElement(textEditingElement);
        }
    }
    setTextEditingElement(textEditingElement) {
        if (textEditingElement != null) {
            this.textEditingElement = textEditingElement;
            textEditingElement.setAttribute("contenteditable", "true");
            textEditingElement.focus();
            this.eventHandler.onEnteredTextChangeMode(textEditingElement);
            this.onTextEditing = true
        }
        else if (this.textEditingElement != null) {
            
            this.textEditingElement.removeAttribute("contentEditable");
            this.eventHandler.onExitedTextChangeMode(this.textEditingElement);
            this.onTextEditing = false;
        }
    }
    exitTextEditing() {

        this.setTextEditingElement(null);
    }

    getReachableClickedElement(dataTarget) {
        /**Eğer divin içi metin olarak düzenlenmiş ise ve ya altındaki elementleri düzenlemesini engellemek için
         * 
         */
        return AncestorParentUtils.goParentToTextElement(dataTarget);
        
         /*let clickedElement : HTMLElement = dataTarget;
        
        while (clickedElement.getAttribute(Constants.METAPHOR_ATTRIBUTE_NAME).indexOf(Constants.METAPHOR_TEXT_ELEMENT) > -1 && clickedElement != document.body.parentElement) {
            clickedElement = clickedElement.parentElement;
        }
        return clickedElement;*/
    }

    
    /**
     * 
     * @param element Editing element
     * @param callback Every iteration, this function run with , (if true is returned, loop will be stopped)
     */
    ancestoringHandle(element: HTMLElement, callback: Function) {
        AncestorParentUtils.ancestoringHandle(element, callback);
    }


    eventHandler = {
        onEnteredTextChangeMode: (editingElement) => {

        },
        onExitedTextChangeMode: (editingElement) => {

        }
    }
    eventHandlerSetter = {
        setOnEnteredTextChangeMode: (callback: (editingElement: HTMLElement) => any) => {
            this.eventHandler.onEnteredTextChangeMode = callback;
        },
        setOnExitedTextChangeMode: (callback: (editingElement: HTMLElement) => any) => {
            this.eventHandler.onExitedTextChangeMode = callback;
        }
    }


}