$( document ).ready(function() {
    var reredirUrl=redirUrl;
    var realId=id;
    //Last name edit
    $("body").on("click","#firstnameempty",function(){
        $(this).replaceWith('<input id="firstnameedit" placeholder="Veuillez renseigner votre nom"></input>');
    });

    $("body").on("click","#firstname",function(){
        $(this).replaceWith('<input id="firstnameedit" value="'+$(this).text()+'"></input>');
    });

    $("body").on("keypress","#firstnameedit",function(e){
        if (e.which == '13' && this.value.length>=255)
            alert("Votre nom ne peut pas faire plus de 255 caractères ! (Comment est-ce possible d'ailleurs ?");
        else if (e.which == '13' && this.value.length>0) {
            var ln=this.value;
            $(this).replaceWith('<div id="firstname">'+this.value+'</div>');
            $.ajax({
                method: "PUT",
                url: reredirUrl,
                data: {id:realId,ln:ln},
                success: function(){
                    console.log("élément mis à jour");
                }
            })
        }
    });
    //First name edit

    //Sex edit




});