// TODO add ignore list of urls from storage.

/**
 * Urls to ignore.
 *
 * @type {*[]}
 */
let ignoredUrls = [];

/**
 * In case if is no tabs or no active tab. Use it before css injection.
 *
 * @param e
 * @returns {*}
 */
const isExpectedChromeError = (e) =>
    e.message.includes('Cannot access a chrome:// URL') ||
    e.message.includes(
        'Extension manifest must request permission to access the respective host',
    );

/**
 * Inject css to active tab when page is loading.
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') {
        return;
    }

    if (!tab.id || !tab.url?.startsWith("http")) return;

    try {
        let generatedCss = '::-webkit-scrollbar { width: 12px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #00ffff; border-radius: 6px; }';

        await chrome.scripting.insertCSS({
            css: generatedCss,
            target: {tabId: tab.id, allFrames: true},
            origin: 'AUTHOR',
        });

        console.log("✅ Скроллбар инжектирован!!");
    } catch (e) {
        console.error("❌ Ошибка при инъекции:", e);
    }
});

/**
 * Handle action button in Chrome toolbar
 */
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({url: 'options.html'});
});