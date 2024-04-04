const JOB_SEARCH_PAGE = "https://www.dice.com/jobs";
const JOB_DETAILS_PAGE = "https://www.dice.com/job-detail";

var current_site = null;
var current_job = null;

var applications_count = 0;

var skill_active = false;
var application_processed = false;
var processing_complete = false;
var last_page = false;

var jobs_tab = null;
var job_details = null;

let load_document = (frame, src) => frame.setAttribute ("src", src);
let send_message = data => window.postMessage (data);
let cover_letter_file = () => document.getElementById ("cover_letter_upload").files [0];


function open_window (destination, name) {
	let result = window.open (destination, name);
	send_message ({ target: name, action: "focus" });
	return result;
}


async function serialize_file (file) {
	if (is_empty (file)) return null;

	let result = await new Promise (resolve => {
		let reader = new FileReader ();
		reader.readAsDataURL (file);
		reader.onload = () => resolve ({
			filename: file.name,
			base_string: reader.result
		});
	});
	return result;
}


async function upload_cover_letter () {
	let cover_letter = await serialize_file (cover_letter_file ());
	send_message ({ target: "job_details", action: "cover_letter", payload: cover_letter });
}


function set_button_text (text, disabled = true, button = document.getElementById ("search_jobs_button")) {
	button.querySelector ("img").style.display = null;
	button.querySelector ("span.button-text").innerHTML = text;
	if (disabled) {
		button.setAttribute ("disabled", "true");
	} else {
		button.removeAttribute ("disabled");
	}
}


function save_job (job_data) {
	fetch ("/Job/Save", {
		method: "post",
		headers: { "content-type": "application/json" },
		body: JSON.stringify (job_data)
	}).then (response => response.json ()).then (response => {
		report_progress ("Job details saved - sending response (machine)");
		send_message ({ target: "application_details", action: "save_complete", payload: response.value });
	});
}


async function save_application (job_id, value = null) {
	await hide_popup ("skill_rating");

	switch (value) {
		case "no": value = null; break;
		default: value = false; break;
	}

	fetch ("/Application/Save", {
		method: "post",
		headers: { "content-type": "application/json" },
		body: JSON.stringify ({
			job_id: job_id ?? current_job.id,
			applied: value
		})
	}).then (response => response.json ()).then (response => {
		send_message ({ target: "application_details", action: "save_complete", payload: response });
		application_processed = true;
	});
}


function get_job (job_list, job_id) {
	for (let job of job_list) {
		if (job.site_job_id.matches (job_id)) return job;
	}
	return null;
}


function save_jobs (jobs) {
	report_progress ("Saving jobs (machine)");

	for (let job of jobs) {
		job.site = current_site;
	}

	let job_list = JSON.parse (JSON.stringify (jobs));

	for (let job of job_list) {
		if (job.href) delete job.href;
	}

	fetch ("/Jobs/Save", {
		method: "post",
		headers: { "content-type": "application/json" },
		body: JSON.stringify (job_list)
	}).then (response => response.json ()).then (response => {
		for (let job of response.value) {
			let item = get_job (jobs, job.site_job_id);

			for (let [key, value] of Object.entries (job)) {
				try {
					if ((item?.[key] == null) || (item?.[key] == BLANK)) item [key] = value;
				} catch (except) {
					console.log (except);
				}
			}

		}

		process_jobs (jobs);
	});
}


async function send_application () {
	await hide_popup ("skill_rating");
	report_progress (`Applying for ${current_job.title} (machine)`);
	send_message ({ action: "apply", target: "job_details" });
}

async function calculate_competency (skills_list) {
	let competency_count = 0;

	if ((skills_list == null) || (skills_list.length == 0)) return send_application ();

	for (let user_skill of skills_list) {
		if (user_skill.active) competency_count++;
	}

	let competency = Math.round (competency_count / skills_list.length * 100);
	let threshold = parseInt (document.getElementById ("threshold_indicator").value);

	if (document.getElementById ("auto_apply").checked) {

		if (threshold < competency) {
			report_progress (`Sending application (${competency}% out of ${threshold}%)`);
			return send_application ();
		}

		report_progress (`Skipping application (${competency}% out of ${threshold}%)`);
		return save_application (current_job.id, document.querySelector ("input[name='unqualified_response']:checked").value);

	}

	document.getElementById ("job_name").innerHTML = current_job.title;
	document.getElementById ("company_name").innerHTML = current_job.company;
	document.querySelector ("#skill_rating [name='percentage']").innerHTML = competency;

	await show_popup ("skill_rating");
}


async function poll_skills (skills_list) {
	for (let skill of skills_list) {
		skill_active = null;
		if (skill.active == null) {
			report_progress (`Polling skill: ${skill.skill} (machine)`);
			document.getElementById ("skill_id").value = skill.skill_id;
			document.getElementById ("skill_prompt_skill").innerHTML = skill.skill;
			await show_popup ("skill_prompt");
			await wait (() => skill_active != null);
			skill.active = skill_active;
		}
	}
	calculate_competency (skills_list);
}


function update_skills (skills_list) {
	if (skills_list == null) return calculate_competency (null);
	fetch ("/Skills/Save", {
		method: "post",
		headers: { "content-type": "application/json" },
		body: JSON.stringify (skills_list)
	}).then (response => response.json ()).then (response => poll_skills (response));
}


function update_user_skill (value) {

	let skill_id = document.getElementById ("skill_id").value;

	fetch ("/Skills/User/Update", {
		method: "post",
		headers: { "content-type": "application/json" },
		body: JSON.stringify ({
			skill_id: skill_id,
			active: value
		})
	}).then (response => response.json ()).then (async response => {
		await hide_popup ("skill_prompt");
		skill_active = response.active;
	});

}


async function process_jobs (jobs) {
	for (let job of jobs) {
		application_processed = false;
		if (job.applied) continue;
		report_progress (`Assessing skills for ${job.title} (machine)`);
		current_job = job;
		job_details = open_window (job?.["href"] ?? `${JOB_DETAILS_PAGE}/${job.site_job_id}`, "job_details");
		await wait (() => application_processed);
		report_progress ("Application processed (machine)");
		report_progress ();
	}
	processing_complete = true;                                   
}


function query_string (index, search_term) {
	switch (current_site) {
		case "Dice": return `q=${search_term}&countryCode=US&radius=30&radiusUnit=mi&page=${index}&pageSize=20&filters.isRemote=true&filters.easyApply=true&language=en&eid=4677`;
		case "Indeed": return `q=${search_term}&l=Remote&vjk=6ea7f88daec1ded2&start=${(index - 1) * 10}`;
	}
}


async function search_website (term) {

	report_progress ("Loading search page (machine)");

	let page_index = 1;

	last_page = false;

	report_progress (`Searching for ${term}`);

	while (!last_page) {
		await new Promise (async resolve => {
			jobs_tab = open_window (`${job_search_page (current_site)}?${query_string (page_index, term)}`, "jobs_tab");
			await wait (() => processing_complete);
			processing_complete = false;
			resolve ();
		});
		report_progress (`Page ${page_index} complete (machine)`);
		page_index++;
	}
	report_progress (`Processing for ${document.getElementById ("search_terms").value} complete (machine)`);

}


function job_search_page () {
	switch (current_site) {
		case "Dice": return "https://www.dice.com/jobs";
		case "Indeed": return "https://www.indeed.com/jobs";
	}
}


async function search_jobs () {
	let sites = document.querySelectorAll ("[name='site_checkbox']:checked");

	for (let site of sites) {

		let search_terms = document.getElementById ("search_terms").value.split (",");
		current_site = site.value;

		report_progress (`Searching ${current_site}`)

		for (let term of search_terms) {
			await search_website (term);
		}

	}

	jobs_tab.close ();
	job_details?.close ();
}


window.addEventListener ("message", event => {

	if (event.data.target != "script") return;

	window.focus ();

	if (event.data.action == "job_cards") {
		last_page = event.data.last_page;
		return save_jobs (event.data.items);
	}

	switch (event.data.action) {
		case "identification": store_identification (event.data.source, event.data.tab_id);
		case "alert": return alert (event.data.message);
		case "skills": return update_skills (event.data.payload);
		case "save_application": return save_application (event.data.payload.job_id, event.data.payload.applied);
		case "save_job": return save_job (event.data.payload);
		case "cover_letter": return upload_cover_letter ();
		case "retrieve_job_id": return send_message ({ target: "job_details", action: "job_id_retrieved", payload: current_job.id });
	}

});

