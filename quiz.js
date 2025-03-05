// Lấy dữ liệu từ localStorage khi vào trang
window.addEventListener("load", function () {
    let storedData = localStorage.getItem("stored");
    if (storedData) {
        tuvung = JSON.parse(storedData);
    }

});
