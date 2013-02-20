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
	
	var cells = []
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
			
			Ti.API.info('cell: ' + (i+1) + ' top: ' + top);

			var cell = Draggable.createView({
				title: i,
				position: i,
				index: i,
				top : top,
				left : left,
				height : args.cellHeight,
				width : args.cellWidth
			});
			cell.add(args.data[i]);
			cells.push(cell);
						
/*
			if(row !== rowCheck){
				rowCheck = row;
				rowArray = [];
				posArray.push(rowArray);
				
			}
			
			rowArray.push({top:top,left:left});*/

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
			
					
					
					var dPositionIndex = ((1*row)*args.columns)+col;
					var oPositionIndex = v.position;					

					//set the new position to help with animation bouncing back					
					v.left = e.left;
					v.top = e.top;
									
					animate({
						cellIndex: v.index,
						dPositionIndex: dPositionIndex
					});
					
					//move old cells
					if(dPositionIndex !== oPositionIndex){
						
						var dir =  (dPositionIndex > oPositionIndex) ? 1 : 0;
						
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
		
		cells[obj.cellIndex].animate({top: posArray[obj.dPositionIndex].top, left: posArray[obj.dPositionIndex].left, duration: 500}, function(){
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