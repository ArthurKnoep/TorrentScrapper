$('.search-tag').click(function() {
    let error = false;

    if ($('#search').val().length == 0) {
        error = true;
        $('#search').addClass('is-danger');
    } else {
        $('#search').removeClass('is-danger');
    }

    if (error) {
        return;
    }
    const socket = io('http://localhost:8086');
    let cookies = {};
    let c = document.cookie.split("; ");
    for (let i = 0; c[i]; i++) {
        let idx = c[i].indexOf('=');
        cookies[c[i].substr(0, idx)] = c[i].substr(idx + 1);
    }
    socket.emit('search', {
        session1: cookies["session"],
        session2: cookies["session.sig"],
        categorie: parseInt($(this).attr("data-value")),
        query: $('#search').val()
    });

    socket.on('resp', function(data) {
        console.log(data);
    })
});