var blocks = [];
var filled = [];
var totalsize;
var numblocks;

var submitBtn = document.querySelector('#submitBtn');
//console.log('Welcome!');
submitBtn.onclick = getInitValues;

function getInitValues() {
	totalsize = document.querySelector('#totalMemSize').value;
	numblocks = document.querySelector('#numBlocks').value;
	var message = 'Read totalsize =' + totalsize + ' and numblocks = ' + numblocks;

	var template = "<label class='col-form-label'>Enter Block Sizes</label>"
	var i;
	for (i = 0; i < numblocks; i++) {
		template = template + "<input class='form-control' type='text' class='blockInput' id='blockSize" + i + "'>";
	}
	template += "<button id='submitBlockBtn' class='btn btn-primary' style='margin-top: 36px'>Submit</button>";
	if(numblocks > 0)
		render(template, document.querySelector('#blockContainer'));
	else
		render('Please enter the number of blocks', document.querySelector('#requestMsg'));

	var submitBlockBtn = document.querySelector('#submitBlockBtn');

	var blocksize0 = document.querySelector('#blockSize0');

	var i = 0;
	var blockSizeBtn = document.querySelector('#submitBlockBtn');
	blockSizeBtn.onclick = getBlockSizes;
	
	function getBlockSizes() {
		i = 0;
		var flag = 0;
		for(i = 0; i < numblocks; i++) {
			blockSize = document.querySelector('#blockSize' + i).value;
			if(parseInt(blockSize) < 0)
				flag++;
			if(blockSize == 0) {
				render("Blocksize can't be zero", document.querySelector('#requestMsg'));
				flag++;
			}
			blocks[i] = blockSize
			filled[i] = 0;
			console.log(blockSize);
			console.log(filled[i]);
		}
		if(parseInt(flag))
			render("Block size can't be zero/negative", document.querySelector('#requestMsg'));
		else {
			//check if blocksizes don't exceed the total size
			var blockSum = 0;
			for(i = 0; i < numblocks; i++) 
				blockSum += parseInt(blocks[i]);
			console.log(blockSum);
			console.log(totalsize);
			if(blockSum > totalsize)
				render('Entered block sizes do not match the total size! Re-enter the block sizes.', document.querySelector('#requestMsg'));
			else
				render('Block sizes set successfully', document.querySelector('#requestMsg'));
			var requestBtn = document.querySelector('#submitRequestBtn');
			requestBtn.onclick = handleRequest;

			var removeBtn = document.querySelector('#removeBtn');
			removeBtn.onclick = handleRemove;
		}
		function handleRequest() {
			var alloc = -1;
			var requestSize = document.querySelector('#requestSize').value;
			var algo = document.getElementById('sel1');
			if(parseInt(requestSize) < 0)
				render("Request can't be negative", document.querySelector('#requestMsg'));
			else {
				if (algo.value === 'First Fit') {
					for(i = 0; i < numblocks; i++) {
						//perform a first fit request
						//console.log(blocks[i]);
						//console.log(filled[i]);
						if(parseInt(blocks[i]) >= parseInt(requestSize) && filled[i] == 0) {
							filled[i] = 1;
							render('Allocated block ' + i + ' to the request', document.querySelector('#requestMsg'));

							alloc = i;
							break;
						}
					}
				} else if (algo.value === 'Best Fit') {
					var bestIndex = -1;
					for(i = 0; i < numblocks; i++) {
						if(parseInt(blocks[i]) >= parseInt(requestSize) && filled[i] == 0) {
							if(bestIndex == -1) {
								bestIndex = i;
							} else if (blocks[bestIndex] > blocks[i]) {
								bestIndex = i;
							}
						}
					}
					if (bestIndex != -1) {
						i = bestIndex;
						filled[i] = 1;
						render('Allocated block ' + i + ' to the request', document.querySelector('#requestMsg'));
						alloc = i;
					}
				}
				else if (algo.value === 'Worst Fit') {
					var worstIndex = -1;
					for(i = 0; i < numblocks; i++) {
						if(parseInt(blocks[i]) >= parseInt(requestSize) && filled[i] == 0) {
							if(worstIndex == -1) {
								worstIndex = i;
							} else if (blocks[worstIndex] < blocks[i]) {
								worstIndex = i;
							}
						}
					}
					if (worstIndex != -1) {
						i = worstIndex;
						filled[i] = 1;
						render('Allocated block ' + i + ' to the request', document.querySelector('#requestMsg'));
						alloc = i;
					}					
				}
			}
			if(alloc == -1)
				render("Request couldn't be accomodated.", document.querySelector('#requestMsg'));
		}

		function handleRemove() {
			var remove = document.querySelector('#removeNum').value;
			if(parseInt(remove) > numblocks || parseInt(remove) < 0)
				render("Cannot remove what does not exist", document.querySelector('#requestMsg'));
			else {
				filled[parseInt(remove)] = 0;
				render('Emptied block ' + remove, document.querySelector('#requestMsg'));
			}
		}
	}
}

function render (template, node) {
	if(!node)
		return;
	node.innerHTML = template;
}
