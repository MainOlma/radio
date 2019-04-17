import * as Fingerprint2 from 'fingerprintjs2'
let url = (process.env.NODE_ENV=='development') ? "http://rad/" : "/"
function initRadioemoji() {

    const elements = document.querySelectorAll('#radiobuttons>a');
    const elements_arr=[]
    Array.prototype.forEach.call(elements, function(el, i){
        elements_arr.push(el.classList[0])
    });

    loadCounters(elements_arr)

    let $ = function (selector) {
        return document.querySelector(selector);
    };
    let links = $('#radiobuttons').getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        link.onclick = incrementCounter;
    }
}

function loadCounters( elements_arr) {
    fetch(url+"init.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "reactions":elements_arr
        })
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(json) {
                if (json.error==null)
                    json.reactions.forEach((v)=>{
                        let span=document.createElement("span")
                        span.innerText=v.counter
                        span.classList.add('counter_value')
                        if (document.getElementsByClassName(v.name)[0])
                            document.getElementsByClassName(v.name)[0].appendChild(span);
                    })
            });
        } else {
            console.log('Network request  failed with response ' + response.status + ': ' + response.statusText);
        }
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
                        if (json.error==null)
                            target.getElementsByClassName('counter_value')[0].innerText=json.incremented_value;
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