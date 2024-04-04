const BLANK = "";
const DEBUGGING = false;

const NONPRINTABLE_CHARACTERS = ["ArrowLeft", "ArrowRight", "Tab", "Backspace", "Delete"];
const ROOT_SITE = "https://localhost:44339";


Object.defineProperty (HTMLElement.prototype, "firstSibling", { get: function () { return this.parentNode?.children?.[0] } });

HTMLElement.prototype.getElementByContents = function (contents, substring = false) {
	let xpath = `//* [${substring ? "contains (., " : "text () = "}'${contents}'${substring ? ")" : BLANK}]`;
	return document.evaluate (xpath, this, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
}


HTMLElement.prototype.getElementsByContents = function (contents, substring = false) {

	let result = null;
	let xpath = `//* [${substring ? "contains (., " : "text () = "}'${contents}'${substring ? ")" : BLANK}]`;
	let query = document.evaluate (xpath, this, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);

	for (let index = 0; index < query.snapshotLength; index++) {
		result ??= new Array ();
		result.push (query.snapshotItem (index));
	}
	return result;
}


Document.prototype.getElementByContents = HTMLElement.prototype.getElementByContents;
Document.prototype.getElementsByContents = HTMLElement.prototype.getElementsByContents;


String.prototype.matches = function (value) {
	return this.trim ().toLowerCase () == value.trim ().toLowerCase ();
}


/********/


var debug = text => DEBUGGING ? alert (text) : null;


var is_empty = object => ((object == null) || (object == "undefined"));
var not_empty = item => !is_empty (item);
var pause = (text = null) => alert (is_empty (text) ? "paused" : text);


var wait = (condition) => new Promise (function waiter (resolve) {
	if (!(condition instanceof Function)) throw ("Condition must be a boolean function");
	let result = condition ();
	if (result) return resolve (result);
	setTimeout (() => waiter (resolve));
});


/**** Debug Function ****/


function doit (method) {
	let doit_button = document.createElement ("button");
	doit_button.innerHTML = "Doit";
	doit_button.addEventListener ("click", method);
	document.body.insertBefore (doit_button, document.body.firstChild);
}


/********/


async function load_control (selector) {
	return await new Promise (function control_loader (resolve) {
		let control = document.getElementById (selector);
		if (control == null) control = document.querySelector (selector);
		if (control == null) return setTimeout (() => control_loader (resolve));
		resolve (control);
	});
}


function update_progress (text = BLANK) {
	fetch (`${ROOT_SITE}/report`, {
		method: "post",
		headers: { "content-type": "text/plain" },
		body: text
	});
}


function report_progress (text = BLANK) {
	let progress_window = document.getElementById ("progress_window");
	if (progress_window.innerHTML == "Idle") return progress_window.innerHTML = text;
	progress_window.innerHTML += `<br />${text}`;
	progress_window.scrollTop = progress_window.scrollHeight;
	update_progress (text);
}


function ShowPage (page, parameters) {
	let form = document.createElement("form");
	form.action = page;
	form.method = "post";

	for (let parameter of parameters) {
		let child = form.appendChild (document.createElement ("input"));
		child.type = "hidden";
		for (let [name, value] of Object.entries (parameter)) {
			child.name = name;
			child.value = value;
		}
	}

	document.body.append (form);
	form.submit ();
}


function GetElementByContents (node_type, contents, substring = false) {
	let xpath = `//${node_type} [${substring ? "contains (., " : "text () = "}'${contents}'${substring ? ")" : BLANK}]`;
	return document.evaluate (xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE).singleNodeValue;
}