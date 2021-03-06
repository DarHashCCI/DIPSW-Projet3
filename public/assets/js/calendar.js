$( document ).ready(function() {
    var realUrl=urf;
    var realId=id;
    var calendarEl = document.getElementById('calendar-holder');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'fr',
        initialView: 'dayGridMonth',
        editable: true,
        eventSources: [
            {
                url: realUrl,
                method: "POST",
                extraParams: {
                    filters: JSON.stringify({id: realId})
                },
                failure: () => {
                    // alert("There was an error while fetching FullCalendar!");
                },
            },
        ],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }, // https://fullcalendar.io/docs/plugin-index
        eventDrop: (info) =>{
            console.log(info);
            console.log(info.delta);
            console.log(info.event._def.publicId);
            $.ajax({
                method: "PUT",
                url: "../event/"+info.event._def.publicId,
                data: {dr:info.delta},
                success: function(){
                    console.log("élément mis à jour");
                }
            })
        },
        eventResize: (info) =>{
            console.log(info);
            console.log(info.endDelta);
            console.log(info.event._def.publicId);
            $.ajax({
                method: "PUT",
                url: "../event/"+info.event._def.publicId,
                data: {re:info.endDelta},
                success: function(){
                    console.log("élément mis à jour");
                }
            })
        },
        dateClick: function(info) {
            $("#newDateModal .modal-title").text('Nouvelle date');
            $("#newDateModal .modal-footer").html('<button id="newDateButton" type="button" class="btn btn-primary">Créer</button>');
            $("#colorback").val("#FFFFFF");
            //Month view
            if(info.view.type=="dayGridMonth") {
                $("#dateBegin").val(info.dateStr);
                $("#newDateModal").toggle();
            }
            // Week view
            else if (info.view.type=="timeGridWeek"){
                date=info.dateStr.split('T');
                $("#dateBegin").val(date[0]);
                $("#timeBegin").val(date[1].substring(0, 5));
                $("#newDateModal").toggle();
            }
            else if (info.view.type=="timeGridDay"){
                date=info.dateStr.split('T');
                $("#dateBegin").val(date[0]);
                $("#dateEnd").val(date[0]);
                $("#timeBegin").val(date[1].substring(0, 5));
                $("#newDateModal").toggle();
            }
            /*alert('Clicked on: ' + info.dateStr);
            alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
            alert('Current view: ' + info.view.type);*/
            // change the day's background color just for fun
            //info.dayEl.style.backgroundColor = 'red';
        },
        eventClick: function(info){
            $("#loadingModal").toggle();
            $.ajax({
                method: "POST",
                url: "../event/"+info.event._def.publicId,
                success: function(data){
                    var don=JSON.parse(data);
                    $("#displayDateModal .modal-title").text(don.title);
                    $("#disp_desc").text(don.description);
                    $("#disp_dateBegin").text(don.beginAt);
                    $("#disp_dateEnd").text(don.endAt);
                    $("#dontlookpls").val(don.id);
                    //Coloring the display window, so it uses the event's color.
                    $("#displayDateModal .modal-content").css('background-color',don.backColor);
                    $("#displayDateModal .modal-content").css('color',don.textColor);
                    $("#displayDateModal .modal-footer button").css("border-color", don.textColor);
                    $("#displayDateModal .modal-footer button").css("background-color", don.textColor);
                    $("#displayDateModal .modal-footer button").css("color", don.backColor);
                    $("#displayDateModal .modal-header button").css("color", don.textColor);
                    $("#loadingModal").toggle();
                    $("#displayDateModal").toggle();
                }
            })
        },
        timeZone: 'UTC',
    });
    calendar.render();

    $(".fc-toolbar-title").append('<input type="hidden" id="datepicker"></input>');
    $(function() {
        $("#datepicker").datepicker({
            showOn: "both",
            showOptions: {
                direction: "down"
            },
            buttonImage: "../../assets/img/calender.png",
            autoSize: true,
            changeMonth: true,
            changeYear: true,
            currentText: "Now",
            firstDay: 1,
            showOtherMonths: true,
            selectOtherMonths: true,
            closeText: 'Fermer',
            prevText: 'Précédent',
            nextText: 'Suivant',
            currentText: 'Aujourd\'hui',
            monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
            dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
            dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
            dayNamesMin: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            weekHeader: 'Sem.',
            onSelect: function(formated, dates) {
                calendar.gotoDate(formated);
            }
        });;$.datepicker.setDefaults( $.datepicker.regional[ "fr" ] );
        $("#datepicker").datepicker("option", "dateFormat", "yy-mm-dd");
        $("#datepicker").datepicker( "setDate" , "+0d" );
    });

	function resetEventForm()
	{
		$("#title").attr("placeholder",'');
        $("#desc").attr("placeholder",'');
		$("#newDateModal .modal-content").css("background-color", 'white');
        $("#newDateModal .modal-footer button").css("color", 'white');
        $("#newDateModal .modal-content").css("color", 'black');
        $("#newDateModal .modal-footer button").css("background-color", 'black');
        $("#newDateModal .modal-footer button").css("border-color", 'black');
        $("#newDateModal .modal-header button").css("color", 'black');
        $("#newDateModal input").css("color", 'black');
	}

    //RGB to hex - used for the color input that don't accept rgb values
    function rgbToHex(r) {
        var a = r.split("(")[1].split(")")[0];
        a = a.split(",");
        var b = a.map(function(x){             //For each array element
            x = parseInt(x).toString(16);      //Convert to a base16 string
            return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
        })
        b="#"+b.join("");
        return b;
    }

    // Date creation modal - Close button. Aka "fixing Bootstrap's shit"
    $("#newDateModal button.close").on("click",function(){
        $("#newDateForm")[0].reset();
        $("#newDateModal").toggle();
        resetEventForm();
    })

    // Date creation modal
    $("body").on("click","#newDateButton",function(){
        var check=true;
        if($("#title").val().length==0){
            alert("Veuillez rajouter un titre.");
            check=false;
        }
        if($("#desc").val().length==0){
            alert("Votre description ne peut être vide.");
            check=false;
        }
        if($("#dateBegin").val().length==0){
            alert("Veuillez renseigner une date de début.");
            check=false;
        }
        if($("#timeBegin").val().length==0){
            alert("Veuillez renseigner une heure de début.");
            check=false;
        }
        if($("#dateEnd").val().length==0){
            alert("Veuillez renseigner une date de fin.");
            check=false;
        }
        if($("#timeEnd").val().length==0){
            alert("Veuillez renseigner une heure de fin.");
            check=false;
        }
        if(check){
            if(new Date($("#dateBegin").val()+' '+$("#timeBegin").val())>=new Date($("#dateEnd").val()+' '+$("#timeEnd").val())){
                alert("La date de fin ne peut être inféreure à la date de début, voyons !");
                check=false;
            }
        }
        if($("#colorback").val()==$("#colorfont").val()){
            alert("Les couleurs sont pareilles. Veuillez changer au moins une des 2 couleurs.");
            check=false;
        }
        if(check){
            $("#newDateModal").toggle();
            $("#loadingModal").toggle();
            $.ajax({
                method: "POST",
                url: "../event/create/"+realId,
                data: {data:$("#newDateForm").serialize()},
                success: function(){
                    $("#newDateForm")[0].reset();
					resetEventForm();
                    calendar.refetchEvents();
                    $("#loadingModal").toggle();
                }
            })
        }
    })

    //Date show modal - Close button. Aka "fixing Bootstrap's shit"
        $("#displayDateModal button.close").on("click",function(){
            $("#displayDateModal .modal-title").text('');
            $("#disp_desc").text('');
            $("#disp_dateBegin").text('');
            $("#disp_dateEnd").text('');
            $("#dontlookpls").val('');
            $("#displayDateModal").toggle();
       })

    // Date deletion button
    $("#deleteButton").on("click",function(){
        $("#displayDateModal").toggle();
        $("#loadingModal").toggle();
        $.ajax({
            method: "DELETE",
            url: "../event/"+$("#dontlookpls").val(),
            success: function(){
                $("#displayDateModal .modal-title").text('');
                $("#disp_desc").text('');
                $("#disp_dateBegin").text('');
                $("#disp_dateEnd").text('');
                $("#dontlookpls").val('');
                calendar.refetchEvents();
                $("#loadingModal").toggle();
            }
        })
    })

    // Update button on the display modal
    $("#updateButton").on("click",function(){
        dateBegin=$("#disp_dateBegin").text().split(' ');
        dateEnd=$("#disp_dateEnd").text().split(' ');
        fontColor=$("#displayDateModal .modal-footer button").css("background-color");
        backColor=$("#displayDateModal .modal-footer button").css("color");
        // Putting the right values in their respective inpus
        $("#title").attr("placeholder",$("#displayDateModal .modal-title").text());
        $("#desc").attr("placeholder",$("#disp_desc").text());
        $("#dateBegin").val(dateBegin[0]);
        $("#dateEnd").val(dateEnd[0]);
        $("#timeBegin").val(dateBegin[1].substring(0, 5));
        $("#timeEnd").val(dateEnd[1].substring(0, 5));
        $("#colorback").val(rgbToHex(backColor));
        $("#colorfont").val(rgbToHex(fontColor));
        $("#newDateModal .modal-title").text('Éditer la date');
        $("#newDateModal .modal-footer").html('<button id="editButton" type="button" class="btn btn-primary">Mettre à jour</button>');
        $("#newDateModal .modal-content").css("background-color", backColor);
        $("#newDateModal .modal-footer button").css("color", backColor);
        $("#newDateModal .modal-content").css("color", fontColor);
        $("#newDateModal .modal-footer button").css("background-color", fontColor);
        $("#newDateModal .modal-footer button").css("border-color", fontColor);
        $("#newDateModal .modal-header button").css("color", fontColor);
        $("#newDateModal input").css("color", fontColor);
        $("#plsno").val($("#dontlookpls").val());
        $("#displayDateModal").toggle();
        $("#newDateModal").toggle();
        // Resetting the display modal
        $("#displayDateModal .modal-title").text('');
        $("#disp_desc").text('');
        $("#disp_dateBegin").text('');
        $("#disp_dateEnd").text('');
        $("#dontlookpls").val('');
    })

    $("body").on("click","#editButton",function(){
        var check=true;
        if($("#dateBegin").val().length==0){
            alert("Veuillez renseigner une date de début.");
            check=false;
        }
        if($("#timeBegin").val().length==0){
            alert("Veuillez renseigner une heure de début.");
            check=false;
        }
        if($("#dateEnd").val().length==0){
            alert("Veuillez renseigner une date de fin.");
            check=false;
        }
        if($("#timeEnd").val().length==0){
            alert("Veuillez renseigner une heure de fin.");
            check=false;
        }
        if(check){
            if(new Date($("#dateBegin").val()+' '+$("#timeBegin").val())>=new Date($("#dateEnd").val()+' '+$("#timeEnd").val())){
                alert("La date de fin ne peut être inféreure à la date de début, voyons !");
                check=false;
            }
        }
        if($("#colorback").val()==$("#colorfont").val()){
            alert("Les couleurs sont pareilles. Veuillez changer au moins une des 2 couleurs.");
            check=false;
        }
        if(check){
            $("#newDateModal").toggle();
            $("#loadingModal").toggle();
            $.ajax({
                method: "PUT",
                url: "../event/"+$("#plsno").val(),
                data: {upd:$("#newDateForm").serialize()},
                success: function(){
                    $("#newDateForm")[0].reset();
					resetEventForm();
                    calendar.refetchEvents();
                    $("#loadingModal").toggle();
                }
            })
        }
    })

    // Date invite button
    $("#inviteButton").on("click",function(){
        fontColor=$("#displayDateModal .modal-footer button").css("background-color");
        backColor=$("#displayDateModal .modal-footer button").css("color");
        $("#inviteDateModal .modal-content").css("background-color", backColor);
        $("#inviteDateModal .modal-footer button").css("color", backColor);
        $("#inviteDateModal .modal-content").css("color", fontColor);
        $("#inviteDateModal .row .fas").css("color", backColor);
        $("#inviteDateModal .row .fas").css("background-color", fontColor);
        $("#inviteDateModal .modal-footer button").css("background-color", fontColor);
        $("#inviteDateModal .modal-footer button").css("border-color", fontColor);
        $("#inviteDateModal .modal-header button").css("color", fontColor);
        $("#inviteLoader").css("color", fontColor);
        $("#searchResults").css("border-color",fontColor);
        $("#plsffs").val($("#dontlookpls").val());
        $("#displayDateModal").toggle();
        $("#inviteDateModal").toggle();
        // Resetting the display modal
        $("#displayDateModal .modal-title").text('');
        $("#disp_desc").text('');
        $("#disp_dateBegin").text('');
        $("#disp_dateEnd").text('');
        $("#dontlookpls").val('');
    })

    //Date invite modal - Close button. Aka "fixing Bootstrap's shit"
    $("#inviteDateModal button.close").on("click",function(){
        $("#searchResults").html('');
        $("#searchity").text('');
        $("#plsffs").val('');
        $("#inviteDateModal").toggle();
    })

    //Date invite modal - Search button.
    $("#inviteDateModal .fa-search").on("click",function(){
        if($("#searchity").val().length>0){
            $("#inviteLoader").css('display','block');
            $("#searchResults").css('display','none');
            $("#searchResults").html('');
            console.log($("#searchity").val());
            $.ajax({
                method: "POST",
                url: "../event/"+$("#plsffs").val()+"/getlist",
                data: {str:$("#searchity").val(),id:realId},
                success: function(data){
                    var don=JSON.parse(data);
                    if(don.length==0){
                        $("#searchResults").html("Aucun résultat trouvé");
                    }
                    else{
                        don.forEach(function(user){
                            $("#searchResults").append("<div><input type=\"checkbox\" value='"+user.id+"'>Nom : "+user.last_name+" | Prénom : "+user.first_name+"<br>Email : "+user.email+"</div>");
                        })
                    }
                    $("#inviteLoader").css('display','none');
                    $("#searchResults").css('display','block');
                }
            })
        }
    })

    //Date invite modal - Invite button.
    $("#inviteButton2").on("click",function(){
        if($( "#searchResults input:checked" ).length==0){
            alert("Impossible de n'inviter personne !");
        }
        else{
            var checked= [];
            $('#searchResults input:checked').each(function() {
                checked.push($(this).val());
            });
            $("#inviteDateModal").toggle();
            $("#loadingModal").toggle();
            $.ajax({
                method: "POST",
                url: "../mail/event/"+$("#plsffs").val()+"/invite",
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                traditional: true,
                data: JSON.stringify(checked),
                processData: false,
                success: function(data){
                    $("#loadingModal").toggle();
                },
                error: function(info){
                    $("#loadingModal").toggle();
                }
            })
        }
    })

    // Date creation/update modal : color inputs behavior check
    $("#colorback").on("input",function(){
        $("#newDateModal .modal-content").css("background-color", $("#colorback").val());
        $("#newDateModal .modal-footer button").css("color", $("#colorback").val());
    })

    $("#colorfont").on("input",function(){
        $("#newDateModal .modal-content").css("color", $("#colorfont").val());
        $("#newDateModal .modal-footer button").css("background-color", $("#colorfont").val());
        $("#newDateModal .modal-footer button").css("border-color", $("#colorfont").val());
        $("#newDateModal .modal-header button").css("color", $("#colorfont").val());
        $("#newDateModal input").css("color", $("#colorfont").val());
    })
});
