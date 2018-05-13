let $btn = $(".control > .button");
$btn.click(function() {
    let data = {};
    let $select = $(".provider");
    for (let i = 0; $select[i]; i++)
        data[$($select[i]).attr("data-name")] = {checked: $($select[i]).is(":checked"), file: $($select[i]).attr("data-file")};
    console.log(data);
    $.ajax('/api/setup/3', {
        method: 'POST',
        data: {data: JSON.stringify(data)},
        success: function(data) {
            console.log(data);
            if (data.success)
                window.location.href = "/setup/4";
            else
                alert("Erreur");
        },
        error: function() {
            alert("Erreur");
        }
    });
});

$logBtn = $('.need-logged');
$logBtn.click(function() {
    console.log($(this).is(':checked'));
})