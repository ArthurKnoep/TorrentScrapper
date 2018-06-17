function deleteServerInfo(type) {
    $.ajax({
        url: '/api/config/dlsoft/'+type,
        method: 'DELETE',
        success: function (resp) {
            if (resp.success) {
                $('.active-'+type).parent().find('.sub-span').remove();
                toastr.success(resp.data.msg);
            } else {
                toastr.warning(resp.data.msg);
            }
        },
        error: function () {
            toastr.warning("Error");
        }
    });
}

$('.active-deluge').change(function() {
    if ($(this).is(":checked")) {
        $('.deluge-box').slideDown(350);
    } else {
        deleteServerInfo("deluge");
        $('.deluge-box').slideUp(350);
    }
});

$('.active-transmission').change(function() {
    if ($(this).is(":checked")) {
        $('.transmission-box').slideDown(350);
    } else {
        deleteServerInfo("transmission");
        $('.transmission-box').slideUp(350);
    }
});


const $btnDeluge = $('.test-connect-deluge button');
$btnDeluge.click(function() {
    let form = {
        host: $('#deluge-host').val(),
        password: $('#deluge-password').val()
    };
    let error = false;
    if (form.host.length < 3) {
        error = true;
        $('#deluge-host').addClass('is-danger');
    } else {
        $('#deluge-host').removeClass('is-danger');
    }
    if (form.password.length === 0) {
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
    $.ajax({
        url: '/api/config/dlsoft/deluge',
        method: 'POST',
        data: form,
        success: function (resp) {
            $btnDeluge.removeClass('is-loading');
            if (resp.success) {
                $('.active-deluge').parent().append($("<span></span>").addClass('sub-span').text(resp.data.msg));
                $('.deluge-box').slideUp(350);
            } else {
                $btnDeluge.addClass('is-danger');
            }
        },
        error: function () {
            $btnDeluge.removeClass('is-loading').addClass('is-danger');
        }
    });
    console.log(form);
});



const $btnTransmi = $('.test-connect-transmission button');
$btnTransmi.click(function () {
    let $transmi = {
        host: $('#transmi-host'),
        login: $('#transmi-login'),
        password: $('#transmi-password')
    };
    let form = {
        host: $transmi.host.val(),
        login: $transmi.login.val(),
        password: $transmi.password.val()
    };
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
        host += "/transmission/rtc";
    }
    form.host = host;
    $btnTransmi.removeClass('is-danger').addClass('is-loading');
    $('.field-transmi .help').text('');
    $transmi.host.removeClass('is-danger').removeClass('is-success');
    $transmi.login.removeClass('is-danger').removeClass('is-success');
    $transmi.password.removeClass('is-danger').removeClass('is-success');
    $.ajax('/api/config/dlsoft/transmission', {
        method: 'POST',
        data: form,
        success: function (data) {
            $btnTransmi.removeClass('is-loading');
            if (data.success) {
                $('.active-transmission').parent().append($("<span></span>").addClass('sub-span').text(data.data.msg));
                $('.transmission-box').slideUp(350);
            } else {
                $btnTransmi.addClass('is-danger');
                toastr.warning(data.data.msg);
            }
        },
        error: function () {
            toastr.warning("Error");
            $btnTransmi.removeClass('is-loading').addClass('is-danger');
        }
    });
});