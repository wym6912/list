"use strict";

var currCl="";
var lastCl=undefined;

function initialDisabling(){
    disabling("btnNext");
    let code="{{llsifsonglist|type=";
    switch($$("ddlEvent")){
	case "0":
	    disabling("txtLow","txtHigh","ddlRound","ckIfMaster");
	    $("ckIfMaster").checked=false;
	    code=code.concat("as2|diff=easy,normal,hard,expert");
	    break;
	case "1":
	    enabling("txtLow","txtHigh","ddlRound","ckIfMaster");
	    code=code.concat("sm|diff=easy,normal,hard,expert,technical");
	    $("txtHigh").value=5;
	    generateRounds(1);
	    break;
	case "2":
	    disabling("txtLow","txtHigh","ddlRound","ckIfMaster");
	    $("ckIfMaster").checked=false;
	    code=code.concat("mf|diff=easy,normal,hard,expert");
	    break;
	case "3":
	    disabling("txtLow","txtHigh","ddlRound");
	    enabling("ckIfMaster");
	    code=code.concat("cm|diff=easy,normal,hard,expert");
	    break;
	case "4":
	    disabling("txtLow","txtHigh","ckIfMaster");
	    enabling("ddlRound");
	    $("ckIfMaster").checked=false;
	    code=code.concat("cf");
	    generateRounds(4);
	    break;
    }

// 开发中
    if(getInt("ddlEvent")>0){
	disabling("btnCode");
    }
    else{
	enabling("btnCode");
    }
// 开发中

    clearTable();
    if($("ckIfMaster").checked){
        code=code.concat(",master");
	$("txtHigh").value=5+($$("ddlEvent")==1);
    }
    let tb=$("tbOutput");
    tb.rows[0].innerHTML=code;
}

function initialSongList(){
    let oldLength=$("ddlSong").length;
    for(let i=oldLength;i>=0;i--){
	$("ddlSong").remove(i);
    }
    songs.forEach(function(song){
	if((song.group==$$("ddlGroup") || $$("ddlGroup")==0) && ($$("ddlCl")=="0" || song.cl.toLowerCase()==$$("ddlCl"))){
	    $("ddlSong").options.add(new Option(song.nm,song.id));
	}
    })
}

function generateCode(){
    let id=$$("ddlSong");
    let song=songs[id];
    let code='|';
    let addition='';
    currCl=song.cl.toLowerCase();
    switch($$("ddlEvent")){
	case "0":
	    if(($("ckIsFirst").disabled==false && $("ckIsFirst").checked) || (lastCl && currCl!==lastCl)){
		code=code.concat(song.cl,'|');
	    }
	    else{
		code=code.concat('|');
	    }
	    if(song.cover){
		if(song.cover.endsWith('.jpg')){
		    addition=addition.concat('|cover',$$("txtOrder"),'=',song.cover);
		    code=code.concat(song.nm,'||||');
		}
		else{
		    code=code.concat(song.cover,'|||',song.nm,'|');
		}
	    }
	    else{
		code=code.concat(song.nm,'||||');
	    }
	    code=code.concat(song.exCombo,'|',song.mp3);
	    if(song.lk){
		code=code.concat('|lk',$$("txtOrder"),'=',song.lk,addition);
	    }
	    else{
		code=code.concat(addition);
	    }
	    break;
    }
    let tb=$("tbOutput");
    let lastRow=tb.rows[tb.rows.length-1];
    lastRow.innerHTML=code;
    enabling("btnNext");
}

function clearTable(){
    let tb=$("tbOutput");
    let len=tb.rows.length;
    for(let i=len-1;i>1;i--){
	tb.deleteRow(i);
    }
    tb.rows[1].innerHTML="";
    enabling("ckIsFirst","txtOrder");
    disabling("btnNext");
    lastCl=undefined;
    $("txtOrder").value=1;
    $("ckIsFirst").checked=true;
}

function nextRow(){
    let tb=$("tbOutput");
    tb.insertRow(-1);
    disabling("ckIsFirst","txtOrder","btnNext");
    lastCl=currCl;
    $("txtOrder").value=getInt("txtOrder")+1;
}

function ifMaster(){
    let tb=$("tbOutput");
    let startRow=tb.rows[0];
    if($("ckIfMaster").checked){
	$("txtHigh").value=5+($$("ddlEvent")==1);
	startRow.innerHTML=startRow.innerHTML.concat(",master");
    }
    else{
	$("txtHigh").value=4+($$("ddlEvent")==1);
	startRow.innerHTML=startRow.innerHTML.substring(0,startRow.innerHTML.length-7);
    }
}

function generateRounds(r){
    let round=$("ddlRound");
    for(let i=round.options.length;i>=0;i--){
	round.remove(i);
    }
    switch(r){
	case 1:
	    round.options.add(new Option("前期",1));
	    round.options.add(new Option("中期",2));
	    break;
	case 4:
	    for(let i=1;i<=5;i++){
		round.options.add(new Option(`第${i}轮`,i));
	    }
	    break;
    }
}

function changeIfMaster(){
    let ck=$("ckIfMaster");
    if(ck.disabled==false){
	ck.checked=!(ck.checked);
        ifMaster();
    }
}

function changeIsFirst(){
    let ck=$("ckIsFirst");
    if(ck.disabled==false){
        ck.checked=!(ck.checked);
    }
}

function adjustLow(){
    if(getInt("txtLow")>getInt("txtHigh")){
	$("txtLow").value=$$("txtHigh");
    }
}

function adjustHigh(){
    if(getInt("txtHigh")<getInt("txtLow")){
        $("txtHigh").value=$$("txtLow");
    }
}
