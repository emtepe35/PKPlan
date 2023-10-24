let bledneN = ["-(N)", "-(N", "-N1", "-N2", "-N3", "-n1", "-n2", "-n3", "-(n", "-(n ", "-(n.", "-(n. ", "."]; //lista oznaczen w dniach nieparzystych
let bledneP = ["-(P)", "-(P", "-P1", "-P2", "-P3", "-p1", "-p2", "-p3", "-(p", "-(p ", "-(p.", "-(p. ", "."]; //lista oznaczen w dniach parzystych

var backup; //przechowuje tabele po załadowaniu w celu przywrócenia po zmianie kryteriów

var selectValues = {
    gl: null,
    gk: null,
    week: null,
    sex: null
}

var cookiesConfirmed = false;

let engageScript = function (planFrame, direct, titleBar) {
    let plan = planFrame;
    let wstawOpcje = async function () { //Rysuje navbar w headerze
        await sleep('250');

        if (!direct) { plan = window.frames["plan"].document };
        cookiesConfirmed = checkCookiesConfirmed();
        if (!cookiesConfirmed) { askForCookies(plan) }

        backup = plan.getElementsByClassName('tabela')[0].innerHTML;
        titleBar = plan.getElementsByClassName('tytul')[0];

        selectValues = readCookies();

        let titleChildren = Array.from(titleBar.children);
        if (titleChildren.length < 5) { //tNaglowek nie zawiera jeszcze dodatków
            titleBar.innerHTML += '<br>';
            titleBar.appendChild(stworzSelecty(plan));
            titleBar.appendChild(weekParity());
        }

    }
    wstawOpcje(); //pierwsze wywołanie funkcji

    let stworzSelecty = function (frame) { //generuje poziome menu selectów
        let div = document.createElement('div'); //kontener na navbar

        //GL
        let gl = document.createElement('select');
        gl.name = 'selectGL'; gl.id = 'idGL'; gl.style.margin = '10px'
        addSelectStyle(gl);

        for (let i = 1; i <= 7; i++) {
            let optGL = document.createElement('option');
            optGL.value = 'L0' + String(i);
            optGL.innerHTML = 'GL0' + String(i);
            gl.appendChild(optGL);
        }

        //GK
        let gk = document.createElement('select');
        gk.name = 'selectGK'; gk.id = 'idGK'; gk.style.margin = '10px'
        addSelectStyle(gk);

        for (let i = 1; i <= 6; i++) {
            let optGK = document.createElement('option');
            optGK.value = 'K0' + String(i);
            optGK.innerHTML = 'GK0' + String(i);
            gk.appendChild(optGK);
        }

        //Tydzien 
        let week = document.createElement('select');
        week.name = 'week'; week.id = 'idWeek'; week.style.margin = '10px'
        addSelectStyle(week);

        let parzysty = document.createElement('option');
        parzysty.value = 'n'
        parzysty.innerHTML = 'parzysty'
        let nieparzysty = document.createElement('option');
        nieparzysty.value = 'p'
        nieparzysty.innerHTML = 'nieparzysty'

        week.appendChild(parzysty);
        week.appendChild(nieparzysty);

        //Plec 
        let sex = document.createElement('select');
        sex.name = 'sex'; sex.id = 'idSex'; sex.style.margin = '10px'
        addSelectStyle(sex);

        let man = document.createElement('option');
        man.value = 'K'
        man.innerHTML = 'Mężczyzna'
        let woman = document.createElement('option');
        woman.value = 'M'
        woman.innerHTML = 'Kobieta'

        sex.appendChild(man);
        sex.appendChild(woman);

        //ustawienie wartości z cookie (jeśli pobrane)
        if (selectValues.gl != null) { gl.value = selectValues.gl };
        if (selectValues.gk != null) { gk.value = selectValues.gk };
        if (selectValues.week != null) { week.value = selectValues.week };
        if (selectValues.sex != null) { sex.value = selectValues.sex };

        //Przycisk zatwierdzający
        let button = document.createElement('button');
        button.innerText = 'Zmień'
        button.style.margin = '10px'
        addSelectStyle(button);
        button.onclick = function () { updatePlan(frame) }; //zdarzenie onclick zatwierdzenia

        div.appendChild(gl);
        div.appendChild(gk);
        div.appendChild(week);
        div.appendChild(sex);
        div.appendChild(button);
        return div;
    }

    let updatePlan = function (frame) { //wywołanie po kolei każdej funkcji usuwającej śmieci
        plan.getElementsByClassName('tabela')[0].innerHTML = backup; //przywrócenie backupu
        let gl = frame.getElementById('idGL');
        let gk = frame.getElementById('idGK');
        let sex = frame.getElementById('idSex');
        let week = frame.getElementById('idWeek');
        //wrzucam value selectów do cookies
        if (cookiesConfirmed) { createCookies(gl.value, gk.value, week.value, sex.value) };

        //Przerzucam value z poszczególnych selectów do funkcji
        deleteByWeek(week.value);
        deleteByGL(gl.value);
        deleteByGK(gk.value);
        deleteBySex(sex.value);
        clearMess(week.value);
    }

    let deleteByWeek = function (week) { //Usuwa wpisy na podstawie (N) lub (P). Szuka w ostatniej literze sali
        if (!direct) { plan = window.frames["plan"].document };
        let lekcje = Array.from(plan.getElementsByClassName('l'));
        lekcje.map((lekcja) => {
            let spany = Array.from(lekcja.children)
            for (let i = 0; i < spany.length; i++) {
                if (spany[i].style.fontSize == '85%') { //Oddzielne szukanie dla mniejszych fontów, mają dodatkową warstwę spanów, nie mam pomysłu na lepsze
                    let spans = Array.from(spany[i].children)
                    for (let a = 0; a < spans.length; a++) {
                        if (spans[a].className == 's') {
                            let str = spans[a].innerHTML;
                            let lastChar = str.charAt(str.length - 1)
                            if (lastChar == week) {
                                spans[a].innerHTML = '';
                                spans[a - 1].innerHTML = '';
                                spans[a - 2].innerHTML = ''
                            }
                        }
                    }
                }
                if (spany[i].className == 's') {
                    let str = spany[i].innerHTML;
                    let lastChar = str.charAt(str.length - 1)
                    if (lastChar == week) {
                        spany[i].innerHTML = '';
                        spany[i - 1].innerHTML = '';
                        spany[i - 2].innerHTML = ''
                    }
                }
            }
        })
    }
    let deleteByGL = function (gl) {
        if (!direct) { plan = window.frames["plan"].document };
        let lekcje = Array.from(plan.getElementsByClassName('l'));
        lekcje.map((lekcja) => {
            let spany = Array.from(lekcja.children);
            for (let i = 0; i < spany.length; i++) {
                if (spany[i].style.fontSize == '85%') {
                    let spans = Array.from(spany[i].children)
                    for (let a = 0; a < spans.length; a++) {
                        if (spans[a].className == 'p') {
                            if (spans[a].innerHTML.includes("L0") && !spans[a].innerHTML.includes(gl)) {
                                spans[a].innerHTML = '';
                                spans[a + 1].innerHTML = '';
                                spans[a + 2].innerHTML = '';
                            }
                        }
                    }
                }
                if (spany[i].className == 'p') {
                    for (let a = 0; a < spany.length; a++) {
                        if (spany[a].className == 'p') {
                            if (spany[a].innerHTML.includes("L0") && !spany[a].innerHTML.includes(gl)) {
                                spany[a].innerHTML = '';
                                spany[a + 1].innerHTML = '';
                                spany[a + 2].innerHTML = '';
                            }
                        }
                    }
                }
            }
        })
    }
    let deleteByGK = function (gk) {
        if (!direct) { plan = window.frames["plan"].document };
        let lekcje = Array.from(plan.getElementsByClassName('l'));
        lekcje.map((lekcja) => {
            let spany = Array.from(lekcja.children);
            for (let i = 0; i < spany.length; i++) {
                if (spany[i].style.fontSize == '85%') {
                    let spans = Array.from(spany[i].children)
                    for (let a = 0; a < spans.length; a++) {
                        if (spans[a].className == 'p') {
                            if (spans[a].innerHTML.includes("K0") && !spans[a].innerHTML.includes(gk)) {
                                spans[a].innerHTML = '';
                                spans[a + 1].innerHTML = '';
                                spans[a + 2].innerHTML = '';
                            }
                        }
                    }
                }
                if (spany[i].className == 'p') {
                    for (let a = 0; a < spany.length; a++) {
                        if (spany[a].className == 'p') {
                            if (spany[a].innerHTML.includes("K0") && !spany[a].innerHTML.includes(gk)) {
                                spany[a].innerHTML = '';
                                spany[a + 1].innerHTML = '';
                                spany[a + 2].innerHTML = '';
                            }
                        }
                    }
                }
            }
        })
    }
    let deleteBySex = function (sex) { //Usuwa wpisy na podstawie (M) lub (K). Szuka w pierwszym spanie
        if (!direct) { plan = window.frames["plan"].document };
        let lekcje = Array.from(plan.getElementsByClassName('l'));
        lekcje.map((lekcja) => {
            let spany = Array.from(lekcja.children)
            for (let i = 0; i < spany.length; i++) {
                if (spany[i].style.fontSize == '85%') { //Oddzielne szukanie dla mniejszych fontów, mają dodatkową warstwę spanów, nie mam pomysłu na lepsze
                    let spans = Array.from(spany[i].children)
                    for (let a = 0; a < spans.length; a++) {
                        if (spans[a].className == 'p') {
                            let str = spans[a].innerHTML;
                            if (str.includes(`(${sex})`)) {
                                spans[a].innerHTML = '';
                                spans[a + 1].innerHTML = '';
                                spans[a + 2].innerHTML = ''
                            }
                        }
                    }
                }
                if (spany[i].className == 'p') {
                    let str = spany[i].innerHTML;
                    if (str.includes(`(${sex})`)) {
                        spany[i].innerHTML = '';
                        spany[i + 1].innerHTML = '';
                        spany[i + 2].innerHTML = ''
                    }
                }
            }
        })
    }
    let clearMess = function (week) { //Czyści pozostałości po usuniętych wpisach. Niektóre wpisy mają oznaczenie N i P poza spanami, jako plaintext
        if (!direct) { plan = window.frames["plan"].document }
        let lekcje = Array.from(plan.getElementsByClassName('l'));
        lekcje.map((lekcja) => {
            let currentText = lekcja.innerHTML;
            let edited = currentText;
            if (week == "n") {
                bledneN.forEach(el => {
                    edited = edited.replace(el, "");
                });
            } else {
                bledneP.forEach(el => {
                    edited = edited.replace(el, "");
                });
            }
            lekcja.innerHTML = edited;

            if (lekcja.innerText.length <= 7) {
                lekcja.innerText = '';
            }
        })
    }

    let addSelectStyle = function (el) {
        el.style.borderRadius = '8px';
        el.style.fontWeight = 'bold';
        el.style.cursor = 'pointer';
    }

    function sleep(ms) { //funkcja pomocnicza, delay na załadowanie strony. Metoda starożytna 
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    if (!direct) {
        let listaOddzialow = Array.from(oddzialy.children); //tworzy array z HTMLCollection oddziałow
        listaOddzialow.map((el) => {
            el.onclick = function () { wstawOpcje() }; //ustawia onclick na każdy oddział
        })
    }

}

