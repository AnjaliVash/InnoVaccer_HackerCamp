/* Error Com */
var titles  = [];
var titleInput  = document.getElementById("questiontitle");
var messageBox  = document.getElementById("display");

function insert () {
    titles.push(titleInput.value);
    clearAndShow();
}

function clearAndShow () {
    titleInput.value = "";
    messageBox.innerHTML = "";
    messageBox.innerHTML += "<li> <div data-bs-toggle='collapse' class='collapsed question'>"+titles.join(", ")+" ? <span>Unresolved</span> <i class='bi bi-chevron-down icon-show'></i><i class='bi bi-chevron-up icon-close'></i></div> <div id='faq1' class='collapse' data-bs-parent='.faq-list'></div> </li>";
}    


/*Slot Booking */
mobiscroll.setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

var min = '2022-04-09T00:00';
var max = '2022-10-09T00:00';

mobiscroll.datepicker('#demo-booking-single', {
    display: 'inline',
    controls: ['calendar'],
    min: min,
    max: max,
    pages: 'auto',
    onPageLoading: function (event, inst) {
        getPrices(event.firstDay, function callback(bookings) {
            inst.setOptions({
                labels: bookings.labels,
                invalid: bookings.invalid
            });
        });
    }
});

mobiscroll.datepicker('#demo-booking-datetime', {
    display: 'inline',
    controls: ['calendar', 'timegrid'],
    min: min,
    max: max,
    minTime: '08:00',
    maxTime: '19:59',
    stepMinute: 60,
    width: null,
    onPageLoading: function (event, inst) {
        getDatetimes(event.firstDay, function callback(bookings) {
            inst.setOptions({
                labels: bookings.labels,
                invalid: bookings.invalid
            });
        });
    }
});

mobiscroll.datepicker('#demo-booking-multiple', {
    display: 'inline',
    controls: ['calendar'],
    min: min,
    max: max,
    pages: 'auto',
    selectMultiple: true,
    onInit: function (event, inst) {
        inst.setVal([
            '2022-04-11T00:00',
            '2022-04-16T00:00',
            '2022-04-17T00:00'
        ], true);
    },
    onPageLoading: function (event, inst) {
        getBookings(event.firstDay, function callback(bookings) {
            inst.setOptions({
                labels: bookings.labels,
                invalid: bookings.invalid
            });
        });
    }
});

function getPrices(d, callback) {
    var invalid = [],
        labels = [];

    mobiscroll.util.http.getJson('https://trial.mobiscroll.com/getprices/?year=' + d.getFullYear() + '&month=' + d.getMonth(), function (bookings) {
        for (var i = 0; i < bookings.length; ++i) {
            var booking = bookings[i],
                d = new Date(booking.d);

            if (booking.price > 0) {
                labels.push({
                    start: d,
                    title: '$' + booking.price,
                    textColor: '#e1528f'
                });
            } else {
                invalid.push(d);
            }
        }
        callback({ labels: labels, invalid: invalid });
    }, 'jsonp');
}


function getDatetimes(day, callback) {
    var invalid = [];
    var labels = [];

    mobiscroll.util.http.getJson('https://trial.mobiscroll.com/getbookingtime/?year=' + day.getFullYear() + '&month=' + day.getMonth(), function (bookings) {
        for (var i = 0; i < bookings.length; ++i) {
            var booking = bookings[i];
            var bDate = new Date(booking.d);

            if (booking.nr > 0) {
                labels.push({
                    start: bDate,
                    title: booking.nr + ' SPOTS',
                    textColor: '#e1528f'
                });
                $.merge(invalid, booking.invalid);
            } else {
                invalid.push(bDate);
            }
        }
        callback({ labels: labels, invalid: invalid });
    }, 'jsonp');
}

function getBookings(d, callback) {
    var invalid = [],
        labels = [];

    mobiscroll.util.http.getJson('https://trial.mobiscroll.com/getbookings/?year=' + d.getFullYear() + '&month=' + d.getMonth(), function (bookings) {
        for (var i = 0; i < bookings.length; ++i) {
            var booking = bookings[i],
                d = new Date(booking.d);

            if (booking.nr > 0) {
                labels.push({
                    start: d,
                    title: booking.nr + ' SPOTS',
                    textColor: '#e1528f'
                });
            } else {
                invalid.push(d);
            }
        }
        callback({ labels: labels, invalid: invalid });
    }, 'jsonp');
}