$('.activate-provider').click(function () {
    let providerName = $(this).parent().parent().parent().parent().attr('data-provider-name');
    let url = '/api/config/providers/' + providerName + (($(this).is(':checked')) ? "/enable" : "/disable");
    $.ajax({
        url: url,
        method: 'PUT',
        success: function (resp) {
            if (resp)
                toastr.success(resp.data.msg);
            else
                toastr.warning(resp.data.msg);
        },
        error: function () {
            toastr.warning('Error');
        }
    });
});

$('.base-url').change(function () {
    let value = $(this).val();
    let providerName = $(this).parent().parent().parent().parent().parent().attr('data-provider-name');
    let url = '/api/config/providers/' + providerName + "/base-url";
    $.ajax({
        url: url,
        method: 'PUT',
        data: {
            baseUrl: value
        },
        success: function (resp) {
            if (resp.success)
                toastr.success(resp.data.msg);
            else
                toastr.warning(resp.data.msg);
        },
        error: function () {
            toastr.warning('Error');
        }
    });
});


$('.active-provider').click(function () {
    let file = $(this).parent().parent().parent().parent().attr('data-provider-file');
    let authent = $(this).parent().parent().parent().parent().attr('data-provider-authent');
    let data = {
        file: file
    };
    if (authent === "true") {
        let elem = {
            login: $(this).parent().parent().parent().parent().find('.login'),
            password: $(this).parent().parent().parent().parent().find('.password')
        };
        let error = false;
        for (let key in elem) {
            if (elem[key].val().length < 3) {
                error = true;
                elem[key].addClass('is-danger');
            } else
                elem[key].removeClass('is-danger');
        }
        if (error)
            return;
        data.login = elem.login.val();
        data.password = elem.password.val();
    }
    $.ajax({
        url: '/api/config/provider/active',
        method: 'POST',
        data: data,
        success: function (resp) {
            if (resp.success) {
                toastr.success(resp.data.msg);
                location.reload();
            } else
                toastr.warning(resp.data.msg);
        },
        error: function () {
            toastr.warning('Error');
        }
    });
    console.log($(this).parent().parent().parent().parent().attr('data-provider-file'));
});