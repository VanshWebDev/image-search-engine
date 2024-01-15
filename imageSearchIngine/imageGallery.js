const apiKey = "KUH4iZln24OFIWneILAXpM-MVilFtHkjKApNfawcHeY"
const apiUrl = "https://api.unsplash.com/search/photos?page=10&query=car";
const darkMode = document.querySelector(".form-switch")
const darkModeText = document.querySelector(".form-check-label")
const input = document.querySelector(".input");
const form = document.querySelector(".form");
const imageContainer = document.querySelector(".imageContainer");
const showMore = document.querySelector(".showMore");
const warning = document.querySelector(".warning");
const birds = document.querySelector(".birds");
const wallpaper = document.querySelector(".wallpaper");
const phone = document.querySelector(".phone");
const animals = document.querySelector(".animals");
const car = document.querySelector(".car");
const nature = document.querySelector(".nature");
const gym = document.querySelector(".gym");
const bike = document.querySelector(".bike");
const shoes = document.querySelector(".shoes");
const outerDiv = document.querySelector(".outerDiv")
const ai = document.querySelector(".ai");
const imageDiv = document.querySelector(".imageDiv");
const faRegular = document.querySelector(".fa-regular");
const faDownload = document.querySelector(".fa-download");
const increase = document.querySelector(".increase");
const decrease = document.querySelector(".decrease");



// This function fetches the image URL from the Unsplash API and appends it to the imageContainer element
function fetchImageURL(input) {
    imageContainer.innerHTML = "";
    fetch(`https://api.unsplash.com/search/photos?page=10&query=${input}&client_id=${apiKey}&per_page=30`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log(data)
            fetchImage(data)
        }).catch((error) => {
            console.info("API could't fetch by default pic ok")
        })

}






function fetchImage(data) {
    for (let i = 0; i < data.results.length; i++) {
        const imgUrl = data.results[i].urls.small;

        // ////////////////////////////////

        let outerDiv = document.createElement("div");
        outerDiv.classList.add("outerDiv");
        imageContainer.append(outerDiv);

        // ////////////////////////////////
        let div = document.createElement("div");
        div.classList.add("imageDiv");
        outerDiv.appendChild(div);
        // div.style.backgroundImage = `url(${imgUrl})`;

        let img = document.createElement("img");
        img.classList.add("realImage")
        img.src = imgUrl;
        div.appendChild(img);

        let div1 = document.createElement("div");
        div1.classList.add("optionDiv");
        div.appendChild(div1);

        let picOption = document.createElement("div");
        picOption.classList.add("picOption");
        div.appendChild(picOption);
        // download(picOption)

        imageDetails(div1, data, i)

        img.addEventListener("click", () => {
            createModal(data.results[i].urls.full, data, i); // calling function with image URL
        });

    }
}


function imageDetails(div1, data, i) {
    // console.log(data)
    let div2 = document.createElement("div");
    let div3 = document.createElement("i");
    let div4 = document.createElement("a");
    div4.href = data.results[i].links.download + "&force=true";
    let fileName = "yourFileName.jpg";  // Replace with your desired file name
    div4.download = fileName;


    div2.classList.add("userProfile");
    div3.classList.add("userProfileName");
    div4.classList.add("fa-solid");
    div4.classList.add("fa-download");
    div1.appendChild(div2);
    div1.appendChild(div3);
    div1.appendChild(div4);

    setProfilePic(data, i, div2, div3)
}

function setProfilePic(data, i, div2, div3) {
    div2.style.backgroundImage = `url(${data.results[i].user.profile_image.small})`
    let check = `${data.results[i].user.first_name}`
    // if(check.length>6){
    div3.innerHTML = check.slice(0, 6);
    // }
}

// Butto call//////////////
fetchImageURL("sport car");
fetchImageURL("wallpaper");
fetchImageURL("Phone");

const categories = ["birds", "wallpaper", "phone", "animals", "car", "nature", "gym", "bike", "shoes", "ai"];

categories.forEach(category => {
    const element = document.querySelector(`.${category}`);
    if (element) {
        element.addEventListener("click", () => {
            fetchImageURL(category);
            input.value = category;
            countImage = 0;
        });
    }
});

// fetchImageURL(category) 


///////////////// functio for input field ////////////////
async function search() {
    const picName = input.value;
    const response = await
        fetch(`https://api.unsplash.com/search/photos?page=10&query=${picName}&client_id=${apiKey}&per_page=30`);


    const pic = await response.json();
    console.log(pic.results.length)
    if (pic.results.length == 0) {
        warning.innerHTML = "enter correct name"
    }
    else {
        fetchImage(pic)
    }


}
//////////////////// functio for input field ///////////

// function for input field
form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input.value == "" || input.value == " " || input.value == "  " || input.value == "   ") {
        console.log("err")
        warning.innerHTML = "Please enter input"
        warning.style.color = "red"
    }
    else if (input.value.toLowerCase() === "vansh") {
           window.open("https://www.instagram.com/devloper.mind_/", "_blank");
    }
    else if (input.value.toLowerCase() === 'open my picture') {
        window.open("https://cdn.discordapp.com/avatars/1173627034438737972/020bb49bae36b3278fba2bc0af8f08a1.webp?size=100", "_blank");
    }
    else if (input.value.length > 20) {
        warning.innerHTML = "Name is big"
    }
    else {
        event.preventDefault();
        warning.innerHTML = "";
        imageContainer.innerHTML = "";
        search();
    }

});

let currentPage = 1;

// Function to fetch more images
async function fetchMoreImages(input, page) {
    const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${input}&client_id=${apiKey}&per_page=30`);

    const data = await response.json();
    console.log(data)
    return data;
}

// Function to append more images to the image container
async function showMoreImages() {

    console.log(input.value)
    const inputTerm = input.value || "car"; // Default to "car" if input is empty

    const nextPageImages = await fetchMoreImages(inputTerm, currentPage);
    currentPage++;



    if (nextPageImages.results.length === 0) {
        showMore.style.display = "none"; // Hide the "Show More" button if there are no more images.
    }
    else {
        fetchImage(nextPageImages);
    }
}

// Event listener for the "Show More" button
showMore.addEventListener("click", showMoreImages);

darkMode.addEventListener("click", () => {
    document.body.style.transition = "0.2s"
    if (document.body.style.backgroundColor === "black") {
        // darkModeText.innerHTML = "dark"
        document.body.style.backgroundColor = "white"
        imageContainer.style.color = "black"
        warning.style.color = "black"
        console.log(outerDiv)
        document.querySelector(".a1").style.color = "black"
        document.querySelector(".a2").style.color = "black"
        document.querySelector(".a3").style.color = "black"
        document.querySelector(".legal").style.color = "black"
        document.querySelector(".links").style.color = "black"
        document.querySelector(".links a").style.color = "black"
    }
    else {
        // darkModeText.innerHTML = "Light"
        document.body.style.backgroundColor = "black"
        imageContainer.style.color = "white"
        warning.style.color = "white"
        document.querySelector(".a1").style.color = "#808080"
        document.querySelector(".a2").style.color = "#808080"
        document.querySelector(".a3").style.color = "#808080"
        document.querySelector(".legal").style.color = "#808080"
        document.querySelector(".links").style.color = "#808080"
        document.querySelector(".links a").style.color = "white"
    }
})