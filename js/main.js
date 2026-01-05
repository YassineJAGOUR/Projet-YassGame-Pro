const gamesData = [
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
    },
    {
        id: 3,
        title: "Assassin's Creed Valhalla",
        description: "Incarnez Eivor, un guerrier viking légendaire dans l'Angleterre du IXe siècle.",
        price: 95.00,
        platform: "xbox",
        category: "aventure",
        image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        title: "The Legend of Zelda: Breath of the Wild",
        description: "Aventure épique dans le monde ouvert d'Hyrule.",
        price: 110.00,
        platform: "nintendo",
        category: "aventure",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 5,
        title: "Cyberpunk 2077",
        description: "RPG d'action-aventure dans la mégalopole futuriste de Night City.",
        price: 85.00,
        platform: "pc",
        category: "rpg",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 6,
        title: "NBA 2K24",
        description: "Simulation de basketball avec les meilleures équipes et joueurs de la NBA.",
        price: 79.99,
        platform: "playstation",
        category: "sport",
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 7,
        title: "Minecraft",
        description: "Jeu de construction et d'aventure dans un monde cubique.",
        price: 35.00,
        platform: "pc",
        category: "aventure",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        title: "Civilization VI",
        description: "Jeu de stratégie au tour par tour où vous construisez un empire.",
        price: 65.00,
        platform: "pc",
        category: "strategie",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    }
];

let cart = JSON.parse(localStorage.getItem('yassgameCart')) || [];

document.addEventListener('DOMContentLoaded', function() {
    displayGames(gamesData);
    updateCartCount();
    
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    const platformFilter = document.getElementById('platformFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    if (platformFilter) {
        platformFilter.addEventListener('change', applyFilters);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const gameId = parseInt(e.target.getAttribute('data-id'));
            addToCart(gameId);
        }
    });
});

function displayGames(games) {
    const gamesGrid = document.getElementById('gamesGrid');
    
    if (!gamesGrid) return;
    
    gamesGrid.innerHTML = '';
    
    if (games.length === 0) {
        gamesGrid.innerHTML = '<p class="no-games">Aucun jeu trouvé.</p>';
        return;
    }
    
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        
        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.title}" class="game-image">
            <div class="game-content">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-info">
                    <div class="game-price">${game.price.toFixed(2)} <span>TND</span></div>
                    <span class="game-platform">${getPlatformName(game.platform)}</span>
                </div>
                <button class="btn-add-to-cart" data-id="${game.id}">Ajouter au panier</button>
            </div>
        `;
        
        gamesGrid.appendChild(gameCard);
    });
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

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayGames(gamesData);
        return;
    }
    
    const filteredGames = gamesData.filter(game => {
        return game.title.toLowerCase().includes(searchTerm) || 
               game.description.toLowerCase().includes(searchTerm);
    });
    
    displayGames(filteredGames);
}

function applyFilters() {
    const platform = document.getElementById('platformFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const price = document.getElementById('priceFilter').value;
    
    let filteredGames = gamesData;
    
    if (platform !== 'all') {
        filteredGames = filteredGames.filter(game => game.platform === platform);
    }
    
    if (category !== 'all') {
        filteredGames = filteredGames.filter(game => game.category === category);
    }
    
    if (price !== 'all') {
        if (price === '0-50') {
            filteredGames = filteredGames.filter(game => game.price <= 50);
        } else if (price === '50-100') {
            filteredGames = filteredGames.filter(game => game.price > 50 && game.price <= 100);
        } else if (price === '100+') {
            filteredGames = filteredGames.filter(game => game.price > 100);
        }
    }
    
    displayGames(filteredGames);
}

function addToCart(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    
    if (!game) return;
    
    const existingItem = cart.find(item => item.id === gameId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: game.id,
            title: game.title,
            price: game.price,
            platform: game.platform,
            image: game.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('yassgameCart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${game.title} a été ajouté au panier !`);
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: var(--success-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);