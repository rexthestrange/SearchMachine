function LoginUser () {
	hide_element ("email_form", () => show_element ("email_eyecandy"));

	fetch ("/Accounts/Login", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify ({
			email_address: document.getElementById ('user_email').value
		})
	}).then (response => response.json ()).then (result => {
		if (result.success) {
			hide_element ("signin_popup", () => { show_element ("signin_response") });
			return;
		} else {
			hide_element ("signin_popup", () => { 
				document.querySelector ("#invalid_email_popup div.prompt").innerHTML = result.message;
				show_element ("invalid_email_popup");
				HideElementNow ("email_eyecandy");
				ShowElementNow ("email_form");
			});
		}
	});
}

function ActivateLogin (login_code, stay_logged) {
	fetch ("/Accounts/Validate", {
		method: "post",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify ({ code: login_code })
	}).then (response => response.json ()).then (result => {
		if (result.success) {
			if (stay_logged) localStorage.setItem ("user_id", result.user_id);
			location.href = "/Home";
			return;
		}
		hide_element ("signin_response", () => { show_element ("validation_error") });
	});
}