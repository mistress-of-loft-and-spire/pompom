
window.onload = (event) => {
	loadFrames()
};


var frames = [];
var projects = [];

var calendar = new CalHeatMap();

function loadFrames() {
	data = localStorage.getItem('frameData');
	console.log(data);
	if (!data) {
		data = backupdata;
	}
	parseData(data);
	renderMain();
};

function parseData(data) {
	frames = JSON.parse(data);

	for (var i in frames) {
		// Projects
		var isAdded = false
		for (var project in projects) { if (projects[project] == frames[i][2]) isAdded = true; }
		if (!isAdded) projects.push(frames[i][2]);
	}

}

function clearData() {
	localStorage.clear();
}

function addFrame(timer) {
	var start = Math.round(timer.starttime / 1000)
	var end = Math.round(Date.now() / 1000);

	var id = genRanHex(32);
	//check if id already exists in frames

	frames.push([start, end, timer.activeProject, id, [], end]);

	var data = JSON.stringify(frames);
	localStorage.setItem('frameData', data);
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