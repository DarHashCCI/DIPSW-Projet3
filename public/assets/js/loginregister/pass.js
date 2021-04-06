$( document ).ready(function() {
    $('#registration_form_plainPassword').parent().append("<i class=\"fas fa-eye-slash\"></i>");
    // Make the password text visible
    $("body").on("click",".fa-eye-slash",function(){
        $('#registration_form_plainPassword').get(0).type = 'text'
        $(this).removeClass("fa-eye-slash");
        $(this).addClass("fa-eye");
    });

    // Make the password text hidden
    $("body").on("click",".fa-eye",function(){
        $('#registration_form_plainPassword').get(0).type = 'password'
        $(this).removeClass("fa-eye");
        $(this).addClass("fa-eye-slash");
    });
});