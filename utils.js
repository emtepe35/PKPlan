//Week parity check and display
let weekParity = () => {
    let div = document.createElement('div');
    div.id = 'parzystosc';
    div.innerHTML = 'Bieżący tydzień jest '
    textStyle(div);
    let jaki_tydzien = ''
    if (checkParity()) { jaki_tydzien = 'parzysty' }
    else { jaki_tydzien = 'nieparzysty' }
    div.innerHTML += `<b>${jaki_tydzien}</b>`

    return div;
}

let checkParity = () => {
    currentDate = new Date();
    let startDate = new Date();
    startDate.setDate(1);
    startDate.setMonth(9);

    var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    var weekNumber = Math.ceil(days / 7);

    let parity = false;
    if (weekNumber % 2 == 0) { parity = true };

    return parity;
}

let textStyle = (el) => {
    el.style.fontSize = '50%';
    el.style.marginBottom = '10px'
}
//#########################################################

//Cookies handling
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

let createCookies = (gl, gk, gp, week, sex) => {
    setCookie('gl', gl, 180);
    setCookie('gk', gk, 180);
    setCookie('gp', gp, 180);
    setCookie('week', week, 180);
    setCookie('sex', sex, 180);
}

let readCookies = () => {
    return {
        gl: getCookie('gl'),
        gk: getCookie('gk'),
        gp: getCookie('gp'),
        week: getCookie('week'),
        sex: getCookie('sex')
    }
}

let checkCookiesConfirmed = () => {
    let confirmation = getCookie('cookiePermission');
    if (confirmation == 'true') { return true };
    return false;
}

let setCookiesConfirmed = () => {
    setCookie('cookiePermission', 'true', 180);
}
//Ask for cookies confirmation
let askForCookies = (frame) => {
    let askDiv = document.createElement('div');
    askDiv.id = 'cookieAsk';
    askDiv.style.position = 'absolute';
    askDiv.style.width = '300px';
    askDiv.style.height = '160px';
    askDiv.style.backgroundColor = '#e1e6f5';
    askDiv.style.borderColor = "#7b90d5";
    askDiv.style.borderStyle = "solid";
    askDiv.style.borderWidth = "2px";
    askDiv.style.borderCollapse = 'separate';
    askDiv.style.right = '30px';
    askDiv.style.bottom = '30px';
    askDiv.style.borderRadius = '30px';
    askDiv.style.display = 'flex';
    askDiv.style.justifyContent = 'center';
    askDiv.style.alignItems = 'center';
    askDiv.style.flexDirection = 'column';

    askDiv.innerHTML = `
    <h3>Zgoda na pliki cookie</h3>
    <p style="text-align: center">Wtyczka zapisuje jedynie ostatnio wybrane opcje sortowania planu. Pliki te nie są konieczne, lecz usprawniają pracę</p>
    `
    let buttonDiv = document.createElement('div');
    let confirmButton = document.createElement('button');
    confirmButton.innerHTML = 'Zgoda';
    let declineButton = document.createElement('button');
    declineButton.innerHTML = 'Odmów';
    buttonDiv.appendChild(confirmButton);
    buttonDiv.appendChild(declineButton);

    confirmButton.style.cursor = 'pointer';
    confirmButton.style.margin = '5px';

    declineButton.style.cursor = 'pointer';
    declineButton.style.margin = '5px';

    declineButton.onclick = () => {
        hideDiv(askDiv);
    }

    confirmButton.onclick = () => {
        hideDiv(askDiv);
        setCookiesConfirmed();
    }

    askDiv.appendChild(buttonDiv)
    frame.body.appendChild(askDiv)
}

let hideDiv = (div) => {
    div.style.display = 'none';
}

//###########################################