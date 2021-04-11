$( document ).ready(function() {
    var realId=id;
    var ourRealId=ourId;
    // Invite request
    $("body").on("click","#requestInvite",function(){
        $('#loadingModal .modal-content').text("Envoi en cours...")
        $('#loadingModal').toggle();
        $.ajax({
            method: "POST",
            url: "../mail/calendar_request",
            data: {idDest:realId,idSender:ourRealId,mode:1},
            success: function(){
                $('#loadingModal .modal-content').text("Email envoyé.")
                setTimeout(function(){
                    $('#loadingModal').toggle();
                },2000);
            }
        })
    });

    // Access granting
    $("body").on("click","#allowAccess",function(){
        $('#loadingModal .modal-content').text("Autorisation en cours...")
        $('#loadingModal').toggle();
        $.ajax({
            method: "POST",
            url: "../mail/calendar_request",
            data: {idDest:realId,idSender:ourRealId,mode:2},
            success: function(){
                $('#loadingModal .modal-content').text("Autorisation accordée.")
                $("#allowAccess").replaceWith("<button id=\"denyAccess\" class=\"btn btn-primary\">Retirer l'accès au calendrier</button>");
                setTimeout(function(){
                    $('#loadingModal').toggle();
                },2000);
            }
        })
    });

    // Access removal
    $("body").on("click","#denyAccess",function(){
        $('#loadingModal .modal-content').text("Révocation en cours...")
        $('#loadingModal').toggle();
        $.ajax({
            method: "POST",
            url: "../mail/calendar_request",
            data: {idDest:realId,idSender:ourRealId,mode:3},
            success: function(){
                $('#loadingModal .modal-content').text("Autorisation retirée.")
                $("#denyAccess").replaceWith("<button id=\"allowAccess\" class=\"btn btn-primary\">Donner l'accès au calendrier</button>");
                setTimeout(function(){
                    $('#loadingModal').toggle();
                },2000);
            }
        })
    });
});