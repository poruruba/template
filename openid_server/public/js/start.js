var vue_options = {
    el: "#top",
    data: {
        progress_title: '',
        redirect_uri: '',
        authorize_endpoint: '/oauth2/authorize'
    },
    computed: {
    },
    methods: {
    },
    created: function(){
    },
    mounted: function(){
        this.redirect_uri = location.protocol + '//' + location.hostname + ((location.port) ? ':' + location.port : '') + '/redirect.html';
    }
};
var vue = new Vue( vue_options );
