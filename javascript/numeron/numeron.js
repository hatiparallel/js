var mine;
var yours;
var clickable;
var length = 4;
var numbering = 16;
var game = false;
var challenger;
var possibility;
var yourpossibility;
var item;
var comment;
var shown;
var youritem;

var item_random = true;

function setArray() {
    comment = document.getElementById("comment");
    comment.innerHTML = "ここでは操作は全てクリックで行います。ゲーム開始前に、自分のカードの数字の組み合わせを決めてください。";
    mine = new Array(length);
    yours = new Array(length);
    challenger = new Array(length);
    clickable = new Array(numbering+4); //数字、back、enter、item、mine
    for (var i=0; i<numbering+1; i++) {
        clickable[i]=true;
    }
    clickable[numbering+1]=false;
    clickable[numbering+2]=false;
    clickable[numbering+3]=false;
    youritem = true;
    shown = new Array();
    possibility = new Array();
    yourpossibility = new Array();
    for (var i=0; i<numbering; i++) {
        for (var j=0; j<numbering; j++) {
            if (i != j) {
                for (var k=0; k<numbering; k++) {
                    if (i != k && j != k) {
                        for (var l=0; l<numbering; l++) {
                            if (i != l && j != l && k != l) {
                                possibility.push([i, j, k, l]);
                                yourpossibility.push([i, j, k, l]);
                            }
                        }
                    }
                }
            }
        }
    }
}

function set(n, a, c) {
    var note = document.getElementsByClassName(c);
    for (var i=0; i<a.length; i++) {
        if (a[i] == null) {
            a[i] = n;
            note[i].innerHTML = n;
            if (i == a.length-1) {
                enter = document.getElementById("enter");
                enter.className = ("yes");
                clickable[numbering+1] = true;
                /*for (var j=0; j<numbering; j++) {
                    clickable[j]=false;
                }*/
            }
            return true;
        }
    }
    return false;
}

function clear(k, a, c) {
    var note = document.getElementsByClassName(c);
    var numbers = document.getElementsByClassName("number");
    var enter = document.getElementById("enter");
    for (var i=a.length-1; i>=k; i--) {
        if (a[i]!=null) {
            if (Array.isArray(item)==true) {
                numbers[a[i]].className="number using";
            } else {
                numbers[a[i]].className="number yes";
            }
            clickable[a[i]]=true;
            a[i]=null;
            note[i].innerHTML="";
            enter.className="no";
            clickable[numbering+1]=false;
            /*for (var j=0; j<numbering; j++) {
                for (var l=k; l<a.length; l++) {
                    if (a[l]==j){
                        break;
                    }
                    clickable[j]=true;
                }
            }*/
            return true;
        }
    }
    return false;
}

function challenge(d) {
    if (game==false) {
        yours = possibility[Math.floor(Math.random()*possibility.length)];
        console.log(yours);
        var numbers = document.getElementsByClassName("number");
        for (var i=0; i<numbers.length; i++) {
            numbers[i].className = "number yes";
            clickable[i]=true;
        }
        clickable[numbering+2]=true;
        is = document.getElementsByClassName("item");
        for (var i=0; i<is.length; i++) {
            is[i].className="item yes";
        }
        initComment();
        game=true;
    } else {
        var c=check(challenger, yours);
        var l=document.getElementById("mylog");
        console.log("mylog");
        l.innerHTML += "<p>"+challenger+"    "+c[0]+"eat "+c[1]+"bite</p>";
        if (c[0]==4) {
            setTimeout(function(){finish(0)}, 500);
        }
        var yourpos = new Array();
        for (var i=0; i<yourpossibility.length; i++) {
            var c0 = check(challenger, yourpossibility[i]);
            if (c0[0]==c[0] && c0[1]==c[1]) {
                yourpos.push(yourpossibility[i]);
            }
        }
        yourpossibility = yourpos.concat();
        if (d==false) {
            if (youritem == true) {
                cpUseItem();
            }
            cpchallenge();
        } else {
            item = null;
        }
        var numbers = document.getElementsByClassName("number");
        for (var i=0; i<numbers.length; i++) {
            numbers[i].className = "number yes";
            clickable[i]=true;
        }
        initMemo();
        challenger = new Array(4);
    }
}

function check(a, answer) {
    var eat=0;
    var bite=0;
    for (var i=0; i<length; i++) {
        for (var j=0; j<length; j++) {
            if (a[i]==answer[j]) {
                if (i==j) {
                    eat+=1;
                } else {
                    bite+=1;
                }
                break;
            }
        }
    }
    return [eat, bite];
}

function cpchallenge() {
    console.log(possibility.length);
    var p;
    if (possibility.length < 1000) {
        console.log("final stage!!!")
        var information_record = 0;
        var information_max_index = 0;
        for (var i=0; i<possibility.length; i++) {
            var eat_and_bite = Array(length);
            for (var j=0; j<length; j++) {
                eat_and_bite[j] = Array(length);
                eat_and_bite[j].fill(0);
            }
            for (var j=i+1; j<possibility.length; j++) {
                var c = check(i, j);
                eat_and_bite[c[0]][c[1]]++;
            }
            
            var information = 0;
            for (var eat=0; eat<length; eat++) {
                for (var bite=0; bite<length; bite++) {
                    if (eat_and_bite[eat][bite] > 0) {
                        var p_eb = eat_and_bite[eat][bite]/possibility.length;
                        information -= p_eb*Math.log2(p_eb);
                    }
                }
            }
            if (information > information_record) {
                information_record = information;
                information_max_index = i;
            }
        }
        p = possibility[information_max_index];
    } else {
        p = possibility[Math.floor(Math.random()*possibility.length)];
    }
    var c = check(p, mine);
    var l = document.getElementById("yourlog");
    l.innerHTML += "<p>"+p+"    "+c[0]+"eat "+c[1]+"bite</p>";
    if (c[0]==4) {
        setTimeout(function(){finish(1)}, 500);
    }
    var pos = new Array();
    console.log(possibility.length);
    for (var i=0; i<possibility.length; i++) {
        var c0 = check(p, possibility[i]);
        if (c0[0]==c[0] && c0[1]==c[1]) {
            pos.push(possibility[i]);
        }
    }
    console.log(pos.length);
    possibility = pos.concat();
}

function cpUseItem() {
    if (item_random == false) {
        cphighlow();
    } else {
        console.log("item_random")
        if (possibility.length<10 || yourpossibility.length<5) {
            console.log("DOUBLE")
            cpdouble();
            youritem = false;
        } else if (yourpossibility.length<15) {
            console.log("DEFEND")
            var item_rand = Math.random();
            if (item_rand >= 0.5) {
                cpshuffle();
            } else {
                cpchange(Math.floor(item_rand*2*length));
            }
            youritem = false;
        } else if (Math.random() < 0.2) {
            console.log("ATTACK")
            var information_record = 0;
            var information_max_index = 0;
            // slash
            var slash_p = Array(numbering);
            slash_p.fill(0);
            for (var i=0; i<possibility.length; i++) {
                slash_p[Math.max.apply(null, possibility[i]) - Math.min.apply(null, possibility[i])]++;
            }
            var expection_slash = 0;
            for (var i=0; i<length; i++) {
                expection_slash += slash_p[i]*slash_p[i];
            }
            // highlow
            var highlow_p = Array(2**length);
            highlow_p.fill(0);
            for (var i=0; i<possibility.length; i++) {
                var highlow_p_index = 0;
                for (var j=0; j<length; j++) {
                    if (possibility[i][j] >= numbering/2) {
                        highlow_p_index += 2**j
                    }
                }
                highlow_p[highlow_p_index]++;
            }
            var expection_highlow = 0;
            for (var i=0; i<2**length; i++) {
                expection_highlow += highlow_p[i]*highlow_p[i];
            }
            // target
            var target_p = Array(numbering);
            for (var i=0; i<numbering; i++) {
                target_p[i] = Array(length);
                target_p[i].fill(0);
            }
            for (var i=0; i<possibility.length; i++) {
                for (var j=0; j<length; j++) {
                    target_p[possibility[i][j]][j]++;
                }
            }
            var expection_target = Array(numbering);
            expection_target.fill(0);
            for (var i=0; i<numbering; i++) {
                var target_pi_sum = 0;
                for (var j=0; j<length; j++) {
                    expection_target[i] += target_p[i][j]*target_p[i][j];
                    target_pi_sum += target_p[i][j];
                }
                expection_target[i] += (possibility.length - target_pi_sum) ** 2;
            }

            var expection_target_min = Math.min.apply(null, expection_target)
            
            if (expection_highlow < expection_slash && expection_highlow < expection_target_min) {
                cphighlow();
            } else if (expection_slash < expection_target_min) {
                cpslash();
            } else {
                cptarget(expection_target.indexOf(expection_target_min));
            }
            youritem = false;
        }
    }
}

function cpdouble() { //yourpossibilityの更新は不要のためしていない
    var l = document.getElementById("yourlog");
    l.innerHTML += "<p>doubleを使用しました。</p>"
    var s;
    for (var i=0; i<shown.length; i++) {
        if (shown[i][0] == 1) {
            s = shown[i][1];
        }
    }
    var a = new Array(length);
    var m = new Array(length);
    for (var i=0; i<length; i++) {
        a[i] = new Array(numbering);
        for (var j=0; j<numbering; j++) {
            a[i][j] = 0;
        }
        for (var j=0; j<yourpossibility.length; j++) {
            a[i][yourpossibility[j][i]] += 1;
        }
        m[i] = Math.max.apply(null, a[i]);
    }
    m.splice(s, 1);
    var n = m.indexOf(Math.max.apply(null, m));
    if (s != null && n>=s) {
        n += 1;
    }
    var c = document.getElementsByClassName("yours");
    c[n].className = "card yours shown";
    c[n].innerHTML = yours[n];
    shown.push([1, n]);
    cpchallenge();
}

function cphighlow() {
    var hl = "highlow";
    for (var i=0; i<length; i++) {
        if (mine[i]<numbering/2) {
            hl += " L";
            var j=0;
            while (j<possibility.length) {
                if (possibility[j][i]>=numbering/2) {
                    possibility.splice(j, 1);
                } else {
                    j += 1;
                }
            }
        } else {
            hl += " H";
            var j=0;
            while (j<possibility.length) {
                if (possibility[j][i]<numbering/2) {
                    possibility.splice(j, 1);
                } else {
                    j += 1;
                }
            }
        }
    }
    var l = document.getElementById("yourlog");
    l.innerHTML += "<p>"+hl+"</p>";
}

function cpslash() {
    var l = document.getElementById("yourlog");
    var s = Math.max.apply(null, mine)-Math.min.apply(null, mine);
    l.innerHTML += "<p>slash "+s+"</p>";
    var pos = new Array();
    for (var i=0; i<possibility.length; i++) {
        if (Math.max.apply(null, possibility[i])-Math.min.apply(null, possibility[i]) == s) {
            pos.push(possibility[i])
        }
    }
    console.log(pos.length)
    possibility = pos.concat()
}

function cptarget(n) {
    var l = document.getHTMLById("yourlog");
    for (var i=0; i<length; i++) {
        if (mine[i] == n) {
            l.innerHTML += "<p>target "+n+" あり "+i+"桁目</p>";
            var c = document.getElementsByClassName("mine");
            c[i].className = "card mine shown";
            var pos = new Array();
            for (var j=0; j<possibility.length; j++) {
                if (possibility[j][i] == n) {
                    pos.push(possibility[j])
                }
            }
            console.log(pos.length);
            possibility = pos.concat();
            return;
        }
    }
    l.innerHTML += "<p>target "+n+" なし";
    var pos = new Array();
    for (var i=0; i<possibility.length; i++) {
        for (var j=0; j<length; j++) {
            if (possibility[i][j] == n) {
                break;
            }
        }
        pos.push(possibility[i]);
    }
    console.log(pos.length);
    possibility = pos.concat();
}

function cpshuffle() { //cp完了。見た目の更新やる。
    var c = document.getElementsByClassName("yours");
    for (var i=0; i<length; i++) {
        c[i].className = "card yours closed";
    }
    var s;
    for (var i=0; i<shown.length; i++) {
        if (shown[i][0] == 1) {
            s = yours[shown[i][1]]; //見えている中身
        }
    }
    var a = makeShuffle(yours);
    var m = Math.float(Math.random()*a.length);
    yours = a[m];
    if (s != null) {
        c[yours.indexOf(s)].className = "card yours shown";
    }
}

function makeShuffle(x) {
    var n = 1;
    for (var i=1; i<=length; i++) {
        n *= i;
    }
    var array = new Array();
    for (var i=0; i<n; i++) {
        var a = new Array();
        var k = i;
        for (var j=length; j>0; j--) {
            a.push(k%j);
            k = Math.floor(k/j);
        }
        array.push(a);
    }
    var answer = new Array(array.length);
    for (var i=0; i<array.length; i++) {
        var y = new Array(length);
        var z = x.concat();
        for (var j=0; j<length; j++) {
            y[j] = z[array[i][j]];
            z.splice(array[i][j], 1);
        }
        answer[i] = y;
    }
    return answer;
}

function cpchange(c) {
    var l = document.getElementById("yourlog");
    var a = new Array();
    if (yours[c]<numbering/2) {
        for (var i=0; i<numbering/2; i++) {
            a.push(i);
            for (var j=0; j<length; j++) {
                if (yours[j] == i) {
                    a.pop();
                    break;
                }
            }
        }
        l.innerHTML += "<p>changeを使用しました。 "+c+"桁目(L)を変更しました。</p>";
    } else {
        for (var i=numbering/2; i<numbering; i++) {
            a.push(i);
            for (var j=0; j<length; j++) {
                if (yours[j] == i) {
                    a.pop();
                    break;
                }
            }
        }
        l.innerHTML += "<p>changeを使用しました。 "+c+"桁目(H)を変更しました。</p>";
    }
    var n = Math.floor(Math.random()*a.length);
    yours[c] = a[n];
}

function double() {
    for (var i=0; i<possibility.length; i++) {
        if (possibility[i][item[2]] != mine[item[2]]) {
            possibility.splice(i, 1);
        }
    }
    comment.innerHTML = "double使用中です。";
    var l = document.getElementById("mylog");
    l.innerHTML += "<p>doubleを使用しました。";
    var c = document.getElementById("m"+(item[2]+1));
    c.className = "card mine shown";
    shown.push([0, item[2]]);
    endItem();
    var dn = document.getElementsByClassName("number");
    for (var i=0; i<numbering; i++) {
        dn[i].className = "number using";
    }
    item = new Array();
}

function highlow() {
    var s;
    for (var i=0; i<shown.length; i++) {
        if (shown[i][0] ==1) {
            s = shown[i][1];
        }
    }
    var c = document.getElementsByClassName("yours");
    var hl = "highlow";
    for (var i=0; i<length; i++) {
        if (yours[i]<numbering/2) {
            if (i!=s) {
                c[i].innerHTML = "L";
            }
            hl += " L";
            for (var j=0; j<yourpossibility; j++) {
                if (yourpossibility[j][i]>=numbering/2) {
                    yourpossibility.splice(j, 1);
                }
            }
        } else {
            hl += " H";
            if (i!=s) {
                c[i].innerHTML = "H";
            }
            for (var j=0; j<yourpossibility; j++) {
                if (yourpossibility[j][i]<numbering/2) {
                    yourpossibility.splice(j, 1);
                }
            }
        }
    }
    var l = document.getElementById("mylog");
    l.innerHTML += "<p>"+hl+"</p>";
    initComment();
}

function slash() {
    var s = Math.max.apply(null, yours)-Math.min.apply(null, yours);
    for (var i=0; i<yourpossibility.length; i++) {
        if (Math.max.apply(null, yourpossibility[i])-Math.min.apply(null, yourpossibility[i]) != s) {
            yourpossibility.splice(i, 1);
        }
    }
    var l = document.getElementById("mylog");
    l.innerHTML += "<p>slash "+s+"</p>";
    initComment();
}

function target() {
    var l = document.getElementById("mylog");
    var n = item[0];
    for (var i=0; i<length; i++) {
        if (yours[i]==n) {
            for (var j=0; j<yourpossibility; j++) {
                if (yourpossibility[j][i] != n) {
                    yourpossibility.splice(j, 1);
                }
            }
            var c = document.getElementById("y"+(i+1));
            c.className = "card yours shown";
            c.innerHTML = n;
            l.innerHTML += "<p>target "+n+" あり</p>";
            shown.push([1, i]);
            return;
        }
    }
    var a = new Array();
    for (var i=0; i<yourpossibility; i++) {
        a.push(yourpossibility[i]);
        for (var j=0; j<yourpossibility; j++) {
            if (yourpossibility[i][j] == n) {
                a.pop();
                break;
            }
        }
    }
    l.innerHTML += "<p>target "+n+" なし</p>";
    endItem();
}

function shuffle() {
    for (var i=0; i<possibility.length; i++) {
        var a = makeShuffle(possibility[i]);
        for (var j=0; j<a.length; j++) {
            searchPush(possibility, a[j]);
        }
    }
    var s;
    for (var i=0; i<shown.length; i++) {
        if (shown[i][0] == 0) {
            s = mine[shown[i][1]];
        }
    }
    var l = document.getElementById("mylog");
    l.innerHTML += "<p>shuffleを利用しました</p>";
    var c = document.getElementsByClassName("mine");
    for (var i=0; i<length; i++) {
        mine[i]=item[i];
        c[i].innerHTML = item[i];
        c[i].className = "card mine open";
        if (item[i] == s) {
            c[i].className = "card mine shown";
        }
    }
    endItem();
}

function change() {
    var s;
    for (var i=0; i<shown.length; i++) {
        if (shown[i][0] == 0) {
            s = shown[i][1];
        }
    }
    if (item[0] == s) {
        for (var i=0; i<possibility.length; i++) {
            possibility[i][s] = item[1];
        }
    } else {
    var pos = new Array();
    if (mine[item[0]]<numbering/2) {
        for (var i=0; i<possibility.length; i++) {
            if (possibility[i][item[0]]<numbering/2) {
                for (var j=0; j<numbering/2; j++) {
                    var a = possibility[i].concat();
                    a[item[0]] = j;
                    pos.push(a);
                    for (var k=0; k<length; k++) {
                        if (possibility[i][k] == j) {
                            pos.pop();
                        }
                    }
                }
            }
        }
    } else {
        for (var i=0; i<possibility.length; i++) {
            if (possibility[i][item[0]]>=numbering/2) {
                for (var j=numbering/2; j<numbering; j++) {
                    var a = possibility[i].concat();
                    a[item[0]] = j;
                    pos.push(a);
                    for (var k=0; k<length; k++) {
                        if (possibility[i][k] == j) {
                            pos.pop();
                        }
                    }
                }
            }
        }
    }
    possibility = new Array();
    var p = new Array(length);
    for (var i=0; i<length; i++) {
        p[i] = 0;
    }
    possibility.push(p);
    console.log(possibility);
    console.log(pos);
    for (var i=0; i<pos.length; i++)  {
        searchPush(possibility, pos[i]);
    }
    possibility.shift();
    }
    var l = document.getElementById("mylog");
    var c = document.getElementById("m"+(item[0]+1));
    var n = c.innerHTML
    c.innerHTML = item[1];
    mine[item[0]]=item[1];
    l.innerHTML += "<p>change "+n+"を"+item[1]+"に変更しました。</p>";
    endItem();
}

function initItem() {
    var is = document.getElementsByClassName("item");
    for (var i=0; i<is.length; i++) {
        is[i].className = "item yes";
    }
}

function initEnter() {
    var e = document.getElementById("enter");
    e.className = "no";
    clickable[numbering+1]=false;
}

function initMemo() {
    var m = document.getElementsByClassName("memo");
    for (var i=0; i<length; i++) {
        m[i].innerHTML = "";
    }
}

function initComment() {
    comment.innerHTML = "相手のカードを当ててください。結果はこの下に表示されます。アイテム未使用であれば、１回までアイテムを使用できます。各アイテムは、１度クリックするとその説明が表示され、その状態で再度クリックすると使用できます。";
}

function useItem() { //item使用の決定した瞬間
    var is = document.getElementsByClassName("item");
    for (var i=0; i<is.length; i++) {
        is[i].className = "item no";
    }
    clickable[numbering+2]=false;
    initMemo();
    challenger = new Array(4);
    var n = document.getElementsByClassName("number");
    for (var i=0; i<numbering; i++) {
        clickable[i] = true;
        n[i].className = "number yes";
    }
}

function endItem() { //itemの使用を終えた瞬間
    item = null;
    var n = document.getElementsByClassName("number");
    for (var i=0; i<numbering; i++) {
        clickable[i] = true;
        n[i].className = "number yes";
    }
    var c = document.getElementsByClassName("mine");
    for (var i=0; i<length; i++) {
        c[i].className = "card mine open";
    }
    for (var i=0; i<shown.length; i++) {
        if (shown[i][0]==0) {
            c[shown[i][1]].className = "card mine shown";
        }
    }
    initMemo();
    initComment();
}

var finish = function(n) {
    if (n==0) {
        alert("あなたの勝ちです。");
        game = false;
    } else if (game==true) {
        alert("cpの勝ちです。");
    }
    for (var i=0; i<=numbering+3; i++) {
        clickable[i]=false;
    }
}

window.addEventListener("DOMContentLoaded",function() {
    setArray();
    var numbers = document.getElementsByClassName("number");
    for (var i=0; i<numbers.length; i++) {
        (function(n) {
            numbers[n].addEventListener('click', function() {
                if (clickable[n]==true) {
                    if (game==false) {
                        set(n, mine, "mine");
                    } else if (Array.isArray(item)==true) {
                        if (item.length==0) {
                            set(n, challenger, "memo");
                        } else {
                            set(n, item, "memo");
                        }
                    } else {
                        set(n, challenger, "memo");
                    }
                    numbers[n].className="number no";
                    clickable[n]=false;
                }
            }, false);
        })(i);
    }
    var enter = document.getElementById("enter");
    enter.addEventListener('click', function() {
        if (clickable[numbering+1]==true) {
            if (Array.isArray(item)==true) {
                if (item.length==3) {
                    double();
                    clickable[numbering] = true;
                } else if (item.length==0) { //double
                    challenge(true);
                } else if (item.length==1) {
                    target();
                } else if (item.length==4) {
                    shuffle();
                } else if (item.length==2) { //change
                    if (item[0]==false) {
                        clickable[numbering+3]=false;
                        var cn = document.getElementsByClassName("number");
                        var a = new Array();
                        if (mine[item[1]]<numbering/2) {
                            for (var i=0; i<numbering/2; i++) {
                                a.push(i);
                                for (var j=0; j<length; j++) {
                                    if (i == mine[j]) {
                                        a.pop();
                                        break;
                                    }
                                }
                            }
                        } else {
                            for (var i=numbering/2; i<numbering; i++) {
                                a.push(i);
                                for (var j=0; j<length; j++) {
                                    if (i == mine[j]) {
                                        a.pop();
                                        break;
                                    }
                                }
                            }
                        }
                        for (var i=0; i<a.length; i++) {
                            clickable[a[i]] = true;
                            cn[a[i]].className = "number using";
                        }
                        item[0]=item[1];
                        item[1]=null;
                        comment.innerHTML = "次にそのカードをどの数字に変えるかを決定してください。"
                        clickable[numbering] = true;
                    } else {
                        change();
                    }
                }
            } else {
            console.log("enter");
            challenge(false);
            }
            enter.className="no";
            clickable[numbering+1]=false;
        }
    }, false);
    var back = document.getElementById("back");
    back.addEventListener('click', function() {
        if (clickable[numbering]==true) {
            if (game==false) {
                clear(0, mine, "mine");
            } else if (Array.isArray(item)==true) {
                if (item.length==0) {
                    clear(2, item, "memo");
                } else if (item.length==2) {
                    clear(1, item, "memo");
                } else {
                    clear(0, item, "memo");
                }
            } else {
                clear(0, challenger, "memo");
            }
        }
    }, false);
    var d = document.getElementById("double");
    d.addEventListener('click', function() {
        if (clickable[numbering+2]===1) {
            useItem();
            var dn0 = document.getElementsByClassName("mine");
            var dn1 = document.getElementsByClassName("number");
            for (var i=0; i<length; i++) {
                dn0[i].className = "card mine using";
            }
            for (var i=0; i<numbering; i++) {
                dn1[i].className = "number no";
                clickable[i] = false;
            }
            initEnter();
            comment.interHTML = "相手に見せるカードを選んでください。Enterで決定できます。";
            clickable[numbering+3] = true;
            item = new Array(3);
            item[0] = false;
            item[1] = false;
        } else if (clickable[numbering+2]!=false) {
            clickable[numbering+2]=1;
            initItem();
            d.className = "item using";
            comment.innerHTML = "２回連続で自分のターンとなります。その代わり、自分のカードを１枚選び、それを相手に開示する必要があります。"
        }
    })
    var h = document.getElementById("highlow");
    h.addEventListener('click', function() {
        if (clickable[numbering+2]==2) {
            highlow();
            useItem();
        } else if (clickable[numbering+2]!=false) {
            clickable[numbering+2]=2;
            initItem();
            h.className = "item using";
            comment.innerHTML = "相手のすべてのカードについて、そのカードが半分より大きいか小さいか知れます。大きければH(high)、小さければL(low)と表示されます。"
        }
    }, false);
    var sl = document.getElementById("slash");
    sl.addEventListener('click', function() {
        if (clickable[numbering+2]==3) {
            slash();
            useItem();
        } else if (clickable[numbering+2]!=false) {
            clickable[numbering+2]=3;
            initItem();
            sl.className = "item using";
            comment.innerHTML = "相手のカードのうち最大の数から最小の数を引いた値を知ることができます。"
        }
    }, false);
    var t = document.getElementById("target");
    t.addEventListener('click', function() {
        if (clickable[numbering+2]==4) {
            useItem();
            var tn = document.getElementsByClassName("number");
            for (var i=0; i<numbering; i++) {
                tn[i].className = "number using";
                clickable[i] = true;
            }
            initEnter();
            comment.innerHTML = "数字を一つ選んでください。その数字が相手のカードに含まれているか、含まれているなら何桁目にあるかを知れます。";
            item = new Array(1);
        } else if (clickable[numbering+2]!=false) {
            clickable[numbering+2]=4;
            initItem();
            t.className = "item using";
            comment.innerHTML = "数字を一つ選び、相手のカードの中にその数字が含まれているかを知ることができます。含まれていた場合はその数字が何桁目なのかも知ることができます。";
        }
    }, false);
    var sh = document.getElementById("shuffle");
    sh.addEventListener('click', function() {
        if (clickable[numbering+2]==5) {
            useItem();
            var shn = document.getElementsByClassName("number");
            for (var i=0; i<length; i++) {
                shn[mine[i]].className = "number using";
                clickable[mine[i]]=true;
            }
            for (var i=0; i<numbering; i++) {
                if (shn[i].className != "number using") {
                    shn[i].className = "number no";
                    clickable[i]=false;
                }
            }
            initEnter();
            comment.innerHTML = "数字の並び替え方を決めてください。";
            item = new Array(4);
        } else if (clickable[numbering+2]!=false) {
            clickable[numbering+2]=5;
            initItem();
            sh.className = "item using";
            comment.innerHTML = "自分のカードを、数字の組み合わせは同じままで順番を自由に変更することができます。";
        }
    }, false);
    var c = document.getElementById("change");
    c.addEventListener('click', function() {
        if (clickable[numbering+2]==6) {
            useItem();
            var cn0 = document.getElementsByClassName("mine");
            var cn1 = document.getElementsByClassName("number");
            for (var i=0; i<cn0.length; i++) {
                cn0[i].className = "card mine using";
            }
            for (var i=0; i<numbering; i++) {
                cn1[i].className = "number no";
                clickable[i] = false;
            }
            initEnter();
            comment.innerHTML = "値を変更するカードを１枚選んでください。Enterで決定できます。";
            clickable[numbering+3]=true;
            item = new Array(2);
            item[0] = false;
        } else if (clickable[numbering+2]!=false) {
            clickable[numbering+2]=6;
            initItem();
            c.className = "item using";
            comment.innerHTML = "自分のカードを一枚選択し、それを他の数に変更することができます。ただし、元の数がhigh(H)ならhigh(H)の数に、low(L)ならlowの数にしか変更できず、変更した桁とそのhighlowが相手に開示されます。";
        }
    }, false);
    var cards = document.getElementsByClassName("mine");
    for (var i=0; i<length; i++) {
        (function(n) {
            cards[n].addEventListener('click', function() {
                var s;
                for (var i=0; i<shown.length; i++) {
                    if (shown[i][0] == 0) {
                        s = shown[i][1];
                    }
                }
                if (clickable[numbering+3]==true && n != s) {
                    clickable[numbering] = false; //バグ回避用
                    for (var j=0; j<cards.length; j++) {
                        cards[j].className = "card mine open";
                    }
                    for (var j=0; j<shown.length; j++) {
                        if (shown[j][0] == 0) {
                            cards[shown[j][1]].className = "card mine shown";
                            if (shown[j][1]==n) {
                                break;
                            }
                        }
                    }
                    cards[n].className = "card mine using";
                    item[item.length-1]=n;
                    var ce = document.getElementById("enter");
                    ce.className = "yes";
                    clickable[numbering+1] = true;
                }
            }, false);
        })(i);
    }
}, false);

function searchPush(pos, a) {
    searchPushSub(pos, a, 0, Math.floor(pos.length/2), pos.length);
}

function searchPushSub(pos, a, l, m, r) {
    if (compare(pos[m], a)==0) {
        return false;
    } else if (compare(pos[m], a)==-1) {
        if (l==m) {
            pos.splice(r, 0, a);
        } else {
            searchPushSub(pos, a, m, Math.floor((m+r)/2), r);
        }
    } else {
        if (r==m) {
            pos.splice(l, 0, a);
        } else {
            searchPushSub(pos, a, l, Math.floor((l+m)/2), m);
        }
    }
}

function compare(a, b) {
    for (var i=0; i<length; i++) {
        if (a[i]<b[i]) {
            return -1;
        } else if (a[i]>b[i]) {
            return 1;
        }
    }
    return 0;
}