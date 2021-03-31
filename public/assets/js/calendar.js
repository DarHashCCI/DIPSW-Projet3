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
            console.log(info.event._def.publicId);
            $("#loadingModal .modal-body").html("Chargement...");
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
            $("#loadingModal .modal-body").html("Création en cours...");
            $("#loadingModal").toggle();
            $.ajax({
                method: "POST",
                url: "../event/create/"+realId,
                data: {data:$("#newDateForm").serialize()},
                success: function(){
                    $("#newDateForm")[0].reset();
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
        $("#loadingModal .modal-body").html("Suppression en cours...");
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
            $("#loadingModal .modal-body").html("Mise à jour en cours...");
            $("#loadingModal").toggle();
            $.ajax({
                method: "PUT",
                url: "../event/"+$("#plsno").val(),
                data: {upd:$("#newDateForm").serialize()},
                success: function(){
                    $("#newDateForm")[0].reset();
                    calendar.refetchEvents();
                    $("#loadingModal").toggle();
                }
            })
        }
    })

    // Date creation/update modal : color inputs behavior check
    $("#colorback").on("change",function(){
        $("#newDateModal .modal-content").css("background-color", $("#colorback").val());
        $("#newDateModal .modal-footer button").css("color", $("#colorback").val());
    })

    $("#colorfont").on("change",function(){
        $("#newDateModal .modal-content").css("color", $("#colorfont").val());
        $("#newDateModal .modal-footer button").css("background-color", $("#colorfont").val());
        $("#newDateModal .modal-footer button").css("border-color", $("#colorfont").val());
        $("#newDateModal .modal-header button").css("color", $("#colorfont").val());
    })
});
