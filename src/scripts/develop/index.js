let button;


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
            passwordNew: {
                required: true,
                minlength: 8
            },
            passwordNewRepeat: {
                required: true,
                minlength: 8,
                equalTo: "#passwordNew"
            }

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
            passwordNew: {
                required: "This field is required",
                minlength: "Password can't be shorter than 8 characters"
            },
            passwordNew_confirm: {
                required: "This field is required",
                equalTo: "Password not equal"
            }

        },
        submitHandler: function () {
            func();
            form[0].reset();
        }
    });
};

function ajaxSend(form, funcSuccess,funcError ) {
    let data = form.serialize();
    $.ajax({
        url: '/wp-admin/admin-ajax.php',
        data: data,
        method: 'POST',
        success: function (res) {
            console.log('success ajax');
            funcSuccess(res)
        },
        error: function (error) {
            console.log('error ajax');
            funcError(error)
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
    let allTasks = $('.task').length
    let acceptTasks = $('.task.accept').length
    let percent = acceptTasks*100/allTasks
    $('.project__wrap .project__top .project__percent span').text(percent)
    let notesPercent = $('.notes .project__top .project__percent span').text()
    $('.project__wrap .project__progress-bar').css('width', `${percent}%`)
    $('.notes .project__progress-bar').css('width', `${notesPercent}%`)

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

        $('.project__table-task .project__task-time').each(function (){

            $(this).closest('tr').append(`<td></td>`)
            console.log(1111, $(this).closest('tr td:last-child'))
            $(this).closest('tr').find('td:last-child').append($(this))
        })
    }
}

function resetModal(){
    $('.modal__content-clarify').show()
    $('.modal__content-delete').hide()
    $('.modal__content-approve').hide()

    $('form')[0].reset()
    $('.form__file-list > *').remove();
    $('#fileInput').val('');

    let project = $('.project__top .project__top-title').text()
    $('.modal__notes .project__top-title').text(`New Note For "${project}"`)
    $('.modal__notes input').val("")
    $('.modal__notes textarea').val("")
}







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
    let info =  button.find('.project__task ')
    let desc = info.data('desc')
    let managers = info.data('manager').split(',');
    let number1 = info.closest('tr').index() + 1
    let number2 = info.closest('td').index()
    let part1 = info.closest('tr').find('.project__task-step h3').text()
    let part2 = info.find('.project__task-title').text()

    let managerList = '';
    managers.forEach(function(manager){
        managerList += '<span>' + manager.trim() + '</span>';
    });

    $('.project__manager-list').html(managerList);
    $('.project__modal-desc p').text(desc)
    $('.project__modal-title').html(`<span>Stage ${number1}. ${part1}</span>Step ${number2}. ${part2}`)
    addMoreFile()
}

function openPopupFunction(){
    let cloneFileName = button.closest('.notes__file-item').clone()
    $('.modal__delete .notes__file-item').remove()
    $('.modal__delete .modal__btn').before(cloneFileName)
    $('.modal__content-delete .modal__btn').before(cloneFileName)

    if(button.hasClass('task')){
        appendToModalData()
    }
    if(button.hasClass('clarify')){
        appendInfoAboutClarify(button)
    }
    if(button.hasClass('notes__top-edit')){
        editNotes(button)
    }
    if(button.hasClass('notes__top-delete')){
        deleteNotesOrFile(button,'.notes__item', 'delete__notes')
    }
    if(button.hasClass('notes__file-delete')){
        deleteNotesOrFile(button,'.notes__file-item', 'delete__file-note')
    }

}

let page = 1;
function loadMore(action, btn){
    $(document).on('click',btn, function (){
        let btn = $(this)
        let wrap = btn.closest('.tab__content-item')
        let category = wrap.attr('data-category')
        let page = wrap.attr('data-page')
        page++

        wrap.attr('data-page', page)
        let obj = { action, page, category}
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function () {
                console.log('success ajax');
                btn.hide()
                btn.closest('tbody').append(res);
                $('.notification__mob').append(res)
            },
            error: function (error) {
                console.log('error ajax');
            },
            complete: function (){

            }
        });
    })

}




let fileListContainer = $('.form__file-list');

function updateFileListDisplay(fileList) {
    fileListContainer.empty(); // Clear previous list
    $.each(fileList, function(index, file) {
        let fileName = file.name;
        let deleteButton = $('<button type="button" class="notes__file-delete img"><img src="../../img/delete.svg" alt=""></button>');
        deleteButton.data('index', index); // Set index as data attribute
        deleteButton.on('click', function() {
            let indexToRemove = $(this).data('index');
            let updatedFileList = Array.from(fileList);
            updatedFileList.splice(indexToRemove, 1); // Remove the file from the list
            $(this).closest('.form__file-item').remove(); // Remove the file item from display
            event.target.files = new FileList(updatedFileList); // Update the input's file list
        });

        let listItem = $(`<div class="form__file-item"><h3>Uploaded ${fileName}</h3></div>`).append(deleteButton);
        fileListContainer.append(listItem);
    });
}

function showMobTask(table, elem, prev, next){
    $(`${table} ${elem}:first-child`).addClass('active')

    $(prev).addClass('disabled')
    function disabledBtn(){
        if(!$(`${table} ${elem}:first-child`).hasClass('active')){
            $(prev).removeClass('disabled')
        }else {
            $(prev).addClass('disabled')
        }
        if(!$(`${table} ${elem}:last-child`).hasClass('active')){
            $(next).removeClass('disabled')
        } else {
            $(next).addClass('disabled')
        }
    }
    $(document).on('click', next, function (){
        let active = $(`${table} ${elem}.active`)
        let next = active.next(`${table} ${elem}`)
        active.removeClass('active')
        next.addClass('active')
        disabledBtn()
    })
    $(document).on('click', prev, function (){
        let active = $(`${table} ${elem}.active`)
        let prev = active.prev(`${table} ${elem}`)
        active.removeClass('active')
        prev.addClass('active')
        disabledBtn()
    })
}


function submitFormData(form){
    $(document).on('submit', form, function (e){
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
                console.log('success ajax2222');
                $('.modal').hide()
                $('.form__file-list > *').remove();
                $('#fileInput').val('');
                $(form)[0].reset()
            },
            error: function (error) {
                console.log('error ajax222');
                $('.modal').hide()
                $('.form__file-list > *').remove();
                $('#fileInput').val('');
                $(form)[0].reset()
            },
            complete: function (){

            }
        });
    })
}

function search(){
    let data = $('.project__search').serialize();
    let searchText = $('.project__search-input input').val();
    if (searchText.length < 1){
        $('.project__search-result').hide()
    } else{
        $('.project__search-result').show(300)
    }
    $.ajax({
        url: '/wp-admin/admin-ajax.php',
        data: data,
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

function deleteNotesOrFile(btn, item, action ){
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
                    console.log('success ajax444');
                    note.remove();
                    $('body').css('overflow', 'visible');
                    $('.modal').hide();
                },

                error: function (error) {
                    console.log('error ajax444');
                    note.remove();
                    $('body').css('overflow', 'visible');
                    $('.modal').hide();
                },
                complete: function (){
                }
            });
        })
}



function addMoreFile(){
    $(document).on('click','.project__clarify-more',function (){
        $('.modal__task-clarify').hide()
        $('.modal__task').show()
    })
}

function deleteFileFromModal(btn, content) {
    $(document).on('click', btn, function () {
        $(this).closest('.modal__content').hide();
        content.show();
        let item = $(this).closest('.project__clarify-flex')
        let id = item.data('id')
        let obj = {action:'delete__file-clarify', item_id:id}
        $(document).off('click','.modal__btn-delete');
        $(document).on('click','.modal__btn-delete', function (){
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: obj,
                method: 'POST',
                success: function () {
                    console.log('success ajax1111');
                    if(window.innerWidth <=666){
                        $(item).closest('tbody.active').remove();
                        $('.clarify__mob-wrap tbody:first-child').addClass('active')
                    }
                    $(item).closest('tr').remove();
                    $('.modal__content-delete').hide();
                    $('.modal__content-clarify').show();
                },
                error: function (error) {
                    console.log('error ajax111');
                    if(window.innerWidth <=666){
                        $(item).closest('tbody.active').remove();
                        $('.clarify__mob-wrap tbody:first-child').addClass('active')
                        $('.clarify__mob-prev').addClass('disabled')
                    }
                    $(item).closest('tr').remove();
                    $('.modal__content-delete').hide();
                    $('.modal__content-clarify').show();
                },
                complete: function (){
                }
            });
        })
    });
}


function approveFile(btn, content) {
    $(document).on('click', btn, function () {
        let currentButton = $(this)
        currentButton.closest('.modal__content').hide();
        content.show();
        let item
        if(window.innerWidth > 666){
            item = currentButton.closest('tr')
        }else{
            item = currentButton.closest('tbody')
        }
        let id = item.data('id')
        let choice = currentButton.text()
        $('.modal__manager .modal__title span').text(choice)
        let obj = {action:'aprove-reject-file', item_id:id, choice}

        $(document).off('click','.modal__btn-approve');
        $(document).on('click','.modal__btn-approve', function (){
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: obj,
                method: 'POST',
                success: function () {
                    console.log('success ajax-approve');
                    $('.modal__content-approve').hide();
                    $('.modal__content-clarify').show();
                    currentButton.addClass('active')
                    currentButton.nextAll().remove()
                    currentButton.prevAll().remove()
                },
                error: function (error) {
                    console.log('error ajax-approve');
                    $('.modal__content-approve').hide();
                    $('.modal__content-clarify').show();
                    currentButton.addClass('active')
                    currentButton.nextAll().remove()
                    currentButton.prevAll().remove()
                },
                complete: function (){
                }
            });
        })
    });
}



function deleteJustUploadFile(){


    $(document).on('click','.form__file .notes__file-delete', function (){
        $(this).closest('.form__file-item').remove()

    })
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


function editNotes(btn){
   let title = btn.closest('.notes__top').find('.notes__title').text()
   let desc = btn.closest('.notes__item').find('.notes__desc').text().trim()
   let noteId = btn.closest('.notes__item').attr('data-id')
   $('.modal__notes input[name="title"]').val(title)
   $('.modal__notes input[name="notes__id"]').val(noteId)
   $('.modal__notes textarea[name="text"]').val(desc)
   $('.modal__notes .project__top-title').text(`Edit ${title}`)
}


// function uploadFileTest(){
//
//     let input = $('#file-input');
//     let container = $('#file-container');
//     input.on('change', async function(evt) {
//         let files = $(this).prop('files');
//         for (let file of files) {
//             let elem = $('<div class="file-info"><p>' + file.name + '</p><progress class="progress-bar" max="100" value="0"></progress></div>').appendTo(container);
//             //добавляем инфу о файле в свойство превью
//             elem.get(0).file = file;
//         }
//         evt.preventDefault();
//         //пускаем закачку каждого файла параллельно с помощью Promise.all и дожидаемся закачки всех файлов с помощью await.
//         await Promise.all($('.file-info').map(upload));
//         console.log('готово');
//     });
//
//     async function upload(index, elem) {
//         let data = new FormData();
//         data.append('file', elem.file);
//         let progress = $(elem).find('.progress-bar');
//         //ждем ответа об успешной обработке файла на стороне сервера
//         const res = await $.ajax({
//             url: '/',
//             contentType: false,
//             processData: false,
//             data: data,
//             type: 'post',
//             xhr: function() {
//                 let xhr = new XMLHttpRequest();
//                 xhr.upload.onprogress = function(evt) {
//                     let percent = Math.ceil(evt.loaded / evt.total * 100);
//                     progress.attr('value', percent);
//                 }
//                 return xhr;
//             }
//         });
//     }
// }



function appendInfoAboutClarify(button){
        let task_id = button.attr('data-taskId')
        let role = $('.project__wrap').attr('data-role')
        let obj= {action:'append-clarify-info', task_id, role}
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function (res) {
                console.log('success ajax-append');
                $('.project__table-clarify').replaceWith(res);
            },
            error: function (error) {
                console.log('error ajax-append');
                $('.project__table-clarify').replaceWith(res);
            },
            complete: function (){
            }
        });
}


function uploadAndDeleteFiles(){
    let uploadedFiles = [];
    // <div className="form__file-item"><h3>Uploaded ${fileName}</h3><button type="button" className="notes__file-delete img"><img src="../../img/delete.svg" alt=""></button>

    $('#fileInput').on('change', function() {
        let files = $(this)[0].files;
        for (var i = 0; i < files.length; i++) {
            uploadFile(files[i]);
        }
    });

    $(document).on('click', '.deleteFile', function() {
        let index = $(this).data('index');
        uploadedFiles.splice(index, 1);
        updateFileList();
    });

    function uploadFile(file) {
        let progress = 0;
        let progressBar = $('<div class="progressBar"></div>');
        let listItem = $('<li class="form__file-item"> <h3>' + file.name + '</h3></li>').append(progressBar);
        $('#fileList').append(listItem);

        let uploadInterval = setInterval(function() {
            progress += Math.random() * 10;
            if (progress >= 100) {
                clearInterval(uploadInterval);
                progressBar.css('display', 'none');
                listItem.append('<button class="deleteFile notes__file-delete img" data-index="' + (uploadedFiles.length) + '"><img src="../img/delete.svg" alt=""></button>');
                uploadedFiles.push(file);
            } else {
                progressBar.css('width', progress + '%');
            }
        }, 20);
    }
    function updateFileList() {
        $('#fileList').empty();
        console.log(uploadedFiles);
        for (let i = 0; i < uploadedFiles.length; i++) {
            let fileName = uploadedFiles[i].name;
            $('#fileList').append('<li class="form__file-item"> <h3>' + fileName + '</h3><button class="deleteFile notes__file-delete img" data-index="' + i + '">  <img src="../img/delete.svg" alt=""></button></li>');
        }
    }
}


function loginPopupChange(){
    $(document).on('click','.login__forget', function (){
        $(this).closest('.login__form').removeClass('active');
        $('.login__form-forget').addClass('active')
    })
    $(document).on('click','.login__remember', function (){
        $(this).closest('.login__form').removeClass('active');
        $('.login__signin').addClass('active')
    })
    if(window.location.href.includes('set_new_password')){
        $('.login__form').removeClass('active')
        $('.login__form-recovery').addClass('active')
    } else{
        $('.login__signin').addClass('active')
    }
}
$(document).ready(function(){
    loginPopupChange()
    deleteJustUploadFile()
    let loginForm = $('.login__signin');
    validateForm(loginForm, function () {
        ajaxSend(loginForm, '/wp-admin/admin-ajax.php')
    });

    let loginForget = $('.login__form-forget');
    validateForm(loginForget, function () {
        ajaxSend(loginForget, '/wp-admin/admin-ajax.php', function (){
            $('.login__form-forget').removeClass('active');
            $('.login__form-success').addClass('active')
        }, function (){
            $('.login__form-forget').removeClass('active');
            $('.login__form-success').addClass('active')
        })
    });

    let passwordReset = $('.login__form-recovery');
    validateForm(passwordReset, function () {
        ajaxSend(passwordReset, '/wp-admin/admin-ajax.php')
    });


    progressBar();
    addPercentStyle();
    changeMob()
    toogleModal($('.notes__button'), $('.modal__notes'));
    toogleModal($('.notes__top-edit'), $('.modal__notes'));

    if( $('.project__wrap').attr('data-role') == 'manager'){
        toogleModal($('.project__table-task .clarify'), $('.modal__manager'));
    } else{
        toogleModal($('.project__table-task .clarify'), $('.modal__task-clarify'));
        toogleModal($('.project__table-task .reject'), $('.modal__task'));
    }

    toogleModal($('.notes__file-delete'), $('.modal__delete'));
    toogleModal($('.notes__top-delete'), $('.modal__delete'));


    $('.file-input').on('change', function(event) {
        let fileList = event.target.files;
        updateFileListDisplay(fileList);
    });

    submitFormData('.form__notes');
    submitFormData('.form__task');
    tab();
    $('.header__burger').on('click', openMenu);
    deleteFileFromModal('.project__clarify-delete', $('.modal__content-delete'));
    approveFile('.project__approve-manager > *', $('.modal__content-approve'));
    showSearch();
    loadMore('more_project', '.project__wrap .load__more')
    loadMore('more_notification', '.notification__wrap .load__more')
    showMobTask('.project__table-task', 'tr' ,'.project__task-prev', '.project__task-next')
    showMobTask('.clarify__mob-wrap', 'tbody' , '.clarify__mob-prev', '.clarify__mob-next')
    uploadAndDeleteFiles()
});

$(window).load(function(){

});

$(window).resize(function(){

});
$(window).scroll(function () {
});
