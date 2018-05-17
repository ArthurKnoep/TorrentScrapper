let $btn = $(".control > .button");
$btn.click(function() {
    let form = {
        name: $('#name').val(),
        language: $('#language').val()
    }
    if (form.name.length < 3) {
        $('.name-field .help').addClass('is-danger');
        $('#name').addClass('is-danger');
    } else {
        $('.name-field .help').removeClass('is-danger');
        $('#name').removeClass('is-danger');
    }
    if (form.language === "none") {
        $('#language').parent().addClass('is-danger');
    } else {
        $('#language').parent().removeClass('is-danger');
    }


    if (form.name.length > 3 && form.language !== "none") {
        $btn.addClass('is-loading');
        $btn.removeClass('is-danger');
        $.ajax('/api/setup/1', {
            method: 'POST',
            data: JSON.stringify(form),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(resp) {
                $btn.removeClass('is-loading');
                if (resp.success) {
                    window.location.href = "/setup/2";
                } else {
                    $btn.addClass('is-danger');
                }
            },
            error: function() {
                $btn.removeClass('is-loading');
                $btn.addClass('is-danger');
            }
        })
    }
});