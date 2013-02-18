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
			cells = [],
			posArray = [],
			rowArray = [],
			rowCheck = '';
	
		for (var i = 0; i < args.data.length; i++) {
			
			var column = i % args.columns,
				top = row * (args.cellHeight + (2 * args.rowPadding)),
				left = column * (args.cellWidth + (2 * args.columnPadding));
			
			Ti.API.info('cell: ' + (i+1) + ' top: ' + top);

			var cell = Draggable.createView({
				index: i,
				top : top,
				left : left,
				originalTop:top,
				originalLeft:left,
				height : args.cellHeight,
				width : args.cellWidth,
				zIndex : 0,
				row: row,
				column: column
			});
			cell.add(args.data[i]);
			cells.push(cell);
						
			if(row !== rowCheck){
				rowCheck = row;
				rowArray = [];
				posArray.push(rowArray);
				
			}
			
			rowArray.push({top:top,left:left});

			self.add(cells[i]);
	
			if (column + 1 === args.columns) {
				row++;
			}
	
			//attach the event listener to each view
			(function(v) {							
				
				v.addEventListener('end', function(e){
					
					//disable the touch
					v.touchEnabled = false;
					
					var col = '';
					var row = '';
					
					//get the new row
					switch(true){
						case (e.top <= 60):
							row = 0;
							break;
						case (e.top > 60 && e.top < 160):
							row = 1;
							break;
						case (e.top >=160):
							row = 2;
							break;						
					}						
					
					//get the new column
					switch(true){
						case (e.left <= 60):
							col = 0;
							break;
						case (e.left > 60 && e.left < 160):
							col = 1;
							break;
						case (e.left >=160):
							col = 2;
							break;						
					}				
					
					
					var destinationCellIndex = ((1*row)*args.columns)+col;
					var originCellIndex = v.index;	
					
					//disable the touch					
					cells[destinationCellIndex].touchEnabled = false;					
					
				
					//set the moved cell

					//set the new position to help with animation bouncing back					
					v.left = e.left;
					v.top = e.top;
					
					var newPoints = posArray[row][col];
					
					var originalLeft = v.originalLeft;
					var originalTop = v.originalTop;

					//move to new location
					v.animate({top:newPoints.top, left:newPoints.left, duration: 500});	
					
					//move old cell
					cells[destinationCellIndex].animate({top: originalTop, left:originalLeft, duration: 500}, function(){
						
						//handle cell array movements on completion callback
						//to prevent what appeared to be race conditions	
						
						//update cell properties					
						cells[destinationCellIndex].originalTop = v.originalTop;
						cells[destinationCellIndex].originalLeft = v.originalLeft;
						cells[destinationCellIndex].index = v.index;
						
						v.originalTop = v.top;
						v.originalLeft = v.left;
						v.index = destinationCellIndex;
						
						//swap array element locations
						cells[originCellIndex] = cells[destinationCellIndex];
						
						cells[destinationCellIndex] = v;	
						
						//renable the touch
						cells[originCellIndex].touchEnabled = true;
						cells[destinationCellIndex].touchEnabled = true;					
					});	
					
				});

			})(cell);
	
		}
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