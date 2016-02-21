"use strict";
var PageTotalResults = function () {
    var self = this;
    this.tmplTotalResults = {};
    this.TotalResultsDB = {};
    this.Model = {
        nickname: '',
        points: 0.0,
        stars: 0.0
        

    };
    this.init = function () {
        self.TotalResultsDB = $fireBase.child('Results').child($app.Model.User.username);
        $app.tmplTotalResults = $.templates("#tmplTotalResults");
        self.Model.nickname = $app.Model.User.username;
        $app.tmplTotalResults.link('#pageTotalResults', self.Model);

    };

    this.calculateResults = function () {
        
        var countQuestions = $.grep($app.Model.Questions, function (element) {
            if (element !== undefined && element !== null) {
                
            }
            return element !== undefined && element !== null;
        });

        self.TotalResultsDB.update({
            points: parseFloat($app.Model.points),
            stars: 'N/A'
        }, function (error) {
            if (error) {
                toastr["error"]("update results failed");
                console.log('update results failed');
                return false;
            } else {
                $.observable(self).setProperty('Model.points', parseFloat($app.Model.points));
                $.observable(self).setProperty('Model.stars', Math.round((countQuestions.length * 2 * 40) / (self.Model.points / countQuestions.length)));
                $app.tmplTotalResults.link('#pageTotalResults', $app.pageTotalResults.Model);
                toastr["success"]("results sent completed");
                console.log('results sent completed');
                return true;
            }
            return false;
        });

        //$app.Model.Questions[0].

        //$.observable(_self.Model).setProperty({ nickname: $app.pageTotalResults.Model.nickname, points: parseFloat($app.Model.points), stars: Math.round((countQuestions.length * 2 * 40) / (_self.Model.points / countQuestions.length)) });
        

        
    };


};

