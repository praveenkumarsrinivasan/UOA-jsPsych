/*
 *
 * PRT Task - Experiment
 *
 */

var prt_task_exp = function(appModel) {

    //define blocks of the experiment
    var exp_name_block = {
        type: "text",
        text: appModel.attributes.prt_title
    };

    var welcome_block = {
        type: "text",
        text: appModel.attributes.prt_welcome
    };

    var instructions_block = {
        type: "text",
        text: appModel.attributes.prt_intro_instruction,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.prt_timing_post_trial
    };

    var slider_function_block1 = {
        type: 'slider',
        timing_trial: [200],
        timing_response: appModel.attributes.exp_configCollection.at(0).attributes.prt_slider_timing_response
    };

    var dot_block = {
        type: "text",
        text: appModel.attributes.dot,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.prt_timing_post_trial
    };

    var slider_function_block2 = {
        type: 'slider',
        timing_trial: appModel.attributes.exp_configCollection.at(0).attributes.prt_slider_timing_trials,
        timing_response: appModel.attributes.exp_configCollection.at(0).attributes.prt_slider_timing_response,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.prt_timing_post_trial
    };

    var correct_block = {
        type: "text",
        text: appModel.attributes.correct
    };

    var debrief_block = {
        type: "text",
        text: function() {
            var template = _.template(appModel.attributes.response_time);
            return template({
                'response_time': getAverageResponseTime(),
                'total_score': appModel.attributes.total_points
            });
        }
    }

    //function to compute the average response time
    //for trials where handle was clicked
    var getAverageResponseTime = function() {
        var trials = jsPsych.data.getTrialsOfType('slider');
        console.log(trials)

        var sum_rt = 0;
        var valid_trial_count = 0;

        var current_trial = 0;
        if (trials.length > 0) {
            current_trial = trials.length - appModel.attributes.exp_configCollection.at(0).attributes.prt_slider_timing_trials.length;
        }

        for (var i = current_trial; i < trials.length; i++) {
            if (trials[i].r_type == 'handle_clicked' && trials[i].rt > -1) {
                sum_rt += trials[i].rt;
                valid_trial_count++;
            }
        }
        //if the user succeeds then award them '1' point
        if (appModel.attributes.exp_configCollection.at(0).attributes.prt_slider_timing_trials.length == valid_trial_count) {
            appModel.attributes.prt_exp_points++;
            appModel.attributes.total_points++;
        }
        return Math.floor(sum_rt / valid_trial_count);
    }

    //blocks in the experiment
    var experiment_blocks = [];
    experiment_blocks.push(exp_name_block);
    experiment_blocks.push(welcome_block);
    experiment_blocks.push(instructions_block);
    experiment_blocks.push(slider_function_block1);
    experiment_blocks.push(dot_block);
    experiment_blocks.push(slider_function_block2);
    experiment_blocks.push(correct_block);
    experiment_blocks.push(debrief_block);

    jsPsych.init({
        display_element: $('#exp_target'),
        experiment_structure: experiment_blocks,
        on_finish: function() {
            //count the number of times the exp runs
            appModel.attributes.prt_retry_times++;

            //if the user fails the test more than 5 times call exp_fail
            if (appModel.attributes.prt_retry_times >= appModel.attributes.exp_configCollection.at(0).attributes.prt_retry_times) {
                exp_fail(appModel);
                return;
            }

            //if user reaches '1' point i.e prt_min_points call mem exp
            if (appModel.attributes.prt_exp_points == appModel.attributes.exp_configCollection.at(0).attributes.prt_min_points) {
                //call mem exp
                memory_task_exp(appModel);
                //testing_priming_task_exp(appModel);
            }
            //else restart the test.
            else {
                prt_task_exp(appModel);
            }
        },
        on_data_update: function(data) {
            psiturk.recordTrialData(data);
        }
    });

}
