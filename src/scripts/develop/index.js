const validateForm = (form, func) => {
    form.on("submit", function (e) {
        e.preventDefault();
    });
    $.validator.addMethod("goodMessage", function (value, element) {
        return this.optional(element) || /^[\sаА-яЯіІєЄїЇґҐa-zA-Z0-9._-]{2,100}$/i.test(value);
    }, "Please enter correct");

    $.validator.addMethod("goodEmail", function (value, element) {
        return this.optional(element) || /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,62}$/i.test(value);
    }, "Please enter correct email");


    form.validate({
        rules: {
            username: {
                required: true,
                // goodMessage: true,
            },
            email: {
                required: true,
                goodEmail: true,
                email: true
            },
            password: {
                required: true,
            },

        },
        messages: {
            username: {
                required: "This field is required",
                email: "Please enter correct username"
            },
            email: {
                required: "This field is required",
                email: "Please enter correct email"
            },
            password: {
                required: "This field is required",
                minlength: "First name can't be shorter than 2 characters",
                maxLength: "First name can't be longer than 100 characters "
            },

        },
        submitHandler: function () {
            func();
            form[0].reset();
        }
    });
};

function ajaxSend(form) {
    let formData = form.serialize();
    $.ajax({
        url: '/wp-admin/admin-ajax.php',
        data: formData,
        method: 'POST',
        success: function () {
            console.log('success ajax');

        },
        error: function (error) {
            console.log('error ajax');
        },
        complete: function (){

        }
    });
}

function tab() {
    $(".tab__header-item").click(function () {
        $(".tab__header-item").removeClass("active").eq($(this).index()).addClass("active");
        $(".tab__content-item").hide().eq($(this).index()).fadeIn();
    }).eq(0).addClass("active");
}


function progressBar(){
    let allTasks = $('.project__task').length
    let acceptTasks = $('.project__task.accept').length
    let percent = acceptTasks*100/allTasks
    $('.project__percent span').text(percent)
    $('.project__progress-bar').css('width', `${percent}%`)

}

function addPercentStyle(){
    $('.project__percent span').each(function (){
        let result = $(this).text()
        let wrap = $(this).closest('.project__percent')
        if( result == '0' ){
            wrap.addClass('zero')
        }
        if( result == '100' ){
            wrap.addClass('full')
        }
    })
}

function changeMob() {
    if(window.innerWidth <= 666){

        let progress = $('.project__progress')
        let wrap = $('.project__top')
        wrap.find('.project__top-block:first-child').after(progress);
    }
}

function toogleModal(btn, modal ) {
    btn.click(function () {
        let button = $(this)
        function appendToModal(){

            let desc = button.data('desc')
            let managers = button.data('manager').split(',');
            let number1 = button.closest('tr').index() + 1
            let number2 = button.closest('td').index()
            let part1 = button.closest('tr').find('.project__task-step h3').text()
            let part2 = button.find('.project__task-title').text()
            console.log('manager',managers)



            let managerList = '';
            managers.forEach(function(manager){
                managerList += '<span>' + manager.trim() + '</span>';
            });
            $('.project__manager-list').html(managerList);
            $('.project__modal-desc p').text(desc)
            $('.project__modal-title').html(`<span>Stage ${number1}. ${part1}</span>Step ${number2}. ${part2}`)
        }
        appendToModal()
        modal.show();
        $('body').css('overflow', 'hidden');

        return false;
    });
    $('.modal__close').click(function () {
        $(this).closest(modal).hide();
        $('body').css('overflow', 'visible');

        return false;
    });
    $('.modal__ok').click(function () {
        $(this).closest(modal).hide();
        $('body').css('overflow', 'visible');
        return false;
    });
    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            e.stopPropagation();
            $('body').css('overflow', 'visible');
        }
    });
    modal.click(function (e) {
        if ($(e.target).closest('.modal__content').length == 0) {
            $(this).hide();
            $('body').css('overflow', 'visible');
        }
    });
}

function addInfoTaskToPopup(btn){
    console.log('this', btn)
}
function uploadFiles(){
    $('#upload').on('change', function(){
        let files = $(this)[0].files;
        let fileList = $('.form__file-list');

        for(let i= 0; i < files.length; i++){
            let file = files[i];
            let fileName= file.name
            fileList.append(`<div class="form__file-item"><h3>Uploaded ${fileName}</h3><button class="notes__file-delete img"><img src="../../img/delete.svg" alt=""></button>`)

        }
    });
}
function deleteNotes(btn, item, action ){
    $(document).on('click',btn, function (){
        let note = $(this).closest(item)

        let id = note.data('id')
        note.remove()
        let obj= {action:action, item_id:id}
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function () {
                console.log('success ajax');
            },
            error: function (error) {
                console.log('error ajax');
            },
            complete: function (){

            }
        });
    })
}



function showMobTask(){
    $('.project__table-task tr:first-child').addClass('active')


    function disabledBtn(){

        if(!$('.project__table-task tr:first-child').hasClass('active')){
            $('.project__task-prev').removeClass('disabled')
        }else {
            $('.project__task-prev').addClass('disabled')
        }
        if(!$('.project__table-task tr:last-child').hasClass('active')){
            $('.project__task-next').removeClass('disabled')
        } else {
            $('.project__task-next').addClass('disabled')
        }
    }
    $(document).on('click', '.project__task-next', function (){
        let active = $('.project__table-task tr.active')
        let next = active.next('.project__table-task tr')
        active.removeClass('active')
        next.addClass('active')
        disabledBtn()
    })
    $(document).on('click', '.project__task-prev', function (){
        let active = $('.project__table-task tr.active')
        let prev = active.prev('.project__table-task tr')
        active.removeClass('active')
        prev.addClass('active')
        disabledBtn()
    })
}

function submitForm(){

    let notesForm = $('.form__notes');
    $(document).on('submit', '.form__notes', function (e){
        e.preventDefault();
        ajaxSend(notesForm,'/wp-admin/admin-ajax.php')
    })

}
$(document).ready(function(){

    let loginForm = $('.login__form');
    validateForm(loginForm, function () {
        ajaxSend(loginForm, '/wp-admin/admin-ajax.php')
    });

    progressBar();
    addPercentStyle();
    changeMob()

    toogleModal($('.notes__button'), $('.modal__notes'));
    toogleModal($('.project__task.reject'), $('.modal__task'));
    toogleModal($('.project__task.clarify'), $('.modal__task-clarify'));
    uploadFiles()
    deleteNotes('.notes__top-delete','.notes__item', 'delete__notes')
    deleteNotes('.notes__file-delete','.notes__file-item', 'delete__file')
    submitForm();
    tab();
    showMobTask()
});

$(window).load(function(){

});

$(window).resize(function(){

});
$(window).scroll(function () {
});
