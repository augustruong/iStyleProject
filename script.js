function openCategory(e,category_name) {
    document.querySelector('.category_wrapper').style.display = "none"
    renderTitle(category_name);
    renderItem();
}

function renderTitle(category_name) {
    let title_wrapper = document.querySelector('.category_title')
    title_wrapper.style.display = "block"
    title_wrapper.innerHTML = 
    `
    <button id="btn_back" onclick="closeCategory(event)"></button>
    <div class="title" style="font-size: 18px; padding-left: 30px">${category_name}</div>
    `
}

function renderItem() {
    let item_wrapper = document.querySelector('.item_wrapper')
    item_wrapper.style.display = "block"
    item_wrapper.innerHTML =
    `
    <div class="item">
        <img class="item_thumb" id="802232913" alt="basic_black_cardigan" draggable="true" ondragstart="dragTransfer(event)" 
             src="images/cardigan/802232913.png">
        <div class="title">Basic Black</div>
    </div>
    `   
}

function closeCategory(e) {
    document.querySelector('.category_title').style.display = "none"
    document.querySelector('.category_wrapper').style.display = "block"
    document.querySelector('.item_wrapper').style.display = "none"
}
               
function allowDrop(e) {e.preventDefault();}

function dragTransfer(e) {
    e.dataTransfer.setData("item_id", e.target.id);
}

function drop(e) {
    e.preventDefault();

    var item_id = e.dataTransfer.getData("item_id");
    var original = document.getElementById(item_id);
    var copyimg = document.createElement("img");
    var copyimg_wrapper = document.createElement("div");

    copyimg_wrapper.className = "chosen_item";
    copyimg.src = original.src;
    copyimg.style.position = "absolute";
    copyimg.style.left = (e.clientX - e.target.offsetLeft - 55) +"px";
    copyimg.style.top = (e.clientY - e.target.offsetTop - 55) +"px";
    copyimg.style.height = '110px';
    copyimg.style.objectFit = 'contain';

    copyimg_wrapper.style.height = '110px';
    
    copyimg_wrapper.ondragstart = function() {return false}

    copyimg_wrapper.appendChild(copyimg);
    e.target.appendChild(copyimg_wrapper);
    
    let canvas = document.getElementsByClassName("canvas")[0];
    canvas.addEventListener("touchstart", dragStart, false);
    canvas.addEventListener("touchend", dragEnd, false);
    canvas.addEventListener("touchmove", dragItem, false);

    canvas.addEventListener("mousedown", dragStart, false);
    canvas.addEventListener("mouseup", dragEnd, false);
    canvas.addEventListener("mousemove", dragItem, false);

    canvas.addEventListener("click", (e) => {
        let targetElement = e.target; // clicked element

        do {
            // if click inside
            if (targetElement == copyimg_wrapper) { 
                console.log("resizable");
                copyimg_wrapper.classList.remove("unresizable");
                copyimg_wrapper.classList.add("resizable");
                return;
            }
            //go up the DOM
            targetElement = targetElement.parentNode;
        } while (targetElement);

        //click outside
        console.log("click outside")
        copyimg_wrapper.classList.remove("resizable");
        copyimg_wrapper.classList.add("unresizable");
    })

}

//Move item
var activeItem = null;
var active = false;

function dragStart(e) {
    if (e.target !== e.currentTarget) {
        active = true;

        activeItem = e.target;
        console.dir(e.target)

        if (activeItem !== null) {
            if (!activeItem.xOffset) {activeItem.xOffset = 0}
            if (!activeItem.yOffset) {activeItem.yOffset = 0}
            if (e.type === "touchstart") {
                activeItem.initialX = e.touches[0].clientX - activeItem.xOffset;
                activeItem.initialY = e.touches[0].clientY - activeItem.yOffset;
            } else {
                activeItem.initialX = e.clientX - activeItem.xOffset;
                activeItem.initialY = e.clientY - activeItem.yOffset;
            }
        }
    }
}

function dragEnd(e) {
    if (activeItem !== null) {
        activeItem.initialX = activeItem.currentX;
        activeItem.initialY = activeItem.currentY;
    }
    active = false;
    activeItem = null;
}

function dragItem(e) {
    if (active) {
        if (e.type === "touchmove") {
            e.preventDefault();
            activeItem.currentX = e.touches[0].clientX - activeItem.initialX;
            activeItem.currentY = e.touches[0].clientY - activeItem.initialY;
        } else {
            activeItem.currentX = e.clientX - activeItem.initialX;
            activeItem.currentY = e.clientY - activeItem.initialY;
        }
        activeItem.xOffset = activeItem.currentX;
        activeItem.yOffset = activeItem.currentY;

        setTranslate(activeItem.currentX, activeItem.currentY, activeItem);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

function renew() {
    let canvas = document.querySelector('.canvas');
    canvas.innerHTML = ''
}


var search_box = document.querySelectorAll('.search_box input[type="text"] + span');

console.dir(search_box)

search_box.forEach((elm) => {
	elm.addEventListener('click', () => {
        console.log("click")
        elm.previousElementSibling.value = '';
	});
});