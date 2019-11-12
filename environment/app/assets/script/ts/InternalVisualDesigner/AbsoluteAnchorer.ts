import { CommitParameter } from "./StyleOtomator.js";
import { TextControlling } from "../Utils.js";

export class AbsoluteAnchorer {

    public static modify(elementRelatedStyle: CSSStyleDeclaration, computedStyle: CSSStyleDeclaration, commitParams: CommitParameter, editingElement: HTMLElement) {

        //Senaryo 1:  Element right özelliği taşıyor  mu  Aynı zamanda da esasında absolute ya da fixed midir.?
        if (TextControlling.isNotEmpty(elementRelatedStyle.right) && (elementRelatedStyle.position == "absolute" || elementRelatedStyle.position == "fixed")) {
            let inlineStlLeft = TextControlling.isNotEmpty(editingElement.style.left);

            //Senaryo 2: Left ve Right özelliği  var mı? (R zaten var ama Left var mı)
            if (TextControlling.isNotEmpty(elementRelatedStyle.left)) {
                //Senaryo 2.1 Stylesheette Width özelliği var mı? eğer yok ise devam edilecek
                //Varsa zaten css motoru right'ı yok sayacak, o yüzden koddan çıkacağım
                if (TextControlling.isEmpty(elementRelatedStyle.width)) {

                    //editingElement.style.setProperty("right", computedStyle.right);
                    //Senaryo 2.1.1 - Inline 'da witdth var mı?
                    if (TextControlling.isNotEmpty(editingElement.style.width)) {
                        editingElement.style.setProperty("right", "unset");
                        editingElement.style.setProperty("width", computedStyle.width)
                        editingElement.style.setProperty("right", computedStyle.right);

                        commitParams.addProperty("width", null);
                        commitParams.addProperty("right", computedStyle.right);
                    }


                }


            }
            //senaryo 3: Sadece right varsa 
            else {

                AbsoluteAnchorer.applyForOnlyRight(elementRelatedStyle,computedStyle,commitParams,editingElement,inlineStlLeft);
            }
        }

    }

    public static applyForOnlyRight(elementRelatedStyle: CSSStyleDeclaration, computedStyle: CSSStyleDeclaration, commitParams: CommitParameter, editingElement: HTMLElement, inlineStlLeft : boolean)
    {
        if (!inlineStlLeft) editingElement.style.setProperty("left", computedStyle.left);
            editingElement.style.setProperty("right", "unset");
        
        if (TextControlling.isNotEmpty(editingElement.style.width))
            editingElement.style.setProperty("width", computedStyle.width);
        
        commitParams.addProperty("right", computedStyle.right);
        if (TextControlling.isNotEmpty(editingElement.style.width))
        {
            commitParams.addProperty("width", editingElement.style.width);
        }
        else {
            commitParams.dontTouch("width");
        }
        commitParams.addProperty("left", null);

    }
}