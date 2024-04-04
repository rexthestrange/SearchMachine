const APPLICATION_FORM = "https://smartapply.indeed.com";
//const JOB_DETAILS_PAGE = null; // "https://www.dice.com/job-detail";
//const JOB_FORMAT_PAGE = null; // "https://www.dice.com/apply";
//const HOST_SERVER = "https://localhost:44339";


let press_button = async signature => (await load_control (signature)).click ();


//let send_message = payload => {
//	chrome.runtime.sendMessage (payload);
//	window.opener.focus ();
//}

//let details_window = null;
//let message_response = null;
//let observer = null;
//let job_id = null;

//let cover_letter_loaded = false;


//let deserialize_file = base_file => new Promise(resolve => {
//	let encoding_type = base_file.base_string.match (/^data:(.+);base64/)?.[1];
//	fetch (base_file.base_string).then (response => response.blob ()).then (response => {
//		resolve (new File ([response], base_file.filename, { type: encoding_type }));
//	});
//});


//async function load_control (selector) {
//	return await new Promise (function control_loader (resolve) {
//		let control = document.getElementById (selector);
//		if (control == null) control = document.querySelector (selector);
//		if (control == null) return setTimeout (() => control_loader (resolve));
//		resolve (control);
//	});
//}


//async function wait_for_response (resolve = null) {
//	await wait (() => message_response != null);
//	if (resolve != null) resolve (message_response);
//	message_response = null;
//}


//async function save_application (job_id = null) {

//	update_progress ("Saving application (indeed)");

//	await new Promise (async resolve => {
//		send_message ({ action: "save_application", target: "machine", payload: { 
//			job_id: job_id,
//			applied: true
//		} });
//		await wait_for_response (resolve);
//	});
//}


//async function save_application_details () {

//	update_progress ("Saving application details (indeed)");

//	let job_save_response = await new Promise (async resolve => {
//		send_message ({ action: "save_job", target: "machine", payload: {
//			site_job_id: document.URL.substring (JOB_DETAILS_PAGE.length + 1),
//			title: document.querySelector ("h1[data-cy='jobTitle']").innerHTML,
//			company: document.querySelector ("a[data-cy='companyNameLink']").innerHTML
//		} });
//		await wait_for_response (resolve);
//	});

//	await save_application (job_save_response.id);

//	update_progress ("Save complete (indeed)");

//	send_message ({ action: "save_complete", target: "applied_jobs", payload: { success: true } });
//	message_response = null;

//}

//async function get_applications_list () {

//	let applications_links = document.querySelectorAll ("div.saved-jobs-container a.ng-binding");
//	let next_arrow = document.querySelector ("a[title='Go to next page']");

//	update_progress ("Getting applications list (indeed)");

//	for (let link of applications_links) {
//		if (!link.href.startsWith ("https://www.dice.com/jobs/detail")) continue;
//		details_window = window.open (link.href, "application_details");
//		await wait_for_response ();

//		update_progress ("Applications window opened (indeed)");

//		send_message ({ action: "application_count", target: "machine" });
//	}

//	if (next_arrow) return next_arrow.click ();

//	observer.disconnect ();
//	details_window.close ();
//	send_message ({ action: "save_complete", target: "machine" });

//}

async function load_skills () {

	let skills_list = null;
	let more_button = document.getElementByContents ("+ show more");

	let skills_title = GetElementByContents ("h3", "Skills");

	if (skills_title != null) {

		let job_id = new URLSearchParams(window.location.search).get("jk");

		if (more_button != null) {
			more_button.click ();
			return setTimeout (load_skills);
		}

		for (let button of skills_title.parentNode.querySelectorAll ("button")) {

			let aria_label = button.getAttribute ("aria-label");
			if (aria_label == null) continue;

			let skill = aria_label.match (/Skills (.+?) (matching|missing) qualification/);
			if (skill == null) continue;

			skills_list ??= new Array ();
			skills_list.push ({
				job_id,
				skill: skill [1]
			});
		}

	}

	chrome.runtime.sendMessage ({
		target: "machine",
		action: "skills",
		payload: skills_list
	});

}// load_skills;


//async function submit_application () {
//	let apply_button = await load_control ("button.btn-next");
//	apply_button.click ();
//	save_application ();

//	update_progress ("Application submitted and saved (indeed)");
//}


//async function review_application () {
//	let apply_button = await load_control ("button.btn-next");
//	apply_button.click ();
//	if (document.URL == "https://www.dice.com/apply/application-questions") return; // Complete application manually

//	update_progress ("Application reviewed (indeed)");
	
//	submit_application ();
//}


//async function check_for_completed_application () {

//	let mutable_object = document.querySelector ("apply-button-wc")?.shadowRoot;

//	observer = new MutationObserver (async () => {
//		if (mutable_object.querySelector ("application-submitted") != null) {
//			send_message ({ target: "machine", action: "retrieve_job_id" });
//			await wait (() => (job_id != null));
//			observer.disconnect ();
//			save_application (job_id);
//			job_id = null;
//		}
//	});
//	observer.observe (mutable_object, { childList: true });
//}


async function create_application () {

	let element = document.getElementById ("indeedApplyButton");

	//check_for_completed_application ();
	update_progress ("Creating application (indeed)");
	element.click ();

}


//async function get_cover_letter () {

//	update_progress ("Getting cover letter (indeed)");

//	await new Promise (async resolve => {
//		send_message ({ target: "machine", action: "cover_letter" });
//		await wait (() => cover_letter_loaded);
//		resolve ();
//	});
//}


//async function load_cover_letter (message) {

//	let file = await deserialize_file (message.payload);
//	let list = new DataTransfer ();

//	update_progress ("Loading cover letter (indeed)");

//	let popup_window_button = await load_control ("div.cover-letter-wrapper button");
//	popup_window_button.click ();

//	let cover_letter_button = await load_control  ("div.file-picker-wrapper.cover-letter button");
//	cover_letter_button.click ();

//	list.items.add (file);

//	let file_upload = await load_control ("fsp-fileUpload");
//	file_upload.files = list.files;
//	file_upload.dispatchEvent (new Event ("change"));

//	let upload_button = await load_control ("span[data-e2e='upload']");
//	upload_button.click ();

//	await wait (() => document.getElementById ("__filestack-picker") == null);

//	cover_letter_loaded = true;
//}


//async function format_application () {

//	update_progress ("Formatting application (indeed)");

//	await get_cover_letter ();
//	review_application ();
//}


async function next_page () {
	let continue_button = await wait (() => GetElementByContents ("span", "Continue"));
	continue_button.parentNode.click ();
}


async function update_page () {



	update_progress ("Updating page (indeed)");

	if (document.URL.startsWith (APPLICATION_FORM)) {

		await wait (() => document.URL.endsWith ("/resume"));

		continue_button = GetElementByContents ("span", "Continue")?.parentNode;
		await wait (() => !continue_button.disabled);
		continue_button.click ();

		await wait (() => !document.URL.endsWith ("/review"));

		if (document.URL.endsWith ("form/review")) 

return;

	}
	return load_skills ();
//	if (document.URL.startsWith (JOB_FORMAT_PAGE)) return format_application ();
}


function search_for_cards () {

	let active_cards = null;
	let candidates = document.querySelectorAll ("div.slider_container");

	update_progress ("Searching for cards (indeed)");

	for (let card of candidates) {

		let easy_apply = card.querySelector ("span[data-testid='indeedApply']");

		if (easy_apply != null) {

			let anchor = card.querySelector ("a");

			let target = anchor.href;
			let job_id = anchor.getAttribute ("data-jk");

			if (active_cards == null) active_cards = new Array ();
			active_cards.push ({
				href: target,
				site_job_id: job_id,
				title: card.querySelector ("span[id^='jobTitle']").innerHTML,
				company: card.querySelector ("span[data-testid='company-name']").innerHTML
			});
		}
	}

	chrome.runtime.sendMessage ({ 
		target: "machine", 
		action: "job_cards",
		items: active_cards,
	//	last_page: document.querySelector ("li.pagination-next.disabled") != null
	});

}// search_for_cards;


//function open_applications_page (resolve) {
//	let applied_links = document.querySelectorAll ("h3.job-filters button");
//	if (applied_links.length == 0) return setTimeout (get_job_applications);

//	update_progress ("Opening applications page (indeed)");

//	for (let link of applied_links) {
//		if (link.innerHTML == "Applied Jobs") {
//			resolve (link);
//			break;
//		}
//	}
//}


//async function get_job_applications () {

//	let link = await new Promise (open_applications_page);
//	let mutable_object = await load_control ("div[data-loading-indicator]");

//	update_progress ("Getting job applications (indeed)");

//	link.click ();
//	observer = new MutationObserver (mutation_list => {
//		for (let mutation of mutation_list) {
//			if ((mutation.oldValue == BLANK) && (mutable_object.style.display == "none")) return get_applications_list ();
//		}
//	});
//	observer.observe (mutable_object, {
//		attributes: true,
//		attributeOldValue: true,
//		attributeFilter: ["style"]
//	});
//}


window.addEventListener ("DOMContentLoaded", () => {

	update_progress (`DOMContentLoaded (${window.name} - Indeed)`);

	chrome.runtime.sendMessage ({ action: "identify", source: window.name }, () => {

		switch (window.name) {
			case "jobs_tab": return search_for_cards ();
			case "job_details": if (document.URL.startsWith ("https://www.indeed.com/viewjob")) return update_skills ();
//			case "applied_jobs": return get_job_applications ();
//			case "application_details": return save_application_details ();
		}

		window.focus ();

	});

}, { once: true });


window.navigation.addEventListener ("navigate", async event => {
	if (event.destination.url.endsWith ("profile-location")) return await next_page ();
	if (event.destination.url.endsWith ("resume")) return await next_page ();
	if (event.destination.url.endsWith ("review")) return await press_button ("a[aria-label='Add Supporting documents']");
	if (event.destination.url.endsWith ("documents")) return await press_button ("button[name='additionalDocuments']");

});


chrome.runtime.onMessage.addListener (message => {

	update_progress (`Listener message received (${message.action} - Indeed)`);

	switch (message.action) {
		case "apply": return create_application ();
//		case "save_complete": return message_response = message.payload;
//		case "resolve": return application_processed = true;
//		case "cover_letter": return message.payload == null ? (cover_letter_loaded = true) : load_cover_letter (message);
//		case "job_id_retrieved": return job_id = message.payload;
	}
});
