$( document ).ready(function() {
    var reredirUrl=redirUrl;
    var realId=id;
    //Last name edit
    $("body").on("click","#lastnameempty",function(){
        $(this).replaceWith('<input id="lastnameedit" placeholder="Veuillez renseigner votre nom"></input>');
    });

    $("body").on("click","#lastname",function(){
        $(this).replaceWith('<input id="lastnameedit" value="'+$(this).text()+'"></input>');
    });

    $("body").on("keypress","#lastnameedit",function(e){
        if (e.which == '13' && this.value.length>=255)
            alert("Votre nom ne peut pas faire plus de 255 caractères ! (Comment est-ce possible d'ailleurs ?");
        else if (e.which == '13' && this.value.length>0) {
            var ln=this.value;
            $(this).replaceWith('<div id="lastname">'+this.value+'</div>');
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
    $("body").on("click","#firstnameempty",function(){
        $(this).replaceWith('<input id="firstnameedit" placeholder="Veuillez renseigner votre nom"></input>');
    });

    $("body").on("click","#firstname",function(){
        $(this).replaceWith('<input id="firstnameedit" value="'+$(this).text()+'"></input>');
    });

    $("body").on("keypress","#firstnameedit",function(e){
        if (e.which == '13' && this.value.length>=255)
            alert("Votre prénom ne peut pas faire plus de 255 caractères ! (Comment est-ce possible d'ailleurs ?");
        else if (e.which == '13' && this.value.length>0) {
            var fn=this.value;
            $(this).replaceWith('<div id="firstname">'+this.value+'</div>');
            $.ajax({
                method: "PUT",
                url: reredirUrl,
                data: {id:realId,fn:fn},
                success: function(){
                    console.log("élément mis à jour");
                }
            })
        }
    });

    //Sex edit
    $("body").on("click","#gender",function(){
        console.log($(this).html());
        switch($(this).text()){
            case "Homme":$(this).replaceWith('<select name="gender" id="genderedit"><option value="1" selected="selected">Homme</option><option value="2">Femme</option><option value="3">Autre</option></select><i id="genderupdate" class="fas fa-save"></i>');;break;
            case "Femme":$(this).replaceWith('<select name="gender" id="genderedit"><option value="1">Homme</option><option value="2" selected="selected">Femme</option><option value="3">Autre</option></select><i id="genderupdate" class="fas fa-save"></i>');;break;
            case "Autre":$(this).replaceWith('<select name="gender" id="genderedit"><option value="1">Homme</option><option value="2">Femme</option><option value="3" selected="selected">Autre</option></select><i id="genderupdate" class="fas fa-save"></i>');;break;
            default :$(this).replaceWith('<select name="gender" id="genderedit"><option value="1">Homme</option><option value="2">Femme</option><option value="3">Autre</option></select><i id="genderupdate" class="fas fa-save"></i>');;break;
        }
    });

    $("body").on("click","#genderupdate",function(){
            var sx=$("#genderedit").val();
            switch(sx){
                case "1":$("#genderedit").replaceWith('<div id="gender">Homme</div>');break;
                case "2":$("#genderedit").replaceWith('<div id="gender">Femme</div>');break;
                case "3":$("#genderedit").replaceWith('<div id="gender">Autre</div>');break;
            }
            $(this).remove();
            $.ajax({
                method: "PUT",
                url: reredirUrl,
                data: {id:realId,sx:sx},
                success: function(){
                    console.log("élément mis à jour");
                }
            })
    });

    //Bio edit
    $("body").on("click","#bioempty",function(){
        $(this).replaceWith('<textarea id="bioedit" placeholder="Parlez nous un peu de vous"></textarea><i id="bioupdate" class="fas fa-save"></i>');
    });

    $("body").on("click","#bio",function(){
        $(this).replaceWith('<textarea id="bioedit">'+$(this).text()+'</textarea><i id="bioupdate" class="fas fa-save"></i>');
    });

    $("body").on("click","#bioupdate",function(){
        var bi=$('#bioedit').val();
        if ($('#bioedit').val().length>=255)
            alert("Wowowowo, on a dit 'Biographie', on ne vous a pas demandé d'écrire un roman !")
        else if ($('#bioedit').val().length>0) {
            $('#bioedit').replaceWith('<div id="bio">'+$('#bioedit').val()+'</div>');
            $(this).remove();
            $.ajax({
                method: "PUT",
                url: reredirUrl,
                data: {id:realId,bi:bi},
                success: function(){
                    console.log("élément mis à jour");
                }
            })
        }
    });

    // Ava edit
    $("body").on("click","#ava",function(){
        $('#fileinput').trigger('click');
    });

    $("body").on("change","#fileinput",function(){
        console.log($("#fileinput").val());
        var formData = new FormData();
        var blob = $('input[type=file]')[0].files[0];
        formData.append('newava', blob);
        console.log(formData);
        $.ajax({
            method: "POST",
            url: reredirUrl,
            contentType: false, // requires jQuery 1.6+
            processData: false, // required
            cache: false,
            data: formData,
            success: function(){
                console.log("élément mis à jour");
                d = new Date();
                $("#ava").attr("src","../uploads/ava/"+realId+".png?"+d.getTime());
            }
        })
    });
});