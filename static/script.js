const tbody1 = document.querySelector("#liste");
const tbody2 = document.querySelector("#sum");
const btn_show = document.querySelector("#btnShow_expense");
const re_btn = document.querySelector(".button");
const menu = document.querySelector(".menu");
const daily_btn = document.querySelector(".daily-b")
const hebdo_btn = document.querySelector(".hebdo-b")
const mens_btn = document.querySelector(".mensuel-b")
const ann_btn = document.querySelector(".annuel-b")
const daily = document.querySelector(".daily-expense")
const h2 = document.querySelector(".e-title")
const all_ex = document.querySelector(".all-e")
const table = document.querySelector(".table-show")

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
    h2.innerText = "Bilan Journalier"
    sum.forEach(dep => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${dep[1]}
            <td>${dep[0]}
        `
        tbody2.appendChild(tr)
    })
}

async function hebdoDepenses(){
    const res = await fetch("/hebdo_sum")
    const sum = await res.json()
    tbody2.innerHTML = ""
    h2.innerText = "Bilan Hebdomadaire"
    sum.forEach(dep => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${dep[1]}
            <td>${dep[0]}
        `
        tbody2.appendChild(tr)
    })
}

async function mensDepenses(){
    const res = await fetch("/mens_sum")
    const sum = await res.json()
    tbody2.innerHTML = ""
    h2.innerText = "Bilan Mensuel"
    sum.forEach(dep => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${dep[1]}
            <td>${dep[0]}
        `
        tbody2.appendChild(tr)
    })
}

async function annDepenses(){
    const res = await fetch("/ann_sum")
    const sum = await res.json()
    tbody2.innerHTML = ""
    h2.innerText = "Bilan Annuel"
    sum.forEach(dep => {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${dep[1]}
            <td>${dep[0]}
        `
        tbody2.appendChild(tr)
    })
}

document.querySelector(".select-e").addEventListener("click", async () => {
    const dateInput = document.querySelector(".date").value;
    if (!dateInput) {
        alert("Veuillez choisir une date !");
        return;
    }

    const res = await fetch(`/depenses_par_date?date=${dateInput}`);
    const depenses = await res.json();
    //table.classList.add('active')
    menu.classList.remove('active')
    re_btn.classList.remove('active')
    tbody1.innerHTML = "";
    depenses.forEach((dep, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${dep[0]}</td>   <!-- Description -->
            <td>${dep[1]}</td>   <!-- Catégorie -->
            <td>${dep[2]}</td>   <!-- Montant -->
            <td>${dep[3]}</td>   <!-- Date -->
        `;
        tbody1.appendChild(tr);
    });
});
// Charger dès le début
//chargerDepenses();

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
hebdo_btn.addEventListener('click', () =>{
    menu.classList.remove('active')
    daily.classList.add('active');
    re_btn.classList.remove('active')
    hebdoDepenses()
})
mens_btn.addEventListener('click', () =>{
    menu.classList.remove('active')
    daily.classList.add('active');
    re_btn.classList.remove('active')
    mensDepenses()
})
ann_btn.addEventListener('click', () =>{
    menu.classList.remove('active')
    daily.classList.add('active');
    re_btn.classList.remove('active')
    annDepenses()
})

all_ex.addEventListener('click', () =>{
    chargerDepenses()
    menu.classList.remove('active')
    re_btn.classList.remove('active')
    //table.classList.add('active')
})
