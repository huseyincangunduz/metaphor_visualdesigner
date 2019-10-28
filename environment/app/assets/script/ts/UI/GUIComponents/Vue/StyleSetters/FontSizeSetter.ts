export default Vue.component("stl-font-size-setter",{

    template:`
        <div>
            <input type="range" v-model="value_computed" @value min="0" max="100">
        
        </div>
    `,
    watch:
    {
        value_computed(n,o)
        {
            this.value = n + "pt";
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
        
            let val_i = parseInt(this.value ? this.value : this.initialVal);
            return !isNaN(val_i) ? val_i : 20;
        },
        // onChangedNotify: function()
        // {
        //     this.$emit("style-ui-set", this.initialKey, this.value + "pt");
        // }
    }




})