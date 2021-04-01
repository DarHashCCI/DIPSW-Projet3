$( document ).ready(function() {
    var realId=id;
    var ourRealId=ourId;
    // Invite request
    $("body").on("click","#requestInvite",function(){
        $.ajax({
            method: "POST",
            url: "../mail/invite_request",
            data: {idDest:realId,idSender:ourRealId},
            success: function(){
                $('#loadingModal .modal-content').text("Email envoyé.")
                $('#loadingModal').toggle();
                setTimeout(function(){
                    $('#loadingModal').toggle();
                },1000);
            }
        })
    });

    // Access granting
    $("body").on("click","#allowAccess",function(){

    });

    // Access removal
    $("body").on("click","#denyAccess",function(){

    });
});