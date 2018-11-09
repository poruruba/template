var vue_options = {
    el: "#top",
    data: {
        progress_title: '',
        client_id: '',
        redirect_uri: '',
        response_type: '',
        scope: '',
        state: ''
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
        proc_load();
        this.client_id = searchs.client_id;
        this.redirect_uri = searchs.redirect_uri;
        this.response_type = searchs.response_type;
        this.scope = searchs.scope;
        this.state = searchs.state;
    }
};

//vue_add_methods(vue_options, methods_sample);
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

var hashs = {};
var searchs = {};

function proc_load() {
  hashs = parse_url_vars(location.hash);
  searchs = parse_url_vars(location.search);
}

function parse_url_vars(param){
  if( param.length < 1 )
      return {};

  var hash = param;
  if( hash.slice(0, 1) == '#' || hash.slice(0, 1) == '?' )
      hash = hash.slice(1);
  var hashs  = hash.split('&');
  var vars = {};
  for( var i = 0 ; i < hashs.length ; i++ ){
      var array = hashs[i].split('=');
      vars[array[0]] = array[1];
  }

  return vars;
}
