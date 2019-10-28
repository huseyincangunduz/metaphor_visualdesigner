
//this.$emit("stl-ui-set",this.initialKey, this.value);
import { ColorPicker } from "./ColorSetter/ColorPicker.js"
export default Vue.component("stl-color-setter",{

    template:`
        <div>
           <color-picker @color-selected="colorSelected"></color-picker>
        
        </div>
    `,
    components:{
        ColorPicker
    },
    watch:
    {

    },
    props:
    {
        initialKey: String,
        initialVal: String
    },data()
    {
        return {
            value: this.initialVal,
            key: this.initialKey,
        
        }
    },
    methods:
    {
        colorSelected({ hsl })
        {
            let pickedColor = `hsl(${hsl.h},${hsl.s * 100 + "%"},${hsl.l * 100 + "%"})`;
            this.$emit("stl-ui-set",this.key, pickedColor);
        }
        // onChangedNotify: function()
        // {
        //     this.$emit("style-ui-set", this.initialKey, this.value + "pt");
        // }
    }




})