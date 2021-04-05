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
    //e.dataTransfer.effectAllowed = "copy";
}

function drop(e) {
    e.preventDefault();
    console.log("drop")

    var item_id = e.dataTransfer.getData("item_id");
    var copyimg = document.createElement("img");
    var original = document.getElementById(item_id);

    copyimg.className = "chosen_item";
    copyimg.src = original.src;
    copyimg.style.position = "absolute";
    copyimg.style.left = (e.clientX - e.target.offsetLeft - 55) +"px";
    copyimg.style.top = (e.clientY - e.target.offsetTop - 55) +"px";
    copyimg.style.height = '110px';
    copyimg.style.objectFit = 'contain';
    copyimg.ondragstart = function() {return false}
    e.target.appendChild(copyimg);
    
    let canvas = document.getElementsByClassName("canvas")[0];
    canvas.addEventListener("touchstart", dragStart, false);
    canvas.addEventListener("touchend", dragEnd, false);
    canvas.addEventListener("touchmove", dragItem, false);

    canvas.addEventListener("mousedown", dragStart, false);
    canvas.addEventListener("mouseup", dragEnd, false);
    canvas.addEventListener("mousemove", dragItem, false);

    copyimg.addEventListener('click', function init() {
        // copyimg.className = copyimg.className + ' resizable';
        var resizer = document.createElement('div');
        resizer.className = 'resizer';
        copyimg.appendChild(resizer);
        console.dir(resizer)
        // resizer.addEventListener('mousedown', initDrag, false);
    }, false);
}

//Resize
// function initDrag(e) {
//    let startX = e.clientX;
//    let startY = e.clientY;
//    let startWidth = parseInt(document.defaultView.getComputedStyle(p).width, 10);
//    let startHeight = parseInt(document.defaultView.getComputedStyle(p).height, 10);
//    document.documentElement.addEventListener('mousemove', doDrag, false);
//    document.documentElement.addEventListener('mouseup', stopDrag, false);
// }

// function doDrag(e) {
//    p.style.width = (startWidth + e.clientX - startX) + 'px';
//    p.style.height = (startHeight + e.clientY - startY) + 'px';
// }

// function stopDrag(e) {
//     document.documentElement.removeEventListener('mousemove', doDrag, false);    document.documentElement.removeEventListener('mouseup', stopDrag, false);
// }


//Move item

var activeItem = null;
var active = false;

function dragStart(e) {
    console.log("start")
    if (e.target !== e.currentTarget) {
        active = true;

        activeItem = e.target;

        if (activeItem !== null) {
            if (!activeItem.xOffset) {activeItem.xOffset = 0}
            if (!activeItem.yOffset) {activeItem.yOffset = 0}
            if (e.type === "touchstart") {
                activeItem.initialX = e.touches[0].clientX - activeItem.xOffset;
                activeItem.initialY = e.touches[0].clientY - activeItem.yOffset;
            } else {
                //console.log("doing something!");
                activeItem.initialX = e.clientX - activeItem.xOffset;
                activeItem.initialY = e.clientY - activeItem.yOffset;
            }
        }
    }
}

function dragEnd(e) {
    console.log("end")
    if (activeItem !== null) {
        activeItem.initialX = activeItem.currentX;
        activeItem.initialY = activeItem.currentY;
    }
    active = false;
    activeItem = null;
}

function dragItem(e) {
    console.log("moving")
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

  