const fontWeightConstants = ["Extra-Light", "Light", "Semi-Light", "Normal", "Semi-Bold", "Bold", "Heavy", "Extra-Bold"]
    , fontWeightConstantVals = [100, 200, 300, 400, 500, 700, 800, 900];


export default Vue.component("stl-font-weight-setter",{

    template:`
        <div>
            <input type="range" v-model="value_computed"  min="0" max="9">
            <span class="btn" @click ="value_computed = 4">Normal</span>
            <span class="btn" @click ="value_computed = 7">Bold</span>
        </div>
    `,
    watch:
    {
        value_computed(n,o)
        {
            this.value = n * 100;
            this.$emit("stl-ui-set",this.initialKey, this.value);
        }
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
            value_computed: this.valueAsInt()
        }
    },
    methods:
    {
        valueAsInt(){
            if (this.value == "normal")
            {
                return 4
            }
            if (this.value == "bold")
            {
                return 7
            }
            else{
                let val_i = parseInt(this.value ? this.value : this.initialVal);
                return !isNaN(val_i) ? val_i / 100 : 4;
            }
    
        },
        // onChangedNotify: function()
        // {
        //     this.$emit("style-ui-set", this.initialKey, this.value + "pt");
        // }
    }




})