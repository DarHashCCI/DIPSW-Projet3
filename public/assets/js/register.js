$( document ).ready(function() {

    //Prevent the form button to submit
    $( "form" ).submit(function( event ) {
        event.preventDefault();
    })

    // Make the password text visible
    $("body").on("click",".fa-eye-slash",function(){
        $('#password').get(0).type = 'text'
        $(this).removeClass("fa-eye-slash");
        $(this).addClass("fa-eye");
    });

    // Make the password text hidden
    $("body").on("click",".fa-eye",function(){
        $('#password').get(0).type = 'password'
        $(this).removeClass("fa-eye");
        $(this).addClass("fa-eye-slash");
    });

    $("body").on("click","#createAccount",function() {
        var check=true;
        var passRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})");
        //Valid email check
        if ($("#email").val().match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)==null){
            $("#erroremail").fadeIn();
            check=false;
        }
        else $("#erroremail").fadeOut();

        //Password size check
        if($("#password").val().length<12){
            $("#errorpass1").fadeIn();
            check=false;
        }
        else $("#errorpass1").fadeOut();

        //Password validity check
        console.log(passRegex.test($("#password").val()));
        if(!passRegex.test($("#password").val())){
            $("#errorpass2").fadeIn();
            check=false;
        }
        else $("#errorpass2").fadeOut();
        if(check){
            $.ajax({
                type: "POST",
                url: "/register/create",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                traditional: true,
                data: JSON.stringify({mail:$("#email").val(),password:$("#password").val()}),
                processData: false,
                success: function(){
                    console.log("Compte créé");
                },
                error: function(){
                    console.log("Compte non créé");
                }
            })
        }
    });

});