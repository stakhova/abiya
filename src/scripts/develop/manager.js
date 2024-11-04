let modalManager = $('.modal__managers');

function openManagerPopup(btn, modal) {
    btn.click(function () {
        button = $(this);
        let modalId = button.attr('data-cell');
        modal = $(`.modal[data-modal="${modalId}"]`);
        modalManager = modal;
        appendManager();
        modal.show();
        getPositionDate();
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

function moreLocation() {
    $(document).on('click', '.location__more', function () {
        let modal = $(this).closest('.modal');
        modal.find('.location__more-block').show();
        $(this).hide();
    });
}

function appendManager() {
    let title = button.attr('data-title');
    let desc = button.attr('data-desc');
    let icon = button.find('.project__task-img img').attr('src');
    let numberCell = button.closest('tr').index() + 1;
    let numberColumn = button.closest('td').index();
    let titleCell = button.find('.project__task-title').text();
    let topTitle = button.closest('tr').find('.project__task-step h3').text();

    let amountContract = $('.contract__form').attr('data-contract');

    if (amountContract !== '') {
        $('input[name="amount_contract"]').val(amountContract);
    }

    modalManager.find('.project__modal-desc h3').text(title);
    modalManager.find('.project__modal-desc p').text(desc);
    modalManager.find('.project__top-icon img').attr('src', icon);
    modalManager.find('.project__modal-title').html(`${topTitle}<br> ${numberCell}.${numberColumn} ${titleCell}`);
}

function fillCalendar() {
    let calendarBtn = $('.modal__calendar .location__more');
    if ($('[name = "date_from"]').val() == '') {
        calendarBtn.addClass('disabled');
    }
    $(document).on('change', '.calendar__wrap input', function () {

        let wrap = $(this).closest('.modal__calendar');
        function parseDate(input) {
            const parts = input.split('/');
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
        const dateFrom = $('#date_from').val();
        const dateTo = $('#date_to').val();
        let project_id = $('.project__table-task').data('project-id');

        $('.error').remove();

        const dateFromObj = parseDate(dateFrom);
        const dateToObj = parseDate(dateTo);

        let duration;

        if (dateToObj < dateFromObj) {
            $('.calendar__wrap').append('<label class="error" >The project completion date cannot be earlier than the award of contract date.</label>');
            wrap.removeClass('active');
        } else {
            duration = Math.floor((dateToObj - dateFromObj) / (1000 * 60 * 60 * 24));

            let obj = { action: 'add_date', dateFrom, dateTo, project_id };
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: obj,
                method: 'POST',
                success: function (res) {
                    $('.calendar__start span').text(dateFrom);
                    $('.calendar__end span').text(dateTo);
                    wrap.addClass('active');
                    getPositionDate();
                    $('.calendar__wrap-duration span').text(duration);
                    $('[name = "date_from"]').val() == '' ? calendarBtn.addClass('disabled') : calendarBtn.removeClass('disabled');
                },
                error: function (error) {
                    console.log('error ajax');
                    $('.calendar__start span').text(dateFrom);
                    $('.calendar__end span').text(dateTo);
                    wrap.addClass('active');
                    getPositionDate();
                    $('.calendar__wrap-duration span').text(duration);
                    dateFrom == '' ? calendarBtn.addClass('disabled') : calendarBtn.removeClass('disabled');
                    dateTo !== '' ? calendarBtn.hide() : calendarBtn.show();
                }
            });
        }
    });
}
function moreItems() {
    let modal;
    $(document).on('click', '.modal__managers-more', function () {
        // $(this).closest('.modal[data-modal="1_1"]').find('.project__table-manager > table tbody').append(`<tr class="new">
        //                                 <td>
        //                                     <input type="text">
        //                                 </td>
        //                                 <td>
        //                                    <input type="text">
        //                                 </td>
        //                             </tr>`)
        modal = $(this).closest('.modal');
        modal.find('.modal__managers-save').show();
        $(this).hide();
        submitFormDataProject('.form__task');
        submitFormDataProject('.inspections__form');
    });
    // $(document).on('click','.modal__managers-save', function (){
    //     // modal.find('.new:last-of-type input').attr('readonly', true)
    //     modal = $(this).closest('.modal')
    //     modal.find('.modal__managers-more').show()
    //     $(this).hide()
    // })
}

function removeItem() {
    $(document).on('click', '.delete__item', function () {
        let action = $(this).closest('.modal').data('action');
        let project_id = $('.project__table-task').data('project-id');
        let item = $(this).closest('[data-item-id]');
        let nextAll = item.nextAll();
        let item_id = item.data('item-id');
        let obj = { action, item_id, project_id };

        if (item.hasClass('active')) {
            item.next().addClass('active');
        }
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function (res) {
                item.remove();
                nextAll.each(function () {
                    let currentId = $(this).data('item-id');
                    let newId = currentId - 1;
                    $(this).data('item-id', newId);
                    $(this).attr('data-item-id', newId);
                });
            },
            error: function (error) {
                console.log('error ajax');
            }
        });
    });
}

function calendar() {
    $(".modal__datepicker").datepicker({
        dateFormat: 'dd/mm/yy'
    });
}

function getPositionDate() {
    let lineWidth = $('.calendar__illustrate').width();
    let itemLength = $('.calendar__date .calendar__point').length + 1;

    let gap = lineWidth / itemLength;

    let position = 0;

    if (window.innerWidth <= 666) {
        // Mobile view: Apply vertical layout
        // $('.calendar__date .calendar__point').css({
        //     'position': 'relative',
        //     'left': 'auto',
        //     'width': '50%',
        //     'max-width': '50%',
        //     'margin-bottom': '20px'  // Add spacing between points if needed
        // });
        //
        // $('.calendar__date .calendar__point-content').css({
        //     'position': 'relative',
        //     'right': 'auto',
        //     'bottom': 'auto',
        //     'max-width': '100%'
        // });
        //
        // $('.calendar__date .calendar__point:nth-child(odd)').each(function () {
        //     let content = $(this).find('.calendar__point-content');
        //     let contentHeight = content.height();
        //
        //     content.css({
        //         'bottom': `${contentHeight + 70}px`
        //     });
        // });
    } else {
        $('.calendar__date .calendar__point').each(function () {
            position += gap;
            let content = $(this).find('.calendar__point-content');

            content.css({
                'right': `${(gap - 16) / 2}px`,
                'max-width': gap + 'px'
            });

            $(this).css({
                'position': 'absolute',
                'left': position + 'px',
                'max-width': gap + 'px'
            });
        });
        $('.calendar__date .calendar__point:nth-child(odd)').each(function () {

            let content = $(this).find('.calendar__point-content');
            let contentHeight = content.height();

            content.css({
                'bottom': `${contentHeight + 70}px`
            });
        });
    }
}

function removeDate() {
    $(document).on('click', '.calendar__point-delete', function () {
        let date = $(this).closest('.calendar__point');
        let date_id = date.data('date-id');
        let project_id = $('.project__table-task').data('project-id');
        let obj = { action: 'delete_date', date_id, project_id };
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function (res) {
                $('.calendar__illustrate').html(res);
                getPositionDate();
            },
            error: function (error) {
                console.log('error ajax');
                date.remove();
                getPositionDate();
            }
        });
    });
}

function chartTransfer() {
    if (window.innerWidth <= 666) {
        let clarifyItems = $('.chart__wrap .clarify__mob-wrap');
        let chartItems = $('.chart__item');
        // Переміщаємо кожен блок .chart__item після відповідного .clarify__mob-wrap

        clarifyItems.each(function (index) {
            $(this).after(chartItems.eq(index));
        });
    }
}
function dropMenu() {

    $('.drop').each(function () {
        let btn = $(this).find('.drop__btn');
        let status = btn.data('status');
        let listStatus = $(this).find('.drop__menu-flex span[data-status="' + status + '"]');
        if (listStatus.length) {
            let bgColor = listStatus.data('status-color');
            btn.css('background-color', bgColor);
        }
    });
    $(".drop__btn").on("click", function () {
        $(this).next(".drop__menu").slideToggle();
        $(".drop__menu").not($(this).next(".drop__menu")).slideUp();
    });

    $(document).on("click", function (event) {
        if (!$(event.target).closest('.drop').length) {
            $(".drop__menu").slideUp();
        }
    });

    $(document).on('click', '.drop__menu-flex > *', function () {
        let current = $(this).text();
        let currentStatus = $(this).attr('data-status');
        let currentStatusColor = $(this).attr('data-status-color');
        let currentBtn = $(this).closest('.drop').find('.drop__btn');
        currentBtn.css('background', `${currentStatusColor}`);
        $(this).closest('.drop').find('.drop__btn').text(current);
        $(this).closest('.drop').find('input[type="hidden"]').val(current);
        $(".drop__menu").slideUp();
        let action = $(this).closest('.modal').data('action-change');
        let project_id = $('.project__table-task').data('project-id');
        const obj = { action, project_id, current, currentStatus };
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function (res) {},
            error: function (error) {
                console.log('error', error);
            }
        });
    });
}
function editDataAmount() {
    $(document).on('change', '.project__input input', function () {
        let project_id = $('.project__table-task').data('project-id');
        let invoice_id = $(this).closest('[data-item-id]').data('item-id');
        let amount = +$(this).val();
        let type = $(this).closest('.project__input').data('type');

        let currentModal = $(this).closest('.modal');
        let action = currentModal.data('action-change');
        let totalAmountProject = +currentModal.data('project-amount');
        let obj = { action, project_id, invoice_id, type, amount };

        let currentPercent = $(this).closest('.wrap__amount').next().find('.percent').find('span');
        let percent = (amount / totalAmountProject * 100).toFixed(2);
        if (totalAmountProject) {
            currentPercent.text(percent);
        }

        function calculateTotals(selector) {
            let totalInvoice = 0;
            let totalReceived = 0;
            let totalPercentInvoice = 0;
            let totalPercentReceived = 0;

            $(selector).find('.project__input[data-type="invoice"] input').each(function () {
                totalInvoice += parseFloat($(this).val()) || 0;
            });

            $(selector).find('.project__input[data-type="received"] input').each(function () {
                totalReceived += parseFloat($(this).val()) || 0;
            });

            $(selector).find('.amount__percent span').each(function () {
                totalPercentInvoice += parseFloat($(this).text()) || 0;
            });

            $(selector).find('.received__percent span').each(function () {
                totalPercentReceived += parseFloat($(this).text()) || 0;
            });

            if (totalPercentInvoice > 100) {
                $(selector).find('.total__invoice-percent').css('color', 'red');
            } else {
                $(selector).find('.total__invoice-percent').css('color', 'inherit');
            }
            if (totalPercentReceived > 100) {
                $(selector).find('.total__received-percent').css('color', 'red');
            } else {
                $(selector).find('.total__received-percent ').css('color', 'inherit');
            }

            $(selector).find('.total h4[data-type="invoice"]').text(totalInvoice);
            $(selector).find('.total h4[data-type="received"]').text(totalReceived);
            $(selector).find('.total__invoice-percent span').text(totalPercentInvoice);
            $(selector).find('.total__received-percent span').text(totalPercentReceived);
        }

        function successEdit() {
            calculateTotals(currentModal.find('table.change__table'));

            calculateTotals(currentModal.find('.project__clarify-mob.change__table'));
        }

        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function (res) {
                successEdit();
            },
            error: function (error) {
                successEdit();
            }
        });
    });
}

function editDataPurchases() {
    $(document).on('change', '.financial__input input', function () {
        let project_id = $('.project__table-task').data('project-id');
        let purchases_id = $(this).closest('[data-item-id]').data('item-id');
        let amount = +$(this).val();
        let type = $(this).closest('.supplier').data('type');
        let currentModal = $(this).closest('.modal');
        let action = currentModal.data('action-change');

        let obj = { action, project_id, purchases_id, type, amount };

        function updateDifferences(container) {
            $(container).find('[data-item-id]').each(function () {
                let budgetAmount = +$(this).find('[data-type="budget"] input').val() || 0;

                updateDifferenceForType($(this), "engineering", budgetAmount);
                updateDifferenceForType($(this), "management", budgetAmount);
            });
        }

        function updateDifferenceForType(item, type, budgetAmount) {
            let typeInput = item.find(`[data-type="${type}"] input`);
            let typeAmount = +typeInput.val() || 0;
            let typeDiff = typeAmount - budgetAmount;
            item.find(`[data-type="${type}"] .financial__input-wrap span`).text(typeDiff >= 0 ? `(+${typeDiff})` : `(${typeDiff})`);
        }

        function recalculateTotals(container) {
            let totalBudget = 0;
            let totalEngineering = 0;
            let totalManagement = 0;

            $(container).find('[data-item-id]').each(function () {
                totalBudget += +$(this).find('[data-type="budget"] input').val() || 0;
                totalEngineering += +$(this).find('[data-type="engineering"] input').val() || 0;
                totalManagement += +$(this).find('[data-type="management"] input').val() || 0;
            });
            $(container).find('.total [data-type="budget"]').text(totalBudget);
            $(container).find('.total [data-type="engineering"]').text(totalEngineering);
            $(container).find('.total [data-type="management"]').text(totalManagement);

            let savingsEngineering = totalEngineering - totalBudget;
            let savingsManagement = totalManagement - totalBudget;
            $(container).find('.total__save [data-type="engineering"]').text(savingsEngineering >= 0 ? `+${savingsEngineering}` : savingsEngineering);
            $(container).find('.total__save [data-type="management"]').text(savingsManagement >= 0 ? `+${savingsManagement}` : savingsManagement);
        }

        updateDifferences('table.change__table');
        recalculateTotals('table.change__table');
        updateDifferences('.project__clarify-mob');
        recalculateTotals('.project__clarify-mob');
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function (res) {
                successEdit();
            },
            error: function (error) {
                successEdit();
            }
        });
    });
}

function addDataEnd() {
    $(document).on('change', '.calendar__input input', function () {
        let project_id = $('.project__table-task').data('project-id');
        let task_id = $(this).closest('[data-item-id]').data('item-id');
        let currentModal = $(this).closest('.modal');
        let action = currentModal.data('action-add');
        let currentTask = $(this).closest('tr');
        let endDate = $(this).val();

        // Retrieve the previous date (start date) text and parse it into a date format
        let previousDateText = currentTask.find('.start__date').text().trim();

        if (previousDateText) {

            let previousDate = new Date(previousDateText.split('/').reverse().join('-')); // Converts dd/mm/yyyy to yyyy-mm-dd
            let selectedDate = new Date(endDate.split('/').reverse().join('-'));

            $(this).attr('min', previousDateText.split('/').reverse().join('-'));

            if (selectedDate >= previousDate) {
                let dayDifference = Math.floor((selectedDate - previousDate) / (1000 * 60 * 60 * 24));
                let obj = { action, project_id, task_id, endDate };
                $.ajax({
                    url: '/wp-admin/admin-ajax.php',
                    data: obj,
                    method: 'POST',
                    success: function (res) {
                        currentTask.find('.count').text(`${dayDifference + 1} days`);
                    },
                    error: function (error) {
                        currentTask.find('.count').text(`${dayDifference + 1} days`);
                        currentTask.addClass('comleted');

                        $('[data-manager] .comleted').each(function () {
                            $(this).appendTo($(this).closest('tbody'));
                        });
                    }
                });
            } else {
                currentTask.find('.count').text('');
                $(this).val('');
                alert("Please select a date after " + previousDateText);
            }
        }
    });
}

function addNewTask() {
    $(document).on('click', '.task__more-btn', function () {
        let form = $('.task__more-form');
        let managerId = $(this).closest('.project__table-manager').data('manager');
        $('.task__more-form input[name="manager_id"]').val(managerId);
        let btn = $('.task__more-btn');
        $(this).closest('.task__more').append(form);
        btn.show();
        $(this).hide();
        $('.task__more-form').addClass('active');
    });
}

function sortTask() {
    $("[data-manager] tbody").sortable({
        items: "tr",
        cursor: "move",
        placeholder: "sortable-placeholder",
        start: function (event, ui) {
            ui.item.addClass("highlight");
        },
        stop: function (event, ui) {
            ui.item.removeClass("highlight");
        },
        update: function (event, ui) {
            console.log("Row order updated");
        }
    });
}
function adjustInputWidth() {
    $('.manager__input input').each(function () {
        let tempSpan = $('<span>').text($(this).val()).css({
            'font-size': $(this).css('font-size'),
            'font-family': $(this).css('font-family'),
            'visibility': 'hidden',
            'white-space': 'nowrap'
        }).appendTo('body');

        $(this).width(tempSpan.width() + 15); //
        tempSpan.remove();
    });
}
$(document).ready(function () {
    editDataAmount();
    removeDate();
    openManagerPopup($('.manager'), modalManager);
    moreItems();
    moreLocation();
    removeItem();
    calendar();
    fillCalendar();

    dropMenu();

    let locationForm = $('.location__form');
    validateForm(locationForm, function () {
        ajaxSend(locationForm, function () {
            $('.location__more-block').hide();
            $('.location__more').show();
        }, function (error) {
            // $('.location__more-block').hide();
            // $('.location__more').show();
        });
    });

    let contractForm = $('.contract__form');
    validateForm(contractForm, function () {
        let form__input = $('.contract__form .form__input input').val();
        ajaxSend(contractForm, function () {

            contractForm.attr('data-contract', form__input);
        }, function () {
            contractForm.attr('data-contract', form__input);
        });
    }, 1);

    let formTerms = $('.form__terms');
    validateForm(formTerms, function () {
        ajaxSend(formTerms, function () {
            $('.location__more-block').hide();
            $('.location__more').show();
        }, function (error) {
            // $('.location__more-block').hide();
            // $('.location__more').show();
        });
    });

    let contactForm = $('.contact__form');
    validateForm(contactForm, function () {
        ajaxSend(contactForm, function () {
            $('.location__more-block').hide();
            $('.location__more').show();
        }, function (error) {
            // $('.location__more-block').hide();
            // $('.location__more').show();
        });
    });

    let purchaseForm = $('.purchase__form');
    validateForm(purchaseForm, function () {
        ajaxSend(purchaseForm, function () {
            $('.location__more-block').hide();
            $('.location__more').show();
        }, function (error) {
            // $('.location__more-block').hide();
            // $('.location__more').show();
        });
    });

    let personForm = $('.person__form');
    validateForm(personForm, function () {
        ajaxSend(personForm, function () {
            $('.location__more-block').hide();
            $('.location__more').show();
        }, function (error) {
            // $('.location__more-block').hide();
            // $('.location__more').show();
        });
    });

    let dateForm = $('.calendar__form');
    validateForm(dateForm, function () {
        // let date_add = $('#date_add').val()
        // let note_add = $('#note__add').val()
        ajaxSend(dateForm, function () {
            $('.calendar__illustrate').html(res);
            getPositionDate();
        }, function (error) {
            $('.calendar__illustrate').html(res);
            // $('.calendar__date').append(` <div class="calendar__point">
            //                             <div class="calendar__point-content">
            //                                 <span class="calendar__point-date">${date_add}<button class="calendar__point-delete"></button></span>
            //                                 <span class="calendar__point-desc">${note_add}</span>
            //                             </div>
            //                         </div>`)
            getPositionDate();
        });
    });

    $('.select').select2({});
    chartTransfer();
    spline();
    submitFormDataProject('.delivery__form');
    submitFormDataProject('.mirs__form');
    submitFormDataProject('.wirs__form');
    submitFormDataProject('.variations__form');
    submitFormDataProject('.ncrs__form');

    submitFormDataProject('.nomination-letter__form');
    submitFormDataProject('.completion_certificate__form');
    submitFormDataProject('.misc_letters__form');
    submitFormDataProject('.legal__form');

    submitFormDataProject('.pullout__form');
    submitFormDataProject('.welding__form');
    submitFormDataProject('.shear__form');
    submitFormDataProject('.coating__form');
    submitFormDataProject('.misc__form');

    submitFormDataProject('.invoices__form');
    submitFormDataProject('.variations__form');
    submitFormDataProject('.minutes__form');
    submitFormDataProject('.minutes__form');

    submitFormDataProject('.task__more-form');

    addNewTask();
    addDataEnd();
    editDataPurchases();
    adjustInputWidth();
    sortTask();

    $(document).on('input', '.manager__input input', adjustInputWidth);
});

$(window).load(function () {});

$(window).resize(function () {});
$(window).scroll(function () {});
//# sourceMappingURL=manager.js.map
//# sourceMappingURL=manager.js.map
