
    var board = new Array(100);  //オセロ盤
    var player; //白の手番なら黒、黒の手番なら白
    var availableSquares = [null, new Array(100), new Array(100)];
    var direction = [-11, -10, -9, -1, 1, 9, 10, 11];
    var putable;
    var number;
    makeBoard();
    

    
function opponent(player){
    if (player==1) {
        return 2;
     } else if (player==2) {
        return 1;
    } else {
        return false;
    }
}

function positionInBoard(position) {    
    if (position<11 || position>88 || position%10==0 || position%10==9) {
        return false;
    } else {
        return true;
    }
}

function makeBoard() {  //boardの初期化
    for (var i=0; i<board.length; i++) {
        if (i<11 || i>88 || i%10==0 || i%10==9) {  //壁
            board[i]=-1
        } else if (i==44 || i==55) { //初期黒
            board[i]=2;
        } else if (i==45 || i==54) { //初期白
            board[i]=1;
        } else {        //そのほかのマス
            board[i]=0
        }
    }
    boardConsole();
    player=1;
    number=[0,2,2];
    putable=[null, false, false];
    searchAvailableSquares();
}

function boardConsole() {
     var x, y, row, rows;
     rows = "    0  1  2  3  4  5  6  7  8  9\n";

    for (x=0; x<10; x++) {
        row = x+": ";
        for (y=0; y<10; y++) {
            if (board[10*x+y]>-1) {
                 row = row + " " + board[10*x+y] + ",";
            } else {
                row = row + board[10*x+y] + ",";
            }
        }
        rows  = rows + row.slice(0, -1) + "\n";
    }
    console.log(rows);
}

function judgePut(player, position) {
    var changable = new Array();  //暫定の返り値
    var change = new Array();  //返り値
    var nowPoint;  //現在調べている点
    if ((player != 1 && player != 2) || board[position] != 0) { //playerもしくはpositionの値がおかしいとき
        return false;
    } else {
        for (var i=0; i<direction.length; i++) {
            nowPoint = position+direction[i];
            while (board[nowPoint] == opponent(player)) {
                changable.push(nowPoint);
                nowPoint = nowPoint+direction[i];
            }
            if (board[nowPoint] == player) {
                Array.prototype.push.apply(change,changable);
            }
            changable = new Array();
        }
        if (change.length == 0) {  //おけない
            return null;
        } else {
            return change;  //おけるマスの配列
        }
    }
}

function searchAvailableSquares() {
    putable = [null, false, false]
    for (var i=0; i<board.length; i++) {
        for (var j=1; j<=2; j++) {
            availableSquares[j][i] = judgePut(j, i);
            if (Array.isArray(availableSquares[j][i])==true){
                putable[j]=true
            }
        }
    }
}







/*
window.addEventListener("DOMContentLoaded",function() {
    var squares = document.getElementsByClassName("square");
    console.log(squares);
    console.log(squares[0].id);
    console.log(squares[2].id);
    for (var i = 0; i<squares.length; i++) {
        squares[i].innerHTML = "<p>"+squares[i].id+"</p>";
    }
}, false);

window.addEventListener("DOMContentLoaded", function() {
    var squares = document.getElementsByClassName("square");
    for (var i=0; i<squares.length; i++) {
        (function(n){
            squares[n].addEventListener('click',function() {
            console.log(n);
            console.log(squares[n].id);
            },false);
        })(i);
    }
}, false);
*/




function BoardtoHTML() {
    for (var i=0; i<board.length; i++) {
        switch (board[i]) {
            case 0: 0
            document.getElementById("s"+i).className = "square none";
            break;
            case 1: 1
            document.getElementById("s"+i).className = "square white";
            break;
            case 2: 2
            document.getElementById("s"+i).className = "square black";
            break;
        }
    }
    for (var i=0; i<board.length; i++) {
        if (Array.isArray(availableSquares[player][i])){
            document.getElementById("s"+i).className = "square available";
        }
    }
    document.getElementById("nOfWhite").innerHTML="<p>白"+number[1]+"</p>";
    document.getElementById("nOfBlack").innerHTML="<p>黒"+number[2]+"</p>";
}

function put(position){
    if (Array.isArray(judgePut(player, position))) {
        board[position] = player;
        number[player] += 1
        console.log("player"+player+"はマス"+position+"に石を置きました");
        for (var i=0; i<availableSquares[player][position].length; i++) {
            board[availableSquares[player][position][i]]=player;
            number[player] += 1
            number[opponent(player)] -= 1
            console.log("マス"+availableSquares[player][position][i]+"が裏返りました");
        }
        boardConsole();
        searchAvailableSquares();
        player = opponent(player);
        if (putable[player]==false) {
            player = opponent(player);
        }
        BoardtoHTML();
        if (putable[player]==false) {
            console.log("おわり");
            finish();                 //関数finish呼び出し
        }
        console.log("player"+player+"の番です");
    } else {
        console.log("マス"+position+"に石は置けません");
    }
}

window.addEventListener("DOMContentLoaded",function() {
    BoardtoHTML();
    var squares = document.getElementsByClassName("square");
    for (var i=0; i<squares.length; i++) {
        squares[i].innerHTML = "<p>"+squares[i].id+"</p>";
        (function(n) {
            squares[n].addEventListener('click', function() {
                 m=Number(squares[n].id.slice(1,3));
                put(m);
            }, false);
        })(i);
    }
}, false);