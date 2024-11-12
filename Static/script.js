const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score');
let score = 0;

// Define animal images based on levels
const animalImages = [
    'images/level1.png', // Level 1 image (e.g., Mouse)
    'images/level2.png', // Level 2 image (e.g., Rabbit)
    'images/level3.png', // Level 3 image (e.g., Cat)
    'images/level4.png', // Level 4 image (e.g., Dog)
    'images/level5.png', // Level 5 image (e.g., Sheep)
    'images/level6.png', // Level 6 image (e.g., Pig)
    'images/level7.png', // Level 7 image (e.g., Cow)
    'images/level8.png', // Level 8 image (e.g., Elephant)
    // Add more levels as needed
];

const gridSize = 4;
let cells = [];

// Initialize the grid
function createGrid() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        gridContainer.appendChild(cell);
        cells.push(cell);
    }
}

// Generate a new tile at a random empty cell
function generateNewTile() {
    const emptyCells = cells.filter(cell => !cell.firstChild);
    if (emptyCells.length === 0) return;
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.level = 0; // Starting level
    const img = document.createElement('img');
    img.src = animalImages[0];
    tile.appendChild(img);
    randomCell.appendChild(tile);
}

// Move tiles based on input direction
function moveTiles(direction) {
    let hasMoved = false;
    let mergedTiles = [];

    let indices;
    if (direction === 'ArrowUp' || direction === 'ArrowLeft') {
        indices = [...Array(cells.length).keys()];
    } else {
        indices = [...Array(cells.length).keys()].reverse();
    }

    indices.forEach(index => {
        const cell = cells[index];
        if (!cell.firstChild) return;
        let currentTile = cell.firstChild;
        let nextIndex = getNextIndex(index, direction);
        while (nextIndex !== null) {
            const nextCell = cells[nextIndex];
            if (!nextCell.firstChild) {
                // Move tile
                nextCell.appendChild(currentTile);
                hasMoved = true;
            } else {
                // Check for merge
                const nextTile = nextCell.firstChild;
                if (currentTile.dataset.level === nextTile.dataset.level && !mergedTiles.includes(nextTile)) {
                    const newLevel = parseInt(currentTile.dataset.level) + 1;
                    if (animalImages[newLevel]) {
                        nextTile.dataset.level = newLevel;
                        nextTile.firstChild.src = animalImages[newLevel];
                        score += Math.pow(2, newLevel + 1);
                        scoreDisplay.textContent = score;
                    }
                    currentTile.remove();
                    mergedTiles.push(nextTile);
                    hasMoved = true;
                }
                break;
            }
            nextIndex = getNextIndex(nextIndex, direction);
        }
    });

    if (hasMoved) {
        generateNewTile();
    }
}

// Get next index based on direction
function getNextIndex(index, direction) {
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);

    switch (direction) {
        case 'ArrowUp':
            return y > 0 ? index - gridSize : null;
        case 'ArrowDown':
            return y < gridSize - 1 ? index + gridSize : null;
        case 'ArrowLeft':
            return x > 0 ? index - 1 : null;
        case 'ArrowRight':
            return x < gridSize - 1 ? index + 1 : null;
        default:
            return null;
    }
}

// Handle key presses
function handleKeyPress(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        moveTiles(event.key);
    }
}

// Start the game
function startGame() {
    createGrid();
    generateNewTile();
    generateNewTile();
    document.addEventListener('keydown', handleKeyPress);
}

startGame();
