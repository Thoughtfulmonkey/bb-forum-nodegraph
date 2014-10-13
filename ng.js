
var ngj;

var nodes = [];		// Node names
var rel = [];		// relationships
var count = [];		// occurance of relationships

function trigger(){

/*
	$('.journalContainer').attr('id','journal-target');
	
	$('#blogArchive').find('> li').each(function(index){
		var%20s=$(this).find('> a').text();
		if(s!=""){var u=$(this).find('a:nth-child(2)').attr('href');
		$.ajax({url:u}).done(function(html){
			var f=$(html).find('.journalContainer').html();
			$(f).appendTo('#journal-target')
		}
	);
*/

	ngj=document.createElement('script');
	ngj.setAttribute('src','//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js');
	ngj.onload=ngj.onreadystatechange=function(){ jqueryLoad(); };
	document.head.appendChild(ngj);

}


// Function to combine pairs based on alphabetical order
// - ensures connections in both directions are counted
function alphaPair( a, b){
	if (a<b) return a+':'+b;
	else return b+':'+a;
}


// Returns the number of the supplied node
// - adds the node if not already in the array
function nodeNameToNumber(name){

	var found = -1;

	// Loop through existing nodes
	for (var z=0; z<nodes.length; z++){
		if (nodes[z]==name){
			found = z;
		}
	}
	if (found == -1){
		found = nodes.length;
		nodes[nodes.length] = name;
	}
	
	return found;
}


// Returns supplied strings as an ordered array of the matching node numbers
function nodePair( a, b){

	a = nodeNameToNumber(a);
	b = nodeNameToNumber(b);
	
	pairing = [];
	if (a<b){
		pairing[0] = a;
		pairing[1] = b;
	}
	else {
		pairing[0] = b;
		pairing[1] = a;
	}
	return pairing;
}

// Returns supplied strings as an array of the matching node numbers
// - not numerically ordered
// - order is switched to represent post-reply
function nodePairUnordered( a, b){

	a = nodeNameToNumber(a);
	b = nodeNameToNumber(b);
	
	pairing = [];
	pairing[1] = a;
	pairing[0] = b;

	return pairing;
}


function jqueryLoad(){

	var pairs = [];
	var chain = [];
	var link = 0;
	var lastLevel = 0;

	rootuser = $('.reply-lvl-0').find('.profileCardAvatarThumb').find('a').text().trim();
	rootuser = rootuser.substr( rootuser.search(":")+2 );

	//console.log(rootuser);
	
	chain[link] = rootuser;
	link++;
	
	// Loop through root replies
	$('#forumMessagesContainer').find('.db-reply-block').each( function(index){
	
		//console.log('db-reply-block');
	
		var name;
		var lvl;
	
		// Loop through all replies
		// - build post-reply pairs
		$(this).find('.db-message-wrapper').each( function(index){
		
			name = $(this).find('.profileCardAvatarThumb').text().trim();	// extract name
			
			lvl = $(this).attr('class');									// find list of classes
			lvl = lvl.substr( lvl.search('reply-lvl-')+10, 1);				// extract level number from list
			
			
			if (lvl > lastLevel){											// Child of last checked
				if (lvl > 0){
					pairs[pairs.length] = nodePairUnordered(chain[lastLevel], name);
				}
			}
			else if (lvl == lastLevel){										// Sibling of last checked
				pairs[pairs.length] = nodePairUnordered(chain[lastLevel-1], name);
			}
			else if (lvl < lastLevel){										// Higher level than last checked
				pairs[pairs.length] = nodePairUnordered(chain[lastLevel-2], name);
				
			}
			
			lastLevel = lvl;
			chain[lastLevel] = name;
		});
		
	});

/*	
	// See what node list we got
	for (var z=0; z<nodes.length; z++){
		console.log(nodes[z]);
	}
*/
	

	var found = false;	
	
	// Add up how many times pairs occur
	for (var x=0; x<pairs.length; x++){
	
		//console.log( pairs[x] );
	
		found = false;
		
		// Search rel array
		for (var y=0; y<rel.length; y++){
			if ((pairs[x][0]==rel[y][0]) && (pairs[x][1]==rel[y][1])){
				count[y]++;
				found = true;
			}
		}
		
		// Add to rel if first occurance
		if (!found){
			rel[rel.length] = pairs[x];
			count[count.length] = 1;
		}
	}
	
/*	
	// Show pair count
	for (var y=0; y<rel.length; y++){
		console.log( rel[y] + ' x ' + count[y] );
	}
*/	
	
	// Add the canvas to the page
	var $div = $('<div />').appendTo('body');
	$div.attr('id', 'viewport');
	$div.css('width', '600');
	$div.css('height', '400');
	$div.css('background-color', 'white');
	$div.css('position', 'absolute');
	$div.css('top', '10px');
	$div.css('left', '10px');
	$div.css('z-index', '100');
	
	// Display the nodes
	nga=document.createElement('script');
	nga.setAttribute('src','https://10.6.1.64/ng/dist/vis.js');
	nga.onload=nga.onreadystatechange=function(){ visLoaded(); };
	document.head.appendChild(nga);
}


function visLoaded(){


	var visnodes = [];
	for (var z=0; z<nodes.length; z++){
		visnodes[z] = [];
		visnodes[z]['id'] = z;
		visnodes[z]['label'] = nodes[z];
		visnodes[z]['shape'] = 'box';
	}
	console.log(visnodes);
	
	var visedges = [];
	for (var y=0; y<rel.length; y++){
		visedges[y] = [];
		visedges[y]['from'] = rel[y][0];
		visedges[y]['to'] = rel[y][1];
		visedges[y]['width'] = count[y]*2;
		visedges[y]['style'] = 'arrow';
		visedges[y]['arrowScaleFactor'] = '0.2';
		//console.log( rel[y] + ' x ' + count[y] );
	}
	console.log(visedges);

	/*	
	
	var nodes = [
		{id: 1, label: 'Node 1'},
		{id: 2, label: 'Node 2'},
		{id: 3, label: 'Node 3'},
		{id: 4, label: 'Node 4'},
		{id: 5, label: 'Node 5'}
	];

	// create an array with edges
	var edges = [
		{from: 1, to: 2},
		{from: 1, to: 3},
		{from: 2, to: 4},
		{from: 2, to: 5}
	];
	*/
	
	// create a graph
	var container = document.getElementById('viewport');
	var data= {
		nodes: visnodes,
		edges: visedges,
	};
	var options = {
		width: '600px',
		height: '400px'
	};
	var graph = new vis.Network(container, data, options);
	
}


