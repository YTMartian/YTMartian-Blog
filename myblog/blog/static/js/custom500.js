(function ($) {
    "use strict";
    var mainApp = {

        main_fun: function () {
           
            var count = new countUp("error-link", 10, 500, 0, 5); //CHANGE 404 TO THE ERROR VALUE AS YOU WANT

            window.onload = function () {
                        count.start();
            }
        },
        initialization: function () {
            mainApp.main_fun();
        }
    }
    $(document).ready(function () {
        mainApp.main_fun();
    });

}(jQuery));
