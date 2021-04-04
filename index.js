function openCategory(e,category_name) {
    document.querySelector('.category_wrapper').style.display = "none"

    //Show category title
    let title_wrapper = document.querySelector('.category_title')
    title_wrapper.style.display = "block"
    title_wrapper.innerHTML = 
    `
    <button id="btn_back" onclick="closeCategory(event)"></button>
    <div class="title" style="font-size: 18px; padding-left: 30px">${category_name}</div>
    `

    //Show items
    let item_wrapper = document.querySelector('.item_wrapper')
    item_wrapper.style.display = "block"
    item_wrapper.innerHTML =
    `
    <div class="item">
        <img class="item_thumb" id="802232913" alt="basic_black_cardigan" draggable="true" ondragstart="drag(event)" src="images/cardigan/802232913.png">
        <div class="title">Basic Black</div>
    </div>
    `
}

function closeCategory(e) {
    document.querySelector('.category_title').style.display = "none"
    document.querySelector('.category_wrapper').style.display = "block"
    document.querySelector('.item_wrapper').style.display = "none"
}
               
function allowDrop(ev) {ev.preventDefault();}

function drag(ev) {
    ev.dataTransfer.setData("item_id", ev.target.id);
    //ev.dataTransfer.effectAllowed = "copy";
}

function drop(ev) {
    ev.preventDefault();
    var item_id = ev.dataTransfer.getData("item_id");
    var copyimg = document.createElement("img");
    var original = document.getElementById(item_id);
    
    copyimg.src = original.src;
    copyimg.style.position = "absolute";
    console.dir(ev)
    copyimg.style.left = ev.clientX - ev.target.offsetLeft+"px";
    copyimg.style.top = ev.clientY - ev.target.offsetTop+"px";
    copyimg.style.width = '110px';
    copyimg.style.height = '110px';
    copyimg.style.objectFit = 'contain';
    ev.target.appendChild(copyimg);
    
}