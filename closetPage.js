const form = document.getElementById("search_form");
const category_wrapper = document.querySelector(".category_wrapper");
var item_wrapper = document.querySelector(".item_wrapper");
var category_title = document.querySelector(".category_title");
var btn_search = document.getElementById("btn_search");
var btn_close = document.getElementsByClassName("btn_close");
var input_wrapper = document.getElementById("input_wrapper");
var search_input = document.getElementById("search_input");
var canvas = document.getElementsByClassName("canvas")[0];

var itemList = {
  accessories: [],
  blouse: [],
  boots: [],
  glasses: [],
  shoulder_bag: [],
  tote_bag: [],
  socks: [],
  watches: [],
  cardigan: [],
  coat: [],
  jacket: [],
  zip_up: [],
  knitwears: [],
  long_sleeve: [],
  short_sleeve: [],
  sleeveless: [],
  maxi_dress: [],
  mini_dress: [],
  skirt: [],
  short_pants: [],
  pants: [],
  jeans: [],
  sneakers: [],
};
var loveList = JSON.parse(localStorage.getItem("love list") || "[]");

async function getAllData() {
  let collection = db.collection("items");
  let allItems = await collection.get();
  for (const doc of allItems.docs) {
    itemList[doc.data().category].push(doc.id);
  }
}

getAllData();

async function renderItem(id) {
  let thisItem = await firebase.firestore().collection("items").doc(id).get();
  let category_name = thisItem.data().category;
  let price = thisItem.data().price;

  //Init
  let item = document.createElement("div");
  let option_wrapper = document.createElement("div");
  let btn_link = document.createElement("a");
  let btn_love = document.createElement("i");
  let img = document.createElement("img");
  let price_tag = document.createElement("div");

  item.classList.add("item");

  option_wrapper.classList.add("option_wrapper");
  option_wrapper.classList.add("flex-btw-center");
  option_wrapper.style.display = "none";
  btn_link.classList.add("btn_link");
  btn_love.classList.add("btn_love");
  if (loveList.includes(id)) {
    btn_love.classList.toggle("btn_loved");
  }

  btn_link.href = "https://codibook.net/item/8343134";
  btn_link.target = "_blank";

  //Truyen thong so
  img.classList.add("item_thumb");
  img.id = `${id}`;
  img.setAttribute("draggable", true);
  img.setAttribute("ondragstart", "dragTransfer(event)");
  img.src = `images/${category_name}/${id}.png`;

  price_tag.classList.add("boldtitle");
  price_tag.textContent = `đ${price}.000`;

  option_wrapper.appendChild(btn_link);
  option_wrapper.appendChild(btn_love);
  item.appendChild(option_wrapper);
  item.appendChild(img);
  item.appendChild(price_tag);

  item_wrapper.appendChild(item);

  item.addEventListener("mouseenter", () => {
    option_wrapper.style.display = "flex";
    option_wrapper.style.zIndex = 100;
  });

  item.addEventListener("mouseleave", () => {
    option_wrapper.style.display = "none";
  });

  btn_love.addEventListener("click", () => {
    btn_love.classList.toggle("btn_loved");
    let loveItem = id;

    if (btn_love.classList.contains("btn_loved")) {
      loveList.push(loveItem);
      localStorage.setItem("love list", JSON.stringify(loveList));
    } else {
      loveList = loveList.filter((loveItem) => loveItem !== id);
      localStorage.setItem("love list", JSON.stringify(loveList));
    }
  });
}

function openCategory(category_name) {
  category_wrapper.style.display = "none";
  item_wrapper.style.display = "block";
  category_title.style.display = "block";

  //Show title
  category_title.innerHTML = `
    <button id="btn_back" onclick="closeCategory()"></button>
    <div class="boldtitle" style="font-size: 18px; padding-left: 30px">${category_name}</div>
    `;

  item_wrapper.innerHTML = "";

  let theList = itemList[category_name];
  theList.forEach((id) => {
    renderItem(id);
  });
}

function closeCategory() {
  category_wrapper.style.display = "block";
  category_title.style.display = "none";
  item_wrapper.style.display = "none";
}

function openLoveList() {
  category_wrapper.style.display = "none";
  item_wrapper.style.display = "block";
  category_title.style.display = "block";

  //Show title
  category_title.innerHTML = `
    <button id="btn_back" onclick="closeCategory()"></button>
    <div class="boldtitle" style="font-size: 18px; padding-left: 30px">Love List</div>
    `;

  item_wrapper.innerHTML = "";
  loveList.forEach((doc) => renderItem(doc));
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  category_wrapper.style.display = "none";
  category_title.style.display = "none";
  item_wrapper.style.display = "block";
  item_wrapper.innerHTML = "";

  let collection = db.collection("items");
  let allItems = await collection.get();

  for (const doc of allItems.docs) {
    if (doc.data().color === form[0].value) {
      await renderItem(doc.id);
    }
  }

  if (!item_wrapper.childElementCount) {
    item_wrapper.innerText = "No items found";
  }
});

function allowDrop(e) {
  e.preventDefault();
}

function dragTransfer(e) {
  e.dataTransfer.setData("item_id", e.target.id);
}

function drop(event) {
  console.log("DROP");
  event.preventDefault();
  let item_id = event.dataTransfer.getData("item_id");
  let original = document.getElementById(item_id);
  let copyimg_wrapper = document.createElement("div");
  let copyimg = document.createElement("img");
  let btn_delete = document.createElement("button");

  //Delete Button
  btn_delete.classList.add("btn_close");
  btn_delete.style.position = "absolute";
  btn_delete.style.right = 0;
  btn_delete.addEventListener("click", () => {
    copyimg_wrapper.remove();
  });

  //Clone Image
  copyimg_wrapper.className = "chosen_item resizable";
  copyimg.src = original.src;
  copyimg.style.objectFit = "contain";

  copyimg_wrapper.style.position = "absolute";
  //copyimg_wrapper.style.height = '200px';
  copyimg_wrapper.style.width = "200px";
  copyimg_wrapper.style.left = event.clientX - canvas.getBoundingClientRect().left - 55 + "px";
  copyimg_wrapper.style.top = event.clientY - canvas.getBoundingClientRect().top - 55 + "px";

  copyimg_wrapper.appendChild(btn_delete);
  copyimg_wrapper.appendChild(copyimg);

  //Moving
  copyimg_wrapper.ondragstart = function () {
    return false;
  };

  event.target.appendChild(copyimg_wrapper);

  //Resize
  copyimg_wrapper.addEventListener("click", (e) => {
    e.stopPropagation();
    selectElement(e.target,copyimg_wrapper);
  });
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
    if (
      activeItem.className.includes("resizable") &&
      !activeItem.className.includes("unresizable")
    ) {
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
      activeItem.initialLeft = parseInt(
        activeItem.style.left.replace("px", "")
      );
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

    const newLeft =
      activeItem.initialLeft + (activeItem.currentX - activeItem.initialX);
    const newTop =
      activeItem.initialTop + (activeItem.currentY - activeItem.initialY);

    activeItem.style.left = `${newLeft}px`;
    activeItem.style.top = `${newTop}px`;
  }
}

function renew() {
  let canvas = document.querySelector(".canvas");
  canvas.innerHTML = "";
}

btn_search.addEventListener("click", () => {
  input_wrapper.style.display = "flex";

  search_input.focus();
  btn_search.disabled = true;

  window.onload = function () {
    //var category_title = document.getElementsByClassName("category_title");
    //console.log(category_title);
    category_title.style.padding = "0 0 0 150px";
  };
});

btn_close[0].addEventListener("click", () => {
  input_wrapper.style.display = "none";
  search_input.value = "";
  btn_search.disabled = false;
  closeCategory();
});

function saveImage() {
  localStorage.setItem("item", document.getElementById("canvas").innerHTML);
  html2canvas(document.querySelector(".canvas"), {
    onrendered: function (canvas) {
      console.log(canvas.fileName);
      return Canvas2Image.saveAsPNG(canvas, 1000, 1000);
    },
  });
}

function deselectAll() {
    let chosen_item = document.getElementsByClassName("chosen_item");
    for (let i = 0; i < chosen_item.length; ++i) {
      let copyimg_wrapper = chosen_item[i];
      let btn_delete = copyimg_wrapper.children[0]
  
      copyimg_wrapper.classList.remove("resizable");
      copyimg_wrapper.classList.add("unresizable");
      btn_delete.style.display = "none";
    }
}

function selectElement(targetElement,copyimg_wrapper) {
      let btn_delete = copyimg_wrapper.children[0];   
      if (targetElement.tagName == "IMG") {targetElement = targetElement.parentElement;}
      console.dir(targetElement)

      targetElement.ondragstart = function () {
        return false;
      };
      
        if (targetElement == copyimg_wrapper) {
          if (copyimg_wrapper.classList.contains("resizable")) {
            copyimg_wrapper.classList.remove("resizable");
            copyimg_wrapper.classList.add("unresizable");
            btn_delete.style.display = "none";
            return;
          }
          deselectAll();
          copyimg_wrapper.classList.remove("unresizable");
          copyimg_wrapper.classList.add("resizable");
          btn_delete.style.display = "block";
          return;
        }
}

canvas.addEventListener("touchstart", dragStart, false);
canvas.addEventListener("touchend", dragEnd, false);
canvas.addEventListener("touchmove", dragItem, false);

canvas.addEventListener("mousedown", dragStart, false);
canvas.addEventListener("mouseup", dragEnd, false);
canvas.addEventListener("mousemove", dragItem, false);

canvas.addEventListener("click", (e) => {deselectAll();})

window.onload = function() {
  let chosen_item = document.getElementsByClassName("chosen_item");
  
  for (let i = 0; i < chosen_item.length; ++i) { 
    console.dir(chosen_item[i]);
    let copyimg_wrapper = chosen_item[i];
    let btn_delete = copyimg_wrapper.children[0];   
    btn_delete.addEventListener("click", () => {
      copyimg_wrapper.remove();
    }); 
  
    copyimg_wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      selectElement(e.target,copyimg_wrapper);
    });
  }
}
