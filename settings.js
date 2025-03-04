document.addEventListener("DOMContentLoaded", () => {
    const startTimeInput = document.getElementById("startTime");
    const endTimeInput = document.getElementById("endTime");
    const saveSettingsBtn = document.getElementById("saveSettings");
    const matchTypeRadios = document.querySelectorAll("input[name='matchType']");
    const weekdayCheckboxes = document.querySelectorAll(".weekday");
    const redirectUrlInput = document.getElementById("redirectUrl");

    // 設定をロード
    function loadSettings() {
        chrome.storage.sync.get(["matchType", "scheduleSettings", "redirectUrl"], (data) => {
            const scheSettings = data.scheduleSettings || {
                startTime: "07:00", // デフォルトの開始時間
                endTime: "21:00", // デフォルトの開始時間
                weekdays: [0, 1, 2, 3, 4, 5, 6] // デフォルトはすべての曜日で機能する
            };
            const matchType = data.matchType || "partial"; // デフォルトは「部分一致」
            const redirectUrl = data.redirectUrl || "https://www.google.com"; // デフォルト: Google

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
