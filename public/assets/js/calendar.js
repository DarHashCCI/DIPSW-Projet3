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
                    $("#disp_colorback").text(don.backColor);
                    $("#disp_colorfont").text(don.textColor);
                    $("#dontlookpls").text(don.id);
                    $("#loadingModal").toggle();
                    $("#displayDateModal").toggle();
                }
            })
        },
        timeZone: 'UTC',
    });
    calendar.render();

    // Date creation modal - Close button. Aka "fixing Bootstrap's shit"
    $("#newDateModal button.close").on("click",function(){
        $("#newDateForm")[0].reset();
        $("#newDateModal").toggle();
    })

    // Date creation modal
    $("#newDateButton").on("click",function(){
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
                url: "../event/create",
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
            $("#disp_colorback").text('');
            $("#disp_colorfont").text('');
            $("#dontlookpls").text('');
            $("#displayDateModal").toggle();
       })
});
