"use strict";
var PageQuestions = function () {
    var self = this;
    this.tmplLogin = {};
    this.AnswersDB = {};
    this.Model = {
        idOption: -1,
        timeInit: (new Date),
        timeEnd: null,
        User: {
            properties: {
                 nickname: ''
            }
        },
        Answers: [
        ]

    };
    this.init = function (idOption) {

        self.Model.idOption = idOption;
        self.Model.Answers = $fireBase.child('Answers').child($app.Model.User.username).child(self.Model.idOption);

        

    };
    this.validateAnswer = function (element) {

        /*var correctAnswers = $.grep($app.Model.Questions[_self.Model.idOption].Options, function() {
            return this.points > 0;
        });*/

        self.Model.timeEnd = new Date();

        var timeDiff = (self.Model.timeEnd - self.Model.timeInit) / 1000;
        $app.Model.points += parseFloat($(element).attr('data-points') / timeDiff);

        $.mobile.loading("show", {
            html: "<div style='background-color:#ffffff; width:100px; height:80px; text-align:center;-webkit-border-radius: .6em;-moz-border-radius: .6em;border-radius: .6em; margin: -2.5em 0 0 -2.5em; padding:1em;'><img src='./images/ajax-loader.gif' width='48'/><h3 style='margin-top:0; color:#000000;'>Cargando...</h3></div>"
        });

        self.Model.Answers.update({
            idOption: self.Model.idOption,
            answerSelected: $(element).attr('data-answerSelected'),
            time: timeDiff,
            totalPoints: ($(element).attr('data-points') / timeDiff)
        }, function (error) {
            if (error) {
                toastr["error"]("update failed");
                console.log('update failed');
                return false;
            } else {
                $.mobile.loading("hide");
                toastr["success"]("answered completed");
                var nextQuestion = $app.Model.Questions[self.Model.idOption].nextQuestion;
                if (nextQuestion !== undefined && nextQuestion !== null) {
                    $app.goToUrl(element);
                    $app.pageQuestions = new PageQuestions();
                    $app.pageQuestions.init(nextQuestion);
                } else {
                    $app.pageTotalResults.calculateResults();
                    $.mobile.changePage('#pageTotalResults', { transition: 'slide' });
                    return true;
                }
                console.log('answered completed');
                return true;
            }
            
        });
        return false;
    }
    
};

