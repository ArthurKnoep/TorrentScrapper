let $btn = $(".control > .button");
$btn.click(function() {
    let form = {
        login: $('#login').val(),
        password: $('#password').val()
    }
    if (form.login.length < 3) {
        $('.login-field .help').addClass('is-danger');
        $('#login').addClass('is-danger');
    } else {
        $('.login-field .help').removeClass('is-danger');
        $('#login').removeClass('is-danger');
    }
    if (form.password.length < 3) {
        $('.password-field .help').addClass('is-danger');
        $('#password').addClass('is-danger');
    } else {
        $('.password-field .help').removeClass('is-danger');
        $('#password').removeClass('is-danger');
    }
    if (form.login.length < 3 || form.password.length < 3) {
        return;
    }
    $btn.addClass('is-loading');
    $btn.removeClass('is-danger');
    $.ajax('/api/setup/2', {
        method: 'POST',
        data: form,
        success: function(data) {
            $btn.removeClass('is-loading');
            if (data.success) {
                window.location.href = "/setup/3";
            } else {
                $btn.addClass('is-danger');
            }
        },
        error: function() {
            $btn.removeClass('is-loading');
            $btn.addClass('is-danger');
        }
    })
});