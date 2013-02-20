function MainWindow(){
	var self = Ti.UI.createWindow({
		backgroundColor: '#ffffff'
	});
	
	//create some 'cell' views to add to our sortable views
	var data = [];
	
	for (var i = 0; i < 9; i++){
		data.push(createCell({
			title: i
		}));
	}
	
	
	var SortableView = require('/lib/SortableView');
	
	var view = new SortableView({
	    data: data, //An array of views
	    cellWidth: 100,
	    cellHeight: 100,
	    columnPadding: 5, //Space in between two columns
	    rowPadding: 5, //Space in between two rows
	    columns: 3 //Number of columns		
	});
	
	self.add(view);
	
	return self;	
	
	
	//FUNCTIONS
	
	//creates our sample cells
	function createCell(args){
	    var v = Ti.UI.createView({
	        backgroundColor: '#cdcdcd'
	    });
	    v.add(Ti.UI.createLabel({
	        text: args.title,
	        color: '#3f3f3f',
	        font:{
	        	fontSize:16,
	        	fontWeight:'bold'
	        }
	    }));
	    return v;		
	}
}
module.exports = MainWindow;