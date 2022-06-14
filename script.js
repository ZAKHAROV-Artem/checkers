// Інформація для гри
const horisontal = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], // слева на право
    vertical = ['1', '2', '3', '4', '5', '6', '7', '8'], // снизу в верх
    figures = {
        'white': ['a1', 'a3', 'b2', 'c1', 'c3', 'd2', 'e1', 'e3', 'f2', 'g1', 'g3', 'h2'],
        'black': ['a7', 'b6', 'b8', 'c7', 'd6', 'd8', 'e7', 'f6', 'f8', 'g7', 'h6', 'h8'],
    };
const board_el = document.getElementById('board');
const white_score_el = document.querySelector('.white_score');
const black_score_el = document.querySelector('.black_score');
const turn_el = document.querySelector('.turn');

let is_game_started = false;
let white_score = 12;
let black_score = 12;
let turn = true // True = whtie turn else black

const changeTurn = () => {
    if (turn) {
        turn = false;
        turn_el.innerHTML = 'black';
    } else {
        turn = true;
        turn_el.innerHTML = 'white';
    }
}
const getAllCheckers = () => document.querySelectorAll('.checker');


// Клас для малювання дошки
class Board {
    constructor(options) {
        this.board = options.board;
    }
    drawBoard() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let cell = document.createElement("div");

                if ((i + j) % 2 == 0) {
                    cell.className = 'white cell';
                } else {
                    cell.className = 'black cell';
                }

                cell.setAttribute('id', `${horisontal[j]}${vertical[7-i]}`);
                if (i === 7) {
                    cell.innerHTML += `<span class='symbol letter'>${horisontal[j]}</span>`;
                }
                if (j === 0) {
                    cell.innerHTML += `<span class='symbol number'>${vertical[7-i]}</span>`;
                }

                this.board.appendChild(cell);
            }
        }
    }
}
// Клас для відображення фігур на дошці
class Figure {

    constructor(options) {
        this.color = options.color;
        this.figurePos = options.figurePos;
    }
    showOnBoard() {
        let checker = document.createElement('div');
        checker.className = `checker checker-${this.color} ${this.figurePos}`;
        document.getElementById(this.figurePos).appendChild(checker);
    }

}

class MakeMove {
    constructor() {
        this.white;
        this.black;
        this.cells;

        this.first;
        this.second;

    }
    start() {
        this.white = document.querySelectorAll('.checker.checker-white');
        this.black = document.querySelectorAll('.checker.checker-black');
        this.cells = document.querySelectorAll('.cell');
        this.setEventListenersForCheckers();

    }
    //Ставимо прослуховувачі кліку для шашок
    setEventListenersForCheckers() {
        if (turn) {
            for (let i of this.white) {
                i.addEventListener('click', () => {
                    this.setFirstPos(i);
                })
            }
        } else {
            for (let i of this.black) {
                i.addEventListener('click', () => {
                    this.setFirstPos(i);
                })
            }
        }
    }
    // Записуємо шашку яка ходить
    setFirstPos(el) {
        this.first = el.classList[2];
        this.clearEventListenersForCheckers();
    }
    //Чистимо прослуховувачі кліку для шашок
    clearEventListenersForCheckers() {
        if (turn) {
            for (let i of this.white) {
                let clone = i.cloneNode(true);
                i.parentNode.removeChild(i);
                document.getElementById(i.classList[2]).appendChild(clone);
            }
        } else {
            for (let i of this.black) {
                let clone = i.cloneNode(true);
                i.parentNode.removeChild(i);
                document.getElementById(i.classList[2]).appendChild(clone);
            }
        }
        this.setEventListenersForCells();
    }
    //Ставимо прослуховувачі кліку для клітинок
    setEventListenersForCells() {
        for (let i of this.cells) {
            if (!i.hasChildNodes() || !i.lastChild.classList.contains('checker')) {
                i.addEventListener('click', () => {
                    this.setSecondPosition(i);
                });
            }
        }
    }
    //Записуємо куди ходить шашка
    setSecondPosition(el) {
        this.second = el.id;
        this.clearEventListenersForCells();
    }
    //Чистимо прослуховувачі кліку для клітинок
    clearEventListenersForCells() {
        for (let i of this.cells) {
            if (!i.hasChildNodes() || !i.lastChild.classList.contains('checker')) {
                const parent = i.parentElement;
                const clone = i.cloneNode(true);
                const next_element = i.nextElementSibling;

                parent.removeChild(i);
                parent.insertBefore(clone, next_element);

            }
        }
        this.checkMoveParameters();

    }

    //Перевіряємо можливість ходу
    checkMoveParameters() {
        const move_to_cell = document.getElementById(this.second);
        const move_from_cell = document.getElementById(this.first);

        const is_move_able = this.isMoveAble(move_from_cell);

        if (is_move_able['can_move']) {
            this.makeMove(move_from_cell, move_to_cell, is_move_able['is_can_beat'], is_move_able['beated_element_id']);
            changeTurn();
        } else {
            alert('Invalid move')
        }
        console.log(`Moved from ${this.first} to ${this.second}`);
        this.start();
    }
    isMoveAble(mf) {
        const checker = mf.lastChild;
        if (checker.classList.contains('queen')) {

        } else {
            const h_cell_to_index = horisontal.indexOf(this.second[0]),
                v_cell_to_index = vertical.indexOf(this.second[1]),
                h_cell_from_index = horisontal.indexOf(this.first[0]),
                v_cell_from_index = vertical.indexOf(this.first[1]);

            const p_or_m = turn ? 1 : -1;

            const is_can_beat = this.isCanBeat(h_cell_from_index, v_cell_from_index,
                h_cell_to_index, v_cell_to_index, p_or_m);

            const probability_moves = [
                `${horisontal[h_cell_from_index + p_or_m]}${vertical[v_cell_from_index + p_or_m]}`,
                `${horisontal[h_cell_from_index - p_or_m]}${vertical[v_cell_from_index + p_or_m]}`,
            ]
            console.log(probability_moves)
            if (probability_moves[0] == this.second || probability_moves[1] == this.second) {
                return {
                    can_move: true,
                    is_can_beat: false
                };
            } else if (is_can_beat['res']) {
                return {
                    can_move: true,
                    is_can_beat: true,
                    beated_element_id: is_can_beat['beated_element_id']
                };
            } else {
                return {
                    can_move: false,
                    is_can_beat: false
                };
            }
        }
    }
    isCanBeat(h_c_f, v_c_f, h_c_t, v_c_t, p_or_m) {
        if (h_c_f + p_or_m * 2 == h_c_t && v_c_f + p_or_m * 2 == v_c_t) {
            return {
                res: true,
                beated_element_id: `${horisontal[h_c_f + p_or_m]}${vertical[v_c_f + p_or_m]}`
            };
        } else if (h_c_f - p_or_m * 2 == h_c_t && v_c_f + p_or_m * 2 == v_c_t) {
            return {
                res: true,
                beated_element_id: `${horisontal[h_c_f - p_or_m]}${vertical[v_c_f + p_or_m]}`
            };
        } else {
            return {
                res: false,
                beated_element_id: undefined
            };
        }
    }
    makeMove(mf, mt, can_beat, beated_element_id) {
        const checker = mf.lastChild;
        const checker_clone = checker.cloneNode(true);
        console.log(`Do you can beat - ${can_beat} \nBeated element - ${beated_element_id}`)
        if (can_beat) {
            const beated_cell = document.getElementById(beated_element_id);
            const beated_checker = beated_cell.lastChild;
            beated_cell.removeChild(beated_checker);
            this.updateScore();
        }
        checker_clone.classList.remove(this.first);
        checker_clone.classList.add(this.second);
        mt.appendChild(checker_clone);
        mf.removeChild(checker);
    }
    updateScore() {
        if (turn) {
            black_score--;
            black_score_el.innerHTML = black_score;
        } else {
            white_score--;
            white_score_el.innerHTML = white_score;
        }
    }





}
// Запускаємо гру
class Start {
    constructor() {
        this.board = new Board({
            board: board_el,
        });
    }
    start() {
        this.board.drawBoard();
        this.showFigures();
    }
    resetScore() {
        black_score_el.innerHTML = '12';
        white_score_el.innerHTML = '12';
    }
    showFigures() {
        for (let color in figures) {
            for (let figurePos in figures[color]) {

                let figure = new Figure({
                    'color': color,
                    'figurePos': figures[color][figurePos]
                })
                figure.showOnBoard();
            }
        }
        this.move();
    }
    move() {
        const move = new MakeMove();
        move.start();
    }
    boardReset() {
        board_el.innerHTML = '';
    }
}

const start = new Start();
// Відслідковуємо натиски на кнопку
document.querySelector('button').addEventListener('click', (e) => {
    if (!is_game_started) {
        is_game_started = true;
        e.target.innerHTML = 'Reset';
        start.start()
    } else {
        e.target.innerHTML = 'Start game';
        is_game_started = false;
        start.boardReset();
        start.resetScore();
        // stop();
    }

});