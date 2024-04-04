const JOB_SEARCH_PAGE = "https://www.dice.com/jobs";

let work_window = null;

let application_promise = null;

let is_empty = item => ((item == null) || (item == "undefined"));
let not_empty = item => !is_empty (item);

let alert = (tab_id, message) => chrome.tabs.sendMessage (tab_id, {
	action: "alert",
	message: message
});


let update_tab = async (tab_id, url) => {
	if (await chrome.tabs.get (tab_id) == null) return chrome.tabs.create ({ windowId: work_window.id, url: url});
	chrome.tabs.update (tab_id, { url: url });
}

let send_message = (source_id, target_id, message) => {
	if ((source_id != target_id) && not_empty (target_id))  {
		chrome.tabs.update (target_id, { active: true });
		chrome.tabs.sendMessage (target_id, message);
	}
}


let identify_tab = async (source, tab_id) => {
	let ids = (await chrome.storage.local.get ("tab_ids"))?.["tab_ids"];
	if (is_empty (ids)) ids = {}
	ids [source] = tab_id;
	await chrome.storage.local.set ({
		tab_ids: ids
	});

let result = await chrome.storage.local.get ("tab_ids");
let x = result;

}


let validate_id = async tab_id => {
	return await new Promise (resolve => {
		chrome.tabs.query ({}, validate_tab = tabs => {
			for (let tab of tabs) {
				if (tab.id == tab_id) return resolve (true);
			}
			return setTimeout (() => validate_tab (tabs));
		});
	});
}


let get_tab_id = async target => {
	let tab_ids = await chrome.storage.local.get ("tab_ids");
	let result = tab_ids?.["tab_ids"]?.[target];
	if (await validate_id (result)) return result;
}


chrome.contentSettings.popups.set ({
	primaryPattern: "https://localhost:44339/*",
	setting: "allow"
});


chrome.runtime.onMessage.addListener (async (message, sender) => {

	if (message.target == "script") return;
	if (message.action == "identify") return identify_tab (message.source, sender.tab.id);

	let target = await get_tab_id (message.target);

	try {
		if (message.action == "focus") return chrome.tabs.update (target, { active: true });
		send_message (sender.tab.id, target, message);
		chrome.tabs.update (target, { active: true });
	} catch (except) {
		let x = except;
	}

});

