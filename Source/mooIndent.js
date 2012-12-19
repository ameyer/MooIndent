/*
---
description: mooIndent Class 

license: MIT-style

authors: ameyer

version: 0.5

requires:
  core/1.2.4:
  more/1.2.4:

provides: mooIndent
...
*/


var MooIndent = new Class({

	Implements: [Options],

	options: {

	},

	initialize: function(element, options){
	
		this.el = document.id(element);
		this.stop = false;
	
		element.addEvent('keydown', function(e){
			
			if(this.stop) return;
			
			switch(e.code){
				
				case 219: //[
					if(Browser.Platform.mac && e.meta || !Browser.Platform.mac && e.control){
						e.stop();
						if(element.getSelectedText()){ //is there selected text?
							this.unIndent();
						}	
					}
					break;
				
				case 221: //]
					if(Browser.Platform.mac && e.meta || !Browser.Platform.mac && e.control){
						e.stop();
						if(element.getSelectedText()){ //is there selected text?
							this.indent();	
						}else{
							this.tab();
						}
					}				
					break;
				
				case 9: // tab
					if(element.getSelectedText()){ //is there selected text?
						e.stop();
						
						if(e.shift){
							this.unIndent();	
							break;
						}
						
						this.indent();
					
					}else{
						e.stop();
						this.tab();
					}
					break;
					
				case 13:
					e.stop();
					this.returnWithIndent();
					break;
			  
			}
			
		
		}.bind(this));
	
	
	
	},
	
	pause: function(){
		this.stop = true;
	},
	
	start: function(){
		this.stop = false;
	},
	
	
	
	returnWithIndent: function(){
		if(this.stop) return;
		
		var startTime = $time();
		//------------------------------------------------------------
		// return yeilds auto indent
		//------------------------------------------------------------
		this.val = this.el.value;
		
		
		var scrollPos = this.el.getScroll();
		
		//get the cursor position
		var cursorPos = this.el.getCaretPosition();
		
		//select everything up to that point
		var beforeSelection = this.val.substring(0, cursorPos);
			
		// search backwards for the first line break. This is the begining of that line
		var firstBreak = (beforeSelection.lastIndexOf('\n')) ? beforeSelection.lastIndexOf('\n') : 0;
		
		//select firstBreak (the begining) and cursorPos (the end) of the line
		var  lineSelect = this.val.substring(firstBreak+1, cursorPos)
		
		//look at that line, was there any indentation (tabs or spaces) at the begining? If so, grab it
		var indent = (lineSelect.match(/^(\t| )+/gm)) ? lineSelect.match(/^(\t| )+/gm) : '';
		
		//return to the next line, place that indent (if there was one) on that line.
		this.el.insertAtCursor('\n'+indent, false);
		
		this.el.scrollTo(scrollPos.x, scrollPos.y);
		//alert($time() - startTime);	
	
	},
	
	tab: function(){
		if(this.stop) return;
		
		this.val = this.el.value;
	
		//save scrollbar positions
		var scrollPos = this.el.getScroll();

		this.el.insertAtCursor(String.fromCharCode(9), false);
		
		//reset scrollbar position
		this.el.scrollTo(scrollPos.x, scrollPos.y);	
	},
	
	indent: function(){
		if(this.stop) return;
	
		//------------------------------------------------------------
		// tab indentation
		//------------------------------------------------------------
		this.val = this.el.value;


		var scrollPos = this.el.getScroll();
		
		//start, end of selection
		var start = this.el.getSelectionStart()
		var end = this.el.getSelectionEnd();
		
		//find the begining of the line, or file
		var beforeSelection = this.val.substring(0,start);
			
		// locate the loaction of the 
		var firstBreak = (beforeSelection.lastIndexOf('\n')) ? beforeSelection.lastIndexOf('\n') : 0;
	
		var lastBreak = (this.val.indexOf('\n', end -1) != -1) ? this.val.indexOf('\n', end-1) : this.val.length;
		
		var newText = this.val.substring(0, firstBreak);
							
		newText += this.val.substring(firstBreak, lastBreak).replace(new RegExp("\n", 'gi'), "\n\t");
		
		
		newText += this.val.substring(lastBreak);
		var returnMatches = this.val.substring(firstBreak, lastBreak).match(/(\n)/gm);
		
		if(firstBreak == -1){
			 this.el.set('value',  "\t"+newText);
			 lastBreak ++;
		}else{
			this.el.set('value',  newText);
		}
			
		// }
		
		this.el.selectRange(firstBreak+1,lastBreak+returnMatches.length);
		//reset scrollbar position
		this.el.scrollTo(scrollPos.x, scrollPos.y);
	
	},
	
	unIndent: function(){
		if(this.stop) return;
		
		//------------------------------------------------------------
		// shift-tab unindentation
		//------------------------------------------------------------
		this.val = this.el.value;
	
		var scrollPos = this.el.getScroll();
						
		//start, end of selection
		var start = this.el.getSelectionStart(), end = this.el.getSelectionEnd();
		
		//portion of up-to-the-selection start
		var beforeSelection = this.val.substring(0,start);
		
		//portion beyond selection end
		var afterSelection = this.val.substring(end);
		
		// locate the loaction of the last line break before the selection(marking th begining of the first selected line)
		var firstBreak = (beforeSelection.lastIndexOf('\n')) ? beforeSelection.lastIndexOf('\n') : 0;
		
		// locate the loaction of the first line break after the selection(marking the of the last selected line)
		var lastBreak = (this.val.indexOf('\n', end -1) != -1) ? this.val.indexOf('\n', end-1) : this.val.length;
		
		//dont include the line break in the first line. If it is the begining of the file, do not move
		var lineBegining = (firstBreak == 0) ? 0: firstBreak +1;
		
		//content of the area that is before the first selected line. (need to preserve it)
		var beforeChange = this.val.substring(0, lineBegining);
		
		//content of the area that is after the last selected line. (need to preserve it)
		var afterChange = this.val.substring(lastBreak);
		
		//content from begining of first selected, to end of last selected.
		//this is what we will be manipulating
		var newText = this.val.substring(lineBegining, lastBreak);
								
		//the loc of the end of the selection, so we can end selection at this point again
		var leftOff = this.val.substring(lastBreak).length
		
		//check if there are any lines indented in the selection
		if(newText.match(/^(\t| )+/gm)){
		
			var replacement = ''; //holder
			
			var lines = newText.split('\n'); //create an array of each line
			$each(lines, function(value, i){ //iterate thought them
					
				// if there is no non-whitespace character on that line, we act differently
				// split the white space from the data
				var splitAt = value.indexOf(value.match(/[\S]/));
				if(splitAt != -1){
					var whiteSpace = value.substring(0, splitAt);
					var textPortion = value.substring(splitAt);
				}else{
					var whiteSpace = value;
					var textPortion = '';
				}
				
				//convert all the tabs to 4 spaces (so left with only spaces)								
				whiteSpace = whiteSpace.replace(new RegExp("\t", 'gm'), "    ");
				//if less than 3 spaces, remove them
				if(whiteSpace.length < 4) whiteSpace = '';
				//convert 4 spaces to a tab
				whiteSpace = whiteSpace.replace(new RegExp("    ", 'gm'), "\t");
				//remove the first tab
				whiteSpace = whiteSpace.substring(1);
				//add a crage return if not the last line of the selection
				var lineEnding = (i != lines.length-1)? '\n': '';
				//put it all together again
				replacement += (whiteSpace+textPortion+lineEnding);
				//alert(whiteSpace+textPortion+lineEnding);
				
			});
			//add the head and foot back on	
			var changeTo = beforeChange+replacement+afterChange;
			//calculate where to place the selection
			var endCursor = changeTo.length - leftOff;
			//set the text to the new reduced tab version
			this.el.set('value', changeTo);
			//highlight the correct area of text again, and scroll back to the correct area.
			//this.selectRange(firstBreak+1, endCursor);
			this.el.selectRange(firstBreak+1, firstBreak+1+replacement.length);
			this.el.scrollTo(scrollPos.x, scrollPos.y);
		
		}
		//alert($time() - startTime);
	
	
	
	
	}		
	
	
});
