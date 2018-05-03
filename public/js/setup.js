$('[data-target]').click(function() {
    $('#' + $(this).attr("data-target")).toggleClass('is-active');
});