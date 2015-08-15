require(
    [
        'jquery',
        'underscore',
        'static/js/model/collection.js',
        'text',
        'text!header.html',
    ], function($, _, ConfigCollection, text, header) {
    
        var header_template = _.template(header);
        $('#header_template').html( header_template );
        
        var error_configCollection = new ConfigCollection(); 
        error_configCollection.fetch({
            url: 'static/data/error.json',
            success: function() {                
            },
            complete: function() {
                
                // var template1 = _.template(error);
                // $('#error_template').html( template1(error_configCollection.at(0).attributes) );
            }
        });
        
        return error_configCollection;
    }
);
