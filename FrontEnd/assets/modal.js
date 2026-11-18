// Création du Modal

export function createModal(categories) {

    // Overlay (fond sombre)
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    // Conteneur principal
    const modal = document.createElement("div");
    modal.classList.add("modal");

    // Croix (commune aux deux vues)
    const modalClose = document.createElement("div");
    modalClose.classList.add("modal_close");
    modalClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    modal.appendChild(modalClose);

    // ===== Vue 1 : galerie =====
    const vueGalerie = document.createElement("div");
    vueGalerie.classList.add("vue_galerie");

    const titreGalerie = document.createElement("div");
    titreGalerie.classList.add("modal_titre");
    titreGalerie.textContent = "Galerie photo";

    // Body (les photos seront ajoutées par galleryModal)
    const modalBody = document.createElement("div");
    modalBody.classList.add("modal_body");

    const btnAjouter = document.createElement("button");
    btnAjouter.classList.add("ajouter_photo");
    btnAjouter.textContent = "Ajouter une photo";

    vueGalerie.append(titreGalerie, modalBody, btnAjouter);

    // ===== Vue 2 : ajout photo =====
    const vueAjout = document.createElement("div");
    vueAjout.classList.add("vue_ajout", "hidden");

    const btnRetour = document.createElement("button");
    btnRetour.classList.add("modal_retour");
    btnRetour.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

    const titreAjout = document.createElement("div");
    titreAjout.classList.add("modal_titre");
    titreAjout.textContent = "Ajout photo";

    const form = document.createElement("form");
    form.classList.add("form_ajout");


    // ===== Zone upload =====
    const zoneUpload = document.createElement("div");
    zoneUpload.classList.add("zone_upload");

    const iconeImage = document.createElement("i");
    iconeImage.classList.add("fa-regular", "fa-image");

    const labelUpload = document.createElement("label");
    labelUpload.classList.add("btn_upload");
    labelUpload.htmlFor = "imageInput";
    labelUpload.textContent = "+ Ajouter photo";

    const inputImage = document.createElement("input");
    inputImage.type = "file";
    inputImage.id = "imageInput";
    inputImage.name = "image";
    inputImage.accept = "image/png, image/jpeg";
    inputImage.hidden = true;

    const infoUpload = document.createElement("p");
    infoUpload.textContent = "jpg, png : 4mo max";

    // Prévisualisation (cachée tant qu'aucune image n'est choisie)
    const previewImage = document.createElement("img");
    previewImage.classList.add("preview_image");
    previewImage.alt = "Aperçu de l'image";
    previewImage.hidden = true;

    zoneUpload.append(iconeImage, labelUpload, inputImage, infoUpload, previewImage);

    // Affichage de la miniature quand une image est choisie
    inputImage.addEventListener("change", function () {
        const fichier = inputImage.files[0];
        if (!fichier) return;

        // Vérification du type
        if (fichier.type !== "image/png" && fichier.type !== "image/jpeg") {
            alert("Format non accepté : jpg ou png uniquement.");
            inputImage.value = "";
            return;
        }

        // Vérification de la taille (4 Mo max)
        if (fichier.size > 4 * 1024 * 1024) {
            alert("L'image dépasse 4 Mo.");
            inputImage.value = "";
            return;
        }

        previewImage.src = URL.createObjectURL(fichier);
        previewImage.hidden = false;
        zoneUpload.classList.add("avec_preview"); // le CSS cache l'icône, le bouton et le texte
    });

    // Cliquer sur la miniature permet de choisir une autre image
    previewImage.addEventListener("click", function () {
        inputImage.click();
    });


    // ===== Titre =====
    const labelTitre = document.createElement("label");
    labelTitre.htmlFor = "titre";
    labelTitre.textContent = "Titre";

    const inputTitre = document.createElement("input");
    inputTitre.type = "text";
    inputTitre.id = "titre";
    inputTitre.name = "title";

    // ===== Catégorie =====
    const labelCategorie = document.createElement("label");
    labelCategorie.htmlFor = "categorie";
    labelCategorie.textContent = "Catégorie";

    const selectCategorie = document.createElement("select");
    selectCategorie.id = "categorie";
    selectCategorie.name = "category";

    const optionVide = document.createElement("option");
    optionVide.value = "";
    selectCategorie.appendChild(optionVide);

    // Les catégories viennent de l'API
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement("option");
        option.value = categories[i].id;
        option.textContent = categories[i].name;
        selectCategorie.appendChild(option);
    }

    // ===== Ligne + bouton Valider =====
    const ligneForm = document.createElement("hr");
    ligneForm.classList.add("modal_line");

    const btnValider = document.createElement("button");
    btnValider.type = "submit";
    btnValider.classList.add("btn_valider");
    btnValider.disabled = true;
    btnValider.textContent = "Valider";

    // ===== Assemblage du formulaire =====
    form.append(
        zoneUpload,
        labelTitre, inputTitre,
        labelCategorie, selectCategorie,
        ligneForm,
        btnValider
    );

    // Le bouton "Valider" s'active seulement si image + titre + catégorie sont remplis
    function verifierFormulaire() {
        const imageOk = inputImage.files.length > 0;
        const titreOk = inputTitre.value.trim() !== "";
        const categorieOk = selectCategorie.value !== "";
        btnValider.disabled = !(imageOk && titreOk && categorieOk);
    }

    inputImage.addEventListener("change", verifierFormulaire);
    inputTitre.addEventListener("input", verifierFormulaire);
    selectCategorie.addEventListener("change", verifierFormulaire);

    vueAjout.append(btnRetour, titreAjout, form);

    // Assemblage
    modal.append(vueGalerie, vueAjout);
    document.body.appendChild(modal);
}

// Remise à zéro de la zone d'upload
// (à appeler après l'envoi du formulaire, ou à la fermeture du modal)

export function resetPreview() {
    const inputImage = document.getElementById("imageInput");
    const previewImage = document.querySelector(".preview_image");

    inputImage.value = "";
    previewImage.src = "";
    previewImage.hidden = true;

    document.querySelector(".zone_upload").classList.remove("avec_preview");
}

// Envoi du formulaire "Ajout photo" à l'API
// onWorkAdded : fonction appelée avec le nouveau work quand l'ajout a réussi

export function initFormAjout(onWorkAdded) {
    const form = document.querySelector(".form_ajout");
    const btnValider = document.querySelector(".btn_valider");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // empêche le rechargement de la page

        const token = localStorage.getItem("token");

        // Récupère image, title et category grâce aux attributs "name"
        const formData = new FormData(form);

        try {
            const reponse = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token
                    // pas de Content-Type : le navigateur le gère avec FormData
                },
                body: formData
            });

            if (!reponse.ok) {
                throw new Error("Erreur " + reponse.status);
            }

            const nouveauWork = await reponse.json();
            nouveauWork.categoryId = Number(nouveauWork.categoryId); // pour que les filtres marchent

            // Le formulaire est vidé après validation
            form.reset();
            resetPreview();
            btnValider.disabled = true;

            onWorkAdded(nouveauWork);

        } catch (erreur) {
            console.error(erreur);
            alert("L'ajout de la photo a échoué. Vérifiez que vous êtes bien connecté.");
        }
    });
}

// Suppression d'une photo
// onWorkDeleted : fonction appelée avec l'id du work quand la suppression a réussi

export function initSuppression(modalBody, onWorkDeleted) {

    // Un seul écouteur sur la galerie du modal, pour toutes les poubelles
    modalBody.addEventListener("click", async function (event) {
        const deleteBtn = event.target.closest(".delete_btn");
        if (!deleteBtn) return; // le clic n'était pas sur une poubelle

        const id = Number(deleteBtn.dataset.id);

        if (!confirm("Voulez-vous vraiment supprimer cette photo ?")) return;

        const token = localStorage.getItem("token");

        try {
            const reponse = await fetch("http://localhost:5678/api/works/" + id, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            if (!reponse.ok) {
                throw new Error("Erreur " + reponse.status);
            }

            onWorkDeleted(id);

        } catch (erreur) {
            console.error(erreur);
            alert("La suppression a échoué. Vérifiez que vous êtes bien connecté.");
        }
    });
}

// Galerie du Modal

export function galleryModal(modalBody, works) {
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
        image.alt = work.title;
        image.classList.add("image_modal");
        figure.appendChild(image);

        // Bouton supprimer
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.classList.add("delete_btn");
        deleteBtn.dataset.id = work.id; // on garde l'id pour la suppression
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        figure.appendChild(deleteBtn);
    }

    // Ligne de la galerie
    const line = document.createElement("hr");
    line.classList.add("modal_line");
    modalBody.appendChild(line);
}