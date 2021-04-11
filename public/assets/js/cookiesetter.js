$( document ).ready(function() {
    $("#consent-cookies").on("click",function(){
        $("#cookie-banner").addClass("hidden");
        $.ajax({
            method: "POST",
            url: "../cookie-monster",
            success: function(data){
            }
        });
    });
});