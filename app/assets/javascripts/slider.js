"use strict";

$(document).ready(function() {
    fn();
})

function fn() {

    const next = document.querySelectorAll(".js-next");
    const containers = document.querySelectorAll(".image-container");
    const options = document.querySelectorAll(".image-options");
    const grid = document.querySelector(".incredible-grid");
    var slides = null;
    var slider = null;
    var show = null;

    //we need to let the server know which photos to return
    var index = 0;

    var threshold = 0;
    var pos = 0;
    var end = false;

    //add slides to the slideshow
    const addSlides = function(pslides, uid) {
        threshold = 0;

        //make sure to position slides properly at first fetch      
        if (pos == 0) {
            pos = -110;
        }

	if(slider.children[3].classList.contains("loader")){
	    slider.children[3].remove();
	}

        for (let i = 0; i < pslides.length; i++) {
            pos += 110;
            var newComponent = `
               <div id="${uid}" class="slider-component" data-position="${pos}" style="transform:translateX(${pos}%)">
                   <img class = "slide-image" id = "${pslides[i].p_id}" src="${pslides[i].url}">
                   <h1 class="photo-title">${pslides[i].title}</h1>
               </div>
            `;

            $(slider).append(newComponent);
        }
    }

    //fetch from server
    var fetchPhotos = async function(uId) {

        const promise = await fetch("/photos/" + index + "&" + uId, {
            method: "GET"
        }).then((response) => {
            if (response.ok) {
                return response.json();
                
            } else {
                return Promise.reject(response);
            }
        }).then((data) =>{
	    addSlides(data, uId);
	}).catch((err) => {
            console.warn("panic", err);
        });
    }

    // move the slides
    const slide = function() {

        index += this;
        threshold += this;

        //cant slide to left
        if (index == -1) {
            index = 0;
            return;
        }

        slides = slider.children;

        for (let i = 3; i < slides.length; i++) {

            pos = slides[i].dataset.position;
            if (slides.length - 3 == index) {
                pos = (i - 3) * 110;
            } else {
                pos = -110 * (this) + 1 * pos;
            }
            if (pos == 110 || pos == -110) {
                slides[i].classList.add("fade-out");
            } else {
                slides[i].classList.remove("fade-out");
            }
            slides[i].dataset.position = pos;
            slides[i].style.transform = "translateX( " + pos + "% )";

        }
        //reached the end
        if (slides.length - 3 == index) {
            index = 0;
            slides[2].classList.remove("hidden");
            slider.children[0].classList.remove("hidden");
            slider.children[1].classList.remove("hidden");
            end = true;
        }
        //user has reached the limit , fetch the next set
        if (threshold == 5 && !end) {
            let id = slides[3].id;
            fetchPhotos(id);
        }
    }

    //prepare the slider
    const mouseIn = function(event) {

        if (!(event.target.classList.contains("js-photo"))) {
            return;
        }

        const awesome = event.target.closest(".image-container");
        const ids = awesome.id.split("-");
        const u_id = ids[0];

        slider = awesome.children[1];

	const loader = `<div class="loader"></div>`;
        $(slider).append(loader);
        slider.classList.remove("hidden");

        slider.children[0].classList.remove("hidden");
        slider.children[1].classList.remove("hidden");

        //first fetch
        fetchPhotos(u_id);

        end = false;
    }

    //we are done, clear the slider
    const mouseOut = function(event) {

        slider.classList.add("hidden");
        slider.classList.remove("toggleSlider");

        //in case the live show is up
        clearInterval(show);

        index = 0;
        pos = 0;
        slides = slider.children;
        slides[2].classList.remove("hidden");
        let slidesNum = slides.length;

        //remove from last to first
        for (var i = slidesNum - 1; i > 0; i--) {
            if (slides[i].classList.contains("slider-component")) {
                slides[i].remove();
            }
        }
    }

    // set up the live show
    const liveShow = function(event) {

        end = false;

        slider.children[0].classList.add("hidden");
        slider.children[1].classList.add("hidden");

        //start from current index and from left to right 
        show = setInterval(() => {
            next[1].click();
            if (end) {
                clearInterval(show);
            }
        }, 2000)

    }

    const imageOptions = function(event) {
        const clicked = event.target.closest(".js-opt");
        if (!clicked) {
            return;
        }
        if (clicked.classList.contains("js-live")) {
            clicked.parentNode.classList.add("hidden");
            liveShow(clicked);
        }
    }

    const comments = function(event) {
        //
    }

    //bind my handlers
    for (let i = 0; i < next.length; i++) {
        let direction = null;
        if (next[i].classList.contains("pagination-right")) {
            direction = 1;
        } else {
            direction = -1;
        }
        next[i].addEventListener("click", slide.bind(direction));
    }

    for (let i = 0; i < containers.length; i++) {
        containers[i].addEventListener("mouseover", mouseIn);
        containers[i].addEventListener("mouseleave", mouseOut);
        options[i].addEventListener("click", imageOptions);
    }

    //redirect to comment section
    grid.addEventListener("click", (event) => {
        var clicked = event.target.closest(".slide-image");
        if (!clicked) {
            return;
        }
        clearInterval(show);
        const pid = clicked.id;
        const uid = clicked.parentNode.id;
        window.location.href = "/users/" + uid + "/comments/" + pid;
    })
}