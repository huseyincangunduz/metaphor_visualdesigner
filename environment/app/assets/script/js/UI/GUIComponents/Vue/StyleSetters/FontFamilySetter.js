export default Vue.component("stl-font-size-setter", {
    props: {
        initialKey: "String",
        initialVal: {
            type: String,
            default: "Initial"
        }
    },
    template: `
        <div>
            <input type="range" name="points" min="0" max="10"> 
        </div>
    `
});
