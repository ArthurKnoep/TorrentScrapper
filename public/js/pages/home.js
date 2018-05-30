function setTableHeader(header) {
    let $tr = $("thead tr");
    $tr.empty();
    for (let i = 0; header[i]; i++) {
        $tr.append($('<th></th>').text(header[i]));
    }
}

let categorie = -1;

function addSeedPeers(elem, $dom) {
    $dom.append($('<td></td>')
        .append($('<span></span>').addClass('seed').text(elem.seeds))
        .append(" / ")
        .append($('<span></span>').addClass('peer').text(elem.peers)));
}

function addMovie(elem, $dom) {
    $dom.append($('<td></td>').text(elem.name));
    $dom.append($('<td></td>').text(elem.size));
    $dom.append($('<td></td>').text(elem.quality));
    $dom.append($('<td></td>').text(elem.language));
    addSeedPeers(elem, $dom);
}

function addSerie(elem, $dom) {
    $dom.append($('<td></td>').text(elem.name));
    $dom.append($('<td></td>').text(elem.size));
    $dom.append($('<td></td>').text(elem.quality));
    $dom.append($('<td></td>').text(elem.language));
    addSeedPeers(elem, $dom);
}

$('.search-tag').click(function() {
    const socket = io('http://localhost:8086');
    let error = false;
    let nb_rst = 0;

    if ($('#search').val().length == 0) {
        error = true;
        $('#search').addClass('is-danger');
    } else {
        $('#search').removeClass('is-danger');
    }

    if (error) {
        return;
    }
    $('#search').parent().addClass('is-loading').find('.icon').hide();
    let cookies = {};
    let c = document.cookie.split("; ");
    for (let i = 0; c[i]; i++) {
        let idx = c[i].indexOf('=');
        cookies[c[i].substr(0, idx)] = c[i].substr(idx + 1);
    }
    categorie = parseInt($(this).attr("data-value"));
    socket.emit('search', {
        session1: cookies["session"],
        session2: cookies["session.sig"],
        categorie: categorie,
        query: $('#search').val()
    });

    let data_incom = 0;
    socket.on('resp', function(data) {
        console.log(data);
        if (data.code != "OK") {
            toastr.warning(data.msg);
            $('#search').parent().removeClass('is-loading').find('.icon').show();
            return;
        }
        if (data.code == 'OK' && typeof data.sourceIncomming !== "undefined") {
            nb_rst = data.sourceIncomming.length;
            setTableHeader(data.head);
        } else {
            let $table = $('.table tbody');
            for (let i = 0; data.data[i]; i++) {
                let elem = data.data[i];
                let $tr = $('<tr></tr>');
                switch (categorie) {
                    case 0:
                        addMovie(elem, $tr);
                        break;
                    case 1:
                        addSerie(elem, $tr);
                        break;
                }
                $table.append($tr);
                // console.log(Object.keys(elem));
            }

            //Animate open
            $('.columns-rst').animate({height: $('.table').height()}, 200, function() {
                $('.table').fadeIn(350);
                $('.columns-rst').css('height', '');
            });
            data_incom += 1;
        }
        if (data_incom  == nb_rst || nb_rst == 0) {
            // socket.disconnect();
            $('#search').parent().removeClass('is-loading').find('.icon').show();
        }
    });
});