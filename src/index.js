//import 'bulma'
import './main.scss';
import * as Fingerprint2 from 'fingerprintjs2'

function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(function () {
    setTimeout(function () {
        Fingerprint2.get(function (components) {
            console.log(components) // an array of components: {key: ..., value: ...}
            let values = components.map(function (component) { return component.value })
            let murmur = Fingerprint2.x64hash128(values.join(''), 31)
            console.log(murmur)
        })
    }, 500)
    const group = document.querySelector('.controls');
    let radioButtons=document.getElementById('radiobuttons')
    group.addEventListener("click", toggleStyle, false)
    function toggleStyle(e) {
        if(e.target!==e.currentTarget){
            let clickedGroup=e.target.parentNode.id

            if (e.target.classList.contains('active')) return
            e.target.parentNode.querySelector('.active').classList.remove('active')
            e.target.classList.add('active')

            radioButtons.classList.toggle(clickedGroup)

        }
        e.stopPropagation()
    }

    let location=document.location.href
    console.log("loc: ",location)
    var elements = document.querySelectorAll('#radiobuttons>a');
    let elements_arr=[]
    Array.prototype.forEach.call(elements, function(el, i){

        elements_arr.push(el.classList[0])
    });

    fetch("http://rad/test.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "location": location,
            "reactions":elements_arr
        })
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(json) {
                console.log(json)
                const value = document.getElementById('reactioncount');
                json.reactions.forEach((v,i,a)=>{
                    console.log(v)
                    let span=document.createElement("span")
                    span.innerText=v.counter
                    if (document.getElementsByClassName(v.name)[0])
                    document.getElementsByClassName(v.name)[0].appendChild(span);
                })
                //value.innerText=json.value;
            });
        } else {
            console.log('Network request  failed with response ' + response.status + ': ' + response.statusText);
        }
    })

    const reaction = document.getElementById('reaction');
    reaction.addEventListener("click", incrementIt, false)
    function incrementIt() {
        console.log("click")
        fetch("http://rad/inc.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "location": location,
                "reactions":elements_arr
            })
        }).then(function(response) {
            if(response.ok) {
                response.json().then(function(json) {
                    console.log(json)
                    const value = document.getElementById('reactioncount');
                    value.innerText=json;
                });
            } else {
                console.log('Network request  failed with response ' + response.status + ': ' + response.statusText);
            }
        })
    }
})
