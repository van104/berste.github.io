// 游戏配置
const config = {
    rows: 4,
    cols: 3,
    get totalCards() { return this.rows * this.cols; },
    get totalPairs() { return this.totalCards / 2; }
};

// 卡片图案，使用表情符号作为值
const cardValues = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍒', '🥝', '🍍', '🥭', '🍑', '🥥', '🍋'];

// 游戏状态
let gameState = {
    cards: [],
    flippedCards: [],
    score: 0,
    moves: 0,
    timer: 0,
    timerInterval: null,
    gameStarted: false,
    gameOver: false,
    matchedPairs: 0
};

// DOM元素
const gameBoard = document.getElementById('game-board');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const scoreDisplay = document.getElementById('score');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const gameOverScreen = document.getElementById('game-over');
const finalMovesDisplay = document.getElementById('final-moves');
const finalTimeDisplay = document.getElementById('final-time');
const playAgainBtn = document.getElementById('play-again');

// 初始化游戏
function initGame() {
    // 重置游戏状态
    gameState = {
        cards: [],
        flippedCards: [],
        score: 0,
        moves: 0,
        timer: 0,
        timerInterval: null,
        gameStarted: false,
        gameOver: false,
        matchedPairs: 0
    };
    
    // 更新显示
    scoreDisplay.textContent = '0';
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '0';
    
    // 清空游戏板
    gameBoard.innerHTML = '';
    
    // 创建卡片对
    let tempCards = [];
    const selectedValues = cardValues.slice(0, config.totalPairs);
    
    selectedValues.forEach((value, index) => {
        tempCards = [...tempCards, ...createPair(value, index)];
    });
    
    // 打乱卡片
    gameState.cards = shuffle(tempCards);
    
    // 渲染卡片
    renderCards();
    
    // 设置游戏板的网格列数
    gameBoard.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
    
    // 隐藏游戏结束画面
    gameOverScreen.style.display = 'none';
}

// 渲染卡片
function renderCards() {
    gameState.cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.id = card.id;
        
        cardElement.innerHTML = `
            <div class="card-front">${card.value}</div>
            <div class="card-back"></div>
        `;
        
        cardElement.addEventListener('click', () => handleCardClick(card.id));
        gameBoard.appendChild(cardElement);
    });
}

// 处理卡片点击
function handleCardClick(id) {
    // 如果游戏还没开始或已结束，不处理点击
    if (gameState.gameOver) return;
    
    // 如果是第一次点击卡片，开始游戏
    if (!gameState.gameStarted) {
        startGame();
    }
    
    const card = gameState.cards.find(c => c.id === id);
    const cardElement = document.querySelector(`.card[data-id="${id}"]`);
    
    // 如果卡片已经翻开或已匹配，不处理点击
    if (card.isFlipped || card.isMatched) return;
    
    // 如果已经有两张卡片翻开，不处理点击
    if (gameState.flippedCards.length >= 2) return;
    
    // 翻开卡片
    flipCard(card, cardElement);
    
    // 添加到已翻开的卡片数组
    gameState.flippedCards.push({ card, element: cardElement });
    
    // 如果已经翻开两张卡片，检查是否匹配
    if (gameState.flippedCards.length === 2) {
        // 增加移动次数
        gameState.moves++;
        movesDisplay.textContent = gameState.moves;
        
        const [firstCard, secondCard] = gameState.flippedCards;
        
        // 检查是否匹配
        if (firstCard.card.value === secondCard.card.value) {
            // 匹配成功
            handleMatch();
        } else {
            // 匹配失败
            setTimeout(() => {
                handleMismatch();
            }, 1000);
        }
    }
}

// 处理匹配成功
function handleMatch() {
    const [firstCard, secondCard] = gameState.flippedCards;
    
    // 标记卡片为已匹配
    firstCard.card.isMatched = true;
    secondCard.card.isMatched = true;
    
    // 添加匹配样式
    firstCard.element.classList.add('matched');
    secondCard.element.classList.add('matched');
    
    // 增加分数
    gameState.score += 10;
    scoreDisplay.textContent = gameState.score;
    
    // 增加匹配对数
    gameState.matchedPairs++;
    
    // 重置已翻开的卡片
    gameState.flippedCards = [];
    
    // 检查游戏是否结束
    if (gameState.matchedPairs === config.totalPairs) {
        endGame();
    }
}

// 处理匹配失败
function handleMismatch() {
    const [firstCard, secondCard] = gameState.flippedCards;
    
    // 翻回卡片
    flipCard(firstCard.card, firstCard.element);
    flipCard(secondCard.card, secondCard.element);
    
    // 重置已翻开的卡片
    gameState.flippedCards = [];
}

// 翻转卡片
function flipCard(card, element) {
    card.isFlipped = !card.isFlipped;
    if (card.isFlipped) {
        element.classList.add('flipped');
    } else {
        element.classList.remove('flipped');
    }
}

// 开始游戏
function startGame() {
    gameState.gameStarted = true;
    startBtn.disabled = true;
    
    // 开始计时
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        timerDisplay.textContent = gameState.timer;
    }, 1000);
}

// 结束游戏
function endGame() {
    gameState.gameOver = true;
    clearInterval(gameState.timerInterval);
    
    // 显示游戏结束画面
    gameOverScreen.style.display = 'flex';
    finalMovesDisplay.textContent = gameState.moves;
    finalTimeDisplay.textContent = gameState.timer;
}

// 重置游戏
function resetGame() {
    clearInterval(gameState.timerInterval);
    initGame();
    startBtn.disabled = false;
}

// 事件监听
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);

// 初始化游戏
initGame(); 