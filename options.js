document.addEventListener("DOMContentLoaded", () => {
    const keywordInput = document.getElementById("keywordInput");
    const addKeywordBtn = document.getElementById("addKeyword");
    const keywordList = document.getElementById("keywordList");

    // 設定をロード
    function loadSettings() {
        chrome.storage.sync.get(["blockedKeywords"], (data) => {
            const keywords = data.blockedKeywords || [];

            keywordList.innerHTML = "";
            keywords.forEach((keyword, index) => {
                const li = document.createElement("li");
                li.classList.add("blocked_li");

                // キーワード表示用
                const keywordSpan = document.createElement("span");
                keywordSpan.textContent = keyword;
                keywordSpan.style.cursor = "pointer";
                keywordSpan.addEventListener("click", () => editKeyword(index, keyword));

                // 編集用の入力フィールド
                const editInput = document.createElement("input");
                editInput.type = "text";
                editInput.value = keyword;
                editInput.classList.add("edit-input");
                editInput.addEventListener("blur", () => saveEditedKeyword(index, editInput.value)); // フォーカス外れたら保存
                editInput.addEventListener("keypress", (event) => {
                    if (event.key === "Enter") {
                        saveEditedKeyword(index, editInput.value);
                    }
                });

                // 削除ボタン
                const deleteBtn = document.createElement("i");
                deleteBtn.classList.add("fas", "fa-fw", "fa-times", "delete-btn");
                deleteBtn.style.cursor = "pointer"; // カーソルをポインターにする
                deleteBtn.addEventListener("click", () => removeKeyword(index));

                li.appendChild(keywordSpan);
                li.appendChild(editInput);
                li.appendChild(deleteBtn);
                keywordList.appendChild(li);
            });
        });
    }

    // キーワード追加
    addKeywordBtn.addEventListener("click", () => {
        const newKeyword = keywordInput.value.trim();
        if (newKeyword) {
            chrome.storage.sync.get(["blockedKeywords"], (data) => {
                const keywords = data.blockedKeywords || [];
                if (!keywords.includes(newKeyword)) {
                    keywords.push(newKeyword);
                    chrome.storage.sync.set({ blockedKeywords: keywords }, loadSettings);
                }
            });
            keywordInput.value = "";
        }
    });

    // キーワード編集モード
    function editKeyword(index, oldKeyword) {
        const listItem = keywordList.children[index];
        const keywordSpan = listItem.querySelector("span");
        const editInput = listItem.querySelector(".edit-input");

        keywordSpan.style.display = "none"; // 文字列を非表示
        editInput.style.display = "inline-block"; // 入力フォームを表示
        editInput.focus();
    }

    // 編集確定（ストレージに保存）
    function saveEditedKeyword(index, newKeyword) {
        chrome.storage.sync.get(["blockedKeywords"], (data) => {
            const keywords = data.blockedKeywords || [];
            if (newKeyword.trim() !== "") {
                keywords[index] = newKeyword.trim();
                chrome.storage.sync.set({ blockedKeywords: keywords }, loadSettings);
            }
        });
    }

    // キーワード削除
    function removeKeyword(index) {
        chrome.storage.sync.get(["blockedKeywords"], (data) => {
            const keywords = data.blockedKeywords || [];
            keywords.splice(index, 1);
            chrome.storage.sync.set({ blockedKeywords: keywords }, loadSettings);
        });
    }

    loadSettings();
});
