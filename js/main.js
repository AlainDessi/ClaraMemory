/**
 * ClaraMemory
 *
 * @category    games
 * @package     clara memory
 * @author      DESSI Alain <contact@alain-dessi.com>
 * @copyright   2017 Dessi Alain
 * @link        http://www.alain-dessi.com
 */


var $cardContainer = $('#memory-game');
var cards          = new Array();
var cardValue1     = '';
var cardValue2     = '';
var cardId1        = '';
var cardId2        = '';
var nbCard         = 10;
var typeGame       = 'letter';
var theme          = ['nemo', 'nene', 'peppa', 'paw-patrol', 'raiponce', 'george'];
var oldTheme       = 'nemo';
var forWin         = 0;
var score          = 100;
var scoreInterval  = null;
var version        = '0.1 Alpha';

$(document).ready(function(){

    // initialisation du jeu
    initGame();

    // click Button
    $('#reset').click(function(){
        playSoundClic();
        initGame();
    });

    // click Button
    $('#restart').click(function(){
        playSoundClic();
        initGame();
    });

    // click Button
    $('.card').click(function() {
        if(cardValue1 == '' || cardValue2 == '') {
            playSoundClic();

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
                forWin++;
                if(forWin == nbCard / 2) {
                    winGame();
                }
            }

        } else {
            if(cardValue1 != cardValue2) {
                $('#' + cardId1).removeClass('flipped');
                $('#' + cardId2).removeClass('flipped');
            } else {
                // forWin++;
            }
            cardValue1 = '';
            cardValue2 = '';
        }
    })

});


/**
 * Shuffle Function
 * @param {[type]} o [description]
 */
function Shuffle(arrayToShuffle) {
   for(var j, x, i = arrayToShuffle.length; i; j = parseInt(Math.random() * i), x = arrayToShuffle[--i], arrayToShuffle[i] = arrayToShuffle[j], arrayToShuffle[j] = x);
   return arrayToShuffle;
};

/**
 * Initialisation du jeu
 * @return {[type]} [description]
 */
function initGame()
{
    $('#version').html('Version ' + version);
    $('.card').removeClass('flipped');
    $('#win-game').removeClass('open');
    $('.view-score').html('99');
    clearInterval(scoreInterval);

    cardValue1 = '';
    cardValue2 = '';
    cards      = [];
    score      = 100;
    forWin     = 0

    var count = 0;
    while(count <= (nbCard / 2) - 1) {

        chrNumber = Math.floor((Math.random() * 25) + 66);
        chrString = String.fromCharCode(chrNumber);

        if(cards.indexOf(chrString) === -1) {
            cards[count] = chrString;
            count++;
        } else {
            // nothing
        }
    }

    $.each(cards, function(key, value){
        cards.push(value);
    });

    Shuffle(cards);
    addCards();

    // score interval
    scoreInterval = setInterval(function(){
        score = score - 1;
        $('#score-game span').html(score);
    }, 2000);
}

// Affiche les cartes sur l'écran
function addCards()
{
    var theme = getTheme();

    $('#memory-game').removeClass(oldTheme);
    $('#memory-game').addClass(theme);

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

/**
 * When win game
 * @return void()
 */
function winGame() {
    clearInterval(scoreInterval);
    playSoundWin();
    $('.view-score').html(score);
    $('#win-game').addClass('open');
}

/**
 * Play sound clic mouse
 * @return void
 */
function playSoundClic() {
    $('#clic-sound')[0].play();
}

function playSoundWin() {
    $('#win-sound')[0].play();
}

/**
 * Retourne le nom du theme à utiliser
 * @return string
 */
function getTheme() {
    var nbTheme  = theme.length;
    var newTheme = oldTheme;
    while(oldTheme == newTheme) {
        newTheme = theme[Math.floor((Math.random() * nbTheme))];
    }
    return newTheme;
}
