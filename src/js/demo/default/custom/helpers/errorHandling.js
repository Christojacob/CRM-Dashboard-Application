var Toastr = function(){

    toast = function(){
        toastr["success"]("My name is Inigo Montoya. You killed my father. Prepare to die!")

        toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
        }
    }

    return {
        // public functions
        init: function() {
             toast();
        }
    };
}();

jQuery(document).ready(function() {
    Toastr.init();
});