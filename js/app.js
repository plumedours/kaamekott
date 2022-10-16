const button = document.querySelector("#button");
const saisonTxt = document.querySelector(".saison");
const quoteTxt = document.querySelector(".quote");
const persoTxt = document.querySelector(".personnage");
const url = "../quotes.json";

getQuote();

function getQuote() {
    fetch(url)
        .then(response => response.json())
        .then(json => {
            const x = Math.floor(Math.random() * json.length);
            // console.log(json[x].title + " - " + json[x].season);
            // console.log(json[x].quote);
            // console.log(json[x].personnage);
            saisonTxt.textContent = json[x].title + " - " + json[x].season;
            quoteTxt.textContent = json[x].quote;
            persoTxt.textContent = json[x].personnage;
        })
};

button.addEventListener("click", getQuote);