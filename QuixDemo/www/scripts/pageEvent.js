"use strict";

var $fireBase;

var PageEvent = function () {
    var self = this;
    this.tmplEvent = {};
    this.tmplQuestions = {};
    this.Model = {
        Event: {
            firstQuestion: -1,
            eventName: '',
            literals: {
                litEvent: 'nombre de evento',
                litBtnRegister: 'registrar'
            }
        }
    };
    this.init = function () {

        self.renderEvent();

    };

    this.firstQuestion = function () {
        var fQ = -1;
        $($app.Model.Questions).each(function (index, element) {
            if (element !== null && element !== undefined && fQ < 0) {
                fQ = index;
            }
        });
        return fQ;
    };

    this.renderEvent = function() {
        self.tmplEvent = $.templates("#tmplEvent");
        self.tmplEvent.link('#plhEvent', self.Model.Event);
        $('#plhEvent').trigger('create');
    };

    this.doRegister = function (element) {
        
        if ($("#pageEvent form").valid()) {

            $.mobile.loading("show", {
                html: "<div style='background-color:#ffffff; width:100px; height:80px; text-align:center;-webkit-border-radius: .6em;-moz-border-radius: .6em;border-radius: .6em; margin: -2.5em 0 0 -2.5em; padding:1em;'><img src='./images/ajax-loader.gif' width='48'/><h3 style='margin-top:0; color:#000000;'>Cargando...</h3></div>"
            });
            $fireBase = new Firebase('https://quix.firebaseio.com/Events/' + self.Model.Event.eventName + '/');
            if ($fireBase.root() === null) {
                toastr["error"]("El evento no existe, escriba otro nombre");
                return false;
            } else {
                $fireBase.child('Configuration').once('value', function (dataSnapshot) {
                    $.mobile.loading("hide");
                    if (dataSnapshot.val() === null) {
                        toastr["error"]("El evento no existe, escriba otro nombre");
                        return false;
                    } else {
                        $fireBase.child('Questions').once("value", function (data) {
                            $("#pageLogin form").validate({
                                lang: 'es'
                            });

                            $app.Model.Questions = data.val();

                            $($app.Model.Questions).each(function (index) {
                                if (index > 0) {
                                    if ($app.Model.Questions[index] !== undefined) {
                                        var c = index - 1;
                                        while ($app.Model.Questions[c] === undefined) {
                                            c--;
                                        }
                                        $app.Model.Questions[c].nextQuestion = index;
                                        $app['pageQuestion' + index] = {};
                                    }
                                }

                            });

                            $.observable(self.Model.Event).setProperty('firstQuestion', self.firstQuestion());

                            self.tmplQuestions = $.templates("#tmplQuestions");
                            $('body').append(self.tmplQuestions.render($app.Model.Questions));

                            $app.Model.Event = self.Model.Event;
                            $app.pageLogin = new PageLogin();
                            $app.pageLogin.init();
                            $.mobile.loading("hide");
                            $.mobile.changePage('#pageLogin', { transition: 'fade' });
                            console.log('event complete');
                            return true;
                        });
                    }
                });
            }
            
            
        }
        return false;
    };
};

