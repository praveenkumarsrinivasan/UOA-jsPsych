/*
 * 
 * Memory Task - Experiment
 * 
 */

var memory_task_exp = function(appModel) {

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
        text: appModel.attributes.memory_title,
        cont_key: "mouse"
    };

    var dot_block = {
        type: "text",
        text: appModel.attributes.dot,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.memory_timing_post_trial,
        cont_key: "mouse"
    };

    var instructions_block1 = {
        type: "text",
        text: appModel.attributes.memory_instruction1,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.memory_timing_post_trial,
        cont_key: "mouse"
    };

    var bird_block = {
        type: "single-stim",
        stimuli: [memory_bird],
        is_html: true,
        //timing_response: appModel.attributes.exp_configCollection.at(0).attributes.memory_image_timing_response,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.memory_timing_post_trial,
        // response_ends_trial: false,
    };

    var slider_function_block = {
        type: 'slider',
        timing_trial: appModel.attributes.exp_configCollection.at(0).attributes.memory_slider_timing_trials,
        timing_response: appModel.attributes.exp_configCollection.at(0).attributes.memory_slider_timing_response,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.memory_timing_post_trial,
    };

    var instructions_block2 = {
        type: "text",
        text: appModel.attributes.memory_instruction2,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.memory_timing_post_trial,
        cont_key: "mouse"
    };

    var images_block = {
        type: "single-stim",
        stimuli: [memory_images],
        is_html: true,
        //timing_response: appModel.attributes.exp_configCollection.at(0).attributes.memory_image_timing_response + 10000,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.memory_timing_post_trial,
        choices: [49, 50, 51]
        // response_ends_trial: false
    };

    var star_block = {
        type: "text",
        text: appModel.attributes.star,
        cont_key: "mouse"
    };

    var response_block = {
        type: "text",
        text: function() {
            //if user choses the right image then display the correct template
            if (getResponse()) {
                //if the user succeeds then award them '1' point 
                appModel.attributes.mem_exp_points++;
                appModel.attributes.total_points++;
                return appModel.attributes.correct;
            }
            //else display the incorrect template
            else {
                return appModel.attributes.incorrect;
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

    //if the user chose the right image then return true
    //else return false
    var getResponse = function() {
        var trials = jsPsych.data.getTrialsOfType('single-stim');
        var current_trial = 0;
        //consider last two trails
        current_trial = trials.length;

        //get the image number of the bird displayed
        var re = /(\d.png)/gi
        var num = (trials[current_trial - 2].stimulus).match(re);
        var image_num = parseInt(num[0].toLowerCase().replace('.png', ''), 10);

        //get the image number chosen by the user
        var key_press = parseInt(String.fromCharCode(trials[current_trial - 1].key_press), 10) - 1;
        //-1 because we have to chose the corresponding user choice image in the array
        num = (trials[current_trial - 1].stimulus).match(re);
        var choice = parseInt(num[key_press].toLowerCase().replace('.png', ''), 10);

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
            current_trial = trials.length - appModel.attributes.exp_configCollection.at(0).attributes.memory_slider_timing_trials.length;
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
    experiment_blocks.push(instructions_block1);
    experiment_blocks.push(bird_block);
    //experiment_blocks.push(slider_function_block);
    //experiment_blocks.push(instructions_block2);
    experiment_blocks.push(images_block);
    experiment_blocks.push(star_block);
    experiment_blocks.push(response_block);
    experiment_blocks.push(debrief_block);

    jsPsych.init({
        display_element: $('#exp_target'),
        experiment_structure: experiment_blocks,
        on_finish: function() {
            //count the number of times the exp runs
            appModel.attributes.mem_retry_times++;

            //if the user fails the test more than 5 times call exp_fail
            if (appModel.attributes.mem_retry_times >= appModel.attributes.exp_configCollection.at(0).attributes.mem_retry_times) {
                exp_fail(appModel);
                return;
            }

            //if user reaches '1' point i.e mem_min_points call meta exp
            if (appModel.attributes.mem_exp_points == appModel.attributes.exp_configCollection.at(0).attributes.mem_min_points) {
                //call meta exp
                metacognition_task_exp(appModel);
            }
            //else restart the test.
            else {
                memory_task_exp(appModel);
            }
        },
        on_data_update: function(data) {
            psiturk.recordTrialData(data);
        }
    });

}
