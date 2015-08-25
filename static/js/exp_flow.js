var exp_fail = function(appModel) {
    //- Thank you for your participation, however you have not met the criteria for this study
    //- Give a code that sends them to a leaving screen 
    //- compute their final award 
    var template = _.template(appModel.attributes.exp_fail);
    $('#exp-target').html(template({
        'fail_code': 'FAIL'
    }));
};

var compute_award = function(appModel) {
    //compute the final award for the participant
    //also compute bonus for the person with the highest score

    //total points 
    //compute bonus
    complete();

    //var template = _.template(appModel.attributes.exp_complete);
    //$('#exp-target').html(template({
        //'complete_code': 'COMPLETE'
    //}));
};

//start exp process
function exp_flow(appModel) {   
    prt_task_exp(appModel);
    //memory_task_exp(appModel);
    //metacognition_task_exp(appModel);
    //questionaire_task_exp(appModel);
    //testing_task_exp(appModel);
    //testing_priming_task_exp(appModel);
}
