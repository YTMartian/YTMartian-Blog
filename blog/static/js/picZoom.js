// Get the modal
var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
//var img = document.getElementById('myImg');
var imgs = document.getElementsByClassName('img-judge');
var modalImg = document.getElementById("img01");
//var captionText = document.getElementById("caption");
for (var i = 0; i < imgs.length; i++) {
    imgs[i].onclick = function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        //captionText.innerHTML = this.alt;
    };
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("modal")[0];

// When the user clicks on screen, close the modal
span.onclick = function () {
    modal.style.display = "none";
};