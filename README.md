MooIndent
===========

A class that allows you to use tab, shift-tab, and return to indent text in a textarea. Just create a new instance of the class as seen below, and the texture will be given the power of indentation through tabs in the following ways

*tab: hitting tab will insert a tab

*Select text, press tab: This will shift the text lines selected over by one tab

*Select text, press shift-tab: This will unshift the text lines selected over by one tab

*return: if the line you are on is indented when you hit return, the next line will also be indented, by the same amount.

How to use
----------

var indentor = new MooIndent($('textAreaID'));


General info
----------
Tabs are actual tabs, not spaces. If the line you are on is indented with spaces, this will convert 4 spaces to a tab if you either tab or untab a line.