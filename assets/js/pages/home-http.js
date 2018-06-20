function setTableHeader(header) {
    let $tr = $("thead tr");
    $tr.empty();
    $tr.append($('<th></th>').text(""));
    for (let i = 0; header[i]; i++) {
        $tr.append($('<th></th>').text(header[i]));
    }
}

function addDLButton($dom) {
    $dom.append($('<td></td>').addClass('btn-dl')
        .append(
            $('<a></a>').addClass('button is-link')
                .append($('<span></span>').addClass('icon is-small')
                    .append($('<i></i>').addClass('fas fa-arrow-down')))));
}

function addSeedPeers(elem, $dom) {
    $dom.append($('<td></td>')
        .append($('<span></span>').addClass('seed').text(elem.seeds))
        .append(" / ")
        .append($('<span></span>').addClass('peer').text(elem.peers)));
}

function addIcon($dom, icon) {
    if (icon === "#") {
        $dom.append($('<td></td>').text(""));
    } else {
        $dom.append($('<td></td>').append($("<img>").attr('src', icon).css('height', '20px')));
    }
}

function addMovie(elem, $dom, icon) {
    addIcon($dom, icon);
    $dom.append($('<td></td>').append($('<a>').attr('href', elem.path).attr('target', '_blank').text(elem.name)));
    $dom.append($('<td></td>').text(elem.size));
    $dom.append($('<td></td>').text(elem.quality));
    $dom.append($('<td></td>').text(elem.language));
    addSeedPeers(elem, $dom);
    addDLButton($dom);
}

function addSerie(elem, $dom, icon) {
    addIcon($dom, icon);
    $dom.append($('<td></td>').append($('<a>').attr('href', elem.path).attr('target', '_blank').text(elem.name)));
    $dom.append($('<td></td>').text(elem.size));
    $dom.append($('<td></td>').text(elem.quality));
    $dom.append($('<td></td>').text(elem.language));
    addSeedPeers(elem, $dom);
}

function addAnime(elem, $dom, icon) {
    addIcon($dom, icon);
    $dom.append($('<td></td>').append($('<a>').attr('href', elem.path).attr('target', '_blank').text(elem.name)));
    $dom.append($('<td></td>').text(elem.size));
    $dom.append($('<td></td>').text(elem.quality));
    $dom.append($('<td></td>').text(elem.language));
    addSeedPeers(elem, $dom);
}

function addMusic(elem, $dom, icon) {
    addIcon($dom, icon);
    $dom.append($('<td></td>').append($('<a>').attr('href', elem.path).attr('target', '_blank').text(elem.name)));
    $dom.append($('<td></td>').text(elem.size));
    addSeedPeers(elem, $dom);
}

function addEBook(elem, $dom, icon) {
    addIcon($dom, icon);
    $dom.append($('<td></td>').append($('<a>').attr('href', elem.path).attr('target', '_blank').text(elem.name)));
    $dom.append($('<td></td>').text(elem.size));
    addSeedPeers(elem, $dom);
}

function incProviderFinish() {
    nbProvider += 1;
    if (nbProvider === nbProviderTot)
        $('#search').parent().removeClass('is-loading').find('.icon').show();
}

let categorie = -1;
let nbProviderTot = 0;
let nbProvider = 0;

function launchAllQuery(query, categorie, provider) {
    nbProviderTot = provider.length;
    nbProvider = 0;
    provider.forEach(function (elem) {
        $.ajax({
            url: "/api/search/provider/" + elem,
            method: "GET",
            data: {
                query: query,
                categorie: categorie
            },
            success: function (rst) {
                incProviderFinish();
                if (rst.success) {
                    let $table = $('.table tbody');
                    for (let i = 0; rst.data.data[i]; i++) {
                        let elem = rst.data.data[i];
                        let $tr = $('<tr></tr>');
                        switch (categorie) {
                            case 0:
                                addMovie(elem, $tr, rst.data.icon);
                                break;
                            case 1:
                                addSerie(elem, $tr, rst.data.icon);
                                break;
                            case 2:
                                addAnime(elem, $tr, rst.data.icon);
                                break;
                            case 3:
                                addMusic(elem, $tr, rst.data.icon);
                                break;
                            case 4:
                                addEBook(elem, $tr, rst.data.icon);
                                break;
                        }
                        $table.append($tr);
                    }
                    $('.columns-rst').animate({height: $('.table').height()}, 200, function() {
                        $('.table').fadeIn(350);
                        $('.columns-rst').css('height', '');
                    });
                }
                console.log(rst);
            },
            error: function() {
                incProviderFinish();
                toastr.warning('Error');
            }
        });
        console.log(elem);
    });
}

function launchQuery(query, categorie) {
    $.ajax({
        url: '/api/search/providers',
        method: 'GET',
        data: {
            categorie: categorie
        },
        success: function(rst) {
            console.log(rst, rst.success);
            if (rst.success) {
                setTableHeader(rst.data.head);
                launchAllQuery(query, categorie, rst.data.providers.provider);
            } else {
                toastr.warning(rst.data.msg);
                $('#search').addClass('is-danger');
                $search.parent().removeClass('is-loading').find('.icon').show();
            }
        },
        error: function () {
            $('#search').addClass('is-danger');
            toastr.warning("Error");
            console.error('nope');
        }
    });
}

$('.search-tag').click(async function() {
    let $search = $('#search');
    let query = $search.val();

    if (query.length === 0) {
        $('#search').addClass('is-danger');
        $search.parent().removeClass('is-loading').find('.icon').show();
        return;
    }
    $search.removeClass('is-danger');
    $search.parent().addClass('is-loading').find('.icon').hide();
    categorie = parseInt($(this).attr("data-value"));
    
    if ($('.table tbody').childElementCount !== 0)
        $('.columns-rst').animate({height: 0}, 350, function () {
            $('.table tbody').empty();
            launchQuery(query, categorie);
        });
    else
        launchQuery(query, categorie);
});