//Primitive Components
import GhostTextBox from "./Vue/Primitives/GhostTextBox.js";
//ElementSetters
import FontWeightSetter from "./Vue/StyleSetters/FontWeightSetter.js";
import FontFamilySetter from "./Vue/StyleSetters/FontSizeSetter.js";
import ColorSetter from "./Vue/StyleSetters/ColorSetter.js";
//metaphor
import StylesComponent from "./Vue/StylesComponent.js";
import StyleAdder from "./Vue/StyleAdder.js";
import StyleChanger from "./Vue/StyleChanger.js";
import InternalVisualDesignerComponent from "./Vue/InternalVisualDesignerComponent.js";
import VisualDesignerEnvironment from "./Vue/VisualDesignerEnvironment.js";
//@ts-ignorets
window.Morphosium = {
    Metaphor: {
        Components: {
            GhostTextBox, StyleAdder, StyleChanger, StylesComponent, InternalVisualDesignerComponent, VisualDesignerEnvironment, FontFamilySetter, FontWeightSetter, ColorSetter
        }
    }
};
