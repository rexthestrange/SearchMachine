let applications_window = null;
let application_count = 0;

function get_applied_jobs () {
	application_count = 0;
	applications_window = window.open ("https://www.dice.com/dashboard/jobs", "applied_jobs");
}

window.addEventListener ("message", event => {
	if (event.data.target != "script") return;
	if (event.data.action == "application_count") application_count++;

	if (event.data.action == "save_complete") {
		document.getElementById ("notification").querySelector ("div[name='notification_text']").innerHTML = `${application_count} application${(application_count == 1) ? BLANK : "s"} saved.`;
		show_element ("notification");
		applications_window.close ();
	}

});