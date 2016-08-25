/**
 * Created by Aaron C. Schafer on 8/11/2016.
 */
var TicTacToe = (function(){
    var _game = {
        // variables
        scoring: {
            x: 0,
            y: 0,
            draws: 0
        },
        moves: 0,
        total: 0,
        turnX: true,
        boardSize: 3,
        draw: "draw",
        playersName1: "Player 1",
        playersName2: "Player 2",

        // functions
        resetBoard: function() {
            // hide if displaying
            $(".css-game-result-display").hide();

            // start moves over
            _game.moves = 0;

            // fill each square of board with a space character to get size of board
            $("td.css-font").html("&nbsp;");

            // clean up array board
            if (_game.board) { delete _game.board; }

            // create array board
            _game.board = [];

            var row;

            for (var i = 0; i < _game.boardSize; i += 1) {
                row = [];
                for (var j = 0; j < _game.boardSize; j += 1) {
                    // push a falsey string value
                    row.push("");
                }
                _game.board.push(row);
            }

            // clean up previous DOM board
            $("table tr").remove();

            // create DOM board
            _game.createBoard(_game.boardSize);

            // update user turn
            $(".js-turn").text(_game.turnX ? _game.playersName1 : _game.playersName2);
        },
        resetScores: function() {
            _game.scoring.x = 0;
            _game.scoring.y = 0;
            _game.scoring.draws = 0;
            _game.moves = 0;
            _game.total = 0;
            _game.turnX = true;
            _game.updateScores();
        },
        createBoard: function(boardSize) {
            var htmlBoard = "",
                dataNumber = 0,
                classes = "";

            for (var row = 0; row < boardSize; row += 1) {
                htmlBoard = htmlBoard.concat("<tr>");
                for(var col = 0; col < boardSize; col += 1) {
                    classes = "";
                    if (col !== 0 && col !== boardSize - 1){
                        classes = "css-left-right";
                    }
                    if (col !== 0 && col !== boardSize - 1 && row !== 0 && row !== boardSize - 1) {
                        classes = "css-left-right css-top-bottom";
                    } else if (row !== 0 && row !== boardSize - 1) {
                        classes = "css-top-bottom";
                    }
                    htmlBoard = htmlBoard.concat("<td class='css-font " + classes + "' data-number='" + dataNumber + "'></td>");
                    dataNumber += 1;
                }
                htmlBoard = htmlBoard.concat("</tr>");
            }

            var cssMarginAuto = $(".css-margin-auto"),
                cssTable = $(".css-table");

            cssMarginAuto.css("width","");
            cssTable.append(htmlBoard);
            cssMarginAuto.width(cssTable.width());

            $(".css-font").on("click", function(){
                var value = $(this).text().trim(),
                    boxNumber = parseInt($(this).attr("data-number"), 10),
                    winner;

                if (value) {
                    return;
                }

                if (_game.turnX) {
                    $(this).text("X");
                    _game.updateBoardArray(boxNumber, "X");
                } else {
                    $(this).text("O");
                    _game.updateBoardArray(boxNumber, "O");
                }

                winner = _game.checkForWinner();

                if (!winner) {
                    _game.changeTurn();
                    return;
                }

                _game.declareResult(winner);
                _game.total += 1;
                _game.updateScores();
            });
        },
        showWin: function(num, type){
            var i;
            switch(type) {
                case "row":
                    for (i = 0; i < _game.boardSize; i++) {
                        $("[data-number='" + (((num + 1) * _game.boardSize) - (i + 1)) + "'].css-font").css("background-color", "#c3ffc3");
                    }
                    break;
                case "col":
                    for (i = 0; i < _game.boardSize; i++) {
                        $("[data-number='" + (num + (_game.boardSize * i)) + "'].css-font").css("background-color", "#c3ffc3");
                    }
                    break;
                case "ang1":
                    for (i = 0; i < _game.boardSize; i++) {
                        $("[data-number='" + (i + (i * _game.boardSize)) + "'].css-font").css("background-color", "#c3ffc3");
                    }
                    break;
                case "ang2":
                    for (i = 0; i < _game.boardSize; i++) {
                        $("[data-number='" + (-(i + 1) + ((i + 1) * _game.boardSize)) + "'].css-font").css("background-color", "#c3ffc3");
                    }
                    break;
                default:
                    $(".css-font").css("background-color","#ffeed2");
            }
        },
        changeTurn: function() {
            _game.turnX = !_game.turnX;
            $(".css-turn").text(_game.turnX ? _game.playersName1 : _game.playersName2);
        },
        updateBoardArray: function(number, letter) {
            var totalBoxes = _game.boardSize * _game.boardSize;

            if (number < 0 || number > (totalBoxes - 1) || (letter !== "X" && letter !== "O")) {
                return;
            }

            var row = 0;

            // console.log("---");
            for (var i = _game.boardSize; i <= totalBoxes; i += _game.boardSize) {
                if (number < i) {
                    _game.board[row][number - (i - _game.boardSize)] = letter;
                    break;
                }
                row++;
            }

            // keep track of number of moves made
            _game.moves += 1;
        },
        updateScores: function() {
            $(".js-x-wins").text(_game.scoring.x);
            $(".js-y-wins").text(_game.scoring.y);
            $(".js-draws").text(_game.scoring.draws);
            $(".js-total-games").text(_game.total);
        },
        checkAnswer: function(answer) {
            var xWinnerAnswer = new Array(_game.boardSize + 1).join("X"),
                yWinnerAnswer = new Array(_game.boardSize + 1).join("O");

            if (answer === xWinnerAnswer) {
                return _game.playersName1;
            } else if (answer === yWinnerAnswer){
                return _game.playersName2;
            }

            return "";
        },
        checkForWinner: function() {
            var rowAnswer,
                columnAnswer,
                angleAnswer1,
                angleAnswer2,
                winner,
                row,
                col,
                col1,
                col2;

            // check for any winners via row
            for(row = 0; row < _game.boardSize; row += 1) {
                rowAnswer = _game.board[row].join("");

                if (rowAnswer.length === _game.boardSize) {
                    winner = _game.checkAnswer(rowAnswer);
                    if (winner) {
                        _game.showWin(row, "row");
                        return winner;
                    }
                }
            }

            // check for any winners via columns
            for(col = 0; col < _game.boardSize; col += 1) {
                columnAnswer = "";
                for(row = 0; row < _game.boardSize; row += 1) {
                    columnAnswer = columnAnswer.concat(_game.board[row][col]);
                }

                winner = _game.checkAnswer(columnAnswer);
                if (winner) {
                    _game.showWin(col, "col");
                    return winner;
                }
            }

            // check for any winners via angles
            angleAnswer1 = "";
            angleAnswer2 = "";
            for(row = 0, col1 = 0, col2 = _game.boardSize - 1; row < _game.boardSize; row += 1, col1 += 1, col2 -= 1) {
                angleAnswer1 = angleAnswer1.concat(_game.board[row][col1]);
                angleAnswer2 = angleAnswer2.concat(_game.board[row][col2]);
            }

            winner = _game.checkAnswer(angleAnswer1);
            if (winner) {
                _game.showWin(null, "ang1");
                return winner;
            }

            winner = _game.checkAnswer(angleAnswer2);
            if (winner) {
                _game.showWin(null, "ang2");
                return winner;
            }

            // check for draw
            if (_game.moves === _game.boardSize * _game.boardSize) {
                _game.showWin();
                return _game.draw;
            }

            return "";
        },
        declareResult: function(winner) {
            var message = "DRAW!";
            if (winner === _game.playersName1) {
                message = _game.playersName1 + " Wins!";
                _game.scoring.x += 1;
                _game.turnX = true;
            } else if (winner === _game.playersName2) {
                message = _game.playersName2 + " Wins!";
                _game.scoring.y += 1;
                _game.turnX = false;
            } else {
                _game.scoring.draws += 1;
                _game.turnX = true;
            }
            $(".js-win-title").text(message);
            $(".css-game-result-display").show();
        },
        changeBoardSize: function(size) {
            if (size >= 3 && size <= 5) {
                _game.boardSize = size;
                _game.resetBoard();
            }
        }
    };

    var _init = {
        initGame: function(){
            _game.resetScores();
            _game.resetBoard();
        }
    };

    return {
        init: {
            initGame: function() {
                _init.initGame();
            }
        },
        game: {
            changeBoardSize: function(size) {
                _game.changeBoardSize(size);
            },
            playAgain: function(){
                _game.resetBoard();
            }
        }
    }
})();

$(document).ready(function(){
    TicTacToe.init.initGame();

    $(".js-reset-game").on("click", function(){
        TicTacToe.init.initGame();
    });

    $(".js-play-again").on("click", function(){
        TicTacToe.game.playAgain();
    });

    $("div.modal-footer .js-save-board-size").on("click", function(){
        var saveBoardSizeModalId = $("#saveBoardSizeModal");
        var size = parseInt(saveBoardSizeModalId.modal().find(".js-board-size-input").val(), 10);

        TicTacToe.game.changeBoardSize(size);

        saveBoardSizeModalId.modal("hide");
    });

    $("div.modal-body .js-board-size-input").on("keydown", function(){
        // Allow: backspace, delete, tab, escape, enter
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (event.keyCode >= 51 && event.keyCode <= 53)) {
            // let it happen, don't do anything
            return;
        }

        if (event.keyCode < 51 || event.keyCode > 53) {
            event.preventDefault();
        }
    });
});