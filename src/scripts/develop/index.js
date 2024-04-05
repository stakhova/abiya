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
    $('.project__top .project__percent span').text(percent)
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
        $('.project__table td').each(function (){
            if($(this).find('*').length == 0){
              $(this).closest('td').remove()
          }
        })
    }
}
let button
function toogleModal(btn, modal) {
    btn.click(function () {
        button = $(this)
        openPopupFunction()
        modal.show();
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
        if ($(e.target).closest('.modal__content').length == 0) {
            $(this).hide();
            resetModal()
            $('body').css('overflow', 'visible');
        }
    });
}

function appendToModalData(){
    let desc = button.data('desc')
    let managers = button.data('manager').split(',');
    let number1 = button.closest('tr').index() + 1
    let number2 = button.closest('td').index()
    let part1 = button.closest('tr').find('.project__task-step h3').text()
    let part2 = button.find('.project__task-title').text()

    let managerList = '';
    managers.forEach(function(manager){
        managerList += '<span>' + manager.trim() + '</span>';
    });

    $('.project__manager-list').html(managerList);
    $('.project__modal-desc p').text(desc)
    $('.project__modal-title').html(`<span>Stage ${number1}. ${part1}</span>Step ${number2}. ${part2}`)
}

function openPopupFunction(){
    let cloneFileName = button.closest('.notes__file-item').clone()
    $('.modal__delete .notes__file-item').remove()
    $('.modal__delete .modal__btn').before(cloneFileName)
    if(button.hasClass('project__task')){
        appendToModalData()
    }
    if(button.hasClass('notes__top-delete')){
        deleteNotes(button,'.notes__item', 'delete__notes')
    }
    if(button.hasClass('notes__file-delete')){
        deleteNotes(button,'.notes__file-item', 'delete__file')
    }
}


function uploadFiles(){
    $('#upload').on('change', function(e){
        let files = $(this)[0].files;
        let fileList = $('.form__file-list');
        for(let i= 0; i < files.length; i++){
            let file = files[i];
            let fileName= file.name
            fileList.append(`<div class="form__file-item"><h3>Uploaded ${fileName}</h3><button type="button" class="notes__file-delete img"><img src="../../img/delete.svg" alt=""></button>`)

        }
    });


    // $('#upload').on('change', function(event) {
    //     let fileList = event.target.files;
    //     let fileListContainer = $('.form__file-list');
    //     fileListContainer.empty();
    //
    //     $.each(fileList, function(index, file) {
    //         let fileName = file.name;
    //         let deleteButton = $('<button>Delete</button>');
    //         deleteButton.data('index', index); // Set index as data attribute
    //         deleteButton.on('click', function() {
    //             let indexToRemove = $(this).data('index');
    //             let updatedFileList = Array.from(fileList);
    //             updatedFileList.splice(indexToRemove, 1); // Remove the file from the list
    //             event.target.files = new FileList(updatedFileList); // Assign the updated file list to input
    //             $(event.target).trigger('change'); // Trigger change event to update file list
    //         });
    //
    //         let listItem = $('<div></div>').text(fileName).append(deleteButton);
    //         fileListContainer.append(listItem);
    //     });
    // });

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
        let formData = new FormData($(this)[0]);
        // formData.append('file', $(this).find('input[type=file]')[0].files[0]);
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: formData,
            method: 'POST',
            contentType: false,
            processData: false,
            cache: false,
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

function search(){
    let formData = $('.project__search').serialize();

    let searchText = $('.project__search-input input').val();
    if (searchText.length < 1){
        $('.project__search-result').hide()
    } else{
        $('.project__search-result').show(300)
    }
    $.ajax({
        url: '/wp-admin/admin-ajax.php',
        data: formData,
        method: 'POST',
        success: function (res) {
            console.log('success ajax');
            $('.project__search-list').html(res);
        },
        error: function (error) {
            console.log('error ajax');
        },
        complete: function (){

        }
    });
}

function showSearch(){
    $(document).on('keydown', '.project__search-input input', function (){
        clearTimeout( $(this).data('timer') )
        let timer = setTimeout(function() {
            search()
        }, 500);
        $(this).data('timer', timer);
    })

    $(document).on('submit','.project__search', function (e){
        e.preventDefault()
        search()
    })

    $(document).on('input', '.project__search-input input', function (){
        if($(this).is( ":focus" )){
            $('.project__search').addClass('focused')
        }else{
            $('.project__search').removeClass('focused')
        }
    })
}


const openMenu = () => {
    $('.header__burger').toggleClass("header__burger-open");
    $('.header__menu').toggleClass('header__menu-show');
    $('body').toggleClass('hidden');
};

function deleteNotes(btn, item, action ){
        let note = btn.closest(item)
        let id = note.data('id')
        let obj = {action:action, item_id:id}
        $(document).off('click','.modal__btn-delete');
        $(document).on('click','.modal__btn-delete', function (){
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: obj,
                method: 'POST',
                success: function () {
                    console.log('success ajax');
                    note.remove();
                    $('.modal__delete').hide();
                },

                error: function (error) {
                    console.log('error ajax');
                    note.remove();
                    $('.modal__delete').hide();
                },
                complete: function (){
                }
            });
        })
}


function openModalDelete(btn, content) {
    $(document).on('click', btn, function () {
        $(this).closest('.modal__content').hide();
        content.show();
    });
}

function resetModal(){
    // $('.modal__content-task').show();
    // $('.modal__content-delete').hide();
}


function deleteFileFromModal(){
    $('#upload').on('change', function(event) {
        let fileList = event.target.files;
        let fileListContainer = $('.form__file-list');
        fileListContainer.empty();

        $.each(fileList, function(index, file) {
            let fileName = file.name;
            let deleteButton = $('<button>Delete</button>');
            deleteButton.data('index', index); // Set index as data attribute
            deleteButton.on('click', function() {
                let indexToRemove = $(this).data('index');
                let updatedFileList = Array.from(fileList);
                updatedFileList.splice(indexToRemove, 1); // Remove the file from the list
                event.target.files = new FileList(updatedFileList); // Assign the updated file list to input
                $(event.target).trigger('change'); // Trigger change event to update file list
            });

            let listItem = $('<div></div>').text(fileName).append(deleteButton);
            fileListContainer.append(listItem);
        });
    });
}
$(document).ready(function(){
    // deleteFileFromModal()
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
    toogleModal($('.notes__file-delete'), $('.modal__delete'));
    toogleModal($('.notes__top-delete'), $('.modal__delete'));

    uploadFiles();
    submitForm();
    tab();
    showMobTask();
    $('.header__burger').on('click', openMenu);
    // openModalDelete('.notes__file-delete', $('.modal__content-delete'));
    showSearch()
});

$(window).load(function(){

});

$(window).resize(function(){

});
$(window).scroll(function () {
});
