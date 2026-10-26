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


// Création du Modal

function createModal() {

    // Overlay (fond sombre)
	const overlay = document.createElement("div");
	overlay.classList.add("overlay");
	document.body.appendChild(overlay);

	// Conteneur principal
	const modal = document.createElement("div");
	modal.classList.add("modal");

	// Header
	const modalHeader = document.createElement("div");
	modalHeader.classList.add("modal_header");

	const modalClose = document.createElement("div");
	modalClose.classList.add("modal_close");
	modalClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';

	const modalTitre = document.createElement("div");
	modalTitre.classList.add("modal_titre");
	modalTitre.textContent = "Galerie Photo";

	modalHeader.appendChild(modalClose);
	modalHeader.appendChild(modalTitre);

	// Body (les photos seront ajoutées par galleryModal)
	const modalBody = document.createElement("div");
	modalBody.classList.add("modal_body");

	// Footer
	const modalFooter = document.createElement("div");
	modalFooter.classList.add("modal_footer");

	const ajouterPhoto = document.createElement("div");
	ajouterPhoto.classList.add("ajouter_photo");
	ajouterPhoto.textContent = "Ajouter une photo";

	modalFooter.appendChild(ajouterPhoto);

	// Assemblage
	modal.appendChild(modalHeader);
	modal.appendChild(modalBody);
	modal.appendChild(modalFooter);

	document.body.appendChild(modal);
}

createModal();

// Ouverture / fermeture du modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

function openModal() {
	modal.classList.add("open");
	overlay.classList.add("open");
}

function closeModal() {
	modal.classList.remove("open");
	overlay.classList.remove("open");
}

// Ouvrir avec "modifier"
const btnModifier = document.getElementById("btn-modifier");
if (btnModifier) {
	btnModifier.addEventListener("click", function (event) {
		event.preventDefault(); // évite que le "#" remonte la page
		openModal();
	});
}

// Fermer avec la croix ou en cliquant sur le fond
document.querySelector(".modal_close").addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal)

// Galerie du Modal

const modalBody = document.querySelector(".modal_body");

function galleryModal(works) {
    modalBody.innerHTML = ""; 
    for (let i = 0; i < works.length; i++) {

        const work = works[i];

        // Création d'une balise dédiée à chaque work
        const figure = document.createElement("figure");
        figure.classList.add("image_modal_" + work.id);
        modalBody.appendChild(figure);

        // Image
        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.classList.add("image_modal");
        figure.appendChild(image);

        // Delete Image
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete_btn");
        deleteBtn.dataset.id = work.id; // guarda o id para apagar depois
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        figure.appendChild(deleteBtn);

    }
    
    // Ligne de la gallery
    const line = document.createElement("hr");
    line.classList.add("modal_line");
    modalBody.appendChild(line);
}

galleryModal(works);