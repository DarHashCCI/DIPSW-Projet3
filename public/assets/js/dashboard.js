$( document ).ready(function() {
    /* storing the user id for later*/
    var realId=id;
    var subdata;

    // checking existence of file synchronously - credit to code-grepper
    function doesImgExist(img) {
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', '../../uploads/ava/'+img+'.png', false);
        xhr.send();
        if(xhr.status==true) return img;
        else return 0;
    }

    $('#begPeople').on('click',function(){
        console.log(doesImgExist(7));
    })

    //search modal - Close button. Aka "fixing Bootstrap's shit"
    $("#searchModal button.close").on("click",function(){
        $("#searchResults").html('');
        $("#searchity").text('');
        $('.modal-body .fa-search').attr("id",'');
        $("#searchModal .modal-title").text('');
        $("#searchModal .modal-footer").html('');
        $("#searchModal").toggle();
    })

    // Search modal - Contact - Showing the modal
    $('body').on("click",'#searchContacts', function(){
        $("#searchModal .modal-title").text('Recherche de contacts');
        $("#searchModal .modal-header").css("background-color","var(--zurvan-blue)");
        $("#searchModal .modal-content").css("border","1px solid var(--zurvan-blue)");
        $("#searchResults").css("border-color","var(--zurvan-blue)");
        $("#searchLoader").css("color","var(--zurvan-blue)");
        $("#searchModal").css("background-color",'var(--zurvan-blue-modal)');
        $("#searchity").prev().text('Info à chercher : ');
        $('.modal-body .fa-search').attr("id","searchContacts2");
        $("#searchContacts2").css("background-color","var(--zurvan-blue)");
        $("#searchModal").toggle();
    })

    // Search modal - Contact - Searching
    $("body").on("click","#searchContacts2",function(){
        if($("#searchity").val().length>0){
            $("#searchLoader").css('display','block');
            $("#searchResults").css('display','none');
            $("#searchResults").html('');
            console.log($("#searchity").val());
            $.ajax({
                method: "POST",
                url: "../contact/list",
                data: {str:$("#searchity").val()},
                success: function(data){
                    /*console.log(data);*/
                    var don=JSON.parse(data);
                    if(don.length==0){
                        $("#searchResults").html("Aucun résultat trouvé");
                    }
                    else{/*console.log(don);*/
                        for(var i = 0; i < don.length; i++)
                        {
                            $("#searchResults").append("<div class='searchResult' id='contact-"+i+"'></div>");
                            var zeubi = JSON.parse(don[i].infos);
                            console.log(don[i].length);
                            for(var key in zeubi)
                            {
                                var version = zeubi;
                                $('#contact-'+i).append("<strong>"+key+": </strong>"+zeubi[key]+"<br>");
                                console.log(key+zeubi[key]);
                            }
                        }
                    }
                    $("#searchLoader").css('display','none');
                    $("#searchResults").css('display','block');
                }
            })
        }
    })

    // Search modal - Calendar invite - Showing the modal
    $('body').on("click",'#invitePeople', function(){
        $("#searchModal .modal-title").text('Inviter des utilisateurs');
        $("#searchModal .modal-header").css("background-color","var(--zurvan-green2)");
        $("#searchModal .modal-content").css("border","1px solid var(--zurvan-green2)");
        $("#searchResults").css("border-color","var(--zurvan-green2)");
        $("#searchLoader").css("color","var(--zurvan-green2)");
        $("#searchModal").css("background-color",'var(--zurvan-green2-modal)');
        $("#searchity").prev().text('Info à chercher : ');
        $('.modal-body .fa-search').attr("id","invitePeople2");
        $("#invitePeople2").css("background-color","var(--zurvan-green2)");
        $("#searchModal .modal-footer").html("<button id=\"invitePeopleButton\" type=\"button\" class=\"btn btn-primary\">Inviter</button>")
        $("#invitePeopleButton").css("background-color","var(--zurvan-green2)");
        $("#invitePeopleButton").css("border-color","var(--zurvan-green2)");
        $("#searchModal").toggle();
    })

    // Search modal - Calendar invite - Searching for people to invite
    $("body").on("click","#invitePeople2",function(){
        if($("#searchity").val().length>0){
            $("#searchLoader").css('display','block');
            $("#searchResults").css('display','none');
            $("#searchResults").html('');
            console.log($("#searchity").val());
            $.ajax({
                method: "POST",
                url: "../calendar/seek/"+realId,
                data: {str:$("#searchity").val()},
                success: function(data){
                    var don=JSON.parse(data);
                    if(don.length==0){
                        $("#searchResults").html("Aucun résultat trouvé");
                    }
                    else{
                        don.forEach(function(user){
                            $("#searchResults").append("<div class='searchResult'><input type=\"checkbox\" value='"+user.id+"'>Nom : "+user.last_name+" | Prénom : "+user.first_name+"<br>Email : "+user.email+"</div>");
                        })
                    }
                    $("#searchLoader").css('display','none');
                    $("#searchResults").css('display','block');
                }
            })
        }
    })

    // Search modal - Calendar invite - Sending the checked searched invites
    $("body").on("click","#invitePeopleButton",function(){
        if($( "#searchResults input:checked" ).length==0){
            alert("Impossible de n'inviter personne !");
        }
        else{
            var checked= [];
            $('#searchResults input:checked').each(function() {
                checked.push($(this).val());
            });
            $("#loadingModal").toggle();
            $("#searchModal").toggle();
            $.ajax({
                method: "POST",
                url: "../mail/calendar/"+realId+"/invite",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                traditional: true,
                data: JSON.stringify(checked),
                processData: false,
                success: function(data){
                    $("#loadingModal").toggle();
                    console.log($("#calGuests .row").children.length);
                    for(check in checked){
                        $("#calGuests .row").append("<a href=\"/profile/"+check+"\"><div class=\"miniAva\" style=\"background-image:url(../../uploads/ava/"+doesImgExist(checked[check])+".png);\"></div></a>")
                    }
                },
                error: function(info){
                    $("#loadingModal").toggle();
                    console.log(checked);
                    if(($("#calGuests .row").find("a").length)==0)
                    $("#calGuests .row").html("");
                    for(check in checked){
                        $("#calGuests .row").append("<a href=\"/profile/"+checked[check]+"\"><div class=\"miniAva\" style=\"background-image:url(../../uploads/ava/"+doesImgExist(checked[check])+".png);\"></div></a>")
                    }
                }
            })
        }
    })

    // Search modal - Guesting - Showing the modal

    // Search modal - Guesting - Searching for people to beg for an invite

    // Search modal - Guesting - Sending beg
});