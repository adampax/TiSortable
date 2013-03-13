function MainWindow(){
	var self = Ti.UI.createWindow({
		backgroundColor: '#ffffff'
	});
	
	//create some 'cell' views to add to our sortable views
	var data = [];
	


	
	for (var i = 0; i < 18; i++){
		data.push(createCell({
			title: i
		}));
	}
	
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
	    cellWidth: 100,
	    cellHeight: 100,
	    columnPadding: 5, //Space in between two columns
	    rowPadding: 5, //Space in between two rows
	    columns: 3, //Number of columns
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
	        //color: '#3f3f3f',
	        font:{
	        	fontSize:16,
	        	fontWeight:'bold'
	        }
	    }));
	    return v;		
	}
	
}
module.exports = MainWindow;