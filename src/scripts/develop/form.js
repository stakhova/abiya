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

    let srcCurrent = button.closest('.photo__item-img').find('img').attr('src')
    $('.modal__photo-img img').attr('src',srcCurrent)
    console.log(1212, srcCurrent)

}
function openModal(btn, modal) {

    btn.click(function () {
        button = $(this);
        openModalAppend(button)
        modal.show();
        $('body').css('overflow', 'hidden');
        return false;
    });



    $('.close').click(function () {
        $(this).closest(modal).hide();
        $('body').css('overflow', 'visible');
        resetModal();
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

function closeModal(form){
    form.closest('.modal').hide();
    $('body').css('overflow', 'visible');
    resetModal();
}


function spline() {
    const ctxList = document.querySelectorAll('.chart');

    ctxList.forEach(ctx => {
        // Get chart data from the data-chart attribute and parse it
        const chartData = JSON.parse(ctx.getAttribute('data-chart'));

        // Construct the dataset for the Chart.js instance
        const data = {
            labels: ['Project Value', 'Material Cost', 'Labour Cost', 'Misc. Cost'],
            datasets: [{
                label: 'My Dataset',
                data: chartData.data,
                backgroundColor: ['#564073', '#C4BCCE', '#EDE8E0', '#B3A384'],
                hoverOffset: 4
            }]
        };

        // Initialize the chart
        new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                        // position: 'right',
                    }
                }
            }
        });
    });
    const canvas = document.getElementById('chart__line');

    const labels = JSON.parse(canvas.getAttribute('data-labels'));
    const datasets = JSON.parse(canvas.getAttribute('data-datasets'));

    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets.map(dataset => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: dataset.backgroundColor,
                borderWidth: 2,
                fill: false
            }))
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 10,
                        min: 0
                    }
                },
                x: {
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Bar Chart
    document.querySelectorAll('.chart__bar').forEach(function (chartDiv) {
        // Extract data from data-attr and labels
        let data = chartDiv.getAttribute('data-attr').split(',');
        let labels = chartDiv.getAttribute('data-labels').split(',');
        let canvasId = chartDiv.getAttribute('data-canvas-id');
        var bgColors = chartDiv.getAttribute('data-bg-colors').split(',');
        // Get the corresponding canvas
        let ctx = document.getElementById(canvasId).getContext('2d');

        // Create a bar chart using Chart.js
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Dataset for ' + canvasId,
                    data: data.map(Number),
                    backgroundColor: bgColors,
                    borderColor: bgColors.map(color => color.replace('0.2', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    });
}




$(document).ready(function () {
    openModal($('.change__data'), $('.modal__change'));
    openModal($('.photo__add'), $('.modal__change'));
    openModal($('.photo__resize'), $('.modal__photo'));

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
    let formChange = $('.form__change-note');
    validateForm(formChange, function () {
        ajaxSend(formChange, function (res) {
            currentNotes = $('.modal [name="notes"]').val()
            currentChange.text(currentNotes)
            closeModal(formChange)
        }, function (error) {

            currentNotes = $('.modal [name="notes"]').val()
            currentChange.text(currentNotes)
            closeModal(formChange)
        });
    }, 1);


    submitFormDataProject('.form__photo');

    spline()

    var ctx = document.getElementById("myChart").getContext('2d');


    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ["08 Jan",	"08 Jan",	"08 Jan",	"Shanghai",	"08 Jan",	"08 Jan",	"08 Jan"],
            datasets: [{
                label: 'Series 1', // Name the series
                data: [500,	50,	2424,	14040,	14141,	4111,	4544,	47,	5555, 6811], // Specify the data values array
                fill: false,
                borderColor: '#2196f3', // Add custom color border (Line)
                backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
                borderWidth: 1 // Specify bar border width
            }]},
        options: {
            responsive: true, // Instruct chart js to respond nicely.
            maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
        }
    });


})
