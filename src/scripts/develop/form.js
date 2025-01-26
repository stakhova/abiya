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


function tabCalendar() {
    const $tabItems = $(".site .tab__header-item");
    const $contentItems = $(".site .tab__content-item");
    const $prevButton = $(".nav-button-tab.prev-tab");
    const $nextButton = $(".nav-button-tab.next-tab");
    let currentIndex = 0;

    const updateTabs = (index) => {
        $tabItems.removeClass("active").eq(index).addClass("active");
        $contentItems.hide().eq(index).show();


        $prevButton.prop("disabled", index === 0);
        $nextButton.prop("disabled", index === $tabItems.length - 1);

        if (window.innerWidth <= 666) {
            calendarFullMobile();
        } else {
            calendarFull();
        }
    };


    $tabItems.on("click", function () {
        currentIndex = $tabItems.index(this);
        updateTabs(currentIndex);
    });

    $prevButton.on("click", function () {
        if (currentIndex > 0) {
            currentIndex--;
            updateTabs(currentIndex);
        }
    });

    $nextButton.on("click", function () {
        if (currentIndex < $tabItems.length - 1) {
            currentIndex++;
            updateTabs(currentIndex);
        }
    });

    updateTabs(currentIndex);
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
            dropdownParent: $(this).closest('.question__item'),

        });
    });
}



let currentChange, currentAction, currentText


function  openModalAppend(button){
    currentChange = button
    currentText = button.find('.project__clarify-text')
    let item_id = button.closest('[data-item-id]').data('item-id')
    let text = currentText.text().trim()
    $('.modal [name="item_id"]').val(item_id)
    $('.modal [name="action_text"]').val(text)

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


function formatDateCalendar(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}



function calendarFull() {
    const calendarContainers = document.querySelectorAll('.calendar');
    const currentYear = new Date().getFullYear();

    calendarContainers.forEach((container, index) => {
        container.innerHTML = ''; // Очищуємо попередній вміст

        for (let month = 0; month < 12; month++) {
            const calendarDiv = document.createElement('div');
            calendarDiv.className = 'month-calendar';

            // Додаємо місяць і рік до заголовка
            const title = document.createElement('h3');
            title.textContent = new Date(currentYear, month).toLocaleString('en-US', { month: 'long', year: 'numeric' });

            const calendarEl = document.createElement('div');
            calendarDiv.appendChild(title);
            calendarDiv.appendChild(calendarEl);
            container.appendChild(calendarDiv);

            // Отримуємо дані для вкладки
            const tabData = days[index];
            const workDates = tabData ? tabData.daysWork.map(formatDateCalendar) : [];
            const engineersDates = tabData ? tabData.daysEngineers.map(formatDateCalendar) : [];

            // Ініціалізуємо FullCalendar
            const calendar = new FullCalendar.Calendar(calendarEl, {
                locale: 'en',
                initialDate: `${currentYear}-${String(month + 1).padStart(2, '0')}-01`,
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: '',
                    center: '',
                    right: ''
                },
                firstDay: 1,
                height: 'auto',
                contentHeight: 'auto',
                dayHeaderFormat: { weekday: 'short' },
                dayHeaderContent: (args) => args.text.substring(0, 2),
                dayCellDidMount: (info) => {
                    const dateStr = info.date.toISOString().split('T')[0]; // Формат дати YYYY-MM-DD
                    const localDateStr = new Date(info.date.getTime() - info.date.getTimezoneOffset() * 60000)
                        .toISOString()
                        .split('T')[0]; // Конвертуємо в локальний час

                    // Додаємо клас для робочих днів
                    if (workDates.includes(localDateStr)) {
                        info.el.classList.add('day__custom', 'day__work');
                    }

                    // Додаємо клас для днів інженерів
                    if (engineersDates.includes(localDateStr)) {
                        info.el.classList.add('day__custom', 'day__engineers');
                    }
                }
            });

            calendar.render();
        }
    });
}


function calendarFullMobile() {
    const calendarContainers = document.querySelectorAll('.calendar');
    const currentYear = new Date().getFullYear();
    const monthsPerView = 2; // Number of months to show at a time

    calendarContainers.forEach((container, index) => {
        container.innerHTML = ''; // Clear previous content

        const wrapper = document.createElement('div');
        wrapper.className = 'calendar-wrapper';
        container.appendChild(wrapper);

        let currentStartMonth = 0;

        const renderMonths = () => {
            wrapper.innerHTML = '';

            for (let i = 0; i < monthsPerView; i++) {
                const month = currentStartMonth + i;

                if (month >= 12) break;

                const calendarDiv = document.createElement('div');
                calendarDiv.className = 'month-calendar';


                const title = document.createElement('h3');
                title.textContent = new Date(currentYear, month).toLocaleString('en-US', { month: 'long', year: 'numeric' });

                const calendarEl = document.createElement('div');
                calendarDiv.appendChild(title);
                calendarDiv.appendChild(calendarEl);
                wrapper.appendChild(calendarDiv);


                const tabData = days[index];
                const workDates = tabData ? tabData.daysWork.map(formatDateCalendar) : [];
                const engineersDates = tabData ? tabData.daysEngineers.map(formatDateCalendar) : [];


                const calendar = new FullCalendar.Calendar(calendarEl, {
                    locale: 'en',
                    initialDate: `${currentYear}-${String(month + 1).padStart(2, '0')}-01`,
                    initialView: 'dayGridMonth',
                    headerToolbar: {
                        left: '',
                        center: '',
                        right: ''
                    },
                    firstDay: 1,
                    height: 'auto',
                    contentHeight: 'auto',
                    dayHeaderFormat: { weekday: 'short' },
                    dayHeaderContent: (args) => args.text.substring(0, 2),
                    dayCellDidMount: (info) => {
                        const localDateStr = new Date(info.date.getTime() - info.date.getTimezoneOffset() * 60000)
                            .toISOString()
                            .split('T')[0];


                        if (workDates.includes(localDateStr)) {
                            info.el.classList.add('day__custom', 'day__work');
                        }

                        if (engineersDates.includes(localDateStr)) {
                            info.el.classList.add('day__custom', 'day__engineers');
                        }
                    }
                });

                calendar.render();
            }
        };


        const navPrev = document.createElement('button');
        navPrev.textContent = 'Previous';
        navPrev.className = 'nav-button prev';

        const navNext = document.createElement('button');
        navNext.textContent = 'Next';
        navNext.className = 'nav-button next';

        const updateButtonState = () => {
            navPrev.classList.toggle('disabled', currentStartMonth === 0);
            navNext.classList.toggle('disabled', currentStartMonth >= 12 - monthsPerView);
        };

        navPrev.addEventListener('click', (event) => {
            event.preventDefault(); // Забороняє стандартну поведінку кнопки
            const scrollTop = window.scrollY; // Зберігає поточну позицію прокрутки

            if (currentStartMonth > 0) {
                currentStartMonth = Math.max(0, currentStartMonth - monthsPerView);
                renderMonths();
                updateButtonState();
            }

            window.scrollTo(0, scrollTop); // Відновлює позицію прокрутки
        });

        navNext.addEventListener('click', (event) => {
            event.preventDefault();
            const scrollTop = window.scrollY;

            if (currentStartMonth < 12 - monthsPerView) {
                currentStartMonth = Math.min(12 - monthsPerView, currentStartMonth + monthsPerView);
                renderMonths();
                updateButtonState();
            }

            window.scrollTo(0, scrollTop);
        });

        renderMonths();
        updateButtonState();


        const buttonWrap = document.createElement('div');
        buttonWrap.className = 'button__wrap';
        buttonWrap.appendChild(navPrev);
        buttonWrap.appendChild(navNext);

        container.appendChild(buttonWrap);
    });
}


$(document).ready(function () {
    openModal($('.change__data'), $('.modal__change'));
    openModal($('.photo__add'), $('.modal__change'));
    openModal($('.photo__resize'), $('.modal__photo'));
    // openModal($('.site .project__clarify-delete '), $('.modal__photo-delete'))
    changeSelect('location')
    changeSelect('request')
    changeSelect('delay')
    changeSelect('toolbox')
    changeSelect('factory')
    initSelectForm()
    formSubmit()
    clearForm()
    if (window.innerWidth <= 666) {
        calendarFullMobile()
    } else{
        calendarFull()
    }
    tabCalendar()
    changeNewTable()
    let formChange = $('.form__change-note');
    validateForm(formChange, function () {
        ajaxSend(formChange, function (res) {
            currentAction = $('.modal [name="action_text"]').val()
            currentText.text(currentAction)
            closeModal(formChange)
        }, function (error) {

            currentAction = $('.modal [name="action_text"]').val()
            currentText.text(currentAction)
            closeModal(formChange)
        });
    }, 1);


    submitFormDataProject('.form__photo');

    // spline()
    //
    // var ctx = document.getElementById("myChart").getContext('2d');
    //
    //
    // var myChart = new Chart(ctx, {
    //     type: 'line',
    //     data: {
    //         labels: ["08 Jan",	"08 Jan",	"08 Jan",	"Shanghai",	"08 Jan",	"08 Jan",	"08 Jan"],
    //         datasets: [{
    //             label: 'Series 1', // Name the series
    //             data: [500,	50,	2424,	14040,	14141,	4111,	4544,	47,	5555, 6811], // Specify the data values array
    //             fill: false,
    //             borderColor: '#2196f3', // Add custom color border (Line)
    //             backgroundColor: '#2196f3', // Add custom color background (Points and Fill)
    //             borderWidth: 1 // Specify bar border width
    //         }]},
    //     options: {
    //         responsive: true, // Instruct chart js to respond nicely.
    //         maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height
    //     }
    // });


})
