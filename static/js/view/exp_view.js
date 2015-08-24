require(
    [
        'static/js/model/collection.js',
        'static/js/model/app_model.js',
        'static/js/exp_flow.js',
        'static/js/controller/prt_task.js',
        'static/js/controller/memory_task.js',
        'static/js/controller/metacognition_task.js',
        'static/js/controller/questionaire_task.js',
        'static/js/controller/testing_task.js',
        'static/js/controller/testing_priming_task.js',
        'text',
        'text!header.html',
        'text!exp/prt_title.html',
        'text!exp/memory_title.html',
        'text!exp/meta_title.html',
        'text!exp/test_title.html',
        'text!exp/priming_title.html',
        'text!exp/prt_welcome.html',
        'text!exp/prt_intro_instruction.html',
        'text!exp/memory_instruction1.html',
        'text!exp/memory_instruction2.html',
        'text!exp/memory_bird.html',
        'text!exp/memory_images.html',
        'text!exp/metacognition_instruction.html',
        'text!exp/questionaire_title.html',
        'text!exp/questionaire1.html',
        'text!exp/questionaire2.html',
        'text!exp/testing_bird.html',
        'text!exp/testing_bird_large.html',
        'text!exp/testing_images.html',
        'text!exp/response_time.html',
        'text!exp/star.html',
        'text!exp/star_cloud.html',
        'text!exp/cloud.html',
        'text!exp/dot.html',
        'text!exp/correct.html',
        'text!exp/incorrect.html',
        'text!exp/maybe.html',
        'text!exp/exp_fail.html',
        'text!exp/exp_complete.html',
    ],
    function(
        ConfigCollection, AppModel,
        flow,
        prt_task, memory_task, metacognition_task, questionaire_task, testing_task, testing_priming_task,
        text, header,
        prt_title, memory_title, meta_title, test_title, priming_title,
        prt_welcome, prt_intro_instruction,
        memory_instruction1, memory_instruction2, memory_bird, memory_images,
        metacognition_instruction,
        questionaire_title, questionaire1, questionaire2,
        testing_bird, testing_bird_large, testing_images,
        response_time, star, star_cloud, cloud, dot, correct, incorrect, maybe,
        exp_fail, exp_complete) {

        var header_template = _.template(header);
        $('#header_template').html(header_template);

        var testing_configCollection = new ConfigCollection();
        testing_configCollection.fetch({
            url: 'static/data/allocation.json',
            success: function() {},
            complete: function() {
            }
        });

        var exp_configCollection = new ConfigCollection();
        exp_configCollection.fetch({
            url: 'static/data/exp.json',
            success: function() {},
            complete: function() {

                var appModel = new AppModel({
                    //exp config
                    exp_configCollection : exp_configCollection,

                    //title
                    prt_title     : prt_title,
                    memory_title  : memory_title,
                    meta_title    : meta_title,
                    test_title    : test_title,
                    priming_title : priming_title,

                    //prt templates
                    prt_welcome : prt_welcome,
                    prt_intro_instruction : prt_intro_instruction,

                    //memory templates
                    memory_instruction1 : memory_instruction1,
                    memory_instruction2 : memory_instruction2,
                    memory_bird : memory_bird,
                    memory_images : memory_images,

                    //meta-cognition templates
                    metacognition_instruction : metacognition_instruction,

                    questionaire_title : questionaire_title,
                    questionaire1 : questionaire1,
                    questionaire2 : questionaire2,

                    testing_bird : testing_bird,
                    testing_bird_large : testing_bird_large,
                    testing_images : testing_images,

                    //general templates
                    response_time : response_time,
                    star : star,
                    star_cloud : star_cloud,
                    cloud : cloud,
                    dot : dot,
                    correct : correct,
                    incorrect : incorrect,
                    maybe : maybe,

                    exp_fail: exp_fail,
                    exp_complete: exp_complete,

                    //app variables
                    total_points : 0,
                    prt_exp_points : 0,
                    mem_exp_points : 0,
                    meta_exp_points : 0,
                    questionaire_exp_points : 0,

                    test_exp_points : 0,
                    test_priming_exp_points : 0,

                    prt_retry_times : 0,
                    mem_retry_times : 0,
                    meta_retry_times : 0,

                    questionaire_retry_times : 0,
                    questionaire1_correct_ans : 1,
                    questionaire2_correct_ans : 2,

                    test_retry_times : 0,
                    test_priming_retry_times : 0,

                    test_random_val : 0,
                    testing_configCollection : testing_configCollection,
                });

                exp_flow(appModel);

                // prt_task_exp(exp_configCollection,
                //     prt_welcome, prt_intro_instruction,
                //     response_time, dot, correct, incorrect);
                // memory_task_exp(exp_configCollection,
                //     memory_instruction1, memory_instruction2, memory_bird, memory_images,
                //     response_time, star, dot, correct, incorrect);
                // metacognition_task_exp(exp_configCollection,
                //     memory_bird, memory_images,
                //     metacognition_instruction,
                //     response_time, star_cloud, dot, correct, incorrect, maybe);
                // testing_task_exp(exp_configCollection,
                //     memory_bird, memory_images,
                //     response_time, star, star_cloud, cloud, dot, correct, incorrect, maybe);
                // testing_priming_task_exp(exp_configCollection,
                //     memory_bird, memory_images,
                //     response_time, star, star_cloud, cloud, dot, correct, incorrect, maybe);
            }
        });
    }
);
