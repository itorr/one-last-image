Vue.component('ui-switch',{
    template: `<span class="ui-switch-box" 
        :data-checked="value" 
        :data-disabled="disabled"
        @touchend.prevent.stop="_switch"
        @click.prevent.stop="_switch">
        <a class="switch" :style="{color}">
            <i class="slider"></i>
        </a>
        <span><slot></slot></span>
    </span>`,
    props:{
        value: Boolean,
        color: String,
        disabled: Boolean,
    },
    methods:{
        _switch(){
            this.$emit('input',!this.value);
        }
    }
})