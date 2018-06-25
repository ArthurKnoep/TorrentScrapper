$('.add-menu-entry').click(function () {
    $('.modal').addClass('is-active');
});

$('.close-modal').click(function () {
    $('.modal').removeClass('is-active');
});

function reindex() {
    let box = $('.box-menu');
    for (let i = 0; box[i]; i++) {
        $(box[i]).attr('data-id', i + "");
        $(box[i]).find('.delete').attr('data-id', i + "");
    }
}

$('.delete').click(function () {
    let idx = $(this).attr('data-id');
    $.ajax({
        url: '/api/config/menu',
        method: 'DELETE',
        data: {
            id: idx
        },
        success: function (resp) {
            if (resp.success) {
                $('.box-menu[data-id=' + idx + ']').remove();
                reindex();
            } else
                toastr.warning(rst.data.msg);
        },
        error: function () {
            toastr.warning("Error");
        }
    })
});

$('.add-menu-entry-btn').click(function () {
    let elem = {
        title: $('#name'),
        url: $('#url'),
        new_tab: $('#newTab')
    };
    let value = {
        title: elem.title.val(),
        url: elem.url.val(),
        new_tab: elem.new_tab.is(':checked')
    };

    let key = Object.keys(value);
    let error = false;
    for (let i = 0; key[i]; i++) {
        if (typeof value[[key[i]]] === "string")
            if (value[key[i]].length < 3) {
                error = true;
                elem[key[i]].addClass('is-danger');
            } else
                elem[key[i]].removeClass('is-danger');
    }
    if (error)
        return;
    $.ajax({
        url: '/api/config/menu',
        method: 'POST',
        data: value,
        success: function (resp) {
            if (resp.success) {
                $('.modal').removeClass('is-active');
                location.reload();
            } else
                toastr.warning(rst.data.msg);
        },
        error: function () {
            toastr.warning("Error");
        }
    });
});