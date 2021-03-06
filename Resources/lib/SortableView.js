// TiSortable
// Copyright (c) 2013 Adam Paxton - Polanco Media, LLC
// http://github.com/adampax/TiSortable
// Licensed under the MIT License. See: /License.txt
function SortableView(args) {

	//mix in properties with the defaults
	args = extend({
		cellWidth : 95,
		cellHeight : 95,
		columnPadding : 10,
		rowPadding : 10,
		columns : 3
	}, args || {});
	
	var cells = [],
		posArray = [],
		rowArray = [];


	var Draggable = require('ti.draggable'),
		self = Ti.UI.createView();
	
	populate();

	//FUNCTIONS
	
	function populate(){
		//clear out the parent view
	  	var viewChildren = self.children.slice(0);
		for (var i = 0; i < viewChildren.length; ++i) {
	        self.remove(viewChildren[i]);
		}
		
		var row = 0,
			rowCheck = '';
	
		for (var i = 0; i < args.data.length; i++) {
			
			var column = i % args.columns,
				top = row * (args.cellHeight + (2 * args.rowPadding)),
				left = column * (args.cellWidth + (2 * args.columnPadding));

			var cell = Draggable.createView({
				position: i,
				index: i,
				top : top,
				left : left,
				height : args.cellHeight,
				width : args.cellWidth
			});
			cell.add(args.data[i]);
			cells.push(cell);

			posArray.push({top:top,left:left, cellIndex: i});

			self.add(cells[i]);
	
			if (column + 1 === args.columns) {
				row++;
			}
	
			//attach the event listener to each view
			(function(v) {							
				
				v.addEventListener('end', function(e){
					
					//disable the touch
					enableTouch(false);
					
					var dPositionIndex = getPositionIndex(e);
					var oPositionIndex = v.position;					

					//set the new position to help with animation bouncing back					
					v.left = e.left;
					v.top = e.top;
									
					animate({
						cellIndex: v.index,
						dPositionIndex: dPositionIndex,
						duration: 200
					});
					
					//move old cells
					if(dPositionIndex !== oPositionIndex){
												
						var startPos = (dPositionIndex > oPositionIndex) ? oPositionIndex : dPositionIndex;
						
						var max = (dPositionIndex > oPositionIndex) ? ((dPositionIndex - oPositionIndex)+oPositionIndex) : ((oPositionIndex - dPositionIndex)+dPositionIndex);
						
						//splitting up the logic for now because it is hurting my brain
						if(dPositionIndex > oPositionIndex){
							//ascending
							for(var i = startPos; i < max; i++){
								
								animate({
									cellIndex: posArray[i+1].cellIndex,
									dPositionIndex: i,
									callback: (i+1) !== max ? '' : (function(){
										enableTouch(true)
									})
								});		
							}					
						} else {
							//descending
							for(var i = startPos; i < max; i++){
								
								animate({
									cellIndex: posArray[i].cellIndex,
									dPositionIndex: i+1,
									callback: (i+1) !== max ? '' : (function(){
										enableTouch(true)
									})
								});	
							}
						}
					} else {
						enableTouch(true);
					}
					
				});

			})(cell);
	
		}
	}
	
	function animate(obj){
		
		cells[obj.cellIndex].animate({
			top: posArray[obj.dPositionIndex].top, 
			left: posArray[obj.dPositionIndex].left, 
			duration: obj.duration || 500 
			}, function(){
				//handle cell array movements on completion callback
				//to prevent what appeared to be race conditions			
				cells[obj.cellIndex].position = obj.dPositionIndex;
				posArray[obj.dPositionIndex].cellIndex = obj.cellIndex;
							
				//perform any callbacks
				if(typeof(obj.callback) === 'function'){
					obj.callback();
				}	
		});			
	}
	
	function enableTouch(enable){
		//enable = enable || true;
		for(var i = 0; i < cells.length; i++){
			cells[i].touchEnabled = enable;
		}
	}
	
	//get the position array index from the screen coords
	function getPositionIndex(e){
		
		var totCells = cells.length,
			totRows = Math.ceil(totCells / args.columns),
			col = args.columns-1,
			row = totRows-1,
			heightMult = (args.cellHeight + (2 * args.rowPadding)),
			widthMult = (args.cellWidth + (2 * args.columnPadding));
		
		//get the new row
		for(var i = 0; i < totRows; i++){
			if(e.top < (i * heightMult) + (heightMult / 2)){
				row = i;
				break;
			}
		}
					
		//get the new column
		for(var i = 0; i < args.columns; i++){
			if(e.left < (i * widthMult)+(widthMult/2)){
				col = i;
				break;
			}
		}
		var dPositionIndex = ((1*row)*args.columns)+col;
		
		//check to see if the index is out of bounds and just set it to the last cell
		//probably a better way to handle this
		if(dPositionIndex >= totCells){
			dPositionIndex = totCells-1;
		}
		return 	dPositionIndex;	
	}		

	//helper function extend on object with the properties of one or more others (thanks, Dojo!)
	function extend(obj, props) {
		var empty = {};	
		
		if(!obj) {
			obj = {};
		}
		for(var i = 1, l = arguments.length; i < l; i++) {
			mixin(obj, arguments[i]);
		}
		return obj;
		
		function mixin(target, source) {
			var name, s, i;
			for(name in source) {
				if(source.hasOwnProperty(name)) {
					s = source[name];
					if(!( name in target) || (target[name] !== s && (!( name in empty) || empty[name] !== s))) {
						target[name] = s;
					}
				}
			}
			return target;
			// Object
		}		
	}

	return self;
}

module.exports = SortableView; 