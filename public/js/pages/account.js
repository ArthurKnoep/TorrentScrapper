$('button.validate').click(function() {
    let data = {
        new_login: $('input[name="newLogin"]').val(),
        new_password: $('input[name="newPassword"]').val(),
        actual_password: $('input[name="actualPassword"]').val()
    };

    $('input[name="newLogin"]').removeClass('is-danger');
    $('input[name="newPassword"]').removeClass('is-danger');
    $('input[name="actualPassword"]').removeClass('is-danger');
    $('button.validate').removeClass("is-danger");
    let error = false;
    if (!data.new_login || data.new_login.length < 3) {
        error = true;
        $('input[name="newLogin"]').addClass('is-danger');
    }
    if (!data.new_password || data.new_password.length < 3) {
        error = true;
        $('input[name="newPassword"]').addClass('is-danger');
    }
    if (!data.actual_password || data.actual_password.length < 3) {
        error = true;
        $('input[name="actualPassword"]').addClass('is-danger');
    }
    if (error) {
        $('button.validate').addClass("is-danger");
        return;
    }
    $('button.validate').addClass("is-loading");
    console.log(data);
    $.ajax({
        url: '/api/account',
        method: "POST",
        data: data,
        success: function(resp) {
            $('button.validate').removeClass("is-loading");
            if (resp.success) {
                toastr.success(resp.data.msg);
                $('button.validate').addClass("is-success");
            } else {
                toastr.warning(resp.data.msg);
                $('button.validate').addClass("is-danger");
            }
        },
        error: function() {
            $('button.validate').removeClass("is-loading");
            $('button.validate').addClass("is-danger");
        }
    })
});