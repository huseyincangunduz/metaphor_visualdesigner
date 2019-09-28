import { MovementUtils } from "./Utils.js";
export class ElementResizeHandler {
    constructor(iframeElement, resizerDotsAreaElement) {
        this.resizerdots_msdown /*: (this: Document, ev: MouseEvent) => any*/ = (ev) => {
            if (ev.target instanceof HTMLElement) {
                if (ev.target.classList.contains("selectedElementResizer") && !this.onlyEmphasizeDots) {
                    this.resizingMode.horizontalMode = ev.target.getAttribute("hdirection");
                    this.resizingMode.verticalMode = ev.target.getAttribute("vdirection");
                    this.msdownResizerDotOffset = $(ev.target).offset();
                    this.startupLocation = MovementUtils.position(ev.pageX, ev.pageY);
                    this.pivotOffset = $(this.pivot).offset();
                    let pivot_computedStyle = getComputedStyle(this.pivot);
                    //let verticalBordersThickness = + parseInt(pivot_computedStyle.borderRightWidth.replace("px","")) + parseInt(pivot_computedStyle.borderLeftWidth.replace("px",""));
                    //let determinedWidth = this.pivot.clientWidth + verticalBordersThickness;
                    let determinedWidth = parseInt(pivot_computedStyle.width.replace("px", ""));
                    determinedWidth = determinedWidth == null || isNaN(determinedWidth) ? this.pivot.clientWidth : determinedWidth;
                    this.pivotStartSize = MovementUtils.size(determinedWidth, this.pivot.clientHeight);
                    this.resizingCallbacks = ResizerUtils.getCallbackForDot(this.resizingMode);
                    this.mouseIsDown = true;
                }
                else {
                    this.mouseIsDown = false;
                }
            }
        };
        this.resizerdots_msmove = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            if (ev.target instanceof HTMLElement && this.mouseIsDown /*&& ev.button == 0*/) {
                let deltas = {
                    X: ev.pageX - this.startupLocation.X,
                    Y: ev.pageY - this.startupLocation.Y
                };
                /*           if (ev.shiftKey) {
                               if (this.resizingMode.horizontalMode != '' && this.resizingMode.verticalMode != ''
                                   && ((Math.abs(deltas.X) < 10 || Math.abs(deltas.Y) < 10) && !(Math.abs(deltas.X) < 10 && Math.abs(deltas.Y) < 10))) {
                                   if (Math.abs(deltas.X) > 10) {
                                       let sgn = Math.sign(deltas.Y);
                                       if (sgn == null || sgn == 0)  sgn = 1;
                                       deltas.Y = deltas.X * sgn;
               
                                   }
                                   else
                                       if (Math.abs(deltas.Y) > 10) {
                                           let sgn = (this.resizingMode.horizontalMode == 'r' && this.resizingMode.verticalMode == 'd' ) ? 1 : Math.sign(deltas.Y) ;
                                           deltas.X = Math.abs(deltas.Y ) * sgn;
                                       };
                               }
                           }
               */
                this.resizingCallbacks.resizeAtX(deltas.X, this.pivot, null, this.pivotStartSize.Width, this.pivotOffset.left);
                this.resizingCallbacks.resizeAtY(deltas.Y, this.pivot, null, this.pivotStartSize.Height, this.pivotOffset.top);
                this.updateDots();
            }
        };
        this.eventHandlers = {
            onResized: (elements, pivot) => {
            }
        };
        this.eventHandlerSetter = {
            setOnResizedCallback: (callback) => {
                this.eventHandlers.onResized = callback;
            }
        };
        this.resizerdots_msup = (ev) => {
            this.disableResizingWithMouse();
        };
        this.designerIframe = iframeElement;
        this.designerIframeDocument = iframeElement.contentDocument;
        this.designerIframeWindow = iframeElement.contentWindow;
        this.editorDocument = resizerDotsAreaElement.ownerDocument;
        this.resizerDotsArea = resizerDotsAreaElement;
        this.initializeResizer();
    }
    disableResizingWithMouse() {
        if (this.mouseIsDown) {
            this.mouseIsDown = false;
            this.eventHandlers.onResized([this.pivot], this.pivot);
        }
    }
    hideDots() {
        this.resizerDotsJQ.hide();
    }
    setResizerDotsEventHandlers() {
        this.editorDocument.addEventListener("mousedown", this.resizerdots_msdown);
        this.editorDocument.addEventListener("mousemove", this.resizerdots_msmove);
        this.designerIframeDocument.addEventListener("mousemove", this.resizerdots_msmove);
        this.editorDocument.addEventListener("mouseup", this.resizerdots_msup);
        //this.editorDocument.addEventListener("mouseleave", this.resizerdots_msup);
        this.designerIframeDocument.addEventListener("mouseup", this.resizerdots_msup);
    }
    select(pivot, onlyEmphasize = false) {
        if (pivot != null) {
            this.pivot = pivot;
            this.updateDots();
            this.onlyEmphasizeDots = onlyEmphasize;
        }
        else {
            this.hideDots();
            this.onlyEmphasizeDots = false;
        }
    }
    updateDots() {
        if (this.pivot != null) {
            this.resizerDotsJQ.show();
            let rect = this.pivot.getBoundingClientRect();
            let origins = this.designerIframe.getBoundingClientRect();
            let h = rect.height, w = rect.width, t = rect.top + origins.top - 3, l = rect.left + origins.left - 3, r = l + w, b = t + h;
            jQuery(".selectedElementResizer[vdirection='u'][hdirection='']").offset({ left: l + (w / 2), top: t });
            jQuery(".selectedElementResizer[vdirection='u'][hdirection='l']").offset({ left: l, top: t });
            jQuery(".selectedElementResizer[vdirection='u'][hdirection='r']").offset({ left: r, top: t });
            jQuery(".selectedElementResizer[vdirection='d'][hdirection='']").offset({ left: l + (w / 2), top: b });
            jQuery(".selectedElementResizer[vdirection='d'][hdirection='l']").offset({ left: l, top: b });
            jQuery(".selectedElementResizer[vdirection='d'][hdirection='r']").offset({ left: r, top: b });
            jQuery(".selectedElementResizer[vdirection=''][hdirection='l']").offset({ left: l, top: t + (h / 2) });
            jQuery(".selectedElementResizer[vdirection=''][hdirection='r']").offset({ left: r, top: t + (h / 2) });
        }
    }
    insertResizerDots() {
        /* Eğer noktalar yoksa noktaları ekler ve ardından eventleri ekleyen fonksiyon çağırılır */
        var verticalDirections = ["", "u", "d"], horizontalDirections = ["l", "r", ""];
        var allresizers = this.resizerDotsArea.querySelectorAll(".selectedElementResizer");
        if (allresizers.length != 8) {
            this.resizerDotsArea.innerHTML = "";
            var allTags = "";
            for (let iv = 0; iv < 3; iv++) {
                for (let ih = 0; ih < 3; ih++) {
                    if (horizontalDirections[ih] != "" || verticalDirections[iv] != "") {
                        let tag = "<div class='selectedElementResizer' vDirection='v_' hDirection='h_'></div>";
                        tag = tag.replace("v_", verticalDirections[iv]).replace("h_", horizontalDirections[ih]);
                        allTags += tag;
                    }
                }
            }
            jQuery(this.resizerDotsArea).append(allTags);
        }
        this.resizerDotsJQ = jQuery(".selectedElementResizer");
    }
    initializeResizer() {
        //TODO: İNSERT initialization code
        this.resizingMode = { horizontalMode: "", verticalMode: "" };
        this.resizingCallbacks = {
            resizeAtX: (deltaX, targetPivotElement, rd, startWidth, trgtElStartX) => {
            }, resizeAtY: (deltaY, targetPivotElement, rd, startHeight, trgtElStartY) => {
            }
        };
        this.insertResizerDots();
        this.setResizerDotsEventHandlers();
    }
}
class ResizerUtils {
    static getCallbackForDot(rotation) {
        let resizeAtX, resizeAtY;
        console.log(rotation);
        switch (rotation.horizontalMode) {
            case "r":
                resizeAtX = function (deltaX, targetPivotElement, rd, startWidth) {
                    let newW = startWidth + deltaX;
                    if (newW > 50 || deltaX > 0) {
                        targetPivotElement.style["width"] = newW + "px";
                    }
                };
                break;
            case "l":
                resizeAtX = function (deltaX, targetPivotElement, rd, startWidth, trgtElStartX) {
                    let newW = startWidth - deltaX;
                    if (newW > 50 || deltaX < 0) {
                        targetPivotElement.style["width"] = newW + "px";
                        jQuery(targetPivotElement).offset({ left: trgtElStartX + deltaX });
                    }
                };
                break;
            default:
                resizeAtX = function () {
                };
                break;
        }
        switch (rotation.verticalMode) {
            case "d":
                resizeAtY = function (deltaY, targetPivotElement, rd, startHeight) {
                    let newH = startHeight + deltaY;
                    if (newH > 50 || deltaY > 0) {
                        targetPivotElement.style["height"] = newH + "px";
                    }
                };
                break;
            case "u":
                resizeAtY = function (deltaY, targetPivotElement, rd, startHeight, trgtElStartY) {
                    let newH = startHeight - deltaY;
                    if (newH > 50 || deltaY < 0) {
                        targetPivotElement.style["height"] = newH + "px";
                        jQuery(targetPivotElement).offset({ top: trgtElStartY + deltaY });
                    }
                };
                break;
            default:
                resizeAtY = function () {
                };
                break;
        }
        return { resizeAtX: resizeAtX, resizeAtY: resizeAtY };
    }
}
