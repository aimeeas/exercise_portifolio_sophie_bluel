import { createModal, galleryModal, resetPreview, initFormAjout, initSuppression } from "./modal.js";

const token = localStorage.getItem("token");

if (token) {
    // Barre "Mode édition"
    const header = document.getElementById("header-connected");
    header.classList.add("mode-edition");

    const pHeader = document.createElement("p");
    const iconeEdition = document.createElement("i");
    iconeEdition.classList.add("fa-regular", "fa-pen-to-square");
    pHeader.appendChild(iconeEdition);
    pHeader.append(" Mode édition");
    header.appendChild(pHeader);

    // Cacher "login"
    const navLogin = document.getElementById("nav-login");
    navLogin.style.display = "none";

    // Créer "logout"
    const navLogout = document.createElement("li");
    navLogout.id = "nav-logout";

    const lienLogout = document.createElement("a");
    lienLogout.href = "#";
    lienLogout.textContent = "logout";

    navLogout.appendChild(lienLogout);   // le lien dans le <li>
    navLogin.after(navLogout);           // le <li> juste après "login"

    navLogout.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("token");
        window.location.reload();
    });

    // Bouton "modifier" à côté de "Mes Projets"
    const projets = document.getElementById("projets");

    const btnModifier = document.createElement("a");
    btnModifier.href = "#";
    btnModifier.id = "btn-modifier";

    const iconeModifier = document.createElement("i");
    iconeModifier.classList.add("fa-regular", "fa-pen-to-square");
    btnModifier.appendChild(iconeModifier);
    btnModifier.append(" modifier");

    projets.appendChild(btnModifier);

    // Cacher les filtres
    const filtresConnecte = document.getElementById("filtres");
    filtresConnecte.style.display = "none";
}


// Récupération des pièces depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

// Récupération de l'élément du DOM qui accueillera les fiches
const gallery = document.querySelector(".gallery");

// Création des éléments de la galerie
function createGallery(works) {
    gallery.innerHTML = "";   // on vide la galerie avant de la reconstruire
    for (let i = 0; i < works.length; i++) {

        const work = works[i];

        // Création d'une balise dédiée à chaque work
        const figure = document.createElement("figure");
        gallery.appendChild(figure);

        // Image
        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.alt = work.title;
        figure.appendChild(image);

        // Caption de l'image
        const caption = document.createElement("figcaption");
        caption.innerText = work.title;
        figure.appendChild(caption);
    }
}

createGallery(works);


// Récupération des catégories depuis l'API
const reponseCat = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCat.json();

// Récupération du conteneur des filtres
const filtres = document.querySelector("#filtres");

// Création des filtres
function createFilters(categories) {

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
        button.textContent = categorie.name;
        button.dataset.id = categorie.id;
        filtres.appendChild(button);

        button.addEventListener("click", function () {
            const resultat = works.filter(function (work) {
                return work.categoryId === categorie.id;
            });
            createGallery(resultat);
        });
    }
}

createFilters(categories);


// ===== Modal =====

// 1. Création du modal (doit être fait AVANT tout le reste)
createModal(categories);

// 2. Éléments du modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const modalBody = document.querySelector(".modal_body");
const vueGalerie = document.querySelector(".vue_galerie");
const vueAjout = document.querySelector(".vue_ajout");

// 3. Galerie du modal
galleryModal(modalBody, works);


// Navigation entre les deux vues

function showVueGalerie() {
    vueGalerie.classList.remove("hidden");
    vueAjout.classList.add("hidden");
}

function showVueAjout() {
    vueGalerie.classList.add("hidden");
    vueAjout.classList.remove("hidden");
}

document.querySelector(".ajouter_photo").addEventListener("click", showVueAjout);
document.querySelector(".modal_retour").addEventListener("click", showVueGalerie);


// Ouverture / fermeture du modal

function openModal() {
    modal.classList.add("open");
    overlay.classList.add("open");
}

function closeModal() {
    modal.classList.remove("open");
    overlay.classList.remove("open");
    showVueGalerie(); // à la réouverture, on revient toujours sur la galerie
    resetPreview();   // et la zone d'upload est vide
}

// Ouvrir avec "modifier"
const btnModifier = document.getElementById("btn-modifier");
if (btnModifier) {
    btnModifier.addEventListener("click", function (event) {
        event.preventDefault(); // évite que le "#" remonte la page
        openModal();
    });
}

// Fermer avec la croix, en cliquant sur le fond ou avec Échap
document.querySelector(".modal_close").addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModal();
    }
});


// Ajout d'une photo

initFormAjout(function (nouveauWork) {
    works.push(nouveauWork);           // ajoute la photo à la liste
    createGallery(works);              // met à jour la galerie de la page
    galleryModal(modalBody, works);    // met à jour la galerie du modal
    // le modal reste ouvert sur le formulaire, déjà vidé par initFormAjout
});


// Suppression d'une photo

initSuppression(modalBody, function (id) {
    // Retire le work de la liste
    const index = works.findIndex(function (work) {
        return work.id === id;
    });
    works.splice(index, 1);

    createGallery(works);              // met à jour la galerie de la page
    galleryModal(modalBody, works);    // met à jour la galerie du modal
});