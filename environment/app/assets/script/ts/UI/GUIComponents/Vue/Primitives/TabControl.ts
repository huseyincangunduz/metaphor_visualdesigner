import { ViewIndex } from "../../../../Utils.js";

Vue.component('tab-control', {
    template: ViewIndex.getViewSync("tab-control"/*,`

    <div>
    THIS IS TABCONTROL, BUT getView function is fucked up
    <div class="tab-pages-header">
        <ul>
            <li v-for="tab in tabs" :class="{ 'is-active': tab.isActive }">
                <a @click="selectTab(tab)">{{ tab.name }}</a>
            </li>
        </ul>
    </div>

    <div class="tabs-details">
        <slot></slot>
    </div>
</div>
    `*/),
    
    data() {
        return {    tabs: this.$children ? this.$children  : [] };
    },
    
    created() {
        
        this.tabs = this.$children;
        
    },
    methods: {
        selectTab(selectedTab) {
            this.tabs.forEach(tab => {
                tab.isActive = (tab.name == selectedTab.name);
            });
        }
    }
});

Vue.component('tab-page', {
    
    template: `

        <div v-show="isActive">
            <slot></slot>
        </div>

    `,
    
    props: {
        name: { required: true },
        selected: { default: false },

    },
    
    data() {
        
        return {
            isActive: false
        };
        
    },

    
    mounted() {
        
        this.isActive = this.selected;
        
    }
});
