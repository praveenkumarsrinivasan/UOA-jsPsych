require(
    [
        'jquery',
        'underscore',
        'static/js/model/collection.js',
        'text',
        'text!header.html',
        'text!thanks/thanks_template.html'
    ], function($, _, ConfigCollection, text, header, thanks) {
        
        var header_template = _.template(header);
        $('#header_template').html( header_template );

        var thanks_configCollection = new ConfigCollection(); 
        thanks_configCollection.fetch({
            url: 'static/data/thanks.json',
            success: function() {                
            },
            complete: function() {   
                var template1 = _.template(thanks);
                $('#thanks_template').html( template1(thanks_configCollection.at(0).attributes) );
            }
        });
        
        return thanks_configCollection;
    }
);
