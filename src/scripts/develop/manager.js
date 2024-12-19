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
        modal.find('.form').show();
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
        $('.amount__error').remove()
    }

    modalManager.find('.project__modal-desc h3').text(title);
    modalManager.find('.project__modal-desc p').text(desc);
    modalManager.find('.project__top-icon img').attr('src', icon);
    modalManager.find('.project__modal-title').html(`${topTitle}<br> ${numberCell}.${numberColumn} ${titleCell}`);
}

function fillCalendar() {
    let calendarBtn = $('.modal__calendar .location__more');
    console.log(11113333, $('[name = "date_from"]').val())
    if ($('[name = "date_from"]').val() == '') {
        calendarBtn.addClass('disabled');
    } else{
        calendarBtn.removeClass('disabled');
    }
    $(document).on('change', '.calendar__wrap input', function () {

        let wrap = $(this).closest('.modal__calendar');
        function parseDate(dateStr) {
            const [day, month, year] = dateStr.split('/');
            return new Date(year, month - 1, day);
        }

        const dateFrom = $('#date_from').val();
        const dateToHtml = $('#date_to').val();
        const dateEnd = dateToHtml ? dateToHtml : '';
        let project_id = $('.project__table-task').data('project-id');

        const dateTo = dateToHtml ? dateToHtml : (function() {
            const today = new Date();
            return formatDate(today);
        })();

        // function formatDate(date) {
        //     const d = new Date(date);
        //     const day = String(d.getDate()).padStart(2, '0');
        //     const month = String(d.getMonth() + 1).padStart(2, '0');
        //     const year = d.getFullYear();
        //     return `${day}/${month}/${year}`;
        // }

        const dateFromObj = parseDate(dateFrom);
        const dateToObj = parseDate(dateTo);


        let duration;

        if (dateToObj < dateFromObj) {
            $('.calendar__wrap').append('<label class="error" >The project completion date cannot be earlier than the award of contract date.</label>');
            wrap.removeClass('active');
        } else {
            const diffTime = dateToObj - dateFromObj;
            duration = diffTime / (1000 * 3600 * 24);

            let obj = { action: 'add_date', dateFrom, dateEnd, project_id };
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: obj,
                method: 'POST',
                success: function (res) {
                    // $('.calendar__start span').text(dateFrom);
                    // $('.calendar__end span').text(dateEnd);
                    // wrap.addClass('active');
                    // getPositionDate();
                    // $('.calendar__wrap-duration span').text(duration);

                    $('.calendar__date > *').remove()
                    $('.calendar__date').append(res);
                    $('[name = "date_from"]').val() == '' ? calendarBtn.addClass('disabled') : calendarBtn.removeClass('disabled');
                    getPositionDate();
                },
                error: function (error) {


                }
            });
        }
    });
}
function moreItems() {
    let modal;
    $(document).on('click', '.modal__managers-more', function () {
        modal = $(this).closest('.modal');
        modal.find('.modal__managers-save').show();
        $(this).hide();
        submitFormDataProject('.form__task');
        submitFormDataProject('.inspections__form');
    });
}

function removeItem() {
    $(document).on('click', '.delete__item', function () {
        let btn = $(this)
        let wrapMob = $(this).closest('.clarify__mob-wrap')
        let action = $(this).closest('.modal').data('action');
        let project_id = $('.project__table-task').data('project-id');
        let item = $(this).closest('[data-item-id]');
        let manager_id = $(this).closest("[data-manager]").data('manager');
        let type = $(this).closest("[data-type]").data('type');
        let nextAll = item.nextAll();
        let item_id = item.data('item-id');


        let obj = { action, item_id, project_id, manager_id, type };

        if (item.hasClass('active')) {
            if (item.is(':last-child')) {
                item.prev().addClass('active');
            } else {
                item.next().addClass('active');
            }
        }



        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function (res) {
                item.remove();
                if(wrapMob.find('table tbody').length <= 1){
                    wrapMob.find('.clarify__mob-nav').remove()
                }
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


function  getLineWidth(){


}
function getPositionDate() {
    let first = $('.calendar__point-wrap:first-child')
    if(!first.hasClass('calendar__start')){
        first.css('margin-left','80px')
        // first.addClass('first')
    }else{
       $('.calendar__start .date').css('left','0')
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
                $('.calendar__date > *').remove()
                $('.calendar__date').append(res);
                getPositionDate();
            },
            error: function (error) {
                $('.calendar__date > *').remove()
                $('.calendar__date').append(res);
                getPositionDate();

                console.log('error ajax');

                // date.remove();
                // getPositionDate();
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
        let bgColor = btn.data('status-color');
        btn.css('background-color', bgColor);
    });
    $(document).on("click",".drop__btn", function () {
        console.log(11111111,$(this), $(this).next(".drop__menu"))
        $(this).next(".drop__menu").slideToggle();
        // $(".drop__menu").not($(this).next(".drop__menu")).slideUp();
    });

    // $(document).on("click", function (event) {
    //     if (!$(event.target).closest('.drop').length) {
    //         $(".drop__menu").slideUp();
    //     }
    // });

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
        let item_id = $(this).closest('[data-item-id]').data('item-id');

        let manager = $(this).closest('[data-manager]').data('manager');
        const obj = { action, project_id,item_id, current, currentStatus, manager};

        let wrap= $(this).closest('.project__table.project__table-clarify')

        if(wrap.length > 0){
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: obj,
                method: 'POST',
                success: function (res) {},
                error: function (error) {
                    console.log('error', error);
                }
            });
        }

    });
}
function addDateInvoice()  {
    $(document).on('change', '.amount__date input', function () {
        let project_id = $('.project__table-task').data('project-id');
        let item_id = $(this).closest('[data-item-id]').data('item-id');
        let date = $(this).val();
        let type = $(this).attr('name');

        let currentModal = $(this).closest('.modal');
        let action = currentModal.data('action-change');
        let obj = { action, project_id, item_id, type, date };
        $.ajax({
            url: '/wp-admin/admin-ajax.php',
            data: obj,
            method: 'POST',
            success: function (res) {
            },
            error: function (error) {
            }
        });
    });
}



function editDataAmount(){
    $(document).on('change', '.project__input input', function () {
        let project_id = $('.project__table-task').data('project-id');
        let item_id = $(this).closest('[data-item-id]').data('item-id');
        let amount = +$(this).val();
        let type = $(this).closest('.project__input').data('type');

        let currentModal = $(this).closest('.modal');
        let action = currentModal.data('action-change');
        let totalAmountProject = +currentModal.data('project-amount');
        let obj = { action, project_id, item_id, type, amount };

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


function disableForUser(){
    if($('.project__table').attr('data-user') !== 'manager'){
        $('.drop-wrap').addClass('disabled')
        $('.manager__input input').addClass('disabled')
    }
}
let formattedDate = "";
function setToday() {
    let today = new Date();

    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();
    formattedDate = day + '/' + month + '/' + year;
    console.log(123, formattedDate);
}

function addDataEnd() {
    $(document).on('click', '.modal__managers-tracker .drop__menu-flex > *', function () {

        let project_id = $('.project__table-task').data('project-id');
        let task_id = $(this).closest('[data-item-id]').data('item-id');
        let currentModal = $(this).closest('.modal');
        let action = currentModal.data('action-add');
        let currentTask = $(this).closest('tr');
        if(window.innerWidth < 666){
            currentTask = $(this).closest('tbody');
        }
        let status = $(this).data('status');
        let manager = $(this).closest('[data-manager]').data('manager');
        if (status == '1') {
            setToday();
            currentTask.find('.end__date').text(`${formattedDate}`);
            let endDate = currentTask.find('.end__date').text().trim();
            let currentStatus = $(this).attr('data-status');
            let previousDateText = currentTask.find('.start__date').text().trim();
            console.log(3333,currentTask.find('.start__date').text())
            console.log(3333,previousDateText)

            if (previousDateText) {
                let previousDate = new Date(previousDateText.split('/').reverse().join('-')); // Converts dd/mm/yyyy to yyyy-mm-dd
                let selectedDate = new Date(endDate.trim().split('/').reverse().join('-'));

                let dayDifference = Math.floor((selectedDate - previousDate) / (1000 * 60 * 60 * 24));

                console.log(1111111, selectedDate, previousDate,dayDifference)
                let obj = { action, project_id, manager, task_id, endDate, currentStatus };
                $.ajax({
                    url: '/wp-admin/admin-ajax.php',
                    data: obj,
                    method: 'POST',
                    success: function (res) {
                        currentTask.find('.count').text(`${dayDifference + 1} days`);
                        currentTask.addClass('comleted');
                        // $('[data-manager] .comleted').each(function () {
                        //     $(this).appendTo($(this).closest('tbody'));
                        // });
                    },
                    error: function (error) {
                    }
                });
            }
        }else{
            let obj = { action, project_id, manager, task_id };
            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: obj,
                method: 'POST',
                success: function (res) {
                },
                error: function (error) {
                }
            });
        }
    });
}

function addNewTask() {
    $(document).on('click', '.task__more-btn', function () {
        let form = $(this).closest('.modal').find('.more__form');
        let managerId = $(this).closest('[data-manager]').data('manager');
        $('.task__more-form input[name="manager_id"]').val(managerId);
        let btn = $('.task__more-btn');
        $(this).closest('.task__more').append(form);
        btn.show();
        form.css('display','flex');
        $(this).hide();

        let type = $(this).data('supplier');
        $('input[name="purchase_type"]').val(type);
        // $('.supplier__amount').removeClass('active');
        // $('.supplier__amount input').attr('disabled', 'disabled');
        // $('.supplier__amount').each(function () {
        //     if ($(this).data('supplier') == dataSupplier) {
        //         $(this).addClass('active');
        //         $(this).find('input').removeAttr('disabled');
        //     }
        // });

        $('.task__more-form').addClass('active');
    });
}

function sortTask() {
    let oldOrder = [];

    $("[data-manager] tbody").sortable({
        items: "tr",
        cursor: "move",
        placeholder: "sortable-placeholder",

        start: function (event, ui) {
            ui.item.addClass("highlight");
            oldOrder = $(this).find("tr:not(.sortable-placeholder)").map(function (index) {
                let itemId = $(this).attr("data-item-id");
                return { id: itemId, oldIndex: index };
            }).get();
        },

        stop: function (event, ui) {
            ui.item.removeClass("highlight");
        },

        update: function (event, ui) {
            let newOrder = $(this).find("tr:not(.sortable-placeholder)").map(function (index) {
                let itemId = $(this).attr("data-item-id");
                return { id: itemId, newIndex: index };
            }).get();

            let updatedPositions = newOrder.map((newItem) => {
                let oldItem = oldOrder.find(item => item.id === newItem.id);
                return {
                    id: newItem.id,
                    oldIndex: oldItem ? oldItem.oldIndex : -1,
                    newIndex: newItem.newIndex
                };
            });

            $.ajax({
                url: "/wp-admin/admin-ajax.php",
                type: "POST",
                data: {
                    action: "update_order_project_tracker",
                    manager_id: $(this).closest("[data-manager]").data('manager'),
                    project_id: $(".project__table-task").data('project-id'),
                    updatedTasks: updatedPositions
                },
                success: function(response) {
                    console.log("Order updated successfully");
                },
                error: function(error) {
                    console.error("Error updating order", error);
                }
            });

            console.log("Row order updated", updatedPositions);
        }
    });
}



function parseDate(dateStr) {
    // Split the date string into parts (assumes DD/MM/YYYY format)
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day); // Month is zero-based in JS Date
}



function removeMargin(){
    $('.amount__error').each(function (){
        $(this).closest(".modal").find('.project__table').css('margin','0')
    })
}
function addDate() {
    $(document).on('change', '.calendar__form input[name="date"]', function () {
        let startDateStr = $('.calendar__start span').text();
        let endDateStr = $('.calendar__end span').text();
        let selectedDateStr = $(this).val();

        let startDate = parseDate(startDateStr);
        let endDate = parseDate(endDateStr);
        let selectedDate = parseDate(selectedDateStr);

        if (isNaN(startDate) || isNaN(endDate) || isNaN(selectedDate)) {
            console.error("One or more dates are invalid:", {
                startDateStr,
                endDateStr,
                selectedDateStr,
                startDate,
                endDate,
                selectedDate
            });
            return;
        }

        if (selectedDate < startDate || selectedDate > endDate) {
            $('.calendar__form .location__save').addClass('disable');
            if ($(this).closest('.form__input').find('.error').length === 0) {
                $(this).closest('.form__input').append(
                    `<label class="error">The date must be between the start and end dates</label>`
                );
            }
        } else {
            $('.calendar__form .location__save').removeClass('disable');
            $(this).closest('.form__input').find('.error').remove();
        }

        console.log("Start Date:", startDate, "End Date:", endDate, "Selected Date:", selectedDate);
    });
}



function adjustInputWidth() {
    $('.manager__input input, .amount__date input').each(function () {
        let $input = $(this);

        // Функція для встановлення ширини
        function updateWidth() {
            let tempSpan = $('<span>').text($input.val()).css({
                'font-size': $input.css('font-size'),
                'font-family': $input.css('font-family'),
                'visibility': 'hidden',
                'white-space': 'nowrap'
            }).appendTo('body');

            $input.width(tempSpan.width() + 15); // 15 - додатковий відступ
            tempSpan.remove();
        }

        // Ініціальна адаптація ширини
        updateWidth();

        // Адаптація під час введення тексту
        $input.on('input', updateWidth);
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
    // addDate()
    dropMenu();

    let locationForm = $('.location__form');
    validateForm(locationForm, function () {
        ajaxSend(locationForm, function (res) {
            $('.location__more-block').hide();
            $('.location__more-block .form').show();
            $('.location__more').show();
            let modal = locationForm.closest('.modal')
            modal.find('.project__table > *').remove()
            modal.find('.project__table').append(res)

            showMobTask('.clarify__mob-wrap', 'tbody', '.clarify__mob-prev', '.clarify__mob-next');
            modal.find('.clarify__mob-wrap tbody').removeClass('active')
            modal.find('.clarify__mob-wrap tbody:last-child').addClass('active')
            modal.find('.clarify__mob-wrap .clarify__mob-next').addClass('disabled')
            modal.find('.clarify__mob-wrap .clarify__mob-prev').removeClass('disabled')


        }, function (error) {
            // $('.location__more-block').hide();
            // $('.location__more').show();
        });
    });

    let contractForm = $('.contract__form');
    validateForm(contractForm, function () {
        let form__input = $('.contract__form .form__input input').val();
        ajaxSend(contractForm, function (res) {
            $('.amount__text').text(`Amount Of the contract: ${form__input}`);
            contractForm.attr('data-contract', form__input);

            console.log(11111,contractForm)
            $('.amount__error').remove()
            let modal = contractForm.closest('.modal')
            modal.find('.project__table > *').remove()
            modal.find('.project__table').append(res)
            showMobTask('.clarify__mob-wrap', 'tbody', '.clarify__mob-prev', '.clarify__mob-next');
            modal.find('.clarify__mob-wrap tbody').removeClass('active')
            modal.find('.clarify__mob-wrap tbody:last-child').addClass('active')
            modal.find('.clarify__mob-wrap .clarify__mob-next').addClass('disabled')
            modal.find('.clarify__mob-wrap .clarify__mob-prev').removeClass('disabled')
        }, function () {

        });
    }, 1);

    let formTerms = $('.form__terms');
    validateForm(formTerms, function () {
        ajaxSend(formTerms, function (res) {
            $('.location__more-block').hide();
            $('.location__more').show();



            let modal = formTerms.closest('.modal')
            modal.find('.project__table > *').remove()
            modal.find('.project__table').append(res)
            showMobTask('.clarify__mob-wrap', 'tbody', '.clarify__mob-prev', '.clarify__mob-next');
            modal.find('.clarify__mob-wrap tbody').removeClass('active')
            modal.find('.clarify__mob-wrap tbody:last-child').addClass('active')
            modal.find('.clarify__mob-wrap .clarify__mob-next').addClass('disabled')
            modal.find('.clarify__mob-wrap .clarify__mob-prev').removeClass('disabled')
        }, function (error) {

        });
    });

    let contactForm = $('.contact__form');
    validateForm(contactForm, function () {
        ajaxSend(contactForm, function (res) {
            $('.location__more-block').hide();
            $('.location__more').show();

            let modal = contactForm.closest('.modal')
            modal.find('.project__table > *').remove()
            modal.find('.project__table').append(res)
            showMobTask('.clarify__mob-wrap', 'tbody', '.clarify__mob-prev', '.clarify__mob-next');
            modal.find('.clarify__mob-wrap tbody').removeClass('active')
            modal.find('.clarify__mob-wrap tbody:last-child').addClass('active')
            modal.find('.clarify__mob-wrap .clarify__mob-next').addClass('disabled')
            modal.find('.clarify__mob-wrap .clarify__mob-prev').removeClass('disabled')
        }, function (error) {

        });
    });

    // let purchaseForm = $('.purchase__form');
    // validateForm(purchaseForm, function () {
    //     ajaxSend(purchaseForm, function (res) {
    //         $('.location__more-block').hide();
    //         $('.location__more').show();
    //
    //
    //         let modal = purchaseForm.closest('.modal')
    //         modal.find('.project__table > *').remove()
    //         modal.find('.project__table').append(res)
    //         showMobTask('.clarify__mob-wrap', 'tbody', '.clarify__mob-prev', '.clarify__mob-next');
    //         modal.find('.clarify__mob-wrap tbody').removeClass('active')
    //         modal.find('.clarify__mob-wrap tbody:last-child').addClass('active')
    //         modal.find('.clarify__mob-wrap .clarify__mob-next').addClass('disabled')
    //         modal.find('.clarify__mob-wrap .clarify__mob-prev').removeClass('disabled')
    //     }, function (error) {
    //
    //     });
    // });

    let personForm = $('.person__form');
    validateForm(personForm, function () {
        ajaxSend(personForm, function (res) {
            $('.location__more-block').hide();
            $('.location__more').show();



            let modal = personForm.closest('.modal')
            modal.find('.project__table > *').remove()
            modal.find('.project__table').append(res)
            showMobTask('.clarify__mob-wrap', 'tbody', '.clarify__mob-prev', '.clarify__mob-next');
            modal.find('.clarify__mob-wrap tbody').removeClass('active')
            modal.find('.clarify__mob-wrap tbody:last-child').addClass('active')
            modal.find('.clarify__mob-wrap .clarify__mob-next').addClass('disabled')
            modal.find('.clarify__mob-wrap .clarify__mob-prev').removeClass('disabled')
        }, function (error) {


        });
    });

    let dateForm = $('.calendar__form');
    validateForm(dateForm, function () {
        // let date_add = $('#date_add').val()
        // let note_add = $('#note__add').val()
        ajaxSend(dateForm, function (res) {
            $('.calendar__date > *').remove()
            $('.calendar__date').append(res);
            getPositionDate();
        }, function (error) {
            // $('.calendar__illustrate').html(res);
            // $('.calendar__date').append(` <div class="calendar__point">
            //                             <div class="calendar__point-content">
            //                                 <span class="calendar__point-date">${date_add}<button class="calendar__point-delete"></button></span>
            //                                 <span class="calendar__point-desc">${note_add}</span>
            //                             </div>
            //                         </div>`)
            // getPositionDate();
        });
    });

    $('.select').select2({});
    chartTransfer();
    // spline();
    submitFormDataProject('.form__contract');
    submitFormDataProject('.purchase__form');
    submitFormDataProject('.form__ar_ap');
    submitFormDataProject('.form__p_l');
    submitFormDataProject('.delivery__form');
    submitFormDataProject('.mirs__form');
    submitFormDataProject('.wirs__form');
    submitFormDataProject('.variations__form_add_ons');
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
    submitFormDataProject('.guarantees__form');

    submitFormDataProject('.form__tracker');

    addNewTask();
    addDataEnd();
    editDataPurchases();
    adjustInputWidth();
    sortTask();
    disableForUser()
    removeMargin()
    addDateInvoice()
    $(document).on('input', '.manager__input input', adjustInputWidth);
    getLineWidth();
});

$(window).load(function () {});

$(window).resize(function () {});
$(window).scroll(function () {});
//# sourceMappingURL=manager.js.map
//# sourceMappingURL=manager.js.map
//# sourceMappingURL=manager.js.map
