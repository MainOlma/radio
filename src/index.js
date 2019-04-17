//import 'bulma'
import './main.scss';
//import * as Fingerprint2 from 'fingerprintjs2'
//import initRadioemoji from './radioemoji'
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
    //initRadioemoji

    function makeParallax() {
        const scene = document.getElementById('scene');
        const parallaxInstance = new Parallax(scene, {
            relativeInput: true,
            calibrateX:true
        });
    }

    function handleControls(){
        const group = document.querySelector('.controls');
        group.addEventListener("click", toggleStyle, false)
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
