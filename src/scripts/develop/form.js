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



function fillAreaSelect() {

    if (typeof projects === 'undefined' || !projects) {
        return;
    }

    projects = JSON.parse(projects);

    $(document).on('change', '.question__item select[name="project_id"]', function () {
        let selectedProjectId = $(this).val();
        let selectedProject = projects.find(project => project.id == selectedProjectId);
        let areaSelect = $('select[name="area"]');

        areaSelect.empty().append('<option value="">Select area</option>');

        if (selectedProject) {
            selectedProject.areas.forEach(area => {
                areaSelect.append(`<option value="${area.area}">${area.area}</option>`);
            });
        } else {
            areaSelect.append('<option value="">No areas available</option>');
        }
    });


}

function initializeCanvasNavigation() {

    $(".tab__content-item").each(function () {
        const $canvasWraps = $(this).find(".canvas__wrap:not(.canvas__wrap-top)");
        const $prevButton = $(this).find(".button__wrap .prev");
        const $nextButton = $(this).find(".button__wrap .next");
        let canvasIndex = 0;

        const updateCanvasDisplay = () => {
            $canvasWraps.hide().eq(canvasIndex).show();
            $prevButton.prop("disabled", canvasIndex === 0);
            $nextButton.prop("disabled", canvasIndex === $canvasWraps.length - 1);
        };

        updateCanvasDisplay();

        $prevButton.on("click", function () {
            if (canvasIndex > 0) {
                canvasIndex--;
                updateCanvasDisplay();
            }
        });

        $nextButton.on("click", function () {
            if (canvasIndex < $canvasWraps.length - 1) {
                canvasIndex++;
                updateCanvasDisplay();
            }
        });
    });
}
function tabCalendar() {
    const $tabItems = $(".site .tab__header-item");
    const $contentItems = $(".site .tab__content-item");
    const $prevButton = $(".nav-button-tab.prev-tab");
    const $nextButton = $(".nav-button-tab.next-tab");

    let currentIndex = 0;

    const updateTabs = index => {
        $tabItems.removeClass("active").eq(index).addClass("active");
        $contentItems.hide().eq(index).show();

        $prevButton.prop("disabled", index === 0);
        $nextButton.prop("disabled", index === $tabItems.length - 1);

        if (window.innerWidth <= 666) {
            calendarFullMobile();
            initializeCanvasNavigation();
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

function changeNewTable() {
    if (window.innerWidth <= 666) {
        $('.project__top-block:last-of-type').append($('.site__link'));
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
        if ($('div.error').length < 1) {
            $('p.error').remove();
        }
    });
}

function initSelectForm() {
    $('.question__select').each(function () {
        $(this).select2({
            dropdownParent: $(this).closest('.question__item')

        });
    });
}

let currentChange, currentAction, currentText;

function openModalAppend(button) {
    currentChange = button;
    currentText = button.find('.project__clarify-text');
    let item_id = button.closest('[data-item-id]').data('item-id');
    let text = currentText.text().trim();
    $('.modal [name="item_id"]').val(item_id);
    $('.modal [name="action_text"]').val(text);

    let srcCurrent = button.closest('.photo__item-img').find('img').attr('src');
    $('.modal__photo-img img').attr('src', srcCurrent);
    console.log(1212, srcCurrent);
}
function openModal(modal, btn) {

    if (btn) {
        btn.click(function () {
            const button = $(this);
            openModalAppend(button);
            modal.show();
            $('body').css('overflow', 'hidden');
            return false;
        });
    } else {
        modal.show();
        $('body').css('overflow', 'hidden');
    }

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

function closeModal(form) {
    form.closest('.modal').hide();
    $('body').css('overflow', 'visible');
    resetModal();
}

function spline() {

    document.querySelectorAll('[data-color]').forEach(function (colorElement) {
        let bgColors = colorElement.closest('[data-color]').getAttribute('data-color').split(',');

        const descSpans = colorElement.querySelectorAll('.analysis__desc-item span');
        descSpans.forEach((span, index) => {
            span.style.backgroundColor = bgColors[index % bgColors.length].trim();
        });

        const lineItems = colorElement.querySelectorAll('.analysis__line-item');
        lineItems.forEach((lineItem, lineIndex) => {
            let percentValues = lineItem.getAttribute('data-percent').split(',').map(Number);
            const spans = lineItem.querySelectorAll('span');
            let baseColor = bgColors[lineIndex % bgColors.length].trim(); // Assign base color per line item

            spans.forEach((span, spanIndex) => {
                if (percentValues[spanIndex] !== undefined) {
                    span.style.backgroundColor = baseColor;
                    span.style.display = 'inline-block';
                    span.style.width = `${percentValues[spanIndex]}%`;
                }
            });
        });
    });


    document.querySelectorAll('.chart__bar').forEach(function (chartDiv) {
        let data = chartDiv.getAttribute('data-attr').split(',');
        let canvasId = chartDiv.getAttribute('data-canvas-id');
        let bgColors = chartDiv.closest('[data-color]').getAttribute('data-color').split(',');

        let ctx = document.getElementById(canvasId).getContext('2d');

        new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{
                    label: 'Dataset for ' + canvasId,
                    data: data.map(Number),
                    backgroundColor: bgColors,
                    borderColor: bgColors.map(color => color.trim()),
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    mode: null
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
                dayHeaderContent: args => args.text.substring(0, 2),
                dayCellDidMount: info => {
                    const dateStr = info.date.toISOString().split('T')[0]; // Формат дати YYYY-MM-DD
                    const localDateStr = new Date(info.date.getTime() - info.date.getTimezoneOffset() * 60000).toISOString().split('T')[0]; // Конвертуємо в локальний час

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
                    dayHeaderContent: args => args.text.substring(0, 2),
                    dayCellDidMount: info => {
                        const localDateStr = new Date(info.date.getTime() - info.date.getTimezoneOffset() * 60000).toISOString().split('T')[0];

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

        navPrev.addEventListener('click', event => {
            event.preventDefault(); // Забороняє стандартну поведінку кнопки
            const scrollTop = window.scrollY; // Зберігає поточну позицію прокрутки

            if (currentStartMonth > 0) {
                currentStartMonth = Math.max(0, currentStartMonth - monthsPerView);
                renderMonths();
                updateButtonState();
            }

            window.scrollTo(0, scrollTop); // Відновлює позицію прокрутки
        });

        navNext.addEventListener('click', event => {
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

function chart() {
    document.querySelectorAll('canvas[data-chart]').forEach(canvas => {
        const ctx = canvas.getContext('2d');

        // Retrieve data from data attributes
        const type = canvas.dataset.type || 'line';
        const labels = JSON.parse(canvas.dataset.labels || '[]');
        const data = JSON.parse(canvas.dataset.data || '[]');
        const borderColor = canvas.dataset.borderColor || '#000';
        const backgroundColor = canvas.dataset.backgroundColor || '#000';

        // Find max value for normalization
        const maxValue = Math.max(...data);

        // Normalize data to a 0-100 scale
        const normalizedData = data.map(value => value / maxValue * 100);

        // Set font size based on screen width
        const fontSize = window.innerWidth <= 666 ? 7 : 10;

        // Create the chart
        new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: 'Dataset',
                    data: normalizedData,
                    fill: false,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                    borderWidth: 1,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            stepSize: 50,
                            font: {
                                size: fontSize
                            },
                            callback: function (value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            borderDash: [5, 5],
                            color: '#cccccc'
                        },
                        min: 0,
                        max: 100
                    },
                    x: {
                        ticks: {
                            font: {
                                size: fontSize
                            }
                        },
                        grid: {
                            borderDash: [5, 5],
                            color: '#cccccc'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        titleFont: {
                            size: fontSize
                        },
                        bodyFont: {
                            size: fontSize
                        },
                        callbacks: {
                            label: function (context) {
                                const originalValue = data[context.dataIndex];
                                return `Value: ${originalValue}`;
                            }
                        }
                    },
                    datalabels: {
                        align: 'top',
                        color: '#000',
                        font: {
                            size: fontSize
                        },
                        formatter: function (value, context) {
                            const originalValue = data[context.dataIndex];
                            return `${originalValue}`;
                        },
                        padding: 5
                    }
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 20,
                        bottom: 20
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    });
}
$(document).ready(function () {
    openModal($('.modal__change'), $('.change__data'));
    openModal($('.modal__change'), $('.photo__add'));
    openModal($('.modal__photo'), $('.photo__resize'));

    changeSelect('location');
    changeSelect('request');
    changeSelect('delay');
    changeSelect('toolbox');
    changeSelect('factory');
    initSelectForm();
    formSubmit();
    clearForm();
    if (window.innerWidth <= 666) {
        calendarFullMobile();
    } else {
        calendarFull();
    }
    tabCalendar();
    changeNewTable();
    let formChange = $('.form__change-note');
    validateForm(formChange, function () {
        ajaxSend(formChange, function (res) {
            currentAction = $('.modal [name="action_text"]').val();
            currentText.text(currentAction);
            closeModal(formChange);
        }, function (error) {

            currentAction = $('.modal [name="action_text"]').val();
            currentText.text(currentAction);
            closeModal(formChange);
        });
    }, 1);

    chart();
    submitFormDataProject('.form__photo');

    spline()
    fillAreaSelect()

    console.log('CHART123', document.querySelectorAll('canvas[data-chart]'));
});
//# sourceMappingURL=form.js.map
