require(
    [
        'jquery',
        'underscore',
        'static/js/model/collection.js',
        'text',
        'text!header.html',
        'text!ad/ad1_template.html',
        'text!ad/ad2_template.html'
    ], function($, _, ConfigCollection, text, header, ad1, ad2) {
    
        var header_template = _.template(header);
        $('#header_template').html( header_template );
        
        var ad_configCollection = new ConfigCollection(); 
        ad_configCollection.fetch({
            url: 'static/data/ad.json',
            success: function() {                
            },
            complete: function() {
                
                var template1 = _.template(ad1);
                $('#ad1_template').html( template1(ad_configCollection.at(0).attributes) );

                var template2 = _.template(ad2);
                $('#ad2_template').html( template2(ad_configCollection.at(0).attributes) );
            }
        });
        
        return ad_configCollection;
    }
);
