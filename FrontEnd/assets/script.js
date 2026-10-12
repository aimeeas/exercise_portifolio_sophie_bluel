const modeEdition = document.querySelector(".mode-edition");
const token = localStorage.getItem("token");
const navLogin = document.querySelector("#nav-login");
const navLogout = document.querySelector("#nav-logout");

if (token) {
    modeEdition.classList.add("visible");
    navLogout.classList.add("visible");
    navLogin.classList.add("hidden");
}

navLogout.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.reload();
});


// Récupération des pièces depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

 // Récupération de l'élément du DOM qui accueillera les fiches
const gallery = document.querySelector(".gallery")

// Création des éléments de la galerie
function createGallery(works){
    gallery.innerHTML = "";   // AJOUT : on vide la galerie avant de la reconstruire
    for (let i = 0; i < works.length; i++) {

        const work = works[i];

        // Création d’une balise dédiée à chaque work
        const figures = document.createElement("figure");
        gallery.appendChild(figures);
        // Création des éléments de chaque work
        // Image
        const image = document.createElement("img");
        image.src = work.imageUrl;
        figures.appendChild(image)
        // Caption de l'image
        const caption = document.createElement("figcaption");
        caption.innerText = work.title;
        figures.appendChild(caption)
    };
};

createGallery(works);


// Récupération des catégories depuis l'API
const reponseCat = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCat.json();

// AJOUT : récupération du conteneur des filtres
const filtres = document.querySelector("#filtres");

// Création des filtres
function createFilters (categories){

    // Bouton "Tous" créé à part, car il ne vient pas de l'API
    const btnTous = document.createElement("button");
    btnTous.textContent = "Tous";
    filtres.appendChild(btnTous);

    btnTous.addEventListener("click", function () {
        createGallery(works);
    });

    // Boutons des catégories de l'API
    for (let i = 0; i < categories.length; i++) {

        const categorie = categories[i];

        const button = document.createElement("button");
        filtres.appendChild(button);

        button.textContent = categorie.name;
        button.dataset.id = categorie.id;

        button.addEventListener("click", function () {
            const resultat = works.filter(function (work) {
                return work.categoryId === categorie.id;
            });
            createGallery(resultat);
        });
    };
};

createFilters(categories);