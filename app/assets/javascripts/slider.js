
//our image slider and live show
"use strict";

$(document).ready(function() {
    fn();
})

function fn() {

    const next = document.querySelectorAll(".js-next");
    const containers = document.querySelectorAll(".image-container");
    const options = document.querySelectorAll(".image-options");
    const closeCommentBtn = document.querySelectorAll(".close-btn");
    const grid = document.querySelector(".incredible-grid");
    const post = document.querySelectorAll(".js-post");

    var singleClickTimer = null;
    var comments = null;
    var slides = null;
    var slider = null;
    var show = null;
    var ids = [];

    //we need to let the server know which photos to return
    var index = 0;

    var threshold = 0;
    var pos = 0;
    var clicks = 0;
    var end = false;
    var showWasUp = false;

    ////////////////////async calls to the server to retrieve/post data /delete//////////////////////////

    // create new comment and append to dom
    const addComment = async function(event) {

        const text = event.target.parentNode.children[0];

        var fd = new FormData();

        var myData = {

            "uid": ids[1],
            "pid": ids[0],
            "text": text.textContent

        };

        fd.append("jsondata", JSON.stringify(myData));

        await fetch("/users/" + ids[1] + "/comments", {
            method: "POST",
            body: fd,
        }).then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                return Promise.reject(response);
            }
        }).then((data) => {
            addComments([JSON.parse(data)]);
        }).catch((error) => {
            console.error("panic", error);
        });
    }

    //fetch photos from server
    const fetchPhotos = async function(uId) {

            await fetch("/photos/" + index + "&" + uId, {
                method: "GET"
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject(response);
                }
            }).then((data) => {
                addSlides(data, uId);
            }).catch((error) => {
                console.warn("panic", error);
            });
        }

    //get the comments for the clicked photo
    const fetchComments = async function(event) {
        await fetch("/photos/" + ids[0] + "/comments", {
            method: "GET"
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then((data) => {
            addComments(data);
        }).catch((err) => {
            console.warn("panic", err);
        });
    }

    //delete from the db and from the dom
    const deletePhoto = async function() {

        slides = slider.children;

        //check if photo belongs to some1 else
        const property = slides[2].children[1];
        if (property.classList.contains("js-belongs-to-followed")) {
            return;
        }

        let i;
        for (i = 3; i < slides.length; i++) {
            if (slides[i].dataset.position == 0) {
                break;
            }
        }

        await fetch("/users/" + slides[i].id + "/photos/" + (slides[i].children[0]).id, {
            method: "DELETE"
        }).then((response) => {
            if (response.ok) {
                deleteFromDom(i);
            } else {
                return Promise.reject(response);
            }
        }).catch((err) => {
            console.warn("panic", err);
        });
    }

    //////////////////////////////////////////////////////////////////////////////

    /////////////////////////// main functionalities//////////////////////////////

    //add slides to the slideshow
    const addSlides = function(pslides, uid) {
        threshold = 0;

        //make sure to position slides properly at first fetch      
        if (pos == 0) {
            pos = -110;
        }

        if (slider.children[3].classList.contains("loader")) {
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

    // move the slides
    const slide = function() {

        index += this;
        threshold += this;

        //in case the comment pop up is visible
        hideComments();

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

        slider = awesome.children[0];

        const loader = `<div class="loader"></div>`;
        $(slider).append(loader);
        slider.classList.remove("hidden");

        slider.children[0].classList.remove("hidden");
        slider.children[1].classList.remove("hidden");

        //first fetch
        fetchPhotos(u_id);

        end = false;
    }

    //we are done, clear the slider , also clear the comments
    const mouseOut = function(event) {

        if (!slider) {
            return;
        }

        slider.classList.add("hidden");
        slider.classList.remove("toggleSlider");

        //in case the live show is up
        clearInterval(show);
        show = null;

        index = 0;
        pos = 0;
        slides = slider.children;
        slides[2].classList.remove("hidden");
        let slidesNum = slides.length;

        //remove from last to first
        for (var i = slidesNum - 1; i > 0; i--) {
            if (slides[i].classList.contains("slider-component") || slides[i].classList.contains("loader")) {
                slides[i].remove();
            }
        }
        hideComments();
    }

    // set up the live show
    const liveShow = function(event) {

        end = false;

        slider.children[0].classList.add("hidden");
        slider.children[1].classList.add("hidden");

        if (comments != null) {
            hideComments();
        }

        //start from current index and from left to right 
        show = setInterval(() => {
            next[1].click();
            if (end) {
                clearInterval(show);
                showWasUp = false;
                show = null;
            }
        }, 2000)

    }

    //image options for deleting/starting the live show
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

    //add new comments to the comment pop up
    const addComments = function(data) {

        for (let i = 0; i < data.length; i++) {

            let avatar = data[i].url;
            if (avatar == "/avatars/thumb/missing.png") {
                avatar = "/system/users/avatars/uicon.jpg";
            }

            var newComponent = `
           		<div class="comment">
                	<div class="comment-user">
                	    <img src="${avatar}" alt="Avatar" class="avatar">
                	    <span>${data[i].email}:</span>
                	</div>
                	<div class="comment-body comment-text">
                	    ${data[i].text}
                	</div>
            	</div>
        	`;

            $(comments.children[1]).prepend(newComponent);
        }
    }

    //hide the comment pop up and remove all appended comments in the comment section
    const hideComments = function() {

        if (!comments) {
            return;
        }

        comments.classList.add("hidden");
        comments.children[1].innerHTML = "";
        comments = null;

        if (showWasUp) {
            showWasUp = false;
            liveShow();
        }
    }

    const deleteFromDom = function(i) {

        //replace/delete the first photo 
        if (i === 3 && slides.length == 4) {
            slider.classList.add("hidden");
            slider.parentNode.remove();
            return;
            
        } else if (i === 3 && slides.length > 4) {
            slider.parentNode.children[2].src = slides[i + 1].children[0].src;
        }

        //realign to the right
        let x;
        if (i == slides.length - 1) {
            slides[i].remove();
            for (let j = 3; j < slides.length; j++) {
                x = 1 * slides[j].dataset.position + 110;
                slides[j].dataset.position = x;
                slides[j].style.transform = "translateX( " + x + "% )";
            }
            index--;
            //realign to the left
        } else {
            for (let j = i + 1; j < slides.length; j++) {
                x = 1 * slides[j].dataset.position - 110;
                slides[j].dataset.position = x;
                slides[j].style.transform = "translateX( " + x + "% )";
            }
            slides[i].remove();
        }
    }

    //single click action
    const handleClick = function(clicked) {

        if (comments != null) {
            hideComments();
            return;
        }
        
        if (show) {
            clearInterval(show);
            show = null;
            showWasUp = true;
        }

        comments = slider.parentNode.children[1];
        comments.classList.remove("hidden");

        ids = [];
        ids.push(clicked.id); //pid
        ids.push(slider.id); //uid

        fetchComments();

    }

    ///////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////bind my handlers//////////////////////////

    //pagination buttons
    for (let i = 0; i < next.length; i++) {
        let direction = null;
        if (next[i].classList.contains("pagination-right")) {
            direction = 1;
        } else {
            direction = -1;
        }
        next[i].addEventListener("click", slide.bind(direction));
    }

    // show/hide slider
    for (let i = 0; i < containers.length; i++) {
        closeCommentBtn[i].addEventListener("click", hideComments);
        containers[i].addEventListener("mouseover", mouseIn);
        containers[i].addEventListener("mouseleave", mouseOut);
        options[i].addEventListener("click", imageOptions);
        post[i].addEventListener("click", addComment);
    }

    //handle the clicks on the picture
    grid.addEventListener("click", (event) => {

        const clicked = event.target.closest(".slide-image");

        if (!clicked) {
            return;
        }

        clicks++;
        if (clicks === 1) {
            singleClickTimer = setTimeout(() => {
                clicks = 0;
                handleClick(clicked);
            }, 200);
        } else if (clicks === 2) {
            clearTimeout(singleClickTimer);
            clicks = 0;
            deletePhoto();
        }
    }, false)
}
