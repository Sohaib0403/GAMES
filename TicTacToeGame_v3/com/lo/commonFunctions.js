/*-- Common Functions Starts --*/

//1: Set Opacity
function SetOpacity(DivID) {
	$("#" + DivID).css('opacity', 0);	 
}

function ResetOpacity(DivID) {
	$("#" + DivID).css('opacity', 1);	
}

//2: Animate Div
function AnimateDiv(DivID, Top, Left, AnimTime) {
	$("#" + DivID).animate({
		top: Top + 'px',
		left: Left + 'px'		
	}, AnimTime);
}

function ResetDivPos(DivID, Top, Left) {
	$("#" + DivID).css('top', Top + 'px');
	$("#" + DivID).css('left', Left + 'px');
}

//3: FadeIn Div
function FadeInDiv(DivID) {
	$("#" + DivID).fadeIn(500);
}

function FadeOutDiv(DivID) {
	$("#" + DivID).fadeOut(500);
}

//4: Change Bg Image
function SetBgImagePos(DivID, XPos) {
	$("#" + DivID).css('background-position', XPos + 'px 0' );
}

function ResetBgImagePos(DivID) {
	$("#" + DivID).css('background-position','0 0');
}

//5: Show/hide Div
function ShowDiv(DivID) {
	$("#" + DivID).css('display','block');
}

function HideDiv(DivID) {
	$("#" + DivID).css('display','none');
}

//6: Visible / Invisible Div
function VisibleDiv(DivID) {
	$("#" + DivID).css('visibility','visible');
}

function InvisibleDiv(DivID) {
	$("#" + DivID).css('visibility','hidden');
}


//7: Change Bg Color of Div
function ChangeDivBgColor(DivID, ColorCode) {   	
	$("#" + DivID).css('background-color', '#' + ColorCode);
}

//8 : Set Pointer Events
function SetPointerEventNone(DivID) {
	$("#"+DivID).css('pointer-events','none');
}

function SetPointerEventAuto(DivID) {
	$("#"+DivID).css('pointer-events','auto');
}

//9: Disable Drop
function DisableDrop(DivID,XPos)
{
	$('#'+DivID).droppable( 'disable' );
	if( (XPos != undefined) || (XPos != null) || (XPos != undefined))
	{
		SetBgImagePos(DivID, XPos);
	}
}

function EnableDrop(DivID,XPos)
{
	$('#'+DivID).droppable( 'enable' );
	if( (XPos != undefined) || (XPos != null) || (XPos != undefined))
	{
		SetBgImagePos(DivID, XPos);
	}
}

//9: Disable Drag
function DisableDrag(DivID,XPos)
{
	$('#'+DivID).draggable( 'disable' );
	if( (XPos != undefined) || (XPos != null) || (XPos != undefined))
	{
		SetBgImagePos(DivID, XPos);
	}	
}

function EnableDrag(DivID,XPos)
{
	$('#'+DivID).draggable( 'enable' );	
	if( (XPos != undefined) || (XPos != null) || (XPos != undefined))
	{
		SetBgImagePos(DivID, XPos);
	}	
}

/*-- Common Functions Ends --*/