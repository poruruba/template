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
var vue = new Vue( vue_options );

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
