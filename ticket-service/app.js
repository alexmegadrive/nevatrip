// обработчик изменения селекта
$(ROUTE_SELECTOR).change(function () {
    let value = $(this).val().split(' ').filter(el => el !== '' && el == el.toUpperCase()).join('')

    //отключение опций селектора time1, несоответствующих выбору
    for (i = 0; i < TIME1_OPTIONS.length; i++) {
        const option = TIME1_OPTIONS[i]
        if (value == 'ABА' && option.dataset.route !== 'BA' && option.value) option.hidden = false;
        else if (option.dataset.route == value) option.hidden = false;
        else option.hidden = true;
    }

    // показать блок для выбора обратного билета
    if (value == 'ABА'){
        let selectedIndex1 = TIME1_SELECTOR.selectedIndex || 1
        let selectedDate1 = TIME1_SELECTOR.options[selectedIndex1].getAttribute('data-time')
        showTime2Options(TIME2_SELECTOR, selectedDate1)
        TIME2_BLOCK.style.display = 'flex'
    } 
    else TIME2_BLOCK.style.display = 'none'

    // показать блок выбора билетов
    document.querySelector('#ticket-block').style.display = 'block'


    // выбрать первую доступную опцию при изменении селекта
    setAvailableValue(TIME1_SELECTOR)
    paintRouteDetails();


})

// прослушивание событий изменения значения селектора маршрута 1
$(TIME1_SELECTOR).change(function () {
    let route_type = ROUTE_SELECTOR.value.split(' ').filter(el => el !== '' && el == el.toUpperCase()).join('')
    if (route_type == 'ABА') {
        let selectedDate1 = TIME1_SELECTOR.options[TIME1_SELECTOR.selectedIndex].getAttribute('data-time')
        showTime2Options(TIME2_SELECTOR, selectedDate1)
    }
    paintRouteDetails();
})

// прослушивание событий изменения значения селектора маршрута 2
$(TIME2_SELECTOR).change(function () {
    paintRouteDetails();
})

// прослушивание событий изменения значения инпута количества билетов
$(TICKET_INPUT).change(function () {
    paintRouteDetails();
})

//отрисовать часовой пояс и внести корректировки в инпуты
paintUserTimezone()
changeTimeOffset(TIME1_OPTIONS)
changeTimeOffset(TIME2_OPTIONS)