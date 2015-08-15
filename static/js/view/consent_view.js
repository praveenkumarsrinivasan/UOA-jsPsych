require(
    [
        'jquery',
        'underscore',
        'static/js/model/collection.js',
        'text',
        'text!header.html',
        'text!consent/consent_template.html'
    ], function($, _, ConfigCollection, text, header, consent) {

        var header_template = _.template(header);
        $('#header_template').html( header_template );

        var consent_configCollection = new ConfigCollection(); 
        consent_configCollection.fetch({
            url: 'static/data/consent.json',
            success: function() {                
            },
            complete: function() {                   
                var template1 = _.template(consent);
                $('#consent_template').html( template1(consent_configCollection.at(0).attributes) );
            }
        });
        
        return consent_configCollection;
    }
);
