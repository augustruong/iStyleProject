function renderItem(doc,category_name) {
    let item_wrapper = document.querySelector(`.${category_name}_wrapper`)
    item_wrapper.style.display = "block"

    item_wrapper.innerHTML +=
    `
    <div class="item">
        <img class="item_thumb" data-tilt data-tilt-scale="1.05"
             id="${doc.id}" draggable="true" ondragstart="dragTransfer(event)" 
             src="images/${category_name}/${doc.id}.png">
        <div class="boldtitle">${doc.data().price}</div>
    </div>
    `   
}

//Get data
    db.collection("cardigan").get()
    .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            renderItem(doc,"cardigan")
        });
    });

    db.collection("coat").get()
    .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            renderItem(doc,"coat")
        });
    });

function openCategory(category_name) {
    document.querySelector('.category_wrapper').style.display = "none"
    document.querySelector(`.${category_name}_wrapper`).style.display = "block"
    document.querySelector('.category_title').style.display = "block"
    
    //Show title
    document.querySelector('.category_title').innerHTML = 
    `
    <button id="btn_back" onclick="closeCategory('${category_name}')"></button>
    <div class="boldtitle" style="font-size: 18px; padding-left: 30px">${category_name}</div>
    `
}

function closeCategory(category_name) {
    document.querySelector('.category_wrapper').style.display = "block"
    document.querySelector('.category_title').style.display = "none"
    document.querySelector(`.${category_name}_wrapper`).style.display = "none"
}
               
function allowDrop(e) {e.preventDefault();}

function dragTransfer(e) {
    e.dataTransfer.setData("item_id", e.target.id);
}

function drop(e) {
    e.preventDefault();

    var item_id = e.dataTransfer.getData("item_id");
    var original = document.getElementById(item_id);
    var copyimg_wrapper = document.createElement("div");
    var copyimg = document.createElement("img");
    var btn_delete = document.createElement("button");
    let canvas = document.getElementsByClassName("canvas")[0];

    //Delete Button
    btn_delete.classList.add("btn_close")
    btn_delete.style.position = "absolute"
    btn_delete.style.right = 0
    btn_delete.addEventListener("click", () => {
        copyimg_wrapper.remove()
    })

    //Clone Image
    copyimg_wrapper.className = "chosen_item resizable";
    copyimg.src = original.src;
    copyimg.style.objectFit = 'contain';

    copyimg_wrapper.style.position = "absolute";
    copyimg_wrapper.style.height = '200px';
    copyimg_wrapper.style.width = '200px';
    copyimg_wrapper.style.left = (e.clientX - canvas.getBoundingClientRect().left - 55) +"px";
    copyimg_wrapper.style.top = (e.clientY - canvas.getBoundingClientRect().top - 55) +"px";

    copyimg_wrapper.appendChild(btn_delete);
    copyimg_wrapper.appendChild(copyimg);
    e.target.appendChild(copyimg_wrapper);


    //Moving 
    copyimg_wrapper.ondragstart = function() {return false}

    canvas.addEventListener("touchstart", dragStart, false);
    canvas.addEventListener("touchend", dragEnd, false);
    canvas.addEventListener("touchmove", dragItem, false);

    canvas.addEventListener("mousedown", dragStart, false);
    canvas.addEventListener("mouseup", dragEnd, false);
    canvas.addEventListener("mousemove", dragItem, false);

    //Resize
    canvas.addEventListener("click", (e) => {
        let targetElement = e.target; // clicked element

        do {
            // if click inside
            if (targetElement == copyimg_wrapper) { 
                if (copyimg_wrapper.classList.contains("resizable")) {
                    copyimg_wrapper.classList.remove("resizable");
                    copyimg_wrapper.classList.add("unresizable");
                    btn_delete.style.display = "none"
                    return;
                }
                copyimg_wrapper.classList.remove("unresizable");
                copyimg_wrapper.classList.add("resizable");
                btn_delete.style.display = "block"
                return;
            }
            //go up the DOM
            targetElement = targetElement.parentNode;
        } while (targetElement);

        //click outside
        copyimg_wrapper.classList.remove("resizable");
        copyimg_wrapper.classList.add("unresizable");
        btn_delete.style.display = "none"
    })

}

//Move item
var activeItem = null;
var active = false;

function dragStart(e) {
    if (e.target !== e.currentTarget) {
        activeItem = e.target;

        if (activeItem.tagName === "IMG") {
            activeItem = activeItem.parentElement;
        }
        if (activeItem.className.includes('resizable') && !activeItem.className.includes('unresizable')) {
            return;
        }

        active = true;

        if (activeItem !== null) {
            if (e.type === "touchstart") {
                activeItem.initialX = e.touches[0].clientX;
                activeItem.initialY = e.touches[0].clientY;
            } else {
                activeItem.initialX = e.clientX;
                activeItem.initialY = e.clientY;
            }
            activeItem.initialLeft = parseInt(activeItem.style.left.replace("px", ""));
            activeItem.initialTop = parseInt(activeItem.style.top.replace("px", ""));
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
            activeItem.currentX = e.touches[0].clientX;
            activeItem.currentY = e.touches[0].clientY;
        } else {
            activeItem.currentX = e.clientX;
            activeItem.currentY = e.clientY;
        }

        const newLeft = activeItem.initialLeft + (activeItem.currentX - activeItem.initialX);
        const newTop = activeItem.initialTop + (activeItem.currentY - activeItem.initialY);

        activeItem.style.left = `${newLeft}px`;
        activeItem.style.top = `${newTop}px`;
    }
}

function renew() {
    let canvas = document.querySelector('.canvas');
    canvas.innerHTML = ''
}

var btn_search = document.getElementById("btn_search");
var btn_close = document.getElementsByClassName("btn_close");
var input_wrapper = document.getElementById("input_wrapper")
var search_input = document.getElementById("search_input")

btn_search.addEventListener("click",() => {    
    input_wrapper.style.display = "flex"; 
    input_wrapper.classList.add('slide-in');
    input_wrapper.classList.remove('slide-out');
    
    search_input.focus();
    btn_search.disabled = true;

    window.onload = function() {
        var category_title = document.getElementsByClassName("category_title")
        console.log(category_title);
        category_title.style.padding = "0 0 0 150px";
    }
    
})

btn_close[0].addEventListener("click",() => {
    input_wrapper.classList.add('slide-out');
    input_wrapper.classList.remove('slide-in');
    input_wrapper.style.display = "none";
    search_input.value = '';
    btn_search.disabled = false;
})

// document.querySelector('#btn_save').addEventListener('click', () => {
//     html2canvas(document.querySelector('.canvas'), {
//         onrendered: function(canvas) {
//           return Canvas2Image.saveAsPNG(canvas);
//         }
//     });
// })