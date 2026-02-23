const tbody1 = document.querySelector("#liste");
const tbody2 = document.querySelector("#sum");
const btn_show = document.querySelector("#btnShow_expense");
const re_btn = document.querySelector(".button");
const menu = document.querySelector(".menu");
const daily_btn = document.querySelector(".daily")
const hebdo_btn = document.querySelector(".hebdo")
const mens_btn = document.querySelector(".mensuel")
const ann_btn = document.querySelector(".annuel")
const daily = document.querySelector(".daily-expense")

// Soumission du formulaire
document.querySelector("form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const data = {
        description: e.target.description.value,
        categorie: e.target.categorie.value,
        montant: e.target.montant.value,
        date: e.target.date.value
    };

    // Envoi vers Flask
    const res = await fetch("/ajouter", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.message);

    // Recharge la liste complète depuis la DB
    await chargerDepenses();

    // Reset du formulaire
    e.target.reset();
});

// Login
async function redirect_login(){
    const res = await fetch("/login")
    if (e.target.headers('login.html')){
        const p = document.createElement("p")
        const box = document.querySelector(".auth-container")
        p.innerHTML = "Nom d'utilisateur ou mot de passe incorrect !!!"
        box.appendChild(p)
    }
}

// Fonction pour charger toutes les dépenses
async function chargerDepenses() {
    const res = await fetch("/liste");
    const depenses = await res.json();

    tbody1.innerHTML = "";
    depenses.forEach((dep, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${dep[1]}</td>
            <td>${dep[2]}</td>
            <td>${dep[3]}</td>
            <td>${dep[4]}</td>
        `;
        tbody1.appendChild(tr);
    });
}

async function sumDepenses() {
    const res = await fetch("/sum")
    const sum = await res.json()
    tbody2.innerHTML = ""
    sum.forEach(dep => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${dep[1]}
            <td>${dep[0]}
        `
        tbody2.appendChild(tr)
    })
}

// Charger dès le début
chargerDepenses();

btn_show.addEventListener('click', () =>{
    menu.classList.toggle('active');
    re_btn.classList.add('active');
})
re_btn.addEventListener('click', () =>{
    menu.classList.remove('active')
    re_btn.classList.remove('active')
})

// ------------------------------------------
daily_btn.addEventListener('click', () =>{
    menu.classList.remove('active')
    daily.classList.add('active');
    re_btn.classList.remove('active')
    sumDepenses()
})
