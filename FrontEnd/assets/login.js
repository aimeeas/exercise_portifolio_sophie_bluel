const form = document.querySelector("#login-form");

// Message d'erreur
const messageErreur = document.createElement("p");
messageErreur.id = "login-error";
document.querySelector("#motDePasse").after(messageErreur);

form.addEventListener("submit", async function (event) {
    event.preventDefault(); // empêche le rechargement de la page

    messageErreur.textContent = ""; // on efface l'ancien message à chaque essai

    // on lit les valeurs au moment du clic
    const email = document.querySelector("#email").value;
    const motDePasse = document.querySelector("#motDePasse").value;

    try {
        const reponse = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: motDePasse
            })
        });

        if (reponse.ok) {
            const data = await reponse.json();
            // on garde le token pour les pages qui demandent d'être connecté
            localStorage.setItem("token", data.token);
            window.location.href = "./index.html";
        } else {
            messageErreur.textContent = "Erreur dans l’identifiant ou le mot de passe";
        }

    } catch (erreur) {
        // le serveur ne répond pas (backend éteint, par exemple)
        console.error(erreur);
        messageErreur.textContent = "Le serveur ne répond pas, réessayez plus tard.";
    }
});