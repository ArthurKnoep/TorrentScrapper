$('.active-deluge').change(function() {
    if ($(this).is(":checked")) {
        $('.deluge-box').slideDown(350);
    } else {
        $('.deluge-box').slideUp(350);
    }
});

$('.active-transmission').change(function() {
    if ($(this).is(":checked")) {
        $('.transmission-box').slideDown(350);
    } else {
        $('.transmission-box').slideUp(350);
    }
});

const $btnDeluge = $('.test-connect-deluge button')
$btnDeluge.click(function() {
    let form = {
        host: $('#deluge-host').val(),
        password: $('#deluge-password').val()
    }
    let error = false;
    if (form.host.length < 3) {
        error = true;
        $('#deluge-host').addClass('is-danger');
    } else {
        $('#deluge-host').removeClass('is-danger');
    }
    if (form.password.length == 0) {
        error = true;
        $('#deluge-password').addClass('is-danger');
    } else {
        $('#deluge-password').removeClass('is-danger');
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
    $('#deluge-host').removeClass('is-success').removeClass('is-danger');
    $('#deluge-password').removeClass('is-success').removeClass('is-danger');
    $.ajax('/api/setup/4/deluge', {
        method: 'POST',
        data: form,
        success: function(data) {
            if (data.success) {
                $btnDeluge.removeClass('is-loading');
                $('#deluge-host').addClass('is-success');
                $('#deluge-password').addClass('is-success');
                $('.deluge-box').slideUp(350);
                $('.active-deluge').attr('disabled', 'disabled');
                $btnDeluge.attr('disabled', 'disabled');
            } else {
                $btnDeluge.removeClass('is-loading').addClass('is-danger');
                $('#deluge-host').addClass('is-danger');
                $('#deluge-password').addClass('is-danger');
            }
        },
        error: function() {
            $btnDeluge.removeClass('is-loading').addClass('is-danger');
        }
    })
});

const $btnTransmi = $('.test-connect-transmission button')
$btnTransmi.click(function() {
    let $transmi = {
        host: $('#transmi-host'),
        login: $('#transmi-login'),
        password: $('#transmi-password')
    }
    let form = {
        host: $transmi.host.val(),
        login: $transmi.login.val(),
        password: $transmi.password.val()
    }
    let error = false;
    for (let i in form) {
        if (form[i].length < 3) {
            $transmi[i].addClass('is-danger');
            error = true;
        } else {
            $transmi[i].removeClass('is-danger');
        }
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
    if (host.indexOf("/transmission/rtc") !== host.length - "/transmission/rtc".length) {
        host = host += "/transmission/rtc";
    }
    form.host = host;
    $btnTransmi.removeClass('is-danger').addClass('is-loading');
    $('.field-transmi .help').text('');
    $transmi.host.removeClass('is-danger').removeClass('is-success');
    $transmi.login.removeClass('is-danger').removeClass('is-success');
    $transmi.password.removeClass('is-danger').removeClass('is-success');
    $.ajax('/api/setup/4/transmission', {
        method: 'POST',
        data: form,
        success: function(data) {
            if (data.success) {
                $btnTransmi.removeClass('is-loading');
                $transmi.host.addClass('is-success');
                $transmi.login.addClass('is-success');
                $transmi.password.addClass('is-success');
                $('.transmission-box').slideUp(350);
                $('.active-transmission').attr('disabled', 'disabled');
                $btnTransmi.attr('disabled', 'disabled');
            } else {
                $btnTransmi.removeClass('is-loading').addClass('is-danger');
                $transmi.host.addClass('is-danger');
                $transmi.login.addClass('is-danger');
                $transmi.password.addClass('is-danger');
                $('.field-transmi .help').text(data.data.msg);
            }
        },
        error: function() {
            $btnTransmi.removeClass('is-loading').addClass('is-danger');
        }
    });
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