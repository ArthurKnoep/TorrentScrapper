let $btn = $(".control > .button");
$btn.click(function() {
    let data = {};
    let error = false;
    let $select = $(".provider");
    for (let i = 0; $select[i]; i++) {
        data[$($select[i]).attr("data-name")] = {
            checked: $($select[i]).is(":checked"),
            file: $($select[i]).attr("data-file"),
            baseUrl: $($select[i]).attr("data-base-url"),
            needLogged: false
        };
        if ($($select[i]).hasClass('need-logged') && $($select[i]).is(':checked')) {
            data[$($select[i]).attr("data-name")].needLogged = true;
            if ($('#'+$($select[i]).attr("data-name")+'-login').val().length == 0) {
                error = true;
                $('#'+$($select[i]).attr("data-name")+'-login').addClass('is-danger');
            } else {
                $('#'+$($select[i]).attr("data-name")+'-login').removeClass('is-danger');
            }
            if ($('#'+$($select[i]).attr("data-name")+'-password').val().length == 0) {
                error = true;
                $('#'+$($select[i]).attr("data-name")+'-password').addClass('is-danger');
            } else {
                $('#'+$($select[i]).attr("data-name")+'-password').removeClass('is-danger');
            }
            data[$($select[i]).attr("data-name")].login = $('#'+$($select[i]).attr("data-name")+'-login').val();
            data[$($select[i]).attr("data-name")].password = $('#'+$($select[i]).attr("data-name")+'-password').val();
        }
    }
    if (error) {
        return;
    }
    $btn.addClass('is-loading').removeClass('is-danger');
    $.ajax('/api/setup/3', {
        method: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            console.log(data);
            $btn.removeClass("is-loading");
            if (data.success)
                window.location.href = "/setup/4";
            else
                $btn.addClass("is-danger");
        },
        error: function() {
            $btn.removeClass("is-loading").addClass("is-danger");
        }
    });
});

$logBtn = $('.need-logged');
$logBtn.click(function() {
    if ($(this).is(':checked')) {
        $('.'+$(this).attr('data-toggle')).slideDown(350);
    } else {
        $('.'+$(this).attr('data-toggle')).slideUp(350);
    }
})