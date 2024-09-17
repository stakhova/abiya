let modalManager = $('.modal__managers')

function openManagerPopup(btn, modal) {
    btn.click(function () {
        button = $(this)
        let modalId = button.attr('data-cell');
        modal = $(`.modal[data-modal="${modalId}"]`);
        modalManager = modal
        appendManager()
        modal.show();
        getPositionDate()
        $('body').css('overflow', 'hidden');
        return false;
    });
    $('.modal__close').click(function () {
        $(this).closest(modal).hide();
        $('body').css('overflow', 'visible');
        resetModal()
        return false;
    });
    $('.modal__btn-close').click(function () {
        $(this).closest(modal).hide();
        $('body').css('overflow', 'visible');
        resetModal()
        return false;
    });
    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            e.stopPropagation();
            resetModal()
            $('body').css('overflow', 'visible');
        }
    });
    modal.click(function (e) {
        console.log(32323232)
        if ($(e.target).closest('.modal__content').length == 0) {
            $(this).hide();
            resetModal()
            $('body').css('overflow', 'visible');
        }
    });
}



function moreLocation(){
    $(document).on('click','.location__more', function (){
        let modal = $(this).closest('.modal')
        modal.find('.location__more-block').show();
        $(this).hide()
    })
}





function appendManager(){
    let title = button.attr('data-title')
    let desc = button.attr('data-desc')
    let icon = button.find('.project__task-img img').attr('src')
    let numberCell = button.closest('tr').index() + 1
    let numberColumn = button.closest('td').index()
    let titleCell = button.find('.project__task-title').text()
    let topTitle = button.closest('tr').find('.project__task-step h3').text()


    modalManager.find('.project__modal-desc h3').text(title)
    modalManager.find('.project__modal-desc p').text(desc)
    modalManager.find('.project__top-icon img').attr('src',icon)
    modalManager.find('.project__modal-title').html(`${topTitle}<br> ${numberCell}.${numberColumn} ${titleCell}`)
}


function fillCalendar(){
    $(document).on('change', '.calendar__wrap input', function (){
        let wrap = $(this).closest('.modal__calendar')
        function parseDate(input) {
            const parts = input.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Months are zero-based in JavaScript Date object
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
        const dateFrom = $('#date_from').val();
        const dateTo = $('#date_to').val();


        $('.error').remove();
        if (!dateFrom || !dateTo) {
            $('.calendar__wrap').append('<label class="error" >Please fill in both dates.</label>');
        } else {
            const dateFromObj = parseDate(dateFrom);
            const dateToObj = parseDate(dateTo);

            let duration

            if (dateToObj < dateFromObj) {
                $('.calendar__wrap').append('<label class="error" >The project completion date cannot be earlier than the award of contract date.</label>');
                wrap.removeClass('active')
            } else{
                duration = Math.floor((dateToObj - dateFromObj) / (1000 * 60 * 60 * 24));

                let obj ={action:'add_date',dateFrom,dateTo}
                $.ajax({
                    url: '/wp-admin/admin-ajax.php',
                    data: obj,
                    method: 'POST',
                    success: function (res) {

                    },
                    error: function (error) {
                        console.log('error ajax');
                    },
                    complete: function () {}
                });

                $('.calendar__start span').text(dateFrom)
                $('.calendar__end span').text(dateTo)
                wrap.addClass('active')
                getPositionDate()
                $('.calendar__wrap-duration span').text(duration)
            }
        }
    })
}
function moreItems(){
    let modal
    $(document).on('click','.modal__managers-more', function (){
        // $(this).closest('.modal[data-modal="1_1"]').find('.project__table-manager > table tbody').append(`<tr class="new">
        //                                 <td>
        //                                     <input type="text">
        //                                 </td>
        //                                 <td>
        //                                    <input type="text">
        //                                 </td>
        //                             </tr>`)
        modal = $(this).closest('.modal')
        modal.find('.modal__managers-save').show()
        $(this).hide()
        submitFormDataProject('.form__task');
        submitFormDataProject('.inspections__form');
    })
    // $(document).on('click','.modal__managers-save', function (){
    //     // modal.find('.new:last-of-type input').attr('readonly', true)
    //     modal = $(this).closest('.modal')
    //     modal.find('.modal__managers-more').show()
    //     $(this).hide()
    // })
}

function removeItem(){
    $(document).on('click','.delete__item',function (){
        let action= $(this).closest('.modal').data('action')
        let item = $(this).closest('[data-item-id]')
        let item_id = item.data('item-id')
        let obj = { action, item_id};
        console.log(111, obj)
        if(item.hasClass('active')){
            item.next().addClass('active')
        }
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function (res) {
                item.remove()
            },
            error: function (error) {
                console.log('error ajax');
                item.remove()
            },
        });
    })
}

function calendar() {
    $(".modal__datepicker").datepicker({
        dateFormat: 'dd/mm/yy'
    });
}

// function getPositionDate() {
//     let lineWidth = $('.calendar__illustrate').width();
//     let points = $('.calendar__date .calendar__point');
//     let itemLength = points.length;
//
//     console.log('Line width:', lineWidth);
//     console.log('Number of points:', itemLength);
//
//     if (itemLength > 1) {
//         // Початкова і кінцева точки фіксовані
//         // points.first().css({
//         //     'position': 'absolute',
//         //     'left': '0'
//         // });
//         //
//         // points.last().css({
//         //     'position': 'absolute',
//         //     'left': (lineWidth - points.last().width()) + 'px'
//         // });
//
//         // Розміщення проміжних точок
//         let availableWidth = lineWidth - points.first().width() - points.last().width();
//         let step = availableWidth / (itemLength - 1);
//
//         points.each(function (index) {
//             if (index > 0 && index < itemLength - 1) { // Проміжні точки
//                 let position = step * index;
//                 $(this).css({
//                     'position': 'absolute',
//                     'left': (position + points.first().width()) + 'px'
//                 });
//             }
//         });
//     }
// }

function getPositionDate(){
    let lineWidth = $('.calendar__illustrate').width()
    let itemLength = $('.calendar__date .calendar__point').length + 1

    let gap = lineWidth/itemLength


    console.log('Line width:', lineWidth)
    console.log('Number of points:', itemLength)
    console.log('Number of points:', gap)
    let position = 0



    $('.calendar__date .calendar__point').each(function () {
        position += gap;
        let content =  $(this).find('.calendar__point-content')

        content.css({
            'right': `${(gap-16)/2}px`,
            'max-width': gap + 'px'
        })




        $(this).css({
            'position': 'absolute',
            'left': position + 'px',
            'max-width': gap + 'px'
        });
    });
    $('.calendar__date .calendar__point:nth-child(odd)').each(function () {

        let content =  $(this).find('.calendar__point-content')
        let contentHeight =  content.height()

        content.css({
            'bottom': `${contentHeight + 71}px`,
        })
    });
}

function removeDate(){
    $(document).on('click','.calendar__point-delete', function (){
        let date = $(this).closest('.calendar__point')
        let date_id = date.data('date-id')
        let obj = { action: 'add_date', date_id};
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function (res) {
                $('.calendar__illustrate').html(res)
                getPositionDate()
            },
            error: function (error) {
                console.log('error ajax');
                date.remove()
                getPositionDate()
            },
        });
    })
}


$(document).ready(function(){
    removeDate()
    openManagerPopup($('.manager'), modalManager );
    moreItems()
    moreLocation()
    removeItem()
    calendar()
    fillCalendar()



    let locationForm = $('.location__form');
    validateForm(locationForm, function () {
        ajaxSend(locationForm, function () {

            ('.location__more-block').hide();
            $('.location__more').show();
        }, function (error){
            // $('.location__more-block').hide();
            // $('.location__more').show();
        });
    });


    let contractForm = $('.contract__form');
    validateForm(contractForm, function () {
        let form__input = $('.contract__form .form__input input').val()
        ajaxSend(contractForm, function () {
            ('.location__more-block').hide();
            $('.location__more').show();

        }, function (error){

            $('.contract__form .form__input label:first-of-type').text(`Amount Of the contract: ${form__input}`)
            // $('.location__more-block').hide();
            // $('.location__more').show();
        });
    });



    let formTerms = $('.form__terms');
    validateForm(formTerms, function () {
        ajaxSend(formTerms, function () {
            $('.location__more-block').hide();
            $('.location__more').show();
        }, function (error){
            // $('.location__more-block').hide();
            // $('.location__more').show();
        });
    });


    let contactForm = $('.contact__form');
    validateForm(contactForm, function () {
        ajaxSend(contactForm, function () {
            $('.location__more-block').hide();
            $('.location__more').show();
        }, function (error){
            // $('.location__more-block').hide();
            // $('.location__more').show();
        });
    });

    let dateForm = $('.calendar__form');
    validateForm(dateForm, function () {
        // let date_add = $('#date_add').val()
        // let note_add = $('#note__add').val()
        ajaxSend(dateForm, function () {
            $('.calendar__illustrate').html(res)
            getPositionDate()
        }, function (error){
            $('.calendar__illustrate').html(res)
            // $('.calendar__date').append(` <div class="calendar__point">
            //                             <div class="calendar__point-content">
            //                                 <span class="calendar__point-date">${date_add}<button class="calendar__point-delete"></button></span>
            //                                 <span class="calendar__point-desc">${note_add}</span>
            //                             </div>
            //                         </div>`)
            getPositionDate()
        });
    });

    $('.select').select2({})


});

$(window).load(function(){

});

$(window).resize(function(){

});
$(window).scroll(function () {
});