$( document ).ready(function() {
    var realUrl=urf;
    var realId=id;
    var calendarEl = document.getElementById('calendar-holder');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'fr',
        initialView: 'dayGridMonth',
        editable: false,
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
        },
        timeZone: 'UTC',
    });
    calendar.render();
});
