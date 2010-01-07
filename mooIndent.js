var MooIndent = new Class({

	Implements: [Options],

	options: {

	},

	initialize: function(element, options){
	
		element.addEvent('keydown', function(e){
		
			//all content in input
			var val = element.value;
				
			switch(e.code){
				
				case 9: // tab
				var startTime = $time();
					if(this.getSelectedText()){ //is there selected text?
						e.stop();
						
						if(e.shift){
						//------------------------------------------------------------
						// shift-tab unindentation
						//------------------------------------------------------------
		
							var scrollPos = this.getScroll();
											
							//start, end of selection
							var start = this.getSelectionStart(), end = this.getSelectionEnd();
							
							//portion of up-to-the-selection start
							var beforeSelection = val.substring(0,start);
							
							//portion beyond selection end
							var afterSelection = val.substring(end);
							
							// locate the loaction of the last line break before the selection(marking th begining of the first selected line)
							var firstBreak = (beforeSelection.lastIndexOf('\n')) ? beforeSelection.lastIndexOf('\n') : 0;
							
							// locate the loaction of the first line break after the selection(marking the of the last selected line)
							var lastBreak = (val.indexOf('\n', end -1) != -1) ? val.indexOf('\n', end-1) : val.length;
							
							//dont include the line break in the first line. If it is the begining of the file, do not move
							var lineBegining = (firstBreak == 0) ? 0: firstBreak +1;
							
							//content of the area that is before the first selected line. (need to preserve it)
							var beforeChange = val.substring(0, lineBegining);
							
							//content of the area that is after the last selected line. (need to preserve it)
							var afterChange = val.substring(lastBreak);
							
							//content from begining of first selected, to end of last selected.
							//this is what we will be manipulating
							var newText = val.substring(lineBegining, lastBreak);
													
							//the loc of the end of the selection, so we can end selection at this point again
							var leftOff = val.substring(lastBreak).length
							
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
								this.set('value', changeTo);
								//highlight the correct area of text again, and scroll back to the correct area.
								//this.selectRange(firstBreak+1, endCursor);
								this.selectRange(firstBreak+1, firstBreak+1+replacement.length);
								this.scrollTo(scrollPos.x, scrollPos.y);
							
							}
							//alert($time() - startTime);
							break;
						}
						
						
						//------------------------------------------------------------
						// tab indentation
						//------------------------------------------------------------
		
						var scrollPos = this.getScroll();
						
						//start, end of selection
						var start = this.getSelectionStart(), end = this.getSelectionEnd();
						
						//find the begining of the line, or file
						var beforeSelection = val.substring(0,start);
						
						// locate the loaction of the 
						var firstBreak = (beforeSelection.lastIndexOf('\n')) ? beforeSelection.lastIndexOf('\n') : 0;
		
						var lastBreak = (val.indexOf('\n', end -1) != -1) ? val.indexOf('\n', end-1) : val.length;
						
						var newText = val.substring(0, firstBreak);
											
						newText += val.substring(firstBreak, lastBreak).replace(new RegExp("\n", 'gi'), "\n\t");
						
						newText += val.substring(lastBreak);
						var returnMatches = val.substring(firstBreak, lastBreak).match(/(\n)/gm);
							
							
						$(this).set('value',  newText);
							
						// }
						
						this.selectRange(firstBreak+1,lastBreak+returnMatches.length);
						//reset scrollbar position
						this.scrollTo(scrollPos.x, scrollPos.y);
						
					}else{
						e.stop();
						//save scrollbar positions
						var scrollPos = this.getScroll();
				
						$(this).insertAtCursor(String.fromCharCode(9), false);
						
						//reset scrollbar position
						this.scrollTo(scrollPos.x, scrollPos.y);
					}
					//alert($time() - startTime);
					break;
				
				case 13:
				var startTime = $time();
				//------------------------------------------------------------
				// return yeilds auto indent
				//------------------------------------------------------------
					e.stop();
					var scrollPos = this.getScroll();
					
					//get the cursor position
					var cursorPos = this.getCaretPosition();
					
					//select everything up to that point
					var beforeSelection = val.substring(0, cursorPos);
						
					// search backwards for the first line break. This is the begining of that line
					var firstBreak = (beforeSelection.lastIndexOf('\n')) ? beforeSelection.lastIndexOf('\n') : 0;
					
					//select firstBreak (the begining) and cursorPos (the end) of the line
					var  lineSelect = val.substring(firstBreak+1, cursorPos)
					
					//look at that line, was there any indentation (tabs or spaces) at the begining? If so, grab it
					var indent = (lineSelect.match(/^(\t| )+/gm)) ? lineSelect.match(/^(\t| )+/gm) : '';
					
					//return to the next line, place that indent (if there was one) on that line.
					this.insertAtCursor('\n'+indent, false);
					
					this.scrollTo(scrollPos.x, scrollPos.y);
			//alert($time() - startTime);	
			break;
			  
			}
			
		
		});
	
	
	
	}
});
