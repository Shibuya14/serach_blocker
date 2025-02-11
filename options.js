document.addEventListener("DOMContentLoaded", () => {
    const keywordInput = document.getElementById("keywordInput");
    const addKeywordBtn = document.getElementById("addKeyword");
    const keywordList = document.getElementById("keywordList");
    const startTimeInput = document.getElementById("startTime");
    const endTimeInput = document.getElementById("endTime");
    const saveSettingsBtn = document.getElementById("saveSettings");
    const matchTypeRadios = document.querySelectorAll("input[name='matchType']");
    const weekdayCheckboxes = document.querySelectorAll(".weekday");
    const redirectUrlInput = document.getElementById("redirectUrl");

    // 設定をロード
    function loadSettings() {
        chrome.storage.sync.get(["blockedKeywords", "matchType", "scheduleSettings", "redirectUrl"], (data) => {
            const keywords = data.blockedKeywords || [];
            const scheSettings = data.scheduleSettings || {
                startTime: "07:00", // デフォルトの開始時間
                endTime: "21:00", // デフォルトの開始時間
                weekdays: [0, 1, 2, 3, 4, 5, 6] // デフォルトはすべての曜日で機能する
            };
            const matchType = data.matchType || "partial"; // デフォルトは「部分一致」
            const redirectUrl = data.redirectUrl || "https://www.google.com"; // デフォルト: Google


            keywordList.innerHTML = "";
            keywords.forEach((keyword, index) => {
                const li = document.createElement("li");

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
                const deleteBtn = document.createElement("span");
                deleteBtn.textContent = " ❌";
                deleteBtn.classList.add("delete-btn");
                deleteBtn.addEventListener("click", () => removeKeyword(index));

                li.appendChild(keywordSpan);
                li.appendChild(editInput);
                li.appendChild(deleteBtn);
                keywordList.appendChild(li);
            });

            // 時間の設定を読み込み
            startTimeInput.value = scheSettings.startTime || "";
            endTimeInput.value = scheSettings.endTime || "";

             // マッチタイプの選択状態を更新
            matchTypeRadios.forEach(radio => {
                radio.checked = (radio.value === matchType);
            });

            // 曜日の設定を読み込み
            weekdayCheckboxes.forEach(checkbox => {
                checkbox.checked = (scheSettings.weekdays || []).includes(parseInt(checkbox.value));
            });

            // 設定を反映
            matchTypeRadios.forEach(radio => {
                radio.checked = (radio.value === matchType);
            });

            // 遷移先URLの設定
            redirectUrlInput.value = redirectUrl;
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

    // 設定を保存
    saveSettingsBtn.addEventListener("click", () => {
        const weekdays = Array.from(weekdayCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => parseInt(checkbox.value));

        const scheSettings = {
            startTime: startTimeInput.value,
            endTime: endTimeInput.value,
            weekdays: weekdays
        };

        const matchType = document.querySelector("input[name='matchType']:checked").value;

        const redirectUrl = redirectUrlInput.value.trim() || "https://www.google.com"; // 入力が空ならGoogleへ
        console.log(scheSettings);
        console.log(scheSettings.weekdays);

        chrome.storage.sync.set({ scheduleSettings: scheSettings, matchType: matchType, redirectUrl: redirectUrl }, () => {
            alert("設定を保存しました！");
        });
    });

    loadSettings();
});
