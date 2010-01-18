/*
---
description: mooIndent Class 
Ê
license: MIT-style
Ê
authors: ameyer
Ê
version: 0.5
Ê
requires:
  core/1.2.4:
  more/1.2.4:
Ê
provides: mooIndent
...
*/

var MooIndent=new Class({Implements:[Options],options:{},initialize:function(b,a){b.addEvent("keydown",function(w){var z=b.value;switch(w.code){case 9:var o=$time();if(this.getSelectedText()){w.stop();if(w.shift){var s=this.getScroll();var h=this.getSelectionStart(),f=this.getSelectionEnd();var t=z.substring(0,h);var k=z.substring(f);var u=(t.lastIndexOf("\n"))?t.lastIndexOf("\n"):0;var m=(z.indexOf("\n",f-1)!=-1)?z.indexOf("\n",f-1):z.length;var v=(u==0)?0:u+1;var r=z.substring(0,v);var q=z.substring(m);var y=z.substring(v,m);var i=z.substring(m).length;if(y.match(/^(\t| )+/gm)){var p="";var c=y.split("\n");$each(c,function(C,A){var E=C.indexOf(C.match(/[\S]/));if(E!=-1){var D=C.substring(0,E);var e=C.substring(E)}else{var D=C;var e=""}D=D.replace(new RegExp("\t","gm"),"    ");if(D.length<4){D=""}D=D.replace(new RegExp("    ","gm"),"\t");D=D.substring(1);var B=(A!=c.length-1)?"\n":"";p+=(D+e+B)});var x=r+p+q;var g=x.length-i;this.set("value",x);this.selectRange(u+1,u+1+p.length);this.scrollTo(s.x,s.y)}break}var s=this.getScroll();var h=this.getSelectionStart(),f=this.getSelectionEnd();var t=z.substring(0,h);var u=(t.lastIndexOf("\n"))?t.lastIndexOf("\n"):0;var m=(z.indexOf("\n",f-1)!=-1)?z.indexOf("\n",f-1):z.length;var y=z.substring(0,u);y+=z.substring(u,m).replace(new RegExp("\n","gi"),"\n\t");y+=z.substring(m);var n=z.substring(u,m).match(/(\n)/gm);$(this).set("value",y);this.selectRange(u+1,m+n.length);this.scrollTo(s.x,s.y)}else{w.stop();var s=this.getScroll();$(this).insertAtCursor(String.fromCharCode(9),false);this.scrollTo(s.x,s.y)}break;case 13:var o=$time();w.stop();var s=this.getScroll();var j=this.getCaretPosition();var t=z.substring(0,j);var u=(t.lastIndexOf("\n"))?t.lastIndexOf("\n"):0;var d=z.substring(u+1,j);var l=(d.match(/^(\t| )+/gm))?d.match(/^(\t| )+/gm):"";this.insertAtCursor("\n"+l,false);this.scrollTo(s.x,s.y);break}})}});