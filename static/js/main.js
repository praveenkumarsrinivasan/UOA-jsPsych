requirejs.config({
    baseUrl: '',
    paths: {
        'jquery': 'static/lib/jquery-1.11.3.min',
        'backbone': 'static/lib/backbone-1.2.0.min',
        'bootstrap': 'static/lib/bootstrap-3.3.4.min',
        'text': 'static/lib/require-text-2.0.14',
        'underscore': 'static/lib/underscore-1.8.3.min'
    },
    shim: {
        'backbone': {
            deps: ["underscore", "jquery"],
        },
        'bootstrap': {
            deps: ["jquery"],
        }
    }
});


