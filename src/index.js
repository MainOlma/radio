//import 'bulma'
import './main.scss';
import * as Fingerprint2 from 'fingerprintjs2'
import Parallax from 'parallax-js'

function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(function () {
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
        relativeInput: true,
        calibrateX:true
    });
    function getFingerprint() {
        //return  setTimeout(function () {
        let fp =
             Fingerprint2.get(function (components) {
                let values = components.map(function (component) {
                    return component.value
                })
                let murmur = Fingerprint2.x64hash128(values.join(''), 31)
                console.log("mur = ",murmur);
                fp=murmur

            })
        return fp
        //}, 500)
    }
    let fpr = getFingerprint();
    console.log("finger = ",fpr);
    const group = document.querySelector('.controls');
    let radioButtons=document.getElementById('radiobuttons')
    let mainContainer=document.getElementById('main')
    group.addEventListener("click", toggleStyle, false)
    function toggleStyle(e) {
        if(e.target!==e.currentTarget){
            let clickedGroup=e.target.parentNode.id

            if (e.target.classList.contains('active')) return
            e.target.parentNode.querySelector('.active').classList.remove('active')
            e.target.classList.add('active')

            radioButtons.classList.toggle(clickedGroup)
            mainContainer.classList.toggle(clickedGroup)

        }
        e.stopPropagation()
    }

    let location=document.location.href
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
                const value = document.getElementById('reactioncount');
                json.reactions.forEach((v,i,a)=>{
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


    // querySelector, jQuery style
    let $ = function (selector) {
        return document.querySelector(selector);
    };
    let links = $('#radiobuttons').getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        link.onclick = incrementIt;
    }
    function incrementIt() {
        let target = this
        let emotion=this.classList[0]
        //let reaction = this.classList[0]
        fetch("http://rad/inc.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "location": location,
                "reaction": emotion
            })
        }).then(function(response) {
            if(response.ok) {
                response.json().then(function(json) {
                    target.getElementsByClassName('counter_value')[0].innerText=json;
                });
            } else {
                console.log('Network request  failed with response ' + response.status + ': ' + response.statusText);
            }
        })
    }
})
