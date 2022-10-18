const ROUTE_SELECTOR = document.querySelector('#route')
const TIME1_SELECTOR = document.querySelector('#time-route')
const TIME1_OPTIONS = TIME1_SELECTOR.querySelectorAll('option')
const TIME2_SELECTOR = document.querySelector('#time-route2')
const TIME2_OPTIONS = TIME2_SELECTOR.querySelectorAll('option')
const TIME2_BLOCK = document.querySelector('#time2-block')
const TICKET_INPUT = document.querySelector('#ticket-quantity')
const ROUTE_INFO = document.querySelector('#route-info')
const ROUTE_PRICE = document.querySelector('#route-price')
const USER_TIMEZONE = document.querySelector('#user-timezone')



//подстройка времени под часовой пояс пользователя

function changeTimeOffset(options) {
    for (i = 0; i < options.length; i++) {
        if (options[i].value) {
            let hours = +options[i].innerText.slice(0, 2)
            hours = String(hours + getTimezoneOffsetHours());
            hours = hours > 23 ? String(hours - 24) : hours;
            if (hours.length < 2) hours = '0' + hours;
            let result = hours + options[i].value.slice(2);
            options[i].innerText = result
        }
    }
}

// вычисление смещения часового пояса от МСК
function getTimezoneOffsetHours() {
    const MSC_OFFSET = 3
    let x = new Date();
    return -x.getTimezoneOffset() / 60 - MSC_OFFSET;
}

// отобразить часовой пояс в интерфейсе
function paintUserTimezone() {
    let offset =  getTimezoneOffsetHours()
    USER_TIMEZONE.innerText = `${offset+3} GMT`
}

// вычисление маршрута и сумм
function countRoute() {
    let route_type = ROUTE_SELECTOR.value.split(' ').filter(el => el !== '' && el == el.toUpperCase()).join(''),
        departure1 = TIME1_SELECTOR.value.slice(0, 5),
        departure2 = TIME2_SELECTOR.value.slice(0, 5) || '',
        tickets = TICKET_INPUT.value,
        sum, price = 0,
        traveltime = '',
        infoStr, totalStr, timeStr = '';

        let selectedDate1 = TIME1_SELECTOR.options[TIME1_SELECTOR.selectedIndex].getAttribute('data-time')
        let selectedTime1 = (new Date(selectedDate1)).getTime();
        let selectedDate2 = TIME2_SELECTOR.options[TIME2_SELECTOR.selectedIndex].getAttribute('data-time')
        let selectedTime2 = (new Date(selectedDate2)).getTime();


    if (route_type.length > 2) {
        price = 1200
        traveltime = countTotalTravelTime(selectedTime1, selectedTime2);
        let comebackstr = getComeBackTime(selectedTime2)
        timestr = `Теплоход отправляется в ${departure1}, а обратно прибудет в ${comebackstr}.`
    } else {
        price = 700;
        traveltime = '50 мин.';
        let comebackstr = getComeBackTime(selectedTime1)
        timestr = `Теплоход отправляется в ${departure1}, в пункт назначения прибудет в ${comebackstr}`;
    }

    sum = tickets * price

    infoStr = `
    \u{1F3AB} Выбрано билетов: ${tickets} 
    \u{1F4CD} Маршрут: "${ROUTE_SELECTOR.value}" стоимостью ${sum}р.
    \u{23F1} Время в путешествии: ${traveltime} 
    \u{2693} ${timestr}`

    totalStr = `ИТОГО: ${sum}р`

    return {infoStr, totalStr}

}

// отрисовка деталей маршрута в DOM
function paintRouteDetails() {
    let {infoStr, totalStr} = countRoute()
    ROUTE_INFO.innerText = infoStr
    ROUTE_PRICE.innerText = totalStr
}

// вычисление времени прибытия
function getComeBackTime(time) {
    let d = new Date(time);
    d.setMinutes(d.getMinutes() + 50);
    hours = d.getHours()
    minutes = d.getMinutes()
    return [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0')].join(':')
}

// вычисление общего времени в пути
function countTotalTravelTime(departure, departure2) {
    let singleTravelTime =  3000000 //50 мин в миллисекундах
    let totalMillis = departure2 - departure + singleTravelTime
    let minutes = Math.floor(totalMillis / 60000);
    let hours = Math.floor(totalMillis / 3600000)
    minutes = minutes - 60*hours
    return `${hours} ч. ${minutes} мин.`

  
}

//отключение опций селектора time2, несоответствующих выбору
function showTime2Options(selector, date) {

    let option1SelectedTime = (new Date(date)).getTime();
     for (i = 0; i < selector.length; i++) {
        const option = selector[i]
        const optionDate = selector[i].getAttribute('data-time')
        const option2Time = (new Date(optionDate)).getTime();
        if ((option2Time - option1SelectedTime) > 3000000) option.hidden = false;
        else option.hidden = true;
        console.log('option_time :', option2Time);
     }
    setAvailableValue(selector)
}

// выбрать первую доступную опцию при изменении селекта
function setAvailableValue(selector) {
    let selected = [...selector].filter(el => !el.hidden)[0].value
    selector.value = selected
}

// валидация инпута количества билетов
function validateTicketNumber() {

    let max = parseInt(this.max);
    let min = parseInt(this.min);
    if (parseInt(this.value) > max) {
        this.value = max;
    }
    if (!parseInt(this.value)) {
        this.value = min;
    }
}

//проверка вводимого символа (для поддерживаемости некоторых браузеров)
function checkNum(e) {
    e = e || window.event;
    let charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
    let charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9]+/)) e.preventDefault();

}




