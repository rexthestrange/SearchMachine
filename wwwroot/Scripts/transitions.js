function show_element (name) {
	let element = document.getElementById (name);
	if (element.showing) return;
	element.addEventListener ("animationend", () => element.showing = true, { once: true });
	element.style.display = null;
	element.classList.remove ("fadeout");
	element.classList.add ("fadein");
}


function hide_element (name) {
	let element = document.getElementById (name);
	if (!element.showing) return;
	element.addEventListener ("animationend", () => {
		element.style.display = "none";
		element.showing = false;
	}, { once: true });
	element.classList.remove ("fadein");
	element.classList.add ("fadeout");
}


async function show_popup (name) {
	let element = document.getElementById (name);
	show_element (name);
	await wait (() => element.showing);
}


async function hide_popup (name) {
	let element = document.getElementById (name);
	hide_element (name);
	await wait (() => !element.showing);
}


function ShowElementNow (name) {
	let element = document.getElementById (name);
	let transition_time = getComputedStyle (element, "transition-duration");
	element.style.transitionDuration = 0;
	element.style.opacity = 1;
	element.style.display = null;
	element.style.transitionDuration = transition_time;
}


function HideElementNow (name) {
	let element = document.getElementById (name);
	let transition_time = getComputedStyle (element, "transition-duration");
	element.style.transitionDuration = 0;
	element.style.opacity = 0;
	element.style.display = "none";
	element.style.transitionDuration = transition_time;
}
