let tuvung = {}; // Biến global
let wordHistory = {}; // Lưu lịch sử từ vựng

// Hàm hiển thị danh sách từ vựng
function renderVocabularyList() {
    let listVoca = document.getElementById("listvoca");
    listVoca.innerHTML = ""; // Xóa danh sách cũ
    Object.entries(tuvung).forEach(([word, translation]) => {
        let li = document.createElement("li");
        li.classList.add("words");
        li.textContent = `${word}: ${translation}`;

        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.width = "100px";

        let level = document.createElement("div");
        level.classList.add("level");
        level.style.height = "100%";
        level.style.width = (wordHistory[word] ? (wordHistory[word] / 50 * 100) : 0) + "%";

        bar.appendChild(level);
        li.appendChild(bar);
        listVoca.appendChild(li);
    });
}

// Lấy dữ liệu từ localStorage khi vào trang
window.addEventListener("load", function () {
    let storedData = localStorage.getItem("stored");
    if (storedData) {
        tuvung = JSON.parse(storedData);
    }
    let storedHistory = localStorage.getItem("wordHistory");
    if (storedHistory) {
        wordHistory = JSON.parse(storedHistory);
    }
    renderVocabularyList();
});

document.getElementById("vocabularysumit").addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn form gửi đi nếu trong form

    let inputText = document.querySelector("textarea[name='vocabulary_input']").value;
    let wordsArray = inputText.split(/\s+/).map(word => word.trim()); // Tách từ theo dấu cách
    let vocabularyObject = {};

    // Lấy dữ liệu cũ từ localStorage nếu có
    let storedData = localStorage.getItem("stored");
    let existingData = storedData ? JSON.parse(storedData) : {};

    let promises = wordsArray.map(word => {
        let cleanedWord = word.replace(/[^a-zA-Z]/g, "").trim(); // Loại bỏ ký tự đặc biệt, giữ lại chữ cái
        if (cleanedWord && !existingData[cleanedWord]) { // Chỉ dịch nếu từ chưa có trong localStorage
            return fetch(`https://api.mymemory.translated.net/get?q=${cleanedWord}&langpair=en|vi`)
                .then(response => response.json())
                .then(data => {
                    vocabularyObject[cleanedWord] = data.responseData.translatedText;
                })
                .catch(error => console.error("Error translating:", error));
        }
    });

    Promise.all(promises).then(() => {
        // Cập nhật dữ liệu và lưu lại vào localStorage
        tuvung = { ...existingData, ...vocabularyObject };
        localStorage.setItem("stored", JSON.stringify(tuvung));

        // Hiển thị danh sách từ vựng
        renderVocabularyList();

        console.log(tuvung);
    });
});

// Xóa toàn bộ dữ liệu từ điển
document.getElementById("deletedic").addEventListener("click", function () {
    localStorage.removeItem("stored");
    localStorage.removeItem("wordHistory");
    tuvung = {};
    wordHistory = {};
    document.getElementById("listvoca").innerHTML = ""; // Xóa danh sách hiển thị
    console.log("Từ điển đã bị xóa.");
});
