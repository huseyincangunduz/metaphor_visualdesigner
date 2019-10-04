//Components
import StylesComponent from "./Vue/StylesComponent.js";
import StyleAdder from "./Vue/StyleAdder.js";
import StyleChanger from "./Vue/StyleChanger.js";
import InternalVisualDesignerComponent from "./Vue/InternalVisualDesignerComponent.js";
import VisualDesignerEnvironment from "./Vue/VisualDesignerEnvironment.js";
//@ts-ignorets
window.Morphosium = {
    Metaphor: {
        Components: {
            StyleAdder, StyleChanger, StylesComponent, InternalVisualDesignerComponent, VisualDesignerEnvironment
        }
    }
};
