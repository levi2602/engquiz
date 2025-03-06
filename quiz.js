
// Lấy dữ liệu từ localStorage khi vào trang
window.addEventListener("load", function () {
    let storedData = localStorage.getItem("stored");
    if (storedData) {
        vocabulary = JSON.parse(storedData);
    }
});


let vocabulary = {}; // Khai báo biến vocabulary
let wordHistory = JSON.parse(localStorage.getItem("wordHistory")) || {}; // Lưu số lần gặp từ từ LocalStorage
let questionCount = 0;
const maxQuestions = 20; // Số câu hỏi tối đa

function getRandomWords(obj, exclude, count) {
    let keys = Object.keys(obj).filter(word => word !== exclude);
    keys.sort(() => Math.random() - 0.5);
    return keys.slice(0, count);
}

function generateQuestion() {
    if (questionCount >= maxQuestions) {
        localStorage.setItem("wordHistory", JSON.stringify(wordHistory)); // Lưu vào LocalStorage
        window.location.href = "index.html"; // Chuyển về trang chủ
        return;
    }
   
    let words = Object.keys(vocabulary);
    let questionWord = words[Math.floor(Math.random() * words.length)];
    let correctAnswer = vocabulary[questionWord];

    let options = getRandomWords(vocabulary, questionWord, 4);
    options.push(questionWord);
    options.sort(() => Math.random() - 0.5);

    displayQuestion(questionWord, options);
}

function displayQuestion(word, options) {
    console.log(`Đâu là nghĩa của từ: ${word}`);
    options.forEach((option, index) => {
        console.log(`${index + 1}. ${vocabulary[option]}`);
    });

    let questionBox = document.createElement("div");
    questionBox.classList.add('questionBox');
    document.body.appendChild(questionBox);

    document.body.innerHTML = `<center>
        <div class="questionbox">
            <h1>Quiz</h1>
            <h3>Đâu là nghĩa của từ: ${word}?</h3>
            <div id="answerOptions"></div>
        </div>
    </center>`;
    options.forEach(option => {
        let button = document.createElement("button");
        button.textContent = vocabulary[option];
        button.onclick = () => checkAnswer(word, option);
        let answerOptions = document.getElementById("answerOptions")
        answerOptions.appendChild(button);
    });
}

function checkAnswer(word, chosenWord) {
    if (chosenWord === word) {
        wordHistory[word] = (wordHistory[word] || 0) + 1;
        localStorage.setItem("wordHistory", JSON.stringify(wordHistory)); // Cập nhật vào LocalStorage
        questionCount++;

        generateQuestion();
    } else {
        alert("Bạn chọn sai rồi, hãy chọn lại!");
    }
}


