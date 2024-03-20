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
            changeContent()

        },
        error: function (error) {
            console.log('error ajax');
            changeContent()
        },
        complete: function (){

        }
    });
}


function progressBar(){
    let allTasks = $('.project__task').length
    let acceptTasks = $('.project__task.accept').length
    let percent = acceptTasks*100/allTasks
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
        $('.project__top-block:first-child').after($('.project__progress'));
    }
}
$(document).ready(function(){
    let loginForm = $('.login__form');
    validateForm(loginForm, function () {
        ajaxSend(loginForm, '/wp-admin/admin-ajax.php')
    });
    progressBar();
    addPercentStyle();
    changeMob()



});

$(window).load(function(){

});

$(window).resize(function(){

});
$(window).scroll(function () {
});
