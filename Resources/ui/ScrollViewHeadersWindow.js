function MainWindow(){
	var COLUMNS = 5,
		CELL_WIDTH = 100,
		CELL_HEIGHT = 100,
		ROW_PADDING = 5,
		COLUMN_PADDING = 5;
		
	var self = Ti.UI.createWindow({
		backgroundColor: '#ffffff'
	});
	
	//create some 'cell' views to add to our sortable views
	var data = [];
	
	for (var i = 0; i < 10; i++){
		data.push(createCell({
			title: i
		}));
	}
	
	//create column data
	var columnData = createColumnData(COLUMNS);
	
	var scroll = Ti.UI.createScrollView({
		top:0,
		height:1024,
		width: Ti.UI.FILL
	});
	//win.add(scroll);

	scroll.addEventListener('scroll', function(e){
		top = e.y;
	});	
		
		
	var SortableView = require('/lib/SortableView');
	
	var view = new SortableView({
		top: 0,
	    //data: data, //An array of views
	    cellWidth: CELL_WIDTH,
	    cellHeight: CELL_HEIGHT,
	    columnPadding: COLUMN_PADDING, //Space in between two columns
	    rowPadding: ROW_PADDING, //Space in between two rows
	    columns: COLUMNS, //Number of columns
	    borderPadding: true, //add row/column padding to outside borders
	    fixRows: false //if true, cells may only move horizontally	
	});
	
	self.add(view);
	
	//event fires after a cell is moved
	view.addEventListener('move', function(e){
		Ti.API.info(JSON.stringify(e));
	});
	
	var btn = Ti.UI.createButton({
		title:'Set Data',
		bottom: 20,
		height:40,
		width:100
	});
	self.add(btn);
	
	btn.addEventListener('click', function(){
		view.setColumnData(columnData);
		view.setData(data);
	});
	
	return self;	
	
	
	//FUNCTIONS
	
	//creates our sample cells
	function createCell(args){
	    var v = Ti.UI.createView({
	        backgroundColor: '#cdcdcd'
	    });
	    v.add(Ti.UI.createLabel({
	        text: args.title,
	        color: 'black',
	        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
	        color: '#3f3f3f',
	        font:{
	        	fontSize:16,
	        	fontWeight:'bold'
	        },
	        height: Ti.UI.FILL,
	        width: Ti.UI.FILL
	    }));
	    return v;		
	}
	
	function createColumnData(){
		var d = [];
		for(var i = 0; i < COLUMNS; i++){
			d.push(Ti.UI.createLabel({
				text: i+1,
				left: i * (CELL_WIDTH + COLUMN_PADDING) + COLUMN_PADDING,
				width: CELL_WIDTH,
				height: 20,
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
			}));
		}
		
		return d;
	}
	
}
module.exports = MainWindow;