window.addEventListener ("DOMContentLoaded", () => chrome.runtime.sendMessage ({ action: "identify", source: "machine" }));

window.addEventListener ("message", message => chrome.runtime.sendMessage (message.data));

chrome.runtime.onMessage.addListener ((message, sender) => {
	if (message.target != "machine") return;
	message.target = "script";
	window.postMessage (message);
});
