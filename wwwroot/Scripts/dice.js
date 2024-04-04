const JOB_DETAILS_PAGE = "https://www.dice.com/job-detail";
const JOB_FORMAT_PAGE = "https://www.dice.com/apply";
const HOST_SERVER = "https://localhost:44339";


let send_message = payload => {
	chrome.runtime.sendMessage (payload);
	window.opener.focus ();
}

let details_window = null;
let message_response = null;
let observer = null;
let job_id = null;

let cover_letter_loaded = false;


let deserialize_file = base_file => new Promise(resolve => {
	let encoding_type = base_file.base_string.match (/^data:(.+);base64/)?.[1];
	fetch (base_file.base_string).then (response => response.blob ()).then (response => {
		resolve (new File ([response], base_file.filename, { type: encoding_type }));
	});
});


async function wait_for_response (resolve = null) {
	await wait (() => message_response != null);
	if (resolve != null) resolve (message_response);
	message_response = null;
}


async function save_application (job_id = null) {

	update_progress ("Saving application (dice)");

	await new Promise (async resolve => {
		send_message ({ action: "save_application", target: "machine", payload: { 
			job_id: job_id,
			applied: true
		} });
		await wait_for_response (resolve);
	});
}


async function save_application_details () {

	update_progress ("Saving application details (dice)");

	let job_save_response = await new Promise (async resolve => {
		send_message ({ action: "save_job", target: "machine", payload: {
			site_job_id: document.URL.substring (JOB_DETAILS_PAGE.length + 1),
			title: document.querySelector ("h1[data-cy='jobTitle']").innerHTML,
			company: document.querySelector ("a[data-cy='companyNameLink']").innerHTML
		} });
		await wait_for_response (resolve);
	});

	await save_application (job_save_response.id);

	update_progress ("Save complete (dice)");

	send_message ({ action: "save_complete", target: "applied_jobs", payload: { success: true } });
	message_response = null;

}

async function get_applications_list () {

	let applications_links = document.querySelectorAll ("div.saved-jobs-container a.ng-binding");
	let next_arrow = document.querySelector ("a[title='Go to next page']");

	update_progress ("Getting applications list (dice)");

	for (let link of applications_links) {
		if (!link.href.startsWith ("https://www.dice.com/jobs/detail")) continue;
		details_window = window.open (link.href, "application_details");
		await wait_for_response ();

		update_progress ("Applications window opened (dice)");

		send_message ({ action: "application_count", target: "machine" });
	}

	if (next_arrow) return next_arrow.click ();

	observer.disconnect ();
	details_window.close ();
	send_message ({ action: "save_complete", target: "machine" });

}

async function load_skills () {

	let skills = document.querySelectorAll ("[data-cy='skillsList'] span");
	let skill_list = null;
	let site_job_id = document.URL.substring (JOB_DETAILS_PAGE.length + 1);

	let xpath = "//div[contains (., 'Sorry this job is no longer available')]";

	if (document.evaluate (xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue != null) {
		send_message ({ target: "machine", action: "retrieve_job_id" });
		await wait (() => (job_id != null));
		save_application (job_id);
		return;
	}

	update_progress ("Loading skills (dice)");

	for (let skill of skills) {
		if (skill_list == null) skill_list = new Array ();
		skill_list.push ({ 
			job_id: site_job_id,
			skill: skill.innerHTML
		});
	}

	chrome.runtime.sendMessage ({
		target: "machine",
		action: "skills",
		payload: skill_list
	}, response => alert (response.message));

}// load_skills;


async function complete_application () {

	await load_control ("application-submitted");

	send_message ({ target: "machine", action: "retrieve_job_id" });
	await wait (() => (job_id != null));
	observer.disconnect ();
	save_application (job_id);
	job_id = null;

}


async function submit_application () {

	let apply_button = await load_control ("button.btn-next");

	setTimeout (async () => {

		apply_button.click ();
		await complete_application ();
		//save_application ();

		update_progress ("Application submitted and saved (dice)");

	}, 2000);
}


async function review_application () {
	let apply_button = await load_control ("button.btn-next");
	apply_button.click ();
	if (document.URL == "https://www.dice.com/apply/application-questions") return; // Complete application manually

	update_progress ("Application reviewed (dice)");
	
	submit_application ();
}


async function create_application () {

	let element = document.querySelector ("apply-button-wc")?.shadowRoot?.querySelector ("button");
	if (element == null) return setTimeout (create_application);

	update_progress ("Creating application (dice)");
	element.click ();

}


async function get_cover_letter () {

	update_progress ("Getting cover letter (dice)");

	await new Promise (async resolve => {
		send_message ({ target: "machine", action: "cover_letter" });
		await wait (() => cover_letter_loaded);
		resolve ();
	});
}


async function load_cover_letter (message) {

	let file = await deserialize_file (message.payload);
	let list = new DataTransfer ();

	update_progress ("Loading cover letter (dice)");

	let popup_window_button = await load_control ("div.cover-letter-wrapper button");
	popup_window_button.click ();

	let cover_letter_button = await load_control  ("div.file-picker-wrapper.cover-letter button");
	cover_letter_button.click ();

	list.items.add (file);

	let file_upload = await load_control ("fsp-fileUpload");
	file_upload.files = list.files;
	file_upload.dispatchEvent (new Event ("change"));

	let upload_button = await load_control ("span[data-e2e='upload']");
	upload_button.click ();

	await wait (() => document.getElementById ("__filestack-picker") == null);

	cover_letter_loaded = true;
}


async function format_application () {

	update_progress ("Formatting application (dice)");

	await get_cover_letter ();
	review_application ();
}


function update_page () {

	update_progress ("Updating page (dice)");

	if (document.URL.startsWith (JOB_DETAILS_PAGE)) return load_skills ();
	if (document.URL.startsWith (JOB_FORMAT_PAGE)) return format_application ();
}


function search_for_cards () {

	let job_list = null;

	let active_cards = null;

	let cards = document.getElementsByTagName ("dhi-search-card");
	if (cards.length == 0) return setTimeout (() => search_for_cards ());

	update_progress ("Searching for cards (dice)");

	for (let card of cards) {
		let link = card.querySelector ("[data-cy='card-easy-apply']");
		if (link != null) {
			if (active_cards == null) active_cards = new Array ();
			active_cards.push (card);
		}
	}

	for (let card of active_cards) {
		let job_link = card.querySelector ("[data-cy='card-title-link']");

		if (job_list == null) job_list = new Array ();

		job_list.push ({
			site_job_id: job_link.id,
			title: job_link.innerHTML,
			company: card.querySelector ("[data-cy='search-result-company-name']").innerHTML
		});
	}

	chrome.runtime.sendMessage ({ 
		target: "machine", 
		action: "job_cards",
		items: job_list,
		last_page: document.querySelector ("li.pagination-next.disabled") != null
	});

}// search_for_cards;


function open_applications_page (resolve) {
	let applied_links = document.querySelectorAll ("h3.job-filters button");
	if (applied_links.length == 0) return setTimeout (get_job_applications);

	update_progress ("Opening applications page (dice)");

	for (let link of applied_links) {
		if (link.innerHTML == "Applied Jobs") {
			resolve (link);
			break;
		}
	}
}


async function get_job_applications () {

	let link = await new Promise (open_applications_page);
	let mutable_object = await load_control ("div[data-loading-indicator]");

	update_progress ("Getting job applications (dice)");

	link.click ();
	observer = new MutationObserver (mutation_list => {
		for (let mutation of mutation_list) {
			if ((mutation.oldValue == BLANK) && (mutable_object.style.display == "none")) return get_applications_list ();
		}
	});
	observer.observe (mutable_object, {
		attributes: true,
		attributeOldValue: true,
		attributeFilter: ["style"]
	});
}


window.addEventListener ("DOMContentLoaded", () => {

	update_progress (`DOMContentLoaded (${window.name} - Dice)`);

	chrome.runtime.sendMessage ({ action: "identify", source: window.name }, () => {

		switch (window.name) {
			case "jobs_tab": return search_for_cards ();
			case "job_details": return update_page ();
			case "applied_jobs": return get_job_applications ();
			case "application_details": return save_application_details ();
		}

		window.focus ();

	});

}, { once: true });


chrome.runtime.onMessage.addListener (message => {

	update_progress (`Listener message received (${message.action} - Dice)`);

	switch (message.action) {
		case "apply": return create_application ();
		case "save_complete": return message_response = message.payload;
		case "resolve": return application_processed = true;
		case "cover_letter": return message.payload == null ? (cover_letter_loaded = true) : load_cover_letter (message);
		case "job_id_retrieved": return job_id = message.payload;
	}
});
