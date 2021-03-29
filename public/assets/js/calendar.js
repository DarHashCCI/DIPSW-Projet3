$( document ).ready(function() {
    var realUrl=urf;
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
                    filters: JSON.stringify({})
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
            console.log(info.delta);
            console.log(info.event._def.publicId);
            $.ajax({
                method: "PUT",
                url: "event/"+info.event._def.publicId,
                data: {dr:info.delta},
                success: function(){
                    console.log("élément mis à jour");
                }
            })
        },
        eventResize: (info) =>{
            console.log(info.endDelta);
        },
        timeZone: 'UTC',
    });
    calendar.render();
});

/*$('#calendar-holder').fullCalendar({
        eventDrop: (info) =>{
            console.log(info.delta);
            console.log(info.event._def.publicId);
            $.ajax({
                method: "PUT",
                url: "event/"+info.event._def.publicId,
                data: {dr:info.delta},
                success: function(){
                    console.log("élément mis à jour");
                }
            })
        }
    });
});*/