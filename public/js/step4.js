$('.active-deluge').change(function() {
    if ($(this).is(":checked")) {
        $('.deluge-box').slideDown(350);
    } else {
        $('.deluge-box').slideUp(350);
    }
});

const $btnDeluge = $('.test-connect-deluge button')
$btnDeluge.click(function() {
    let form = {
        host: $('#host').val(),
        password: $('#password').val()
    }
    let error = false;
    if (form.host.length < 3) {
        error = true;
        $('#host').addClass('is-danger');
    } else {
        $('#host').removeClass('is-danger');
    }
    if (form.password.length == 0) {
        error = true;
        $('#password').addClass('is-danger');
    } else {
        $('#password').removeClass('is-danger');
    }
    if (error) {
        return;
    }
    let host = form.host;
    if (host.indexOf("http://") !== 0 && host.indexOf("https://") !== 0) {
        host = "http://" + host;
    }
    if (host[host.length - 1] === '/') {
        host = host.substr(0, host.length - 1);
    }
    if (host.indexOf("/json") !== host.length - "/json".length) {
        host = host += "/json";
    }
    form.host = host;
    $btnDeluge.addClass('is-loading').removeClass('is-danger');
    $('#host').removeClass('is-success').removeClass('is-danger');
    $('#password').removeClass('is-success').removeClass('is-danger');
    $.ajax('/api/setup/4/deluge', {
        method: 'POST',
        data: form,
        success: function(data) {
            if (data.success) {
                $btnDeluge.removeClass('is-loading');
                $('#host').addClass('is-success');
                $('#password').addClass('is-success');
                $('.deluge-box').slideUp(350);
                $('.active-deluge').attr('disabled', 'disabled');
                $btnDeluge.attr('disabled', 'disabled');
            } else {
                $btnDeluge.removeClass('is-loading').addClass('is-danger');
                $('#host').addClass('is-danger');
                $('#password').addClass('is-danger');
            }
        },
        error: function() {
            $btnDeluge.removeClass('is-loading').addClass('is-danger');
        }
    })
});

let $validBtn = $('.valid-btn');
$validBtn.click(function() {
    $validBtn.addClass('is-loading').remove('is-danger');
    $.ajax('/api/setup/end', {
        method: 'POST',
        success: function(data) {
            if (data.success) {
                window.location.href = '/';
            } else {
                $validBtn.removeClass('is-loading').addClass('is-danger');
            }
        },
        error: function() {
            $validBtn.removeClass('is-loading').addClass('is-danger');
        }
    })
})