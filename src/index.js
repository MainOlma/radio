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

    makeParallax()
    handleControls()
    initRadioemoji()

    function makeParallax() {
        const scene = document.getElementById('scene');
        const parallaxInstance = new Parallax(scene, {
            relativeInput: true,
            calibrateX:true
        });
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

    getFpr().then(
        response => console.log(response),
        error => console.log(error)
    )

    function getFingerprint() {
        //return  setTimeout(function () {
             return Fingerprint2.get(function (components) {
                let values = components.map(function (component) {
                    return component.value
                })
                let murmur = Fingerprint2.x64hash128(values.join(''), 31)
                console.log("mur = ",murmur);
            })
        //}, 500)
    }

    function handleControls(){
        const group = document.querySelector('.controls');
        group.addEventListener("click", toggleStyle, false)
    }

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
        fetch("http://rad/init.php", {
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
                fetch("http://rad/inc.php", {
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


    function toggleStyle(e) {
        const radioButtons=document.getElementById('radiobuttons')
        const mainContainer=document.getElementById('main')
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


})
