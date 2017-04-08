/**
 * ClaraMemory
 *
 * @category    games
 * @package     clara memory
 * @author      DESSI Alain <contact@alain-dessi.com>
 * @copyright   2017 Dessi Alain
 * @link        http://www.alain-dessi.com
 */


var $cardContainer = $('#game');
var cards          = new Array();
var cardValue1     = '';
var cardValue2     = '';
var cardId1        = '';
var cardId2        = '';
var nbCard         = 10;
var typeGame       = 'letter';
var theme          = ['nemo', 'nene', 'peppa', 'paw-patrol', 'raiponce', 'george'];
var oldTheme       = 'nemo';

initGame();

// button reset
$('#reset').click(function(){
    initGame();
});


$('.card').click(function() {
    if(cardValue1 == '' || cardValue2 == '') {
        $(this).addClass('flipped');
        var cardId = $(this).attr('id');
        var cardValue = $('#' + cardId + ' figure.back').html();

        if(cardValue1 == '') {
            cardValue1 = cardValue;
            cardId1 = cardId;
        } else {
            cardValue2 = cardValue;
            cardId2 = cardId;
        }

        if(cardValue1 == cardValue2) {
            cardValue1 = '';
            cardValue2 = '';
        }

    } else {
        if(cardValue1 != cardValue2) {
            $('#' + cardId1).removeClass('flipped');
            $('#' + cardId2).removeClass('flipped');
        } else {
            // nothing
        }
        cardValue1 = '';
        cardValue2 = '';
    }
})

/**
 * Shuffle Function
 * @param {[type]} o [description]
 */
function Shuffle(o) {
   for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
   return o;
};

/**
 * Initialisation du jeu
 * @return {[type]} [description]
 */
function initGame()
{
    $('.card').removeClass('flipped');

    cardValue1 = '';
    cardValue2 = '';

    cards = [];

    var count = 0;

    while(count <= (nbCard / 2) - 1) {

        chrNumber = Math.floor((Math.random() * 25) + 66);
        chrString = String.fromCharCode(chrNumber);

        if(cards.indexOf(chrString) === -1) {
            cards[count] = chrString;
            count++;
        } else {
            console.log(chrString + ' : existe déjà');
        }
    }

    $.each(cards, function(key, value){
        cards.push(value);
    });

    Shuffle(cards);

    addCards();
}

function addCards()
{
    var theme = getTheme();

    if($('.card').length == 0) {
        $.each(cards, function(key, cardValue){
            var divCard = '<div class="card-container">';
            divCard += '<div id="' + key + '" class="card">';
            divCard += '<figure class="front ' + theme + '"></figure>';
            divCard += '<figure class="back">' + cardValue + '</figure>';
            divCard += '</div></div>';
            $cardContainer.prepend(divCard);
        });
        oldTheme = theme;
    } else {
        $.each(cards, function(key, cardValue) {
            $(".card figure.front").removeClass(oldTheme);
            $(".card figure.front").addClass(theme);
            setTimeout(function(){
                $('#' + key + ' .back').html(cardValue);
            }, 1000);
            oldTheme = theme;
        });
    }
}

function getTheme() {

    var nbTheme  = theme.length;
    var newTheme = oldTheme;

    while(oldTheme == newTheme) {
        newTheme = theme[Math.floor((Math.random() * nbTheme))];
    }

    return newTheme;
}
