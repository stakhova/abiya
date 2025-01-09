function clearForm() {
    $(document).on('click', '.question__btn-clear', function () {
        $('.question__item:not(.question__const) input[type="text"]').val('');

        $('.question__item:not(.question__const) select').val(null).trigger('change');

        $('.question__item:not(.question__const) input[type="checkbox"], .question__item:not(.question__const) input[type="radio"]').prop('checked', false);

        $('.question__hide').each(function () {
            $(this).removeClass('active');
            $(this).find('input, select').attr('disabled', true);
        });

        initSelectForm();
    });
}

function tab() {
    $(".tab__header-item").click(function () {
        $(".tab__header-item").removeClass("active").eq($(this).index()).addClass("active");
        $(".tab__content-item").hide().eq($(this).index()).fadeIn();
    }).eq(0).addClass("active");
}


function changeNewTable(){
    if (window.innerWidth <= 666) {
        $('.project__top-block:last-of-type').append($('.site__link'))
    }
}



function changeSelect(change) {
    $('.question__hide').each(function () {
        $(this).find('input, select').attr('disabled', true);
    });

    $(document).on('change', `[data-${change}]`, function () {
        let value = $(this).find('select').val();
        console.log('Selected Value:', value);

        $(`[data-${change}-hide]`).each(function () {
            $(this).removeClass('active');
            $(this).find('input, select').attr('disabled', true);

            let currentValue = $(this).data(`${change}-hide`);
            console.log('Current Value:', currentValue);

            if (currentValue == value) {
                $(this).addClass('active');
                $(this).find('input, select').attr('disabled', false);
            }
        });
    });
}

function formSubmit() {
    $('.question__form').on('submit', function (e) {
        e.preventDefault();

        let isValid = true; // Початково форма валідна
        let formData = new FormData();

        // Перевіряємо та додаємо до FormData лише активні поля
        $('.question__item').each(function () {
            $(this).find('input, select, textarea').each(function () {
                if (!$(this).is(':disabled')) {
                    if (!$(this).val().trim()) {
                        isValid = false;
                        $(this).closest('div').addClass('error');
                    } else {
                        $(this).closest('div').removeClass('error');
                        formData.append($(this).attr('name'), $(this).val());
                        formData.forEach(function (value, key) {
                            if (key === 'file[]') {
                                formData.delete(key);
                            }
                        });
                        uploadedFiles.forEach(function (file) {
                            formData.append('file[]', file);
                        });
                    }
                }
            });
        });

        if (isValid) {
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log('Success:', response);
                    $('.question__form')[0].reset();
                },
                error: function (error) {
                    console.error('Error:', error);
                    $('.question__form')[0].reset();
                }
            });
        } else {
            if (!$('.question__btn p.error').length) {
                $('.question__btn').append('<p class="error">Please fill out all required fields before submitting</p>');
            }
        }
    });

    $('.question__form').on('input change', 'input, select, textarea', function () {
        if ($(this).val().trim()) {
            $(this).closest('div').removeClass('error');
        }
        if($('div.error').length < 1){
            $('p.error').remove()
        }
    });
}


function initSelectForm(){
    $('.question__select').each(function () {
        $(this).select2({
            dropdownParent: $(this).closest('.question__item')
        });
    });
}



let currentChange, currentNotes


function  openModalAppend(button){
    currentChange = button
    let id = button.closest('[data-item-id]').data('item-id')
    let text = button.text().trim()
    $('.modal [name="id"]').val(id)
    $('.modal [name="notes"]').val(text)

}
function openModal(btn, modal) {

    btn.click(function () {
        button = $(this);
        openModalAppend(button)
        modal.show();
        $('body').css('overflow', 'hidden');
        return false;
    });
    $('.modal__close').click(function () {
        $(this).closest(modal).hide();
        $('body').css('overflow', 'visible');
        resetModal();
        return false;
    });
    $('.modal__btn-close').click(function () {
        $(this).closest(modal).hide();
        $('body').css('overflow', 'visible');
        resetModal();
        return false;
    });
    $(document).keydown(function (e) {
        if (e.keyCode === 27) {
            e.stopPropagation();
            resetModal();
            $('body').css('overflow', 'visible');
        }
    });
    modal.click(function (e) {
        if ($(e.target).closest('.modal__content').length == 0) {
            $(this).hide();
            resetModal();
            $('body').css('overflow', 'visible');
        }
    });
}



$(document).ready(function () {
    openModal($('.change__data'), $('.modal__change'));

    changeSelect('location')
    changeSelect('request')
    changeSelect('delay')
    changeSelect('toolbox')
    changeSelect('factory')
    initSelectForm()
    formSubmit()
    clearForm()
    tab()
    changeNewTable()

    let formChange = $('.form__change');

    console.log(formChange)
    validateForm(formChange, function () {
        ajaxSend(formChange, function (res) {
            currentNotes = $('.modal [name="notes"]').val()
            currentChange.text(currentNotes)
        }, function (error) {

            currentNotes = $('.modal [name="notes"]').val()
            currentChange.text(currentNotes)
        }, 1);
    });

})
