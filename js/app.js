/*
 * Create a list that holds all of your cards
 */
const cards = [
  '<i class="fa fa-diamond"></i>',
  '<i class="fa fa-paper-plane-o"></i>',
  '<i class="fa fa-anchor"></i>',
  '<i class="fa fa-bolt"></i>',
  '<i class="fa fa-cube"></i>',
  '<i class="fa fa-anchor"></i>',
  '<i class="fa fa-leaf"></i>',
  '<i class="fa fa-bicycle"></i>',
  '<i class="fa fa-diamond"></i>',
  '<i class="fa fa-bomb"></i>',
  '<i class="fa fa-leaf"></i>',
  '<i class="fa fa-bomb"></i>',
  '<i class="fa fa-bolt"></i>',
  '<i class="fa fa-bicycle"></i>',
  '<i class="fa fa-paper-plane-o"></i>',
  '<i class="fa fa-cube"></i>'
];
const matchedCards = [];
const deck = $('.deck');
const MAX_MOVES_FOR_3_STARS = 14;
const MAX_MOVES_FOR_2_STARS = 19;

let numOfMoves = 0;
let gameStarted = false;
let seconds = 0;
let minutes = 0;
let t;

let openedCard = null;

// Display the cards on the page
function displayCards() {
  let shuffledCards = shuffle(cards);

  for (let i=0; i < shuffledCards.length; i++) {
    let card = $('<li class="card"></li>');
    let icon = shuffledCards[i];

    card.append(icon);
    deck.append(card);
  }
}

// Shuffle and display cards when the page loads
displayCards();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Carry out actions on card click
function onCardSelected(card) {

  // Start the timer if the game has just started
  if (!gameStarted) {
    timer();
    gameStarted = true;
  }

  let selectedCard = card;

  // Disable any matched cards from being clicked
  if (!selectedCard.hasClass('open')) {
    selectedCard.toggleClass('open show');

    if (openedCard === null) {
      openedCard = selectedCard;
    }
    else {
      iterateNumOfMoves();
      checkForMatch(selectedCard);
      openedCard = null;
    }
  }
}

$('.deck').on('click', '.card', function() {
  onCardSelected($(this));
});

// Start a timer once the first card is selected
function timer() {
  t = setTimeout(function() {

    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }

    let secsDisplay = (seconds > 9) ? seconds : '0' + seconds;
    let minsDisplay = (minutes > 9) ? minutes : '0' + minutes;

    $('.timer').text(minsDisplay + ":" + secsDisplay);

    timer();
  }, 1000);
}

// Check if two cards match
function checkForMatch(card) {
  let card2 = openedCard;
  let symbol1 = card2.find('i').attr('class').split(' ')[1];
  let symbol2 = card.find('i').attr('class').split(' ')[1];

  if (symbol1 === symbol2) {
    card2.toggleClass('match');
    card.toggleClass('match');

    matchedCards.push(card, card2);
    checkForWin();
  }
  else {
    // Temporarily disable clicks to avoid multiple checks
    $(".card").css("pointer-events", "none");

    card2.toggleClass('incorrect');
    card.toggleClass('incorrect');

    setTimeout(function() {
      card2.toggleClass('open show incorrect');
      card.toggleClass('open show incorrect');

      $(".card").css("pointer-events", "auto");
    }, 750);
  }
}

// Check if the user has won
function checkForWin() {
  if (matchedCards.length === cards.length) {
    clearTimeout(t);
    $('.modal').css('display', 'flex');

    $('.modal-moves').text(numOfMoves);

    let secsDisplay = (seconds > 9) ? seconds : '0' + seconds;
    let minsDisplay = (minutes > 9) ? minutes : '0' + minutes;
    $('.modal-time').text(minsDisplay + ":" + secsDisplay);

    let stars = $('.modal').find('.stars').children();

    if (numOfMoves > MAX_MOVES_FOR_3_STARS) {
      $(stars[2]).css("display", "none");
    }
    if (numOfMoves > MAX_MOVES_FOR_2_STARS) {
      $(stars[1]).css("display", "none");
    }
  }
}

// Iterate the move counter on each card clicked
function iterateNumOfMoves() {
  numOfMoves++;
  $('.moves').text(numOfMoves);

  let stars = $('.stars').children();

  if (numOfMoves > MAX_MOVES_FOR_3_STARS && numOfMoves <= MAX_MOVES_FOR_2_STARS) {
    $(stars[2]).css("visibility", "hidden");
  }
  else if (numOfMoves > MAX_MOVES_FOR_2_STARS) {
    $(stars[1]).css("visibility", "hidden");
  }
}

// Restart the game
function restartGame() {

  // Hide modal, in case it's showing
  $('.modal').css('display', 'none');

  gameStarted = false;

  // Reset the star ratings and its display
  let stars = $('.stars').children();
  $(stars[2]).css("visibility", "visible");
  $(stars[1]).css("visibility", "visible");

  // Reset the moves counter and its display
  numOfMoves = 0;
  $('.moves').text(numOfMoves);

  // Reset the time and its display
  clearTimeout(t);
  seconds = 0;
  minutes = 0;
  $('.timer').text("00:00");

  // Remove all the current cards
  matchedCards.length = 0;
  openedCard = null;
  $('.card').remove();

  displayCards();
}

$('.play-again-btn').click(function() {
  restartGame();
});

$('.restart').click(function() {
  restartGame();
});
