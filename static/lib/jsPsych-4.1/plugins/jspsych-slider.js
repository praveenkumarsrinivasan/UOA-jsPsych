/**
 * Josh de Leeuw
 * November 2013
 * 
 * This is a basic template for a jsPsych plugin. Use it to start creating your
 * own plugin. There is more information about how to create a plugin on the
 * jsPsych wiki (https://github.com/jodeleeuw/jsPsych/wiki/Create-a-Plugin).
 * 
 * 
 */

(function($) {
    jsPsych["slider"] = (function() {

        var plugin = {};

        plugin.create = function(params) {

            // params enforceArray
            params = jsPsych.pluginAPI.enforceArray(params, ['slider']);

            var trials = new Array(params.timing_trial.length);
            for (var i = 0; i < trials.length; i++) {
                trials[i] = {};
                trials[i].type = "slider";

                // timing parameters
                trials[i].timing_trial = params.timing_trial[i];
                trials[i].timing_response = params.timing_response || -1; // if -1, then wait for response forever

                trials[i].data = (typeof params.data === 'undefined') ? {} : params.data[i];
                trials[i].cont_key = params.cont_key || []; // keycode to press to advance screen, default is all keys.
                
                // trials[i].choices = params.choices || [];
                // trials[i].continue_after_response = (typeof params.continue_after_response === 'undefined') ? false : params.continue_after_response;
            }

            return trials;
        };

        plugin.trial = function(display_element, trial) {

            // if any trial variables are functions
            // this evaluates the function and replaces
            // it with the output of the function
            trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);

            // this array holds handlers from setTimeout calls
            // that need to be cleared if the trial ends early
            var setTimeoutHandlers = [];

            display_element.append($('<div>', {
                "id": 'slider',
                "class": 'slider'
            }));
            // display_element.append('<br/><p>Press any key to continue</p>');

            $('#slider')
                .css("margin-top", (Math.floor(Math.random() * 200) + 1).toString() + 'px')
                .slider({
                    min: 0,
                    max: 2000,
                    step: 100,
                    animate: 'fast',
                    change: function() {
                        //end trial if handle reaches the max value
                        var val = parseInt($('#slider').slider('option', 'value'), 10);
                        var max = parseInt($('#slider').slider('option', 'max'), 10);
                        if (val >= max) {
                            end_trial('max_value_reached');
                        }
                    },
                    slide: function(evt, ui) {
                        //end trail if the user clicks the slider handle
                        sliderMouseDown();
                    }
                });

            var sliderMouseDown = function(e) {
                e.stopImmediatePropagation();
            };

            $('a.ui-slider-handle.ui-state-default.ui-corner-all').bind('mousedown', function() {
                end_trial('handle_clicked');
            });

            var start_time = (new Date()).getTime();

            //slider handle slide speed - controlled by timing_trial
            setTimeoutHandlers.push(
                setInterval(function() {
                    $('#slider').slider('value', $('#slider').slider('option', 'value') + $('#slider').slider('option', 'step'));
                }, trial.timing_trial)
            );

            // end trial if time limit is set
            if (trial.timing_response > 0) {
                setTimeoutHandlers.push(
                    setTimeout(function() {
                        end_trial('timeout');
                    }, trial.timing_response)
                );
            }

            var end_trial = function(key_val) {
                // kill any remaining setTimeout handlers
                for (var i = 0; i < setTimeoutHandlers.length; i++) {
                    clearTimeout(setTimeoutHandlers[i]);
                }

                // kill keyboard listeners
                // if(typeof keyboardListener !== 'undefined') {
                // jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
                // }

                // clear the display
                display_element.html('');

                //save data
                var rt = (new Date()).getTime() - start_time;
                save_data(key_val, rt);

                if (trial.timing_post_trial > 0) {
                    setTimeout(function() {
                        jsPsych.finishTrial();
                    }, trial.timing_post_trial);
                } else {
                    jsPsych.finishTrial();
                }
            };

            function save_data(r_type, rt) {
                jsPsych.data.write($.extend({}, {
                    "rt": rt,
                    "r_type": r_type
                }, trial.data));
            }

            //check if key is 'mouse'
            // if (trial.cont_key == 'mouse') {
            //     // display_element.click(mouse_listener);
            //     // var start_time = (new Date()).getTime();
            // } else {
            //     // jsPsych.pluginAPI.getKeyboardResponse(after_response, trial.cont_key);
            // }

            //function to handle mouse responses
            // var mouse_listener = function(e) {
            //     var rt = (new Date()).getTime() - start_time;
            //     display_element.unbind('click', mouse_listener);
            //     after_response({key: 'mouse', rt: rt});
            // };

            // // function to handle keyboard responses
            // var after_response = function(info) {
            //     end_trial(info.key);
            // };

        };

        return plugin;
    })();
})(jQuery);
