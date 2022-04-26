var chartType = $("#type");
var submit = $("#submit");
var sidebarData = $("#data");
var sidebarVisualize = $("#visualize");
var dataForm = $("#data-form");
var dataGraphContainer = $('#data-graph-container');
var dataChartDiv = $("#data-chart-div");
var meanChartDiv = $("#mean-chart-div");
var medianChartDiv = $("#median-chart-div");

var tableDiv = document.getElementById("analysis");
tableDiv.style.display = "none";

var modeRow = document.getElementById("modeAnalysis");

sidebarVisualize.on("click", function () {
	dataForm.addClass('disappear');
});

sidebarData.on("click", function () {
	dataForm.removeClass('disappear');
});

submit.on("click", function () {
	//delete existing charts
	deleteChart();
	modeRow.style.display = "none";
	//add canvas
	dataChartDiv.append(
		'<div class="card" id="data-graph-container"><canvas id="data-chart" width="400" height="200"></canvas></div>'
	);
	meanChartDiv.append(
		'<div class="card" id="mean-graph-container"><canvas id="mean-chart" width="400" height="200"></canvas></div>'
	);
	medianChartDiv.append(
		'<div class="card" id="median-graph-container"><canvas id="median-chart" width="400" height="200"></canvas></div>'
	);

	//get values
	var mystr = document.getElementById("data-values").value;
	var dataValues = new Array();
	dataValues = mystr.split(',')
	for (a in dataValues) {
		dataValues[a] = parseInt(dataValues[a], 10);
	}

	//get labels
	var mystr1 = document.getElementById("data-labels").value;
	var dataLabels = new Array();
	dataLabels = mystr1.split(',')

	var temp_array = new Array(); // medain sorts the data which reshuffles the original array
	for(var i=0;i<dataValues.length;i++){
		temp_array[i] = dataValues[i];
	}


	//calculate
	var mean = calcMean(dataValues);
	var median = calcMedian(temp_array);// passing temp_array so the original data values are preserved
	var mode = calcMode(dataValues);
	var vari = variance(dataValues);
	var sd = Math.sqrt(variance(dataValues));
	
	//calculate deviations
	aboutMean = deviation(dataValues, mean);
	aboutMedian = deviation(dataValues, median);


	//select canvas
	var dataCanvas = document.getElementById('data-chart');
	var meanCanvas = document.getElementById('mean-chart');
	var medianCanvas = document.getElementById('median-chart');


	//create charts
	var fill = true;
	if (chartType.val() === 'line' || chartType.val() === 'radar') {
		fill = false;
	}
	
	tableDiv.style.display = "block";
	document.getElementById("mean").innerHTML = mean.toFixed(2);
	document.getElementById("median").innerHTML = median.toFixed(2);
	if(mode.length != dataValues.length)
	{
		modeRow.style.display = "table-row";
	}	
	document.getElementById("mode").innerHTML = mode
	document.getElementById("variance").innerHTML = vari.toFixed(2);
	document.getElementById("sd").innerHTML = sd.toFixed(2);
	createChart(chartType.val(), dataCanvas, dataLabels, dataValues, 'Graph', fill);
	createChart('bar', meanCanvas, dataLabels, aboutMean, 'Deviation about Mean ' + mean, fill);
	createChart('bar', medianCanvas, dataLabels, aboutMedian, 'Deviation about Median ' + median, fill);

});


function deleteChart() {
	$(".card").remove();
}



function calcMean(arr) {
	var sum = arr.reduce(function (a, b) {
		return a + b
	}, 0);
	return sum / arr.length;
}

function deviation(arr, about) {
	temp = new Array();
	for (var i = 0; i < arr.length; i++) {
		temp[i] = arr[i] - about;
	}
	return temp;
}

function calcMedian(arr) {
	// median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
	var median = 0, numsLen = arr.length;
	arr.sort();
	if (
		numsLen % 2 === 0 // is even
	) {
		// average of two middle numbers
		median = (arr[numsLen / 2 - 1] + arr[numsLen / 2]) / 2;
	} else { // is odd
		// middle number only
		median = arr[(numsLen - 1) / 2];
	}
	return median;
}

function calcMode(arr) {
	// as result can be bimodal or multi-modal,
	// the returned result is provided as an array
	// mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
	var modes = [], count = [], i, number, maxIndex = 0;

	for (i = 0; i < arr.length; i += 1) {
		number = arr[i];
		count[number] = (count[number] || 0) + 1;
		if (count[number] > maxIndex) {
			maxIndex = count[number];
		}
	}
	for (i in count)
		if (count.hasOwnProperty(i)) {
			if (count[i] === maxIndex) {
				modes.push(Number(i));
			}
		}
	return modes;
}

function isNum(args) {
	args = args.toString();
	if (args.length == 0) return false;
	for (var i = 0; i < args.length; i++) {
		if ((args.substring(i, i + 1) < "0" || args.substring(i, i + 1) > "9") && args.substring(i, i + 1) != "." && args.substring(i, i + 1) != "-") {
			return false;
		}
	}
	return true;
}

function variance(arr) {
	var len = 0;
	var sum = 0;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == "") { }
		else if (!isNum(arr[i])) {
			alert(arr[i] + " is not number, Variance Calculation failed!");
			return 0;
		}
		else {
			len = len + 1;
			sum = sum + parseFloat(arr[i]);
		}
	}
	var v = 0;
	if (len > 1) {
		var mean = sum / len;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == "") { }
			else {
				v = v + (arr[i] - mean) * (arr[i] - mean);
			}
		}
		return v / len;
	}
	else {
		return 0;
	}
}


function createChart(type, canvas, dataLabels, dataValues, label, fill) {
	var ctx = canvas.getContext('2d');
	var myChart = new Chart(ctx, {
		type: type,
		data: {
			labels: dataLabels,
			datasets: [{
				fill: fill,
				data: dataValues,
				backgroundColor: [
					'rgba(78, 181, 226, 1)',
					'rgba(115, 197, 234, 1)',
					'rgba(172, 224, 248, 1)',
					'rgba(74, 121, 179, 1)',
					'rgba(45, 86, 147, 1)',
					'rgba(24, 48, 100, 1)'
				],
				pointRadius: (type === 'line' || type === 'radar') ? 5 : 0,
				borderColor: (type === 'line' || type === 'radar') ? 'rgb(74, 121, 179, 1)' : 'rgba(0,0,0,1)',
				borderWidth: 0,
			}]
		},
		options: {
			title: {
				display: true,
				position: "top",
				text: label,
				fontSize: 16,
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			},
			legend: {
				position: 'right',
				labels: {
					boxWidth: 20,
					generateLabels: function (chart) {
						var data = chart.data;
						return chart.data.labels.map(function (label, i) {
							return {
								text: label,
								fillStyle: chart.data.datasets[0].backgroundColor[i],

							};
						});
					},
				}
			}
			// legend: {
			//     display: (type==='pie'||type==='doughnut'||type==='polarArea'),
			// },
		}
	});
}


