$( document ).ready(function() {
    var contactId;
    //Prevent the form button to submit
    $( "form" ).submit(function( event ) {
        event.preventDefault();
    })

    // Contact modal - Add contact mode.
    $(".fa-plus").on("click",function(){
        $("#contactModal form").html('<div>\n' +
            '            <label>Nom</label>\n' +
            '            <input type="text">\n' +
            '            <i class="fas fa-times-circle"></i>\n' +
            '        </div>\n' +
            '        <button id="createField">Nouveau champ</button>');
        $("#contactModal .modal-title").text('Nouveau contact');
        $("#contactModal .modal-footer").html('<button id="createContact">Créer le contact</button>');
        $("#contactModal").toggle();
    })


    //Contact modal - Close button. Aka "fixing Bootstrap's shit"
    $("#contactModal button.close").on("click",function(){
        $("#contactModal form").html('');
        $("#contactModal .modal-title").text('');
        $("#contactModal .modal-footer").html('');
        $("#contactModal").toggle();
    })

    // Sortable function for the contact infos
    function reloadSortableInfo(){
        $( "form" ).sortable({
            connectWith: "form",
            items: "div",
            placeholder: "ui-state-highlight",
        }).disableSelection();
    }
    reloadSortableInfo();

    //Delete field
    $("body").on("click",".fa-times-circle",function(){
        if($("body").find("label").length !=1)
            $(this).parent().remove();
        else alert("Il ne reste qu'une seule ligne ! Suppression impossible.")
    });

    //New contact field
    $("body").on("click","#createField",function(){
        $(this).replaceWith('<input id="createFieldReal">');
    });

    //Putting the new contact field
    $("body").on("keypress","#createFieldReal",function(e){
        if (e.which == '13' && this.value.length>0) {
            $(this).replaceWith("<div><label>"+this.value+"</label><input type=\"text\"><i class=\"fas fa-times-circle\"></i></div>");
            if($("body").find("label").length < 10)
            $("form").append("<button id=\"createField\">Nouveau champ</button>");
            else console.log($("body").find("label").length);
            reloadSortableInfo();
        }
    });

    //Creating the contact
    $("body").on("click","#createContact",function(){
        var cont= {};
        var check=true;
        // Constructing the json
        $('label').each(function(){
            cont[$(this).text()]=$(this).next().val();
            console.log($(this).text()+" "+$(this).next().val());
        });
        console.log(cont);
        //Checking text inputs
        $('input').each(function(){
            if($(this).val().length==0)
            check=false;
        });
        if(check==false)
            alert("Un des champs est vide !");
        else{
            $("#loadingModal").toggle();
            $.ajax({
                type: "POST",
                url: "/contact/create",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                traditional: true,
                data: JSON.stringify(cont),
                processData: false,
                success: function(data){
                    $('.list-group.list-group-flush').append("<li class=\"list-group-item\" id=\"contact-"+data+"\"><div class=\"editButtons\"><i class=\"fas fa-pen\"></i><i class=\"fas fa-times\"></i></div></li>");
                    $("label").each(function(){
                        $("#contact-"+data).append("<strong>"+$(this).text()+"</strong> : "+$(this).next().val()+"<br>");
                    });
                    $("#loadingModal").toggle();
                    $("#contactModal").toggle();
                    $("#contactModal form").html('');
                },
                error: function(){
                    console.log("J'ai pas fait un truc");
                }
            })
        }
    });

    //Editing a contact - modal generation
    $("body").on("click",".fa-pen",function(){
        contactId=(($(this).parent().parent().attr('id')).slice(8));
        $("#contact-"+contactId+" strong").each(function(){
            console.log(this.nextSibling);
            $("#contactModal form").append('<div>\n' +
                '            <label>'+$(this).text()+'</label>\n' +
                '            <input type="text" value="'+(this.nextSibling.nodeValue).slice(3)+'">\n' +
                '            <i class="fas fa-times-circle"></i>\n' +
                '        </div>');
        });
        $("#contactModal form").append('<button id="createField">Nouveau champ</button>');
        $("#contactModal .modal-title").text('Édition de contact');
        $("#contactModal .modal-footer").html('<button id="updateContact">Mettre à jour le contact</button>');
        $("#contactModal").toggle();
    });

    //Editing a contact - the actual editing
    $("body").on("click","#updateContact",function() {
        var cont = {};
        var check = true;
        console.log(contactId);
        // Constructing the json
        $('label').each(function () {
            cont[$(this).text()] = $(this).next().val();
        });
        //Checking text inputs
        $('input').each(function () {
            if ($(this).val().length == 0)
                check = false;
        });
        if (check == false)
            alert("Un des champs est vide !");
        else {
            $("#loadingModal").toggle();
            $.ajax({
                type: "PUT",
                url: "/contact/update/" + contactId,
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                traditional: true,
                data: JSON.stringify(cont),
                processData: false,
                success: function (data) {
                    $("#contact-"+contactId).html('<div class=\"editButtons\"><i class=\"fas fa-pen\"></i><i class=\"fas fa-times\"></i></div>');
                    $("label").each(function(){
                        $("#contact-"+contactId).append("<strong>"+$(this).text()+"</strong> : "+$(this).next().val()+"<br>");
                    });
                    $("#loadingModal").toggle();
                    $("#contactModal").toggle();
                    $("#contactModal form").html('');
                },
                error: function () {
                    $("#contact-"+contactId).html('<div class=\"editButtons\"><i class=\"fas fa-pen\"></i><i class=\"fas fa-times\"></i></div>');
                    $("label").each(function(){
                        $("#contact-"+contactId).append("<strong>"+$(this).text()+"</strong> : "+$(this).next().val()+"<br>");
                    });
                    $("#loadingModal").toggle();
                    $("#contactModal").toggle();
                    $("#contactModal form").html('');
                }
            })
        }
    });

    //Deleting a contact
    $("body").on("click",".fa-times",function(){
        id=(($(this).parent().parent().attr('id')).slice(8));
        console.log(id);
        $("#loadingModal").toggle();
        $.ajax({
            method: "DELETE",
            url: "/contact/delete/"+id,
            success: function(){
                $("#contact-"+id).remove();
                $("#loadingModal").toggle();
            }
        })
    });
});