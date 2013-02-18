# Sortable Grid View for Titanium

## Sortable. Movable. Drag and Droppable.

Make a sortable grid using native [Titanium](http://developer.appcelerator.com) controls. Inspired by and borrrowed heavily from various [Q&A](http://developer.appcelerator.com/question/67631/grid-view-is-possible-or-not) [posts](http://developer.appcelerator.com/question/101071/drag-and-drop). Uses Pedro Enrique's excellent [TiDraggable](https://github.com/pec1985/TiDraggable) module.

## Use

Require the CommonJS module

```javascript
var SortableView = require('/path/to/SortableView');
```

Add some cell views to an array to be passed to the SortableView

```javascript
var data = [];

for (var i = 0; i < 9; i++){
    var v = Ti.UI.createView({
        //width:95,
        //height:95,
        backgroundColor: 'cdcdcd'
    });
    v.add(Ti.UI.createLabel({
        text: 'Cell ' + (i+1),
        color: '#3f3f3f',
        font:{
        	fontSize:16,
        	fontWeight:'bold'
        }
    }));
    data.push(v);	
}
```

Create the SortableView and pass it the cell data

```javascript
var view = new SortableView({
    data: data, //array of views
    cellWidth: 100,
    cellHeight: 100,
    columnPadding: 5, //Space in between two columns
    rowPadding: 5, //Space in between two rows
    columns: 3 //Number of columns		
});
```