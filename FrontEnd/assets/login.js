const form = document.querySelector("#login-form");

form.addEventListener("submit", async function (event) {
    event.preventDefault(); // empêche le rechargement de la page

    // on lit les valeurs au moment du clic
    const email = document.querySelector("#email").value;
    const motDePasse = document.querySelector("#motDePasse").value;

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
        alert("Erreur dans l’identifiant ou le mot de passe");
    }
});