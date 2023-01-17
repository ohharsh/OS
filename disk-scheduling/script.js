const render = (algo, range, points) => {
	if (window.myChart) {
		window.myChart.destroy();
	}
	const data = {
		labels: points.map(dot => ''),
		datasets: [{
			label: algo,
			data: points,
			backgroundColor: 'rgb(255, 99, 132)',
			borderColor: 'rgb(255, 99, 132)'
		}]
	}
	const options = {
		scales: {
			x: {
				position: 'bottom',
				title: {
					display: true,
					text: 'seek requests'
				}
			},
			y: {
				type: 'linear',
				position: 'left',
				min: 0,
				suggestedMax: range,
				title: {
					display: true,
					text: 'tracks positions'
				}
			}
		}
	};
	const config = {
		type: 'line',
		data: data,
		options: options
	};
	const ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
	window.myChart = new Chart(ctx, config);
	let seektime = 0;
	let prev = points[0];
	for (const track of points) {
		seektime += Math.abs(track - prev);
		prev = track;
	}
	document.getElementById('output').innerHTML = `Seek time: ${seektime}`;
	document.querySelector('.credits').classList.remove('hidden');
}
const clear = () => {
	if (window.myChart) {
		window.myChart.destroy();
	}
	document.getElementById('output').innerHTML = '';
	document.querySelector('.credits').classList.add('hidden');
}
const validate = () => {
	const inputs = document.querySelectorAll('input[type="number"]');
	const re = /[0-9]+/;
	let valid = true;
	let max = null;
	let classes;
	if(re.test(inputs[0].value) && inputs[0].value > 0) {
		max = parseInt(inputs[0].value);
	} else {
		classes = inputs[0].classList;
		classes.remove('valid');
		classes.add('invalid');
		valid = false;
	}
	for(let i = 1; i < inputs.length; i++) {
		classes = inputs[i].classList;
		if (re.test(inputs[i].value) && inputs[i].value > 0) {
			classes.remove('invalid');
			classes.add('valid');
			if (max) {
				if (inputs[i].value < max) {
					continue;
				}
			} else {
				continue;
			}
		}
		valid = false;
		classes.remove('valid');
		classes.add('invalid');
	}
	return valid;
}
const fcfs = () => {
  const nodelist = document.querySelectorAll('input[type="number"]');
  const [range, initial, ...seq] = Array.prototype.map.apply(nodelist, [e => parseInt(e.value)]);
	if (seq.length == 0) {
		return;
	}
	seq.unshift(initial);
	return Array.from(new Set(seq));
}
const scan = () => {
  const nodelist = document.querySelectorAll('input[type="number"]');
  const [range, initial, ...seq] = Array.prototype.map.apply(nodelist, [e => parseInt(e.value)]);
	if (seq.length == 0) {
		return;
	}
	let right = seq.filter(e => e > initial).sort((a, b) => a-b);
  let left = seq.filter(e => e < initial).sort((a, b) => b-a);
	let i = 0;
	while (seq[i] == initial) {
		i++;
	}
  if (seq[i] > initial) {
    right.push(range-1);
    right = new Set(right);
    left = new Set(left);
    return [initial].concat(...right, ...left);
  } else {
		left.push(0);
		right = new Set(right);
		left = new Set(left);
		return [initial].concat(...left, ...right);
	}
}
const cscan = () => {
	const nodelist = document.querySelectorAll('input[type="number"]');
	const [range, initial, ...seq] = Array.prototype.map.apply(nodelist, [e => parseInt(e.value)]);
	if (seq.length == 0) {
		return;
	}
	let right = seq.filter(e => e > initial);
	let left = seq.filter(e => e < initial);
	right.push(range-1);
	left.push(0);
	let i = 0;
	while (seq[i] == initial) {
		i++;
	}
	let cmpfn;
	if (seq[i] > initial) {
		cmpfn = (a, b) => a-b;
	} else {
		cmpfn = (a, b) => b-a;
	}
	right = new Set(right.sort(cmpfn));
	left = new Set(left.sort(cmpfn));
	if (seq[i] > initial) {
		if (left.size == 1) {
			return [initial].concat(...right);
		}
		return [initial].concat(...right, ...left);
	} else {
		if (right.size == 1) {
			return [initial].concat(...left);
		}
		return [initial].concat(...left, ...right);
	}
}
const run = () => {
	clear();
	if (!validate()) {
		return;
	}
	const algofn = { fcfs, scan, cscan };
	const algo = document.querySelector('input[name="algo"]:checked');
	const seq = algofn[algo.id]();
	if (seq) {
		const range = parseInt(document.querySelector('input[type="number"]').value);
		render(algo.value, range, seq);
	}
}

document.querySelector('.btn-add').addEventListener('click', function(){
	const label = document.createElement('label');
	label.appendChild(document.createElement('input')).setAttribute('type', 'number');
	label.appendChild(document.createElement('i')).addEventListener('click', function(){
		this.parentElement.remove();
	});
	label.classList.add('box');
	this.parentElement.insertBefore(label, this);
});
document.querySelectorAll('.box i').forEach(box => {
	box.addEventListener('click', function(){this.parentElement.remove()});
});
document.querySelector('button.clear').addEventListener('click', clear);
document.querySelector('button.submit').addEventListener('click', run);
