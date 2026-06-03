// Game State
let gameState = {
    currentLevel: 1,
    score: 0,
    lives: 3,
    currentQuestionIndex: 0,
    gameActive: false
};

// Questions Database
const questions = [
    {
        level: 1,
        question: "A water source near a village market with visible sewage nearby",
        description: "The water is collected from a well next to an open market where animals and waste are present.",
        isClean: false,
        explanation: "This water source is contaminated by nearby waste and sewage. ❌ Clean water requires proper sanitation and distance from contamination sources."
    },
    {
        level: 1,
        question: "Bottled water from a certified treatment facility",
        description: "Water that has been filtered, treated, and bottled in a controlled facility with safety standards.",
        isClean: true,
        explanation: "This is clean water! ✓ Proper treatment and certification ensure safety. This is what Charity: Water helps bring to communities."
    },
    {
        level: 1,
        question: "Water from a river downstream from a city's industrial area",
        description: "Water collected from a river that flows past factories and urban centers.",
        isClean: false,
        explanation: "This water is likely contaminated with industrial waste and pollutants. ❌ Rivers downstream from industrial areas are not safe sources."
    },
    {
        level: 1,
        question: "A deep well with a sealed pump and regular testing",
        description: "A protected well maintained by trained technicians with monthly safety tests.",
        isClean: true,
        explanation: "This is clean water! ✓ Protected wells with maintenance and testing are reliable sources. This is exactly what Charity: Water promotes."
    },
    {
        level: 2,
        question: "Stagnant water in a pond with algae growth",
        description: "Water that hasn't been flowing, with visible algae and unclear coloration.",
        isClean: false,
        explanation: "Stagnant water breeds disease and parasites. ❌ Moving, treated water is essential for health."
    },
    {
        level: 2,
        question: "Rainwater collected in a clean, covered system",
        description: "Rainwater harvested in a hygienic system with proper storage and filtration.",
        isClean: true,
        explanation: "This is clean water! ✓ Rainwater harvesting is an excellent sustainable solution for clean water access."
    },
    {
        level: 2,
        question: "Water from a hand pump installed by engineers with filters",
        description: "A hand pump installed by trained professionals with multiple filtration stages.",
        isClean: true,
        explanation: "This is clean water! ✓ Hand pumps with filtration are crucial infrastructure. Charity: Water specializes in these!"
    },
    {
        level: 2,
        question: "Water shared with livestock in the same source",
        description: "The same water source used by animals for drinking and bathing.",
        isClean: false,
        explanation: "Shared water sources with animals cause bacterial contamination. ❌ Separate clean water is essential for human health."
    },
    {
        level: 3,
        question: "Spring water from a protected mountain source with monitoring",
        description: "Natural spring water from a protected mountain area with regular quality monitoring.",
        isClean: true,
        explanation: "This is clean water! ✓ Protected natural springs with monitoring provide safe, sustainable water solutions."
    },
    {
        level: 3,
        question: "Water collected in an open container from an untested source",
        description: "Water stored in an open bucket from an unverified water source.",
        isClean: false,
        explanation: "Unverified sources and open storage allow contamination. ❌ All water must be tested and safely stored."
    },
    {
        level: 3,
        question: "Solar-powered filtered water system",
        description: "Water filtered through modern solar-powered purification with transparent pipes.",
        isClean: true,
        explanation: "This is clean water! ✓ Sustainable, solar-powered solutions are the future of clean water access!"
    },
    {
        level: 3,
        question: "Water from a stream used by downstream communities without treatment",
        description: "Water taken from a stream that has multiple communities upstream without any treatment.",
        isClean: false,
        explanation: "Upstream communities make the water unsafe. ❌ Treatment and testing are required for safety."
    }
];

// UI Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startGame() {
    gameState = {
        currentLevel: 1,
        score: 0,
        lives: 3,
        currentQuestionIndex: 0,
        gameActive: true
    };
    
    loadQuestion();
    showScreen('gamePlayScreen');
    updateUI();
}

function goToMenu() {
    gameState.gameActive = false;
    showScreen('startScreen');
}

function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('level').textContent = gameState.currentLevel;
    document.getElementById('lives').textContent = gameState.lives;
}

function loadQuestion() {
    // Get questions for current level
    const levelQuestions = questions.filter(q => q.level === gameState.currentLevel);
    
    if (levelQuestions.length === 0) {
        endGame('win');
        return;
    }
    
    // Get a random question
    const question = levelQuestions[Math.floor(Math.random() * levelQuestions.length)];
    
    // Display question
    document.getElementById('question').textContent = question.question;
    document.getElementById('descriptionText').textContent = question.description;
    
    // Update water glass appearance
    const waterGlass = document.querySelector('.water-glass');
    waterGlass.classList.remove('clean', 'dirty');
    
    // Store the correct answer
    gameState.currentQuestion = question;
    
    // Clear feedback
    const feedback = document.getElementById('feedback');
    feedback.classList.remove('show', 'correct', 'incorrect');
    feedback.textContent = '';
    
    // Enable buttons
    document.getElementById('choice1').disabled = false;
    document.getElementById('choice2').disabled = false;
}

function makeChoice(isClean) {
    if (!gameState.gameActive) return;
    
    const isCorrect = isClean === gameState.currentQuestion.isClean;
    const feedback = document.getElementById('feedback');
    
    // Disable buttons
    document.getElementById('choice1').disabled = true;
    document.getElementById('choice2').disabled = true;
    
    // Update water glass appearance
    const waterGlass = document.querySelector('.water-glass');
    waterGlass.classList.add(gameState.currentQuestion.isClean ? 'clean' : 'dirty');
    
    if (isCorrect) {
        // Correct answer
        feedback.classList.add('show', 'correct');
        feedback.textContent = gameState.currentQuestion.explanation;
        gameState.score += 10;
        
        // Level up every 3 correct answers
        if (gameState.score % 30 === 0 && gameState.score > 0) {
            gameState.currentLevel++;
        }
    } else {
        // Wrong answer
        feedback.classList.add('show', 'incorrect');
        feedback.textContent = gameState.currentQuestion.explanation;
        gameState.lives--;
        
        if (gameState.lives <= 0) {
            endGame('lose');
            return;
        }
    }
    
    updateUI();
    
    // Load next question after delay
    setTimeout(() => {
        loadQuestion();
    }, 3000);
}

function endGame(result) {
    gameState.gameActive = false;
    
    if (result === 'lose') {
        document.getElementById('finalScore').textContent = gameState.score;
        document.getElementById('finalLevel').textContent = gameState.currentLevel;
        document.getElementById('gameOverMessage').textContent = 
            `You reached Level ${gameState.currentLevel} with a score of ${gameState.score} points! Keep learning about clean water access.`;
        showScreen('gameOverScreen');
    } else if (result === 'win') {
        document.getElementById('winScore').textContent = gameState.score;
        document.getElementById('winLevel').textContent = gameState.currentLevel - 1;
        showScreen('winScreen');
    }
}

// Initialize game on page load
document.addEventListener('DOMContentLoaded', function() {
    showScreen('startScreen');
});