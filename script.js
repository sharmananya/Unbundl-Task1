const carousel = document.querySelector(".carousel"),
    firstImg = carousel.querySelectorAll("img")[0],
    arrowIcons = document.querySelectorAll(".wrapper i");

let isDragStart = false,
    isDragging = false,
    prevPageX,
    prevScrollLeft,
    positionDiff;

const showHideIcons = () => {
    // showing and hiding prev/next icon according to carousel scroll left value
    let scrollWidth = carousel.scrollWidth - carousel.clientWidth; // getting max scrollable width
    arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
    arrowIcons[1].style.display =
        carousel.scrollLeft == scrollWidth ? "none" : "block";
};

arrowIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
        let firstImgWidth = firstImg.clientWidth + 14; // getting first img width & adding 14 margin value
        // if clicked icon is left, reduce width value from the carousel scroll left else add to it
        carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
        setTimeout(() => showHideIcons(), 60); // calling showHideIcons after 60ms
    });
});

const autoSlide = () => {
    // if there is no image left to scroll then return from here
    if (
        carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) >
            -1 ||
        carousel.scrollLeft <= 0
    )
        return;

    positionDiff = Math.abs(positionDiff); // making positionDiff value to positive
    let firstImgWidth = firstImg.clientWidth + 14;
    // getting difference value that needs to add or reduce from carousel left to take middle img center
    let valDifference = firstImgWidth - positionDiff;

    let newScrollLeft;
    if (carousel.scrollLeft > prevScrollLeft) {
        // if user is scrolling to the right
        newScrollLeft =
            carousel.scrollLeft +
            (positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff);
    } else {
        // if user is scrolling to the left
        newScrollLeft =
            carousel.scrollLeft -
            (positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff);
    }
    carousel.scrollLeft = newScrollLeft;
};

const dragStart = (e) => {
    // updatating global variables value on mouse down event
    isDragStart = true;
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
    // scrolling images/carousel to left according to mouse pointer
    if (!isDragStart) return;
    e.preventDefault();
    isDragging = true;
    carousel.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    carousel.scrollLeft = prevScrollLeft - positionDiff;
    showHideIcons();
};
let slideshowInterval;

const startSlideshow = () => {
    slideshowInterval = setInterval(() => {
        let firstImgWidth = firstImg.clientWidth + 14;
        carousel.scrollLeft += firstImgWidth;
        setTimeout(() => {
            showHideIcons();
            if (
                carousel.scrollLeft >=
                carousel.scrollWidth - carousel.clientWidth
            ) {
                carousel.scrollLeft = 0;
            }
        }, 60);
    }, 2000); // Adjust the interval time (in milliseconds) as needed
};

const stopSlideshow = () => {
    clearInterval(slideshowInterval);
};

startSlideshow(); // Start the slideshow initially

// Add event listeners to pause the slideshow when the user interacts with the carousel
carousel.addEventListener("mousedown", stopSlideshow);
carousel.addEventListener("touchstart", stopSlideshow);
carousel.addEventListener("mouseup", startSlideshow);
carousel.addEventListener("touchend", startSlideshow);

const dragStop = () => {
    isDragStart = false;
    carousel.classList.remove("dragging");

    if (!isDragging) return;
    isDragging = false;
    autoSlide();
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);

document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);

document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);
