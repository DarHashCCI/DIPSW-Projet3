$( document ).ready(function() {

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
                    $('.list-group.list-group-flush').append("<li class=\"list-group-item\" id=\"contact-"+data+"\">");
                    $("label").each(function(){
                        $("#contact-"+data).append("<strong>"+$(this).text()+"</strong> : "+$(this).next().val()+"<br>");
                    });
                    $("#loadingModal").toggle();
                    $("#contactModal").toggle();
                },
                error: function(){
                    console.log("J'ai pas fait un truc");
                }
            })
        }
    });
});