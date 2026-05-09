// Données dyal Lots
let lots = JSON.parse(localStorage.getItem('lots')) || [
    { id: "LOT-001", medicament: "Doliprane 1000mg", quantite: 5000, statut: "En cours", ligne: "Ligne A", operateur: "Bouya" },
    { id: "LOT-002", medicament: "Gaprex 150mg", quantite: 6000, statut: "Contrôle Qualité", ligne: "Ligne B", operateur: "Robio" },
    { id: "LOT-003", medicament: "Prégabaline 300mg", quantite: 2500, statut: "À Faire", ligne: "Ligne C", operateur: "Ayoub" },
    { id: "LOT-004", medicament: "Artane 5mg", quantite: 4000, statut: "Terminé", ligne: "Ligne D", operateur: "Aymen" },
    { id: "LOT-005", medicament: "Paracétamol 500mg", quantite: 1000, statut: "En cours", ligne: "Ligne A", operateur: "Abdo" }
];

// Données dyal Equipe
const equipe = [
    { nom: "Robio Alami", role: "Opérateur", telephone: "0612345678", email: "robio@pharma.ma" },
    { nom: "Salma Bennani", role: "Responsable Qualité", telephone: "0623456789", email: "salma@pharma.ma" },
    { nom: "Ahmed Idrissi", role: "Superviseur", telephone: "0634567890", email: "ahmed@pharma.ma" },
    { nom: "Fatima Zahra", role: "Opératrice", telephone: "0645678901", email: "fatima@pharma.ma" }
];

function sauvegarder() {
    localStorage.setItem('lots', JSON.stringify(lots));
}

function afficherPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.getElementById('btn-' + page).classList.add('active');
}

function ouvrirFormulaire() {
    document.getElementById('modal').classList.add('active');
}

function fermerFormulaire() {
    document.getElementById('modal').classList.remove('active');
}

function ajouterLot(event) {
    event.preventDefault();
    
    const nouveauLot = {
        id: document.getElementById('new-id').value,
        medicament: document.getElementById('new-medicament').value,
        quantite: parseInt(document.getElementById('new-quantite').value),
        statut: document.getElementById('new-statut').value,
        ligne: document.getElementById('new-ligne').value,
        operateur: document.getElementById('new-operateur').value
    };
    
    lots.push(nouveauLot);
    sauvegarder();
    afficherLots();
    fermerFormulaire();
    
    document.querySelector('form').reset();
}

function afficherLots() {
    document.getElementById('a-faire').innerHTML = '';
    document.getElementById('en-cours').innerHTML = '';
    document.getElementById('controle').innerHTML = '';
    document.getElementById('termine').innerHTML = '';

    document.getElementById('total-lots').textContent = lots.length;
    document.getElementById('stat-faire').textContent = lots.filter(l => l.statut === "À Faire").length;
    document.getElementById('stat-cours').textContent = lots.filter(l => l.statut === "En cours").length;
    document.getElementById('stat-controle').textContent = lots.filter(l => l.statut === "Contrôle Qualité").length;
    document.getElementById('stat-termine').textContent = lots.filter(l => l.statut === "Terminé").length;

    lots.forEach((lot, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.dataset.index = index;
        card.innerHTML = `
            <h3>${lot.id}</h3>
            <p><strong>${lot.medicament}</strong></p>
            <p>📦 ${lot.quantite} unités</p>
            <p>👤 ${lot.operateur}</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${lot.id}" alt="QR" class="qr-code">
        `;

        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('index', index);
        });

        if (lot.statut === "À Faire") document.getElementById('a-faire').appendChild(card);
        else if (lot.statut === "En cours") document.getElementById('en-cours').appendChild(card);
        else if (lot.statut === "Contrôle Qualité") document.getElementById('controle').appendChild(card);
        else if (lot.statut === "Terminé") document.getElementById('termine').appendChild(card);
    });
}

function afficherEquipe() {
    const container = document.getElementById('equipe-list');
    container.innerHTML = '';
    
    equipe.forEach(personne => {
        const initiales = personne.nom.split(' ').map(n => n[0]).join('');
        const card = document.createElement('div');
        card.className = 'personne-card';
        card.innerHTML = `
            <div class="avatar">${initiales}</div>
            <h3>${personne.nom}</h3>
            <p class="role">${personne.role}</p>
            <div class="actions-personne">
                <a href="tel:${personne.telephone}" class="btn-action btn-call">📞 Call</a>
                <a href="sms:${personne.telephone}" class="btn-action btn-sms">💬 SMS</a>
                <a href="mailto:${personne.email}" class="btn-action btn-email">✉️ Email</a>
            </div>
        `;
        container.appendChild(card);
    });
}

document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', (e) => e.preventDefault());
    column.addEventListener('drop', (e) => {
        e.preventDefault();
        const index = e.dataTransfer.getData('index');
        lots[index].statut = column.dataset.status;
        sauvegarder();
        afficherLots();
    });
});

afficherLots();
afficherEquipe();