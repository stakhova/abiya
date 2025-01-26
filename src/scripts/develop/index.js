let url = window.location.origin + '/wp-content/themes/Abiya/img/';
let button;

const validateForm = (form, func, noreset) => {
    form.on("submit", function (e) {
        e.preventDefault();

        console.log(1212121, form.has('.modal__calendar'));
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
                required: true
                // goodMessage: true,
            },
            email: {
                required: true,
                goodEmail: true,
                email: true
            },
            category: {
                required: true
            },
            name: {
                required: true
            },
            phone: {
                required: true
            },
            location_name: {
                required: true
            },
            location: {
                required: true
            },
            link: {
                required: true
            },
            date: {
                required: true
            },
            note: {
                required: true
            },
            password: {
                required: true
            },
            passwordNew: {
                required: true,
                minlength: 8
            },
            passwordNewRepeat: {
                required: true,
                minlength: 8,
                equalTo: "#passwordNew"
            },
            terms: {
                required: true
            },
            percentage: {
                required: true
            },
            amount: {
                required: true
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
            passwordNew: {
                required: "This field is required",
                minlength: "Password can't be shorter than 8 characters"
            },
            passwordNew_confirm: {
                required: "This field is required",
                equalTo: "Password not equal"
            },
            location_name: {
                required: "This field is required"
            },
            location: {
                required: "This field is required"
            },
            link: {
                required: "This field is required"
            },
            category: {
                required: "This field is required"
            },
            name: {
                required: "This field is required"
            },
            phone: {
                required: "This field is required"
            },
            date: {
                required: "This field is required"
            },
            note: {
                required: "This field is required"
            },
            terms: {
                required: "This field is required"
            },
            percentage: {
                required: "This field is required"
            },
            amount: {
                required: "This field is required"
            },

        },
        submitHandler: function () {


            form.find('input.coma').each(function () {
                let input = $(this);
                let cleanValue = input.val().replace(/,/g, ""); // Remove commas
                input.val(cleanValue);
            });

            if (form.hasClass('.modal__calendar')) {
                let startDate = new Date($('.calendar__start .date').text().split('/').reverse().join('/'));
                let endDate = new Date($('.calendar__end .date').text().split('/').reverse().join('/'));
                let inputDate = new Date($('#date_add').val().split('/').reverse().join('/'));
                if (inputDate < startDate || inputDate > endDate) {
                    $('#date_add').after(`<p class="error">The date must be within the range of ${formatDate(startDate)} and ${formatDate(endDate)}</p>`);
                    return false;
                } else {
                    $('p.error').remove();
                    func();
                }
            } else {
                func();
            }
            noreset ? null : form[0].reset();
            // form.find('select').val(null).trigger('change');
        }
    });
    form.find('select').on('change', function () {
        $(this).valid(); // Trigger validation for the select element
    });
};
function formatDate(date) {
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    return day + '/' + month + '/' + year;
}
function ajaxSend(form, funcSuccess, funcError) {
    let data = form.serialize();
    $.ajax({
        url: '/wp-admin/admin-ajax.php',
        data: data,
        method: 'POST',
        success: function (res) {
            console.log('success ajax');
            funcSuccess(res);
        },
        error: function (error) {
            console.log('error ajax');
            funcError(error);
        },
        complete: function () {}
    });
}

function tab() {
    $(".tab__header-item").click(function () {
        $(".tab__header-item").removeClass("active").eq($(this).index()).addClass("active");
        $(".tab__content-item").hide().eq($(this).index()).fadeIn();
    }).eq(0).addClass("active");
}




function progressBar() {
    let allTasks = $('.task').length;
    let acceptTasks = $('.task.accept').length;
    let percent = (acceptTasks * 100 / allTasks).toFixed(2);
    $('.project__wrap .project__top .project__percent span').text(percent);
    let notesPercent = $('.notes .project__top .project__percent span').text();
    $('.project__wrap .project__progress-bar').css('width', `${percent}%`);
    $('.notes .project__progress-bar').css('width', `${notesPercent}%`);
}

function addPercentStyle() {
    $('.project__percent span').each(function () {
        let result = $(this).text();
        let wrap = $(this).closest('.project__percent');
        if (result == '0') {
            wrap.addClass('zero');
        }
        if (result == '100') {
            wrap.addClass('full');
        }
    });
}

function changeMob() {
    if (window.innerWidth <= 666) {
        let progress = $('.project__progress');
        let wrap = $('.project__top');
        wrap.find('.project__top-block:first-child').after(progress);
        $('.project__table td').each(function () {
            if ($(this).find('*').length == 0) {
                $(this).closest('td').remove();
            }
        });

        $('.project__table-task .project__task-time').each(function () {

            $(this).closest('tr').append(`<td></td>`);
            $(this).closest('tr').find('td:last-child').append($(this));
        });
    }
}

function resetModal() {
    $('.modal__content-clarify').show();
    $('.modal__content-delete').hide();
    $('.modal__content-approve').hide();

    $('.form__file-list > *').remove();
    $('.file__input').val('');
    $('.form__file-upload').removeClass('disabled');

    $('.form__check > *').remove();

    let project = $('.project__top .project__top-title').text();
    $('.modal__notes .project__top-title').text(`New Note For "${project}"`);
    $(".form__input input:not(.modal__datepicker)").val("");
    $('.form__input textarea').val("");

    $('.location__more-block').hide();
    $('.location__more').show();
}

function toogleModal(btn, modal) {
    btn.click(function () {
        button = $(this);
        openPopupFunction();
        modal.show();
        $('body').addClass('hidden');
        return false;
    });
    $('.modal__close').click(function () {
        $(this).closest(modal).hide();
        $('body').removeClass('hidden');
        resetModal();
        return false;
    });
    $('.modal__btn-close').click(function () {
        $(this).closest(modal).hide();
        $('body').removeClass('hidden');
        resetModal();
        return false;
    });
    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            e.stopPropagation();
            resetModal();
            $('body').removeClass('hidden');
        }
    });
    modal.click(function (e) {
        if ($(e.target).closest('.modal__content').length == 0) {
            $(this).hide();
            resetModal();
            $('body').removeClass('hidden');
        }
    });
}
function checkbox(subtasks) {
    let checkWrap = $('.form__check');
    subtasks.forEach(function (subtask, index) {
        let itemHtml = `
                    <div class="form__check-item">
                        <input type="checkbox" id="check${index + 1}">
                        <label for="check${index + 1}">${subtask.trim()}</label>
                    </div>
                `;
        checkWrap.append(itemHtml);
    });
    $('.form__check').append(`<p class="form__file-hint" >Selection is required</p>`);

    $('.form__file-upload').addClass('disabled');
    $('.form__check input[type="checkbox"]').on('change', function () {
        let allChecked = true;

        $('.form__check input[type="checkbox"]').each(function () {
            if (!$(this).is(':checked')) {
                allChecked = false;
                return false;
            }
        });

        if (allChecked) {
            $('.form__file-upload').removeClass('disabled');
            $('.form__check .form__file-hint').remove();
        } else {
            $('.form__check').append(`<p class="form__file-hint" > Selection is required</p>`);
            $('.form__file-upload').addClass('disabled');
        }
    });
}
function appendToModalData() {
    let info = button.find('.project__task ');
    let task_id = button.attr('data-taskId');
    $('input[name="task_id"]').val(task_id);

    let desc = info.data('desc');
    let img = info.data('img');
    let template = info.data('template_link');
    let instruction = info.data('instruction');
    let subtasks = info.data('subtasks');

    if (subtasks) {
        checkbox(subtasks);
    }

    let managers = info.data('manager').split(',');
    let number1 = info.closest('tr').index() + 1;
    let number2 = info.closest('td').index();
    let part1 = info.closest('tr').find('.project__task-step h3').text();
    let part2 = info.find('.project__task-title').text();

    let managerList = '';
    managers.forEach(function (manager) {
        managerList += '<span>' + manager.trim() + '</span>';
    });

    $('.project__manager-list').html(managerList);

    if (template !== '') {

        $('.modal .project__top-template').attr('href', template).addClass('show');
    }

    if (instruction !== '') {
        $('.modal .project__top-info').attr('data-url', instruction).addClass('show');;
    } else {
        $('.modal .project__top-info').attr('data-url', '').removeClass('show');
    }

    $('.modal .project__top-icon img').attr('src', img);
    $('.project__modal-desc p').text(desc);
    $('.project__modal-title').html(`<span>Stage ${number1}. ${part1}</span>Step ${number2}. ${part2}`);
    addMoreFile();
}

function showInstruction() {
    $(document).on('click', '.project__top-info', function () {
        let url = $(this).attr('data-url');
        $('.modal__video source').attr('src', url);
        $('.modal__video video')[0].load();

        let modal = $('.modal__instruction');
        modal.show();

        $('.modal__close').click(function () {
            $(this).closest(modal).hide();
            $('video').trigger('pause');
        });
        $(document).keydown(function (e) {
            if (e.keyCode === 27) {
                $('video').trigger('pause');
                e.stopPropagation();
            }
        });
        modal.click(function (e) {
            if ($(e.target).closest('.modal__content').length == 0) {
                $('video').trigger('pause');
                $(this).hide();
            }
        });
    });
}

function openPopupFunction() {

    let cloneFileName = button.closest('.notes__file-item').clone();
    $('.modal__delete .notes__file-item').remove();
    $('.modal__delete .modal__btn').before(cloneFileName);
    $('.modal__content-delete .modal__btn').before(cloneFileName);

    if (button.hasClass('task')) {
        appendToModalData();
    }
    if (button.hasClass('clarify') || button.hasClass('accept') || button.hasClass('first')) {
        appendInfoAboutClarify(button);
    }
    if (button.hasClass('notes__top-edit')) {
        editNotes(button);
    }
    if (button.hasClass('notes__top-delete')) {
        deleteNotesOrFile(button, '.notes__item', 'delete__notes');
    }
    if (button.hasClass('notes__file-delete')) {
        deleteNotesOrFile(button, '.notes__file-item', 'delete__file-note');
    }
    if (button.hasClass('notes__button')) {
        $('.modal__notes input[name=note_id]').val('');
        $('.project__top-title').text('Add new note');
        $('.form__input input').val("");
        $('.form__input textarea').val("");
    }
}

let page = 1;
function loadMore(action, btn) {
    $(document).on('click', btn, function () {
        let btn = $(this);
        let wrap = btn.closest('.tab__content-item');
        let category = wrap.attr('data-category');
        let page = wrap.attr('data-page');
        page++;

        let mob;
        window.innerWidth > 666 ? mob = 0 : mob = 1;

        wrap.attr('data-page', page);
        let obj = { action, page, category, mob };
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function (res) {
                btn.closest('tbody').append(res);
                btn.closest('.project__load').remove();
                wrap.find('.notification__mob').append(res);
            },
            error: function (error) {
                console.log('error ajax');
            },
            complete: function () {}
        });
    });
}

let fileListContainer = $('.form__file-list');

function updateFileListDisplay(fileList) {
    fileListContainer.empty();
    $.each(fileList, function (index, file) {
        let fileName = file.name;
        let deleteButton = $(`<button type="button" class="notes__file-delete img"><img src="${url}delete.svg" alt=""></button>`);
        deleteButton.data('index', index);
        deleteButton.on('click', function () {
            let indexToRemove = $(this).data('index');
            let updatedFileList = Array.from(fileList);
            updatedFileList.splice(indexToRemove, 1);
            $(this).closest('.form__file-item').remove();
            event.target.files = new FileList(updatedFileList);
        });

        let listItem = $(`<div class="form__file-item"><h3>Uploaded ${fileName}</h3></div>`).append(deleteButton);
        fileListContainer.append(listItem);

        console.log(1234, fileListContainer)
    });
}

function showMobTask(table, elem, prev, next) {

    $(table).each(function () {
        const $table = $(this); // Current table instance

        $table.find(`${elem}:first-of-type`).addClass('active');
        $table.find(prev).addClass('disabled');

        function disabledBtn() {
            if (!$table.find(`${elem}:first-of-type`).hasClass('active')) {
                $table.find(prev).removeClass('disabled');
            } else {
                $table.find(prev).addClass('disabled');
            }
            if (!$table.find(`${elem}:last-of-type`).hasClass('active')) {
                $table.find(next).removeClass('disabled');
            } else {
                $table.find(next).addClass('disabled');
            }
        }

        $table.on('click', next, function () {
            let active = $table.find(`${elem}.active`);
            let nextElem = active.next(`${elem}`);
            if (nextElem.length) {
                active.removeClass('active');
                nextElem.addClass('active');
                disabledBtn();
            }
        });

        $table.on('click', prev, function () {
            let active = $table.find(`${elem}.active`);
            let prevElem = active.prev(`${elem}`);
            if (prevElem.length) {
                active.removeClass('active');
                prevElem.addClass('active');
                disabledBtn();
            }
        });


        if ($table.find("table:not('.total__mob-wrap') tbody").length <= 1) {

            $table.find('.clarify__mob-nav').hide();
        }
    });
}




function submitFormDataProject(form) {
    $(document).on('submit', form, function (e) {
        e.preventDefault();

        let taskId = $(this).find('input[name=task_id]').val();
        let currentTask;

        $('.task').each(function () {
            if ($(this).attr('data-taskId') == taskId) {
                currentTask = $(this);
            }
        });

        let fileProject = $(this).closest('.modal').find('input[type="file"]');


        fileProject.each(function(){
            console.log('namenamename', $(this).attr('name'))
        })

        let messageProject = $(this).closest('.modal').find('input[name="notes"]');
        let required = false;


        let isManagersTracker = $(this).closest('.modal').hasClass('modal__managers-tracker');

        if (!messageProject.val()) {
            messageProject.closest('.form__input').find('.form__file-hint').remove(); // Avoid duplicate hints
            messageProject.closest('.form__input').append(`<p class="form__file-hint">Notes is required</p>`);
        } else {
            messageProject.closest('.form__input').find('.form__file-hint').remove();
            required = true;
        }

        if (!isManagersTracker) {
            if (fileProject.length > 0 && fileProject.val() === "") {
                fileProject.closest('.form__file-upload').find('.form__file-hint').remove(); // Avoid duplicate hints
                fileProject.closest('.form__file-upload').append(`<p class="form__file-hint">File is required</p>`);
                required = false;
            } else {
                fileProject.closest('.form__file-upload').find('.form__file-hint').remove();
                required = true;
            }
        } else {
            required = true;
        }

        console.log("Validation Results:", fileProject.val(), required);

        if (required) {

            $(this).find('input.coma').each(function () {
                let input = $(this);
                let cleanValue = input.val().replace(/,/g, ""); // Remove commas
                input.val(cleanValue);
            });


            let formData = new FormData($(this)[0]);

            formData.forEach(function (value, key) {
                if (uploadedFilesMap[key]) {
                    formData.delete(key);
                }
            });


            Object.keys(uploadedFilesMap).forEach(function (inputName) {
                uploadedFilesMap[inputName].forEach(function (file) {
                    console.log(888, inputName)
                    formData.append(inputName + '[]', file); // Використовуємо ім'я інпуту як ключ
                });
            });



            // previous upload file
            // let formData = new FormData($(this)[0]);
            //
            // // Remove default files and add uploaded files
            // formData.forEach(function (value, key) {
            //
            //
            //     if (key === 'file[]') {
            //         formData.delete(key);
            //     }
            // });
            // uploadedFiles.forEach(function (file) {
            //     formData.append('file[]', file);
            // });

            $('.preloader__wrap').show();

            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: formData,
                method: 'POST',
                contentType: false,
                processData: false,
                cache: false,
                success: function (res) {
                    if (res.data) {
                        let newStatus = res.data.status;
                        currentTask.attr('class', 'task').addClass(newStatus);
                    }

                    if ($('.manager__wrap').length > 0) {
                        $(form).closest('.modal__more-task').find('.append__form').append($(form));
                        $(form).hide();
                        $(form).closest('.modal').find('.project__table > *').remove();
                        $(form).closest('.modal').find('.project__table').append(res);
                        showMobTask('.clarify__mob-wrap', 'tbody', '.clarify__mob-prev', '.clarify__mob-next');
                        $('.location__more-block').hide();
                        $('.location__more').show();
                        sortTask();
                    } else {
                        $('.modal').hide();
                    }

                    resetForm();
                },
                error: function () {
                    console.error('Error during AJAX submission');
                }
            });
        }
    });

    // Handle file input change
    $(document).on('change', '.modal__task input[type=file]', function () {
        $('.form__file-hint').remove();
    });
}



function tab() {
    $(".tab__header-item").click(function () {
        $(".tab__header-item").removeClass("active").eq($(this).index()).addClass("active");
        $(".tab__content-item").hide().eq($(this).index()).fadeIn();

    }).eq(0).addClass("active");
}

function resetForm() {
    $('body').removeClass('hidden');
    $('.form__file-list > *').remove();
    $('.file__input').val('');
    $('.form__input input').val("");
    $('.form__input textarea').val("");

    Object.keys(uploadedFilesMap).forEach(function (key) {
        uploadedFilesMap[key] = []; // Очищаємо масив для кожного ключа
    });
    // uploadedFiles = [];
    $('.form__check > *').remove();
    $('.preloader__wrap').hide();
}


function submitFormDataNotes(form) {

    $(document).on('submit', form, function (e) {
        e.preventDefault();
        let title = $(this).find('input[name="title"]');
        let text = $(this).find('textarea[name="text"]');

        $(document).on('input', '.modal__notes input[name="title"], .modal__notes textarea[name="text"]', function () {
            if ($(this).val() !== "") {
                $(this).closest('.form__input').find('.form__file-hint').remove();
            } else {
                $(this).closest('.form__input').append(`<p class="form__file-hint" >Title is required</p>`);
            }
        });

        if (title.val() == "") {
            title.closest('.form__input').append(`<p class="form__file-hint" >Title is required</p>`);
        }
        if (text.val() == "") {
            text.closest('.form__input').append(`<p class="form__file-hint" >Text is required</p>`);
        }

        if (title.val() !== "" && text.val() !== "") {
            let nodeId = $(form).find($('input[name="note_id"]')).val();





            let formData = new FormData($(this)[0]);



            formData.forEach(function (value, key) {
                if (uploadedFilesMap[key]) {
                    formData.delete(key);
                }
            });


            Object.keys(uploadedFilesMap).forEach(function (inputName) {
                uploadedFilesMap[inputName].forEach(function (file) {
                    console.log(888, inputName)
                    formData.append(inputName + '[]', file); // Використовуємо ім'я інпуту як ключ
                });
            });


            //previous
            // let formData = new FormData($(this)[0]);
            // formData.forEach(function (value, key) {
            //     if (key === 'file[]') {
            //         formData.delete(key);
            //     }
            // });
            // uploadedFiles.forEach(function (file, index) {
            //     formData.append('file[]', file);
            // });
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: formData,
                method: 'POST',
                contentType: false,
                processData: false,
                cache: false,
                success: function (res) {

                    $('.modal').hide();
                    $('body').removeClass('hidden');
                    $('.form__file-list > *').remove();
                    $('.file__input').val('');

                    Object.keys(uploadedFilesMap).forEach(function (key) {
                        uploadedFilesMap[key] = []; // Очищаємо масив для кожного ключа
                    });
                    // uploadedFiles = [];




                    // $(form)[0].reset();

                    // if($('.notes').length > 0){
                    $('.form__input input').val("");
                    $('.form__input textarea').val("");

                    if (nodeId == '') {

                        $('.notes__block').prepend(res);
                    } else {
                        $('.notes__item').each(function () {
                            if ($(this).attr('data-id') == nodeId) {
                                $(this).replaceWith(res);
                            }
                        });
                    }
                    openPopupFunction();
                    toogleModal($('.notes__top-edit'), $('.modal__notes'));
                    toogleModal($('.notes__top-delete'), $('.modal__delete'));
                    // }
                },
                error: function (error) {
                    console.log('error ajax222');
                }
            });
        }
    });
}

function search() {
    let data = $('.project__search').serialize();
    let searchText = $('.project__search-input input').val();
    if (searchText.length < 1) {
        $('.project__search-result').hide();
    } else {
        $('.project__search-result').show();
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
        complete: function () {}
    });
}

function showLogOut() {
    $(document).on('click', '.header__user-img', function () {
        $('.header__user-wrap').toggleClass('show');
    });
}
function showSearch() {
    $(document).on('keydown', '.project__search-input input', function () {
        clearTimeout($(this).data('timer'));
        let timer = setTimeout(function () {
            search();
        }, 500);
        $(this).data('timer', timer);
    });

    $(document).on('submit', '.project__search', function (e) {
        e.preventDefault();
        search();
    });
    $(document).on('input', '.project__search-input input', function () {
        if ($(this).is(":focus")) {
            $('.project__search').addClass('focused');
        } else {
            $('.project__search').removeClass('focused');
        }
    });
}

const openMenu = () => {
    $('.header__burger').toggleClass("header__burger-open");
    $('.header__menu').toggleClass('header__menu-show');
    $('body').toggleClass('hidden');
};

function deleteNotesOrFile(btn, item, action) {
    let note = btn.closest(item);
    let id = note.data('id');
    let note_id = btn.closest('.notes__item').data('id');
    let obj = { action: action, item_id: id, note_id };
    $(document).off('click', '.modal__btn-delete');
    $(document).on('click', '.modal__btn-delete', function () {
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function () {
                console.log('success ajax444');
                note.remove();
                $('body').removeClass('hidden');
                $('.modal').hide();
            },

            error: function (error) {
                console.log('error ajax444');
                note.remove();
                $('body').removeClass('hidden');
                $('.modal').hide();
            },
            complete: function () {}
        });
    });
}

function addMoreFile() {
    $(document).on('click', '.project__clarify-more', function () {
        $('.modal__task-clarify').hide();
        $('.modal__task').show();
    });
}

function deleteFileFromModal(btn, content) {
    $(document).on('click', btn, function () {

        console.log(1111111156, $(this))
        $(this).closest('.modal__content').hide();
        content.show();
        let item = $(this).closest('.project__clarify-flex');
        let id = item.data('id');
        let task_id = $('.modal__task-clarify input[name=task_id]').val();
        let action = 'delete__file-clarify'

        let site = $(this).closest('.project__wrap').hasClass('site')
        if(site){
            openModal($('.modal__delete'))
            task_id = item.data('project-id')
            action ="delete__drawings"
        }

        console.log(121212, id, task_id)


        let obj = { action , item_id: id, project_id:task_id };





        $(document).off('click', '.modal__btn-delete');
        $(document).on('click', '.modal__btn-delete', function () {
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: obj,
                method: 'POST',
                success: function () {
                    console.log('success ajax1111');

                    if(site){
                        item.remove()
                        $('.modal__delete').hide();
                    }else{
                        if (window.innerWidth <= 666) {
                            $(item).closest('tbody.active').remove();
                            $('.clarify__mob-wrap tbody:first-child').addClass('active');
                        }
                        $(item).closest('tr').remove();
                        $('.modal__content-delete').hide();
                        $('.modal__content-clarify').show();
                    }


                },
                error: function (error) {
                    console.log('error ajax111');
                    if(site){
                        item.remove()
                        $('.modal__delete').hide();
                    }else{
                        if (window.innerWidth <= 666) {
                            $(item).closest('tbody.active').remove();
                            $('.clarify__mob-wrap tbody:first-child').addClass('active');
                        }
                        $(item).closest('tr').remove();
                        $('.modal__content-delete').hide();
                        $('.modal__content-clarify').show();
                    }
                },
            });
        });
    });
}

function approveFile(btn, content) {
    $(document).on('click', btn, function () {
        let currentButton = $(this);
        currentButton.closest('.modal__content').hide();
        content.show();
        let item;
        if (window.innerWidth > 666) {
            item = currentButton.closest('tr');
        } else {
            item = currentButton.closest('tbody');
        }
        let id = item.data('id');
        let choice = currentButton.text();
        $('.modal__manager .modal__title span').text(choice);
        let task_id = $(this).closest('.modal').find('input[name="task_id"]').val();
        let obj = { action: 'aprove-reject-file', item_id: id, task_id, choice };

        $(document).off('click', '.modal__btn-approve');
        $(document).on('click', '.modal__btn-approve', function () {
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: obj,
                method: 'POST',
                success: function () {
                    console.log('success ajax-approve');
                    $('.modal__content-approve').hide();
                    $('.modal__content-clarify').show();
                    currentButton.addClass('active');
                    currentButton.nextAll().remove();
                    currentButton.prevAll().remove();
                },
                error: function (error) {
                    console.log('error ajax-approve');
                    $('.modal__content-approve').hide();
                    $('.modal__content-clarify').show();
                    currentButton.addClass('active');
                    currentButton.nextAll().remove();
                    currentButton.prevAll().remove();
                }
            });
        });
    });
}

function deleteJustUploadFile() {

    $(document).on('click', '.form__file .notes__file-delete', function () {
        $(this).closest('.form__file-item').remove();


    });
}

function editNotes(btn) {
    let title = btn.closest('.notes__top').find('.notes__title').text();
    let desc = btn.closest('.notes__item').find('.notes__desc').text().trim();
    let noteId = btn.closest('.notes__item').attr('data-id');
    $('.modal__notes input[name="title"]').val(title);
    $('.modal__notes input[name="note_id"]').val(noteId);
    $('.modal__notes textarea[name="text"]').val(desc);
    $('.modal__notes .project__top-title').text(`Edit ${title}`);
}



function appendInfoAboutClarify(button) {
    let task_id = button.attr('data-taskId');
    let role = $('.project__wrap').attr('data-role');
    $('input[name="task_id"]').val(task_id);

    if (button.hasClass('accept')) {
        $('.project__clarify-more').hide();
    } else {
        $('.project__clarify-more').show();
    }

    let obj = { action: 'append-clarify-info', task_id, role };
    $.ajax({
        url: '/wp-admin/admin-ajax.php',
        data: obj,
        method: 'POST',
        success: function (res) {
            console.log('success ajax-append');
            $('.project__table-clarify').replaceWith(res);

            if ($('.clarify__mob-wrap tbody').length / 2 == 1) {

                $('.clarify__mob-next').addClass('disabled');
            }
        },
        error: function (error) {
            console.log('error ajax-append');
            $('.project__table-clarify').replaceWith(res);
        }
    });
}


const fileInputs = {};

$('input[type="file"]').each(function () {
    const inputName = $(this).attr('name');
    if (inputName) {
        fileInputs[inputName] = []; // Створюємо порожній масив з назвою атрибуту "name"
    }
});

console.log(123123, fileInputs);



const uploadedFilesMap = {};
function uploadAndDeleteFiles() {
    $('.file__input').on('change', function () {
        const inputName = $(this).attr('name');
        if (!inputName) return;

        if (!uploadedFilesMap[inputName]) {
            uploadedFilesMap[inputName] = [];
        }

        let files = $(this)[0].files;
        let list = $(this).closest('.form__file').find('.file__list');

        for (let i = 0; i < files.length; i++) {
            uploadFile(files[i], inputName, list);
        }
    });

    $(document).on('click', '.deleteFile', function () {
        const inputName = $(this).data('name');
        const index = $(this).data('index');
        if (uploadedFilesMap[inputName]) {
            uploadedFilesMap[inputName].splice(index, 1);
            updateFileList(inputName);
        }
    });

    function uploadFile(file, inputName, list) {
        let progress = 0;
        let progressBar = $('<div class="progressBar"></div>');
        let listItem = $(`<li class="form__file-item"><h3>${file.name}</h3></li>`).append(progressBar);
        list.append(listItem);

        let uploadInterval = setInterval(function () {
            progress += Math.random() * 10;
            if (progress >= 100) {
                clearInterval(uploadInterval);
                progressBar.css('display', 'none');
                listItem.append(`
                    <button class="deleteFile notes__file-delete img" data-name="${inputName}" data-index="${uploadedFilesMap[inputName].length}">
                        <img src="${url}delete.svg" alt="">
                    </button>
                `);
                uploadedFilesMap[inputName].push(file);
            } else {
                progressBar.css('width', progress + '%');
            }
        }, 20);
    }

    function updateFileList(inputName) {
        let list = $(`.file__input[name="${inputName}"]`)
            .closest('.form__file')
            .find('.file__list');

        list.empty();


        for (let i = 0; i < uploadedFilesMap[inputName].length; i++) {
            let fileName = uploadedFilesMap[inputName][i].name;
            list.append(`
                <li class="form__file-item">
                    <h3>${fileName}</h3>
                    <button class="deleteFile notes__file-delete img" data-name="${inputName}" data-index="${i}">
                        <img src="${url}delete.svg" alt="">
                    </button>
                </li>
            `);
        }
    }
}



// //previous list file
// let uploadedFiles = [];
// function uploadAndDeleteFiles() {
//     let list;
//     $('.file__input').on('change', function () {
//         console.log(5656)
//         let files = $(this)[0].files;
//         // list = $(this).closest('.form').find('.file__list');
//         list = $(this).closest('.form__file').find('.file__list');
//
//         // if(list.closest('.form').hasClass('.form__photo')){
//         //     list = $(this).closest('.form__file').find('.file__list');
//         // }
//         for (let i = 0; i < files.length; i++) {
//             uploadFile(files[i]);
//         }
//     });
//
//     $(document).on('click', '.deleteFile', function () {
//         let index = $(this).data('index');
//         uploadedFiles.splice(index, 1);
//         updateFileList();
//     });
//
//     function uploadFile(file) {
//         let progress = 0;
//         let progressBar = $('<div class="progressBar"></div>');
//         let listItem = $('<li class="form__file-item"> <h3>' + file.name + '</h3></li>').append(progressBar);
//         list.append(listItem);
//
//         let uploadInterval = setInterval(function () {
//             progress += Math.random() * 10;
//             if (progress >= 100) {
//                 clearInterval(uploadInterval);
//                 progressBar.css('display', 'none');
//                 listItem.append(`<button class="deleteFile notes__file-delete img" data-index="' + uploadedFiles.length + '"><img src="${url}delete.svg" alt=""></button>`);
//                 uploadedFiles.push(file);
//             } else {
//                 progressBar.css('width', progress + '%');
//             }
//         }, 20);
//     }
//     function updateFileList() {
//         list.empty();
//         for (let i = 0; i < uploadedFiles.length; i++) {
//             let fileName = uploadedFiles[i].name;
//             list.append(`<li class="form__file-item"> <h3>${fileName}</h3><button class="deleteFile notes__file-delete img" data-index="${i}">  <img src="${url}delete.svg" alt=""></button></li>`);
//         }
//     }
// }

function loginPopupChange() {
    $(document).on('click', '.login__forget', function () {
        $(this).closest('.login__form').removeClass('active');
        $('.login__form-forget').addClass('active');
    });
    $(document).on('click', '.login__remember', function () {
        $(this).closest('.login__form').removeClass('active');
        $('.login__signin').addClass('active');
    });
    if (window.location.href.includes('set_new_password')) {
        $('.login__form').removeClass('active');
        $('.login__form-recovery').addClass('active');
    } else {
        $('.login__signin').addClass('active');
    }
}

function closeModal(modal) {
    $('body').css('overflow', 'hidden');
    $('.modal__close').click(function () {
        $(this).closest(modal).hide();
        $('body').css('overflow', 'visible');
        return false;
    });
    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            e.stopPropagation();
            modal.hide();
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

function openModalFromEmail() {
    if (window.location.href.includes('task_id')) {
        let urlString = location.href;
        let url = new URL(urlString);
        let task_id = url.searchParams.get("task_id");

        let modal = $('.modal__task-clarify');

        let role = $('.project__wrap').attr('data-role');
        $('input[name="task_id"]').val(task_id);

        let obj = { action: 'append-clarify-info', task_id, role };
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
            }
        });

        $('.task').each(function () {

            if ($(this).attr('data-taskId') == task_id) {
                let info = $(this).find('.project__task ');
                // let task_id = $(this).attr('data-taskId');
                $('input[name="task_id"]').val(task_id);

                let desc = info.data('desc');
                let template = info.data('template_link');
                let img = info.data('img');
                let managers = info.data('manager').split(',');
                let number1 = info.closest('tr').index() + 1;
                let number2 = info.closest('td').index();
                let part1 = info.closest('tr').find('.project__task-step h3').text();
                let part2 = info.find('.project__task-title').text();

                let managerList = '';
                managers.forEach(function (manager) {
                    managerList += '<span>' + manager.trim() + '</span>';
                });

                $('.project__manager-list').html(managerList);
                $('.modal .project__top-template').attr('href', template);
                $('.modal .project__top-icon img').attr('src', img);
                $('.project__modal-desc p').text(desc);
                $('.project__modal-title').html(`<span>Stage ${number1}. ${part1}</span>Step ${number2}. ${part2}`);
            }
        });

        modal.show();

        addMoreFile();

        closeModal(modal);
    }
}
$(document).ready(function () {
    // changeNumberComa()
    loginPopupChange();
    deleteJustUploadFile();
    let loginForm = $('.login__signin');
    validateForm(loginForm, function () {
        ajaxSend(loginForm, function (res) {
            window.location.href = res.data.redirect_url;
        }, function (error) {
            let errorrr = error.responseJSON.data.error;

            $('.login__signin').append(`<p class="login__signin-error">${errorrr}</p>`);
            setTimeout(function () {
                $('.login__signin-error').remove();
            }, 3000);
        });
    });

    let loginForget = $('.login__form-forget');
    validateForm(loginForget, function () {
        ajaxSend(loginForget, function () {
            $('.login__form-forget').removeClass('active');
            $('.login__form-success').addClass('active');
        }, function (error) {
            let errorrr = error.responseJSON.data[0];
            $('.login__form-forget').append(`<p class="login__signin-error">${errorrr}</p>`);
            setTimeout(function () {
                $('.login__signin-error').remove();
            }, 3000);
        });
    });

    let passwordReset = $('.login__form-recovery');
    validateForm(passwordReset, function () {
        ajaxSend(passwordReset, function (res) {
            window.location.href = res.data.redirect_url;
        }, function (error) {
            let errorrr = error.responseJSON.data[0];
            $('.login__form-recovery').append(`<p class="login__signin-error">${errorrr}</p>`);
            setTimeout(function () {
                $('.login__signin-error').remove();
            }, 3000);
        });
    });

    progressBar();
    addPercentStyle();
    changeMob();
    toogleModal($('.notes__button'), $('.modal__notes'));
    toogleModal($('.notes__top-edit'), $('.modal__notes'));

    if ($('.project__wrap').attr('data-role') == 'manager') {
        toogleModal($('.project__table-task .clarify'), $('.modal__manager'));
        toogleModal($('.project__table-task .accept'), $('.modal__manager'));
        toogleModal($('.project__table-task .first'), $('.modal__manager'));
    } else {
        toogleModal($('.project__table-task .clarify'), $('.modal__task-clarify'));
        toogleModal($('.project__table-task .accept'), $('.modal__task-clarify'));
        toogleModal($('.project__table-task .reject'), $('.modal__task'));
        toogleModal($('.project__table-task .first'), $('.modal__task-clarify'));
    }

    toogleModal($('.notes__file-delete'), $('.modal__delete'));
    toogleModal($('.notes__top-delete'), $('.modal__delete'));

    $('.file-input').on('change', function (event) {
        let fileList = event.target.files;
        console.log(1111111155555)
        updateFileListDisplay(fileList);
    });

    submitFormDataNotes('.form__notes');
    submitFormDataProject('.form__task');

    $('.header__burger').on('click', openMenu);
    deleteFileFromModal('.project__clarify-delete', $('.modal__content-delete'));
    approveFile('.project__approve-manager > *', $('.modal__content-approve'));
    showSearch();
    loadMore('more_project', '.project__wrap .load__more');
    loadMore('more_notification', '.notification__wrap .load__more');
    showMobTask('.project__table-task', 'tr', '.project__task-prev', '.project__task-next');
    showMobTask('.clarify__mob-wrap', 'tbody', '.clarify__mob-prev', '.clarify__mob-next');
    uploadAndDeleteFiles();
    openModalFromEmail();
    showLogOut();
    showInstruction();
    tab()
});

$(window).load(function () {});

$(window).resize(function () {});
$(window).scroll(function () {});
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map
