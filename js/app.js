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
let numOfMoves = 0;
const MAX_MOVES_FOR_3_STARS = 10;
const MAX_MOVES_FOR_2_STARS = 15;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - add each card's HTML to the page
 */
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


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
let openedCard = null;

$('.card').click(function() {
  let selectedCard = $(this);

  // Disable any matched cards from being clicked
  if (!selectedCard.hasClass('open')) {
    selectedCard.toggleClass('open show');

    if (openedCard === null) {
      openedCard = selectedCard;
    }
    else {
      checkForMatch(selectedCard);
      iterateNumOfMoves();
      openedCard = null;
    }
  }
});

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
    $(".card").css("pointer-events", "none");
    setTimeout(function() {
      card2.toggleClass('open show');
      card.toggleClass('open show');

      $(".card").css("pointer-events", "auto");
    }, 750);
  }
}

function checkForWin() {
  if (matchedCards.length === cards.length) {
    $('.modal').css('display', 'flex');

    $('.modal-moves').text(numOfMoves);
    let stars = $('.modal').find('.stars').children();

    if (numOfMoves > MAX_MOVES_FOR_3_STARS) {
      $(stars[2]).css("display", "none");
    }
    if (numOfMoves > MAX_MOVES_FOR_2_STARS) {
      $(stars[1]).css("display", "none");
    }
  }
}

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
