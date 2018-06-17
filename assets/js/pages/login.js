$btnSend = $('input[type=submit]');
$btnSend.click(function() {
    let $elem = {
        login: $('#login'),
        password: $('#password')
    }
    let form = {
        login: $elem.login.val(),
        password: $elem.password.val()
    }
    let error = false;
    for (let i in form) {
        if (form[i].length < 3) {
            $elem[i].addClass('is-danger');
            error = true;
        } else {
            $elem[i].removeClass('is-danger');
        }
    }
    if (error) {
        return;
    }
    $elem.login.removeClass('is-danger');
    $elem.password.removeClass('is-danger');
    $btnSend.addClass('is-loading').removeClass('is-danger');
    $.ajax('/api/auth/login', {
        method: 'POST',
        data: form,
        success: function(resp) {
            $btnSend.removeClass('is-loading');
            window.location.href = "/";
        },
        error: function(err) {
            $elem.login.addClass('is-danger');
            $elem.password.addClass('is-danger');
            $btnSend.removeClass('is-loading').addClass('is-danger');
        }
    })
});