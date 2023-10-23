let list = window.frames["list"].document //pobranie frame, używany zamiast domyślnego Document
let oddzialy = list.getElementById('oddzialy'); //list oddziałow

let planFrame = window.frames["plan"].document //frame z planem (niby div)
let titleBar = planFrame.getElementsByClassName('tytul')[0]; //header gdzie wstawiam swój navbar

engageScript(planFrame, false, titleBar, oddzialy)