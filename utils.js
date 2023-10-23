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