const form = document.getElementById("search_form");
const category_wrapper = document.querySelector(".category_wrapper");
var item_wrapper = document.querySelector(".item_wrapper");
var category_title = document.querySelector(".category_title");
var btn_search = document.getElementById("btn_search");
var btn_close = document.getElementsByClassName("btn_close");
var input_wrapper = document.getElementById("input_wrapper");
var search_input = document.getElementById("search_input");

var loveList = JSON.parse(localStorage.getItem("love list") || "[]");

function renderItem(id,price,category_name) {
  let item_wrapper = document.querySelector(".item_wrapper");

  let item = document.createElement("div");
  let option_wrapper = document.createElement("div");
  let btn_love = document.createElement("button");
  let img = document.createElement("img");
  let price_tag = document.createElement("div");

  item.classList.add("item")

  option_wrapper.classList.add("option_wrapper")
  option_wrapper.style.display = "none"
  btn_love.classList.add("btn_love")

  img.classList.add("item_thumb")
  img.id = `${id}`
  img.setAttribute("draggable",true);
  img.setAttribute("ondragstart","dragTransfer(event)");
  img.src = `images/${category_name}/${id}.png`

  price_tag.classList.add("boldtitle");
  price_tag.textContent = `đ${price}.000`

  option_wrapper.appendChild(btn_love);
  item.appendChild(option_wrapper)
  item.appendChild(img)
  item.appendChild(price_tag)

  item_wrapper.appendChild(item)

  img.addEventListener("mouseenter", () => {
    option_wrapper.style.display = "block"
    option_wrapper.style.zIndex = 100;
  })

  img.addEventListener("mouseleave", () => {
    option_wrapper.style.display = "none"
  })

  btn_love.addEventListener("click", () => {
    console.log("love")
    let id = img.id;
    let loveItem = {id, price, category_name};
    loveList.push(loveItem)
    localStorage.setItem('love list', JSON.stringify(loveList));
  })


  // item_wrapper.innerHTML += `
  //   <div class="item">
  //       <div class="option_wrapper" style="display:none;">
  //           <button class="btn_love"></button>
  //       </div>
  //       <img class="item_thumb" data-tilt data-tilt-scale="1.05"
  //            id="${doc.id}" draggable="true" ondragstart="dragTransfer(event)" 
  //            src="images/${category_name}/${doc.id}.png">
  //       <div class="boldtitle">đ${doc.data().price}.000</div>
  //   </div>
  //   `;
    
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
  db.collection(`${category_name}`)
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        renderItem(doc.id, doc.data().price, `${category_name}`);
      });
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
  loveList.forEach(doc => renderItem(doc.id,doc.price,doc.category_name));
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  category_wrapper.style.display = "none";
  category_title.style.display = "none";
  item_wrapper.style.display = "block";
  item_wrapper.innerHTML = "";

  for (let i = 0; i < 23; ++i) {
    let category_name = category_wrapper.children[i].id;

    let collection = db.collection(`${category_name}`);
    let allItems = await collection.get();
    for (const doc of allItems.docs) {
      if (doc.data().color === form[0].value) {
        renderItem(doc.id,doc.data().price,category_name);
      }
    }
  }

  console.log(`Found ${item_wrapper.childElementCount} items`);
  //if (!item_wrapper.childElementCount) {console.log("No items found")}
});

function allowDrop(e) {
  e.preventDefault();
}

function dragTransfer(e) {
  e.dataTransfer.setData("item_id", e.target.id);
}

function drop(e) {
  e.preventDefault();

  let item_id = e.dataTransfer.getData("item_id");
  let original = document.getElementById(item_id);
  let copyimg_wrapper = document.createElement("div");
  let copyimg = document.createElement("img");
  let btn_delete = document.createElement("button");
  let canvas = document.getElementsByClassName("canvas")[0];

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
  copyimg_wrapper.style.left =
    e.clientX - canvas.getBoundingClientRect().left - 55 + "px";
  copyimg_wrapper.style.top =
    e.clientY - canvas.getBoundingClientRect().top - 55 + "px";

  copyimg_wrapper.appendChild(btn_delete);
  copyimg_wrapper.appendChild(copyimg);
  e.target.appendChild(copyimg_wrapper);

  //Moving
  copyimg_wrapper.ondragstart = function () {
    return false;
  };

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
          btn_delete.style.display = "none";
          return;
        }
        copyimg_wrapper.classList.remove("unresizable");
        copyimg_wrapper.classList.add("resizable");
        btn_delete.style.display = "block";
        return;
      }
      //go up the DOM
      targetElement = targetElement.parentNode;
    } while (targetElement);

    //click outside
    copyimg_wrapper.classList.remove("resizable");
    copyimg_wrapper.classList.add("unresizable");
    btn_delete.style.display = "none";
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
