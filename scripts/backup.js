
function loadFrames() {
	parseData(data);
	renderMain();
};

function parseData(data) {
	frames = JSON.parse(data);

	for (var i in frames)
	{
		// Projects
		var isAdded = false
		for (var project in projects) { if (projects[project] == frames[i][2]) isAdded = true; }
		if (!isAdded) projects.push(frames[i][2]);
	}
	
}

/*
var colors = ["#c35ca4",
"#757bcd",
"#af963e",
"#cb5b4c"]
 generated with https://medialab.github.io/iwanthue/ */

/* watson frame:
 [
  frame start date,
  frame end date,
  "project",
  "id",
  [],
  frame creation date?
 ],
*/

var filePath = "";

var frames = [];
var projects = [];

var calendar = new CalHeatMap();



function renderMain(project = "") {

	if (project == "")
	{
		document.getElementById("backBtn").classList.add("hidden");
	}
	else
	{
		document.getElementById("backBtn").classList.remove("hidden");
	}

	document.getElementById("mainView").classList.remove("hidden");
	document.getElementById("initialView").classList.add("hidden");

	renderDatePicker();
	renderCalendar(project);
	renderTime(project);

	if (project == "")
	{
		document.getElementById("projectContainer").classList.remove("hidden");
		document.getElementById("frameList").classList.add("hidden");
		renderProjects();
	}
	else 
	{
		document.getElementById("projectContainer").classList.add("hidden");
		document.getElementById("frameList").classList.remove("hidden");
		renderFrames(project);
	}
}

function renderDatePicker() {
	document.getElementById("enddate").valueAsDate = new Date()
}

function renderCalendar(project = "") {
	
	var graphText = "";

	for (var i in frames)
	{
		if (project != "" && project != frames[i][2])
			continue;

		// Graph Data
		if (graphText == "") graphText += "{ "
		else graphText += ", "
		graphText += '"' + frames[i][0] + '": ';

		timeDifference = frames[i][1] - frames[i][0]
		var startDate = new Date(0); startDate.setUTCMilliseconds(frames[i][0]);
		var endDate   = new Date(0); endDate.setUTCMilliseconds(frames[i][1]);
		var hours = (endDate.getTime() - startDate.getTime()) / 3600;
		graphText += Math.round(hours*10) / 10;
	}
	
	graphText += " }";
	var graphData = JSON.parse(graphText);



	var date = new Date()
	date = new Date(date.getFullYear() - 1, date.getMonth() + 2, 0)
	
	document.getElementById("heatmap").innerHTML = "";

	calendar.init({
		itemSelector: "#heatmap",
		data: graphData,
		domain: "month",
		maxDate: new Date(),
		subDomain: "day",
		cellSize: 24,
		range: 12,
		cellPadding: 2,
		domainGutter: 2,
		cellRadius: 2,
		onMinDomainReached: minDomainReached,
		onMaxDomainReached: maxDomainReached,
		subDomainTextFormat: "%d",
		start: date,
		displayLegend: false,
		legendCellSize: 12,
		legendHorizontalPosition: "right",
		itemName: "hour",
		legend: [3, 6, 9, 12, 15],
		legendColors: {
			min: "#213e33",
			max: "#2cb67d"
		}
	});
}

function renderTime(project = "") {
	var html = "";
	html = "<h1>Report";
	if (project != "") html += " for project <i>" + project + "</i>";
	html += "</h1>"
	html += "<p>";

	var time = 0;
	for (var i in frames)
	{
		if (project == "")
		{
			time += frames[i][1] - frames[i][0];
		}
		else if (project == frames[i][2])
		{
			time += frames[i][1] - frames[i][0];
		}
	}
	var date = new Date(0); date.setUTCMilliseconds(time);
	var hours = Math.floor(date.getTime() / 3600);
	var minutes = Math.floor((date.getTime() - (hours * 3600)) / 60);
	
	if (hours >= 1) html += hours + " hour";
	if (hours >= 2) html += "s"
	if (minutes >= 1) html += " " + minutes + " minute";
	if (minutes >= 2) html += "s"
	
	html += "</p>";

	document.getElementById("timeContainer").innerHTML = html;
}

function renderProjects() {
	var html = "";
	html = "<h1>Projects</h1>";
	html += "<div class='flexProjects'>";
	for (var i in projects)
	{
		html += "<button id='projectBtn" + projects[i] + "' + style='background-color: "  + "'>" + projects[i] + "</button>";
	}
	html += "</div>";

	document.getElementById("projectContainer").innerHTML = html;

	for (var i in projects)
	{
		var button = document.getElementById("projectBtn" + projects[i]);
		button.addEventListener('click', renderMain.bind(null, projects[i]), false);
	}
}

function renderFrames(project = "") {
	var html = "";

	var frameList = []
	
	for (var i in frames)
	{
		if (project != "" && project != frames[i][2])
			continue;
		
		frameList.push([i, frames[i][0]]);
	}

	frameList.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

	html += "<h1>Frames (" + frameList.length + ")</h1>" + html;

	html += "<table>";
	html += "<tr>";
	html += "<th>Date</th>";
	html += "<th>Start</th>";
	html += "<th>End</th>";
	html += "<th>Duration</th>";
	html += "<th>Tags</th>";
	
	html += "</tr>";

	for (var i in frameList)
	{
		var start = new Date(frames[frameList[i][0]][0] * 1000);
		var end = new Date(frames[frameList[i][0]][1] * 1000);
		
		html += "<tr>";
		html += "<td>" + getDayName(start, "en-US") + " - " + start.toLocaleDateString() + "</td>";
		html += "<td>" + start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + "</td>";
		html += "<td>" + end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + "</td>";
		html += "<td>";

		var date = new Date(0); date.setUTCMilliseconds(frames[frameList[i][0]][1] - frames[frameList[i][0]][0]);
		var hours = Math.floor(date.getTime() / 3600);
		var minutes = Math.floor((date.getTime() - (hours * 3600)) / 60);
		
		if (hours >= 1) html += hours + " h";
		html += " " + minutes + " m";

		html += "</td>";
		html += "<td>" + frames[frameList[i][0]][4] + "</td>";
		html += "</tr>";
	}

	html += "</table>";
	
	document.getElementById("frameList").innerHTML = html;
}



document.getElementById("backBtn").onclick = function() {
	renderMain();
}

document.getElementById("aboutBtn").onclick = function() {
	document.getElementById("aboutView").classList.remove("hiddenView");
}

document.getElementById("closeAboutBtn").onclick = function() {
	document.getElementById("aboutView").classList.add("hiddenView");
}



document.getElementById("calLeftBtn").onclick = function() {
	calendar.previous();
	document.getElementById("calOverlay").classList.add("rightBorder");
	document.getElementById("calRightBtn").disabled = false;
}

document.getElementById("calRightBtn").onclick = function() {
	calendar.next();
	document.getElementById("calOverlay").classList.add("leftBorder");
	document.getElementById("calLeftBtn").disabled = false;
}

function minDomainReached(hit) {
	if (hit) {
		document.getElementById("calOverlay").classList.remove("leftBorder");
		document.getElementById("calLeftBtn").disabled = true;
	}
}

function maxDomainReached(hit) {
	if (hit) {
		document.getElementById("calOverlay").classList.remove("rightBorder");
		document.getElementById("calRightBtn").disabled = true;
	}
}




function getDayName(date, locale)
{
    return date.toLocaleDateString(locale, { weekday: 'short' });        
}