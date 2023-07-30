
const timer = {
	time: 0,
	running: false,
	activeProject: "",
	requestStop: false,
	lasttick: Date.now(),
	starttime: Date.now(),
}

function startTimer(project) {
	if (timer.running) return;

	hide("startBtn");
	show("stopBtn");
	hide("returnBtn");
	show("cancelBtn");


	timer.running = true;
	timer.activeProject = project;
	
	timer.starttime = Date.now();
	timer.lasttick = timer.starttime;

	tick();
}

function stopTimer() {
	timer.requestStop = true;
	calcTimer();
	
	addFrame(timer);

	parseTimer();

	show("startBtn");
	show("returnBtn");
	hide("stopBtn");
	hide("cancelBtn");

}

function cancelTimer() {
	timer.requestStop = true;

	show("startBtn");
	show("returnBtn");
	hide("stopBtn");
	hide("cancelBtn");

}

function tick() {
	if (timer.requestStop) {
		timer.running = false;
		timer.requestStop = false;
	} else {
		calcTimer();
		parseTimer();
		setTimeout(tick, 1000);
	}

}

function calcTimer() {
	timer.time += Date.now() - timer.lasttick
	timer.lasttick = Date.now();
}

function parseTimer() {
	var diff = timer.time / 1000;

	var minutes = (diff / 60) | 0;
	var seconds = (diff % 60) | 0;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;

	document.getElementById("clock").textContent = minutes + ':' + seconds;
}