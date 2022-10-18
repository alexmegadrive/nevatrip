// показать дополнительное время при клике на "еще"
window.addEventListener('click', function(event){
    if (event.target.dataset.action == 'show-more') {
        console.log(1)
        const TIME_BLOCK = event.target.closest('.card__schedule').querySelectorAll('span')
        console.log('TIME_BLOCK :', TIME_BLOCK);
        for (i=0; i<TIME_BLOCK.length; i++) {
            if (TIME_BLOCK[i].dataset.action =='show-more') TIME_BLOCK[i].classList.add('hidden')
            else TIME_BLOCK[i].classList.remove('hidden')
        }
    }
})