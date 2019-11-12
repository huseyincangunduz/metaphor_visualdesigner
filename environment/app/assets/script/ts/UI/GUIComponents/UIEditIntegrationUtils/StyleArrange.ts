import { TextControlling } from "../../../Utils.js";

export class StyleOverrideManager {
    static modifiersHash = {};

    static mainModifiers = {
        "background": [
            "background-image",
            "background-position-x",
            "background-position-y",
            "background-size",
            "background-repeat-x",
            "background-repeat-y",
            "background-attachment",
            "background-origin",
            "background-clip",
            "background-color",
        ], "padding": [
            "padding-left",
            "padding-top",
            "padding-right",
            "padding-bottom"
        ],
        "border-radius": [
            "border-top-left-radius",
            "border-top-right-radius",
            "border-bottom-right-radius",
            "border-bottom-left-radius"
        ], "border": [
            "border-top-color",
            "border-top-style",
            "border-top-width",
            "border-right-color",
            "border-right-style",
            "border-right-width",
            "border-bottom-color",
            "border-bottom-style",
            "border-bottom-width",
            "border-left-color",
            "border-left-style",
            "border-left-width",
            "border-image-outset",
            "border-image-repeat",
            "border-image-slice",
            "border-image-source",
            "border-image-width",
        ],
        font:
            [
                "font-size",
                "font-family",

                "font-style",
                "font-variant-caps",
                "font-variant-ligatures",
                "font-variant-numeric","font-variant-east-asian",
                "font-variant",
                "font-weight",
                "font-variant",
                "font-stretch",
                "line-height"

            ],
        "margin": [
            "margin-top",
            "margin-bottom",
            "margin-left",
            "margin-right"
        ],
        "overflow": [
            "overflow-x",
            "overflow-y"
        ],

    }
    static initialized: boolean = false;

    public static getMainModifier(styleKey: string) {
        this.initialize();
        let k1 = this.modifiersHash[styleKey];
        if (k1) {
            let k2 = this.modifiersHash[k1]
            return k2 ? k1 : false;
        }
    }
    protected static initialize() {
        if (!this.initialized) {
            let hash = this.modifiersHash;
            let keys = Object.keys(this.mainModifiers);
            //TODO: For yerine hazır fonksiyonları incele ve varsa onlara uyarla
            for (let index = 0; index < keys.length; index++) {
                const mainModifNm = keys[index];
                const subModifiersArray = this.mainModifiers[mainModifNm];
                hash[mainModifNm] = subModifiersArray;
                for (let j = 0; j < subModifiersArray.length; j++) {
                    const subModifier = subModifiersArray[j];
                    hash[subModifier] = mainModifNm;
                }
            }
            this.initialized = true;
        }

    }


}
export class StyleObject {
    constructor(stylekey_, styleval_) {
        this.StyleKey = stylekey_;
        this.StyleValue = styleval_;
        this.subModifiers = [];

    }
    StyleKey: string;
    StyleValue: string;
    subModifiers: Array<StyleObject>;

}

export class StyleObjectCollector {


    public styleObjects: Array<StyleObject> = [];
    public keys: Array<string> = [];
    points : GenericObject<StyleObject> = {};
    public transferFromStyleDecleration(relatedStyleDecleration: CSSStyleDeclaration) {
        for (let i = 0; i < relatedStyleDecleration.length; i++) {
            const styleKey = relatedStyleDecleration[i],
                styleVal = relatedStyleDecleration[styleKey];

            this.insertKey(relatedStyleDecleration, styleKey, styleVal);

        }
    }
    addToArrays(stl_object: StyleObject) {
        let key = stl_object.StyleKey;

        this.styleObjects.push(stl_object);
        
        this.keys.push(key);

        this.points[key] = stl_object;
    }
    addToArrayAsSubModifier(mainMod: any, key: string, value: string) {
        let stlObject = new StyleObject(key, value);
        this.points[mainMod].subModifiers.push(stlObject);
        this.points[key] = stlObject;
    }
    public insertKey(relatedStyleDecleration: CSSStyleDeclaration, key: string, value: string) {
        let mainMod = StyleOverrideManager.getMainModifier(key);
        if (mainMod == false || TextControlling.isEmpty(relatedStyleDecleration[mainMod])) {

            let value = relatedStyleDecleration[key];
            let stl_object = new StyleObject(key, value);
            this.addToArrays(stl_object);

        }
        else {
            if (this.keys.indexOf(mainMod) == -1) {
                let stl_object = new StyleObject(mainMod, relatedStyleDecleration[mainMod]);
                this.addToArrays(stl_object);
            }
            this.addToArrayAsSubModifier(mainMod, key, value);

        }
    }


}
