function transition(page) {
    var item_wrapper = document.querySelectorAll(".floating_items_wrapper")[0];
    var hero_wrapper = document.querySelector(".hero_wrapper")

    for (var i = 0; i < item_wrapper.children.length; i++) {
        var child = item_wrapper.children[i];
            child.className="flyingback"
            console.dir(child)
    }

    setTimeout(function(){
        hero_wrapper.classList.remove("animate__fadeInDown")
        hero_wrapper.classList.add("animate__fadeOutUp")
    }, 500);

    setTimeout(function(){ window.location.href = page; }, 900);
    
  }