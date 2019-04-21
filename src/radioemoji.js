import * as Fingerprint2 from 'fingerprintjs2'
let url = (process.env.NODE_ENV=='development') ? "http://rad/" : "/"
function initRadioemoji() {

    const elements = document.querySelectorAll('#radioemoji>div');
    const elements_arr=[]
    Array.prototype.forEach.call(elements, function(el, i){
        const icon=document.createElement("span")
        const text=document.createElement("span")
        text.innerText=el.innerHTML
        el.innerHTML=''
        icon.classList.add("icon")
        text.classList.add("text")
        el.appendChild(icon)
        if ( text.innerText!='') el.appendChild(text)
        elements_arr.push(el.classList[0])
    });

    loadCounters(elements_arr)

    let $ = function (selector) {
        return document.querySelector(selector);
    };
    let links = $('#radioemoji').getElementsByTagName('div');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        link.onclick = incrementCounter;
    }
}

function loadCounters( elements_arr) {
    getFpr().then(
        fingerprint => {
            fetch(url + "init.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "reactions": elements_arr,
                    "fingerprint":fingerprint
                })
            }).then(function (response) {
                if (response.ok) {
                    response.json().then(function (json) {
                        if (json.error == null) {
                            json.reactions.forEach((v) => {
                                let span = document.createElement("span")
                                span.innerText = v.counter == 0 ? '' : v.counter
                                span.classList.add('counter_value')
                                if (document.getElementsByClassName(v.name)[0])
                                    document.getElementsByClassName(v.name)[0].appendChild(span);
                            })
                            if (json.active) document.querySelector('#radioemoji .'+json.active).classList.add('active')
                        }
                    });
                } else {
                    console.log('Network request  failed with response ' + response.status + ': ' + response.statusText);
                }
            })
        })
}

function incrementCounter() {
    let target = this
    let emotion=this.classList[0]
    //let reaction = this.classList[0]
    getFpr().then(
        fingerprint => {
            fetch(url+"inc.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "reaction": emotion,
                    "fingerprint":fingerprint
                })
            }).then(function(response) {
                if(response.ok) {
                    response.json().then(function(json) {
                        console.log(json)
                        if (json.error==null){
                            //target.getElementsByClassName('counter_value')[0].innerText=json.incremented_value;
                            if (json.decremented_emoji){
                                document.querySelector('#radioemoji .'+json.decremented_emoji+' span.counter_value ').innerText= (json.decremented_value>0) ? json.decremented_value : '';
                                document.querySelector('#radioemoji .'+json.decremented_emoji).classList.remove('active')
                            }
                            if (json.incremented_emoji){
                                document.querySelector('#radioemoji .'+json.incremented_emoji+' span.counter_value ').innerText=json.incremented_value;
                                document.querySelector('#radioemoji .'+json.incremented_emoji).classList.add('active')
                            }

                        }
                            //target.getElementsByClassName('counter_value')[0].innerText=json.incremented_value;
                    });
                } else {
                    console.log('Network request  failed with response ' + response.status + ': ' + response.statusText);
                }
            })
        },
        error => console.log(error)
    )
}
function getFpr() {
    return new Promise((resolve, reject) =>{
        return  setTimeout(function () {
            Fingerprint2.get(function (components) {
                let values = components.map(function (component) {
                    return component.value
                })
                let murmur = Fingerprint2.x64hash128(values.join(''), 31)
                resolve(murmur)
            })
        }, 500)
    })
}

export default initRadioemoji()