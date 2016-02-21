"use strict";
var PageLogin = function () {
    var self = this;
    this.tmplLogin = {};
    this.tmplQuestions = {};
    this.Model = {
        User: {
            firstQuestion: -1,
            username: '',
            literals: {
                litNickname: 'nickname',
                litBtnLogin: 'entrar'
           },
            properties: {
                 
            }
            
        }
    };
    this.init = function () {

        self.renderLogin();
        $.observable(self.Model.User).setProperty('firstQuestion',$app.Model.Event.firstQuestion);

    };

    this.renderLogin = function() {
        self.tmplLogin = $.templates("#tmplLogin");
        self.tmplLogin.link('#plhLogin', self.Model.User);
        $('#plhLogin').trigger('create');
    };

    this.doEnter = function (element) {
        
        if ($("#pageLogin form").valid()) {

            self.Model.User.properties[self.Model.User.username] = { email: '', registerDate: (new Date) };
            
            $.mobile.loading("show", {
                html: "<div style='background-color:#ffffff; width:100px; height:80px; text-align:center;-webkit-border-radius: .6em;-moz-border-radius: .6em;border-radius: .6em; margin: -2.5em 0 0 -2.5em; padding:1em;'><img src='./images/ajax-loader.gif' width='48'/><h3 style='margin-top:0; color:#000000;'>Cargando...</h3></div>"
            });
            var users = $fireBase.child('Users').child(self.Model.User.username);

            users.update(self.Model.User.properties[self.Model.User.username], function (error) {
                if (error) {
                    toastr["error"]("update failed");
                    console.log('update failed');
                    return false;
                } else {
                    $.mobile.loading("hide");
                    toastr["success"]("login complete");
                    $app.Model.User = self.Model.User;
                    $app.pageTotalResults = new PageTotalResults();
                    $app.pageTotalResults.init();
                    $app.goToUrl(element);
                    $app.pageQuestions = new PageQuestions();
                    $app.pageQuestions.init($app.Model.Event.firstQuestion);
                    console.log('login complete');
                    return true;
                }
            });
        }
        return false;
    };
};

