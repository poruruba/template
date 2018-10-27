var vue_options = {
    el: "#top",
    data: {
        progress_title: ''
    },
    computed: {
    },
    methods: {
        dialog_open: function(target){
            $(target).modal({backdrop:'static', keyboard: false});
        },
        dialog_close: function(target){
            $(target).modal('hide');
        },
        panel_open: function(target){
            $(target).collapse("show");
        },
        panel_close: function(target){
            $(target).collapse("hide");
        },
        progress_open(title = '少々お待ちください。'){
            this.progress_title = title;
            this.dialog_open('#progress');
        },
        progress_close(){
            this.dialog_close('#progress');
        },
    },
    created: function(){
    },
    mounted: function(){
    }
};

vue_add_methods(vue_options, methods_sample);
console.log("vue methods add finished");

var vue = new Vue( vue_options );

function vue_add_methods(options, funcs){
    for(var func in funcs){
        options.methods[func] = funcs[func];
    }
}
function vue_add_computed(options, funcs){
    for(var func in funcs){
        options.computed[func] = funcs[func];
    }
}
