define(['backbone', 'static/js/model/model.js'], function(Backbone, Config) {
    var ConfigCollection = Backbone.Collection.extend({
        model: Config
    });

    return ConfigCollection;
});