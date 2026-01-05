let games = JSON.parse(localStorage.getItem('yassgameGames')) || [
    {
        id: 1,
        title: "FIFA 24",
        description: "Le jeu de football ultime avec les meilleures équipes et joueurs.",
        price: 89.99,
        platform: "playstation",
        category: "sport",
        image: "https://images.unsplash.com/photo-1511882150382-421056c89033?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        title: "Call of Duty: Modern Warfare",
        description: "Jeu de tir à la première personne avec un mode campagne intense et multijoueur.",
        price: 75.50,
        platform: "pc",
        category: "action",
        image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    }
];

let editingGameId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadGames();
    setupForm();
    setupEventListeners();
});

function loadGames() {
    const savedGames = JSON.parse(localStorage.getItem('yassgameGames'));
    if (savedGames && savedGames.length > 0) {
        games = savedGames;
    }
    
    displayGames();
}

function displayGames() {
    const gamesList = document.getElementById('gamesList');
    
    if (!gamesList) return;
    
    gamesList.innerHTML = '';
    
    if (games.length === 0) {
        gamesList.innerHTML = '<p class="no-games">Aucun jeu dans la boutique.</p>';
        return;
    }
    
    games.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.className = 'product-item';
        gameItem.innerHTML = `
            <img src="${game.image}" alt="${game.title}" class="product-item-image">
            <div class="product-item-details">
                <h4>${game.title}</h4>
                <p>${game.description.substring(0, 60)}...</p>
                <div class="product-item-info">
                    <span class="platform">${getPlatformName(game.platform)}</span>
                    <span class="category">${getCategoryName(game.category)}</span>
                    <span class="price">${game.price.toFixed(2)} TND</span>
                </div>
            </div>
            <div class="product-item-actions">
                <button class="btn-edit" data-id="${game.id}">Modifier</button>
                <button class="btn-delete" data-id="${game.id}">Supprimer</button>
            </div>
        `;
        
        gamesList.appendChild(gameItem);
    });
}

function setupForm() {
    const gameForm = document.getElementById('gameForm');
    
    if (gameForm) {
        gameForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveGame();
        });
    }
    
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-edit') || 
            e.target.parentElement.classList.contains('btn-edit')) {
            
            const button = e.target.classList.contains('btn-edit') ? e.target : e.target.parentElement;
            const gameId = parseInt(button.getAttribute('data-id'));
            editGame(gameId);
        }
        
        if (e.target.classList.contains('btn-delete') || 
            e.target.parentElement.classList.contains('btn-delete')) {
            
            const button = e.target.classList.contains('btn-delete') ? e.target : e.target.parentElement;
            const gameId = parseInt(button.getAttribute('data-id'));
            deleteGame(gameId);
        }
    });
}

function saveGame() {
    const title = document.getElementById('gameTitle').value.trim();
    const description = document.getElementById('gameDescription').value.trim();
    const price = parseFloat(document.getElementById('gamePrice').value);
    const platform = document.getElementById('gamePlatform').value;
    const category = document.getElementById('gameCategory').value;
    const image = document.getElementById('gameImage').value.trim();
    
    if (!title || !description || isNaN(price) || price <= 0 || !image) {
        alert('Veuillez remplir tous les champs correctement.');
        return;
    }
    
    if (editingGameId) {
        const gameIndex = games.findIndex(game => game.id === editingGameId);
        
        if (gameIndex !== -1) {
            games[gameIndex] = {
                id: editingGameId,
                title,
                description,
                price,
                platform,
                category,
                image
            };
        }
        
        editingGameId = null;
        document.getElementById('formTitle').textContent = 'Ajouter un jeu';
    } else {
        const newId = games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1;
        
        games.push({
            id: newId,
            title,
            description,
            price,
            platform,
            category,
            image
        });
    }
    
    localStorage.setItem('yassgameGames', JSON.stringify(games));
    resetForm();
    displayGames();
    alert('Jeu enregistré avec succès !');
}

function editGame(gameId) {
    const game = games.find(g => g.id === gameId);
    
    if (!game) return;
    
    document.getElementById('gameTitle').value = game.title;
    document.getElementById('gameDescription').value = game.description;
    document.getElementById('gamePrice').value = game.price;
    document.getElementById('gamePlatform').value = game.platform;
    document.getElementById('gameCategory').value = game.category;
    document.getElementById('gameImage').value = game.image;
    
    document.getElementById('formTitle').textContent = 'Modifier le jeu';
    editingGameId = gameId;
    document.getElementById('gameForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteGame(gameId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
        return;
    }
    
    games = games.filter(game => game.id !== gameId);
    localStorage.setItem('yassgameGames', JSON.stringify(games));
    displayGames();
    
    if (editingGameId === gameId) {
        resetForm();
    }
    
    alert('Jeu supprimé avec succès !');
}

function resetForm() {
    document.getElementById('gameForm').reset();
    document.getElementById('formTitle').textContent = 'Ajouter un jeu';
    editingGameId = null;
}

function getPlatformName(platform) {
    const platforms = {
        'pc': 'PC',
        'playstation': 'PlayStation',
        'xbox': 'Xbox',
        'nintendo': 'Nintendo'
    };
    
    return platforms[platform] || platform;
}

function getCategoryName(category) {
    const categories = {
        'action': 'Action',
        'aventure': 'Aventure',
        'rpg': 'RPG',
        'sport': 'Sport',
        'strategie': 'Stratégie'
    };
    
    return categories[category] || category;
}