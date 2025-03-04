chrome.storage.sync.get(["blockedKeywords", "matchType", "scheduleSettings", "redirectUrl"], (data) => {
    const blockedKeywords = data.blockedKeywords || [];
    const matchType = data.matchType || "partial"; // デフォルトは部分一致
    const scheSettings = data.scheduleSettings || {};
    const redirectUrl = data.redirectUrl || "https://www.google.com"; // デフォルト: Google
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    if (!query) return;

    // 現在の時刻と曜日を取得
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    const currentWeekday = now.getDay();

    // 設定された時間と曜日が一致するか判定
    if (scheSettings.startTime && scheSettings.endTime && scheSettings.weekdays.includes(currentWeekday)) {
        if (scheSettings.startTime <= currentTime && currentTime <= scheSettings.endTime) {
            for (let keyword of blockedKeywords) {
                let isBlocked = false;
                if (matchType === "exact") {
                    isBlocked = query.toLowerCase() === keyword.toLowerCase(); // 完全一致
                    console.log(matchType)
                    console.log(query.toLowerCase())
                } else {
                    isBlocked = query.toLowerCase().includes(keyword.toLowerCase()); // 部分一致
                    console.log(matchType)
                    console.log(query.toLowerCase())
                }
                if (isBlocked) {
                    console.log(`🚫 ${keyword} を含む検索のためリダイレクト`);
                    window.location.href = redirectUrl; // 設定されたURLに遷移
                    break;
                }
            }
        }
    }
});
