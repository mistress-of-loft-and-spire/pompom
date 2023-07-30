
window.onload = (event) => {
	loadFrames()
};


var frames = [];
var projects = [];

var calendar = new CalHeatMap();

function loadFrames() {
	data = localStorage.getItem('frameData');
	parseData(data);
	renderMain();
};

function parseData(data) {
	if (data == null || data == "" || data == "[]") {
		frames = [];
		project = [];
		return
	}
	frames = JSON.parse(data);

	for (var i in frames) {
		// Projects
		var isAdded = false
		for (var project in projects) { if (projects[project] == frames[i][2]) isAdded = true; }
		if (!isAdded) projects.push(frames[i][2]);
	}
}

function clearData() {
	if (confirm("Clear all data?") == true) {
		localStorage.clear();
		loadFrames();
		location.reload();
	}
}

function exportData() {
	var data = JSON.stringify(frames, null,1);
	var file = new Blob([data], { type: 'text/plain' });
	var a = document.createElement("a"),
		url = URL.createObjectURL(file);
	a.href = url;
	a.download = "frames";
	document.body.appendChild(a);
	a.click();
	setTimeout(function () {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}

function importData() {
	var input = document.createElement('input');
	input.type = 'file';
	input.onchange = _ => {
		// you can use this method to get file and perform respective operations
		var files = Array.from(input.files);
		if (files.length < 1) return;
		if (confirm("Import this file and replace all previous data?") == true) {
			var reader = new FileReader();
			reader.onload = onFileLoaded;
			reader.readAsText(files[0])
		}
	};
	input.click();
}
function onFileLoaded(e) {
	try {
		frames = JSON.parse(e.target.result);
	} catch (err) {
		window.alert("Could not load data!\n\n" + err);
		return;
	}
	storeData();
	location.reload();
}

function storeData() {
	var data = JSON.stringify(frames);
	localStorage.setItem('frameData', data);
}

function addFrame(timer) {
	var start = Math.round(timer.starttime / 1000)
	var end = Math.round(Date.now() / 1000);

	var id = genRanHex(32);
	//check if id already exists in frames

	frames.push([start, end, timer.activeProject, id, [], end]);

	storeData();
	renderMain();
}

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');


var backupdata = `[
[
	1639562400,
	1639593238,
	"bites",
	"7aec1dcb567a41c5b23e8b49316a59f4",
	[],
	1639593238
],
	[
  1640453955,
	1640454048,
	"bites",
	"2f7cb9280e14444aa6b8ef87bc210476",
	[],
	1640454048
 ],
[
	1641401405,
	1641401416,
	"snack",
	"a48c8846ecc54dadaa438308985c3bfd",
	[],
	1641401416
]]`