$( document ).ready(function() {
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
        $("#searchity").prev().text('Info à chercher : ');
        $('.modal-body .fa-search').attr("id","searchContacts2");
        $("#searchModal").toggle();
    })

    // Search modal - Contact - Searching
    $("body").on("click","#searchContacts2",function(){
        if($("#searchity").val().length>0){
            $("#inviteLoader").css('display','block');
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
                    $("#inviteLoader").css('display','none');
                    $("#searchResults").css('display','block');
                }
            })
        }
    })
});