/*
 *
 * Metacognition Task - Experiment
 *
 */

var metacognition_task_exp = function(appModel) {

    //get a random image from the list of bird pics in repository
    //range of bird images in repo
    var memory_bird_range = appModel.attributes.exp_configCollection.at(0).attributes.memory_bird_range;
    //random pic to be displayed
    var memory_bird_number = Math.floor((Math.random() * memory_bird_range) + 1);
    var memory_image_numbers = [];

    //random list of bird images chosen to be displayed for the trial
    memory_image_numbers.push(memory_bird_number);
    while (memory_image_numbers.length < 3) {
        var val = Math.floor((Math.random() * memory_bird_range) + 1);
        if (_.indexOf(memory_image_numbers, val) == -1) {
            memory_image_numbers.push(val);
        }
    }
    memory_image_numbers = _.shuffle(memory_image_numbers);

    //compile the html templates
    var memory_bird_template = _.template(appModel.attributes.memory_bird);
    var memory_bird = memory_bird_template({
        'memory_bird_number': memory_bird_number
    });

    var memory_images_template = _.template(appModel.attributes.memory_images);
    var memory_images = memory_images_template({
        'memory_image_number_1': memory_image_numbers[0],
        'memory_image_number_2': memory_image_numbers[1],
        'memory_image_number_3': memory_image_numbers[2]
    });


    //define the blocks of the experiment
    var exp_name_block = {
        type: "text",
        text: appModel.attributes.meta_title,
        cont_key: "mouse"
    };

    var dot_block = {
        type: "text",
        text: appModel.attributes.dot,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.meta_timing_post_trial,
        cont_key: "mouse"
    };

    var bird_block = {
        type: "single-stim",
        stimuli: [memory_bird],
        is_html: true,
        //timing_response: appModel.attributes.exp_configCollection.at(0).attributes.meta_image_timing_response,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.meta_timing_post_trial,
        // response_ends_trial: false,
    };

    var slider_function_block = {
        type: 'slider',
        timing_trial: appModel.attributes.exp_configCollection.at(0).attributes.meta_slider_timing_trials,
        timing_response: appModel.attributes.exp_configCollection.at(0).attributes.meta_slider_timing_response,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.meta_timing_post_trial,
    };

    var images_block = {
        type: "single-stim",
        stimuli: [memory_images],
        is_html: true,
        // timing_response: exp_configCollection.at(0).attributes.meta_image_timing_response,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.meta_timing_post_trial,
        choices: [49, 50, 51]
        // response_ends_trial: false
    };

    var instructions_block = {
        type: "text",
        text: appModel.attributes.metacognition_instruction,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.meta_timing_post_trial,
        cont_key: "mouse"
    };

    var star_n_cloud_block = {
        type: "single-stim",
        stimuli: [appModel.attributes.star_cloud],
        is_html: true,
        choices: [49, 50]
    };

    var response_block = {
        type: "text",
        text: function() {
            //if the user is confident
            if (getConfidence()) {
                //if user choses the right image then display the correct template
                if (getResponse()) {
                    //award them 1 point
                    appModel.attributes.meta_exp_points++;
                    appModel.attributes.total_points++;
                    return appModel.attributes.correct;
                }
                //else display the incorrect template
                else {
                    return appModel.attributes.incorrect;
                }
            }
            //if the user is not confident then display the half moon template
            else {
                //50% of the time award them '1' point
                var prob = Math.floor((Math.random() * 2) + 1);
                if (prob == 2) {
                    appModel.attributes.meta_exp_points++;
                    appModel.attributes.total_points++;
                }
                return appModel.attributes.maybe;
            }
        },
        cont_key: "mouse"
    };

    var debrief_block = {
        type: "text",
        text: function() {
            var template = _.template(appModel.attributes.response_time);
            return template({
                'response_time': getAverageResponseTime(),
                'total_score': appModel.attributes.total_points
            });
        },
        cont_key: "mouse"
    }

    //function to check if the user was sure
    var getConfidence = function() {
        var trials = jsPsych.data.getTrialsOfType('single-stim');
        var key_press = parseInt(String.fromCharCode(trials[trials.length - 1].key_press), 10);

        if (key_press == 1) {
            return true;
        } else {
            return false;
        }
    }

    // function to get the response of the user
    //if the user chose the right image then return true
    //else return false
    var getResponse = function() {
        var trials = jsPsych.data.getTrialsOfType('single-stim');

        var current_trial = 0;
        //consider last three trails
        current_trial = trials.length - 1;

        //get the image number of the bird displayed
        var re = /(\d.png)/gi
        var num = (trials[current_trial - 2].stimulus).match(re);
        var image_num = parseInt(num[0].toLowerCase().replace('.png', ''), 10);

        //get the image number chosen by the user
        var choice = -1;
        if (trials[current_trial - 1].key_press > -1) { //if user responsed
            var key_press = parseInt(String.fromCharCode(trials[current_trial - 1].key_press), 10) - 1;
            //-1 because we have to chose the corresponding user choice image in the array
            num = (trials[current_trial - 1].stimulus).match(re);
            choice = parseInt(num[key_press].toLowerCase().replace('.png', ''), 10);
        }

        if (image_num == choice) {
            return true;
        } else {
            return false;
        }
    }

    //function to compute the average response time
    //for trials where handle was clicked
    var getAverageResponseTime = function() {
        var trials = jsPsych.data.getTrialsOfType('slider');

        var sum_rt = 0;
        var valid_trial_count = 0;

        var current_trial = 0;
        if (trials.length > 0) {
            current_trial = trials.length - appModel.attributes.exp_configCollection.at(0).attributes.meta_slider_timing_trials.length;
        }

        for (var i = current_trial; i < trials.length; i++) {
            if (trials[i].r_type == 'handle_clicked' && trials[i].rt > -1) {
                sum_rt += trials[i].rt;
                valid_trial_count++;
            }
        }
        return Math.floor(sum_rt / valid_trial_count);
    }


    //blocks of the experiment
    var experiment_blocks = [];
    experiment_blocks.push(exp_name_block);
    experiment_blocks.push(dot_block);
    experiment_blocks.push(bird_block);
    //experiment_blocks.push(slider_function_block);
    experiment_blocks.push(images_block);
    experiment_blocks.push(instructions_block);
    experiment_blocks.push(star_n_cloud_block);
    experiment_blocks.push(response_block);
    experiment_blocks.push(debrief_block);

    jsPsych.init({
        display_element: $('#exp_target'),
        experiment_structure: experiment_blocks,
        on_finish: function() {
            //count the number of times the exp runs
            appModel.attributes.meta_retry_times++;

            //if the user reaches 5 points in 8 trials then call test exp
            //else call exp_fail

            //if the number of trails exceed 8 trials then call exp_fail
            if (appModel.attributes.meta_retry_times >= appModel.attributes.exp_configCollection.at(0).attributes.meta_retry_times) {
                exp_fail(appModel);
                return;
            }

            //if the user reaches 5 points then call test exp
            if (appModel.attributes.meta_exp_points == appModel.attributes.exp_configCollection.at(0).attributes.meta_min_points) {
                //call test exp
                //appModel.attributes.test_random_val = Math.floor((Math.random() * 2) + 1);
                //if (appModel.attributes.test_random_val == 1) {
                    //testing_task_exp(appModel);
                //} else {
                    //testing_priming_task_exp(appModel);
                //}

                questionaire_task_exp(appModel);
            }
            //else restart the test.
            else {
                metacognition_task_exp(appModel);
            }
        },
        on_data_update: function(data) {
            psiturk.recordTrialData(data);
        }
    });

}
