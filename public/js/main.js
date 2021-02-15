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
var nbCard         = 24;
var typeGame       = 'letter';
var theme          = ['nemo', 'nene', 'peppa', 'paw-patrol', 'raiponce', 'george'];
var oldTheme       = 'nemo';
var forWin         = 0;
var score          = 100;
var scoreInterval  = null;
var version        = '0.3 Alpha';
var nbCoups        = 0;

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
            var cardId = $(this).attr('id');
            $('#' + cardId).css('left', '4px');
            if($('#' + cardId).hasClass('flipped')) {
                return false;
            }
            if(cardId != cardId1) {
                playSoundClic();
                $(this).addClass('flipped');
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
                    $('#' + cardId1).addClass('card-win');
                    $('#' + cardId2).addClass('card-win');
                    forWin++;
                    if(forWin == nbCard / 2) {
                        winGame();
                    } else {
                        playSound2Card();
                    }
                }
            }
        } else {
            if(cardValue1 != cardValue2) {
                $('#' + cardId1).css('left', '0');
                $('#' + cardId2).css('left', '0');
                $('#' + cardId1).removeClass('flipped');
                $('#' + cardId2).removeClass('flipped');
            } else {
                // forWin++;
            }
            cardValue1 = '';
            cardValue2 = '';
            cardId1 = '';
            cardId2 = '';
            nbCoups++;
            $('#score-game span.coup').html(nbCoups);
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
    $('.card').removeClass('card-win');
    $('#win-game').removeClass('open');
    $('.view-score').html('99');
    $('#score-game span.coup').html('0');
    clearInterval(scoreInterval);

    cardValue1 = '';
    cardValue2 = '';
    cards      = [];
    score      = 0;
    forWin     = 0;
    nbCoups    = 0;

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
        score = score + 1;
        minutes = Math.floor(score / 60);
        secondes = score % 60;
        $('#score-game span.time').html(minutes + '<small>mn</small>&nbsp' + secondes + '<small>s</small>');
    }, 1000);
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
    minutes = Math.floor(score / 60);
    secondes = score % 60;
    $('#view-score-time').html(minutes + '<small>mn</small>&nbsp' + secondes + '<small>s</small>');
    $('#view-score-coups').html(nbCoups + ' Coups');
    $('#win-game').addClass('open');
    playSoundWin();
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

function playSound2Card() {
    $('#win-2card')[0].play();
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
