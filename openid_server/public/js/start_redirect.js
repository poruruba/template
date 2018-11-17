var vue_options = {
    el: "#top",
    data: {
        progress_title: '',
        token_endpoint: '/oauth2/token',
        grant_type: 'authorization_code',
        client_id: '',
        client_secret: '',
        code: '',
        refresh_token: '',
        redirect_uri: '',
        scope: '',
        state: null,
        id_token: null,
        access_token: null,
        refresh_token: null,
        expires_in: 0,
        token_state: null
    },
    computed: {
    },
    methods: {
        token_call: function(){
            var code_or_refresh = (this.grant_type == 'authorization_code') ? this.code : (this.grant_type == 'refresh_token') ? this.refresh_token : null;
            this.do_post_urlencoded(this.token_endpoint, this.grant_type, this.client_id, this.client_secret, this.redirect_uri, code_or_refresh );
        },
        do_post_urlencoded: function(url, grant_type, client_id, client_secret, redirect_uri, code_or_refresh){
            var params = {
                grant_type: grant_type,
                client_id: client_id,
                client_secret: client_secret,
                redirect_uri: redirect_uri
            };
            if( grant_type == 'authorization_code')
                params.code = code_or_refresh;
            else if( grant_type == 'refresh_token')
                params.refresh_token = code_or_refresh;
        
            var data = new URLSearchParams();
            for( var name in params )
                data.append(name, params[name]);
        
            var basic = 'Basic ' + btoa(client_id + ':' + client_secret);
            const headers = new Headers( { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : basic } );
            
            return fetch(url, {
                method : 'POST',
                body : data,
                headers: headers
            })
            .then((response) => {
                return response.json();
            })
            .then(result =>{
                console.log(result);
                this.id_token = result.id_token;
                this.access_token = result.access_token;
                this.refresh_token = result.refresh_token;
                this.expires_in = result.expires_in;
            });
        },
    },
    created: function(){
    },
    mounted: function(){
        this.redirect_uri = location.protocol + '//' + location.hostname + ((location.port) ? ':' + location.port : '') + '/redirect.html';
        proc_load();
        this.code = searchs.code;
        this.state = searchs.state;
        this.id_token = hashs.id_token;
        this.access_token = hashs.access_token;
        this.refresh_token = hashs.refresh_token;
        this.expires_in = hashs.expires_in;
        this.token_state = hashs.state;
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
