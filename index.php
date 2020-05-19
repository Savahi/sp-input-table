<?php
require('auth.php');

if( isAuthRequired() ) {
	$userName = auth(false);
} 
?>

<!DOCTYPE HTML>
<html>
<head>

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

	<link href="index.css" rel="stylesheet">
	
</head>

<body>

<!-- Header -->
<div class='header' id='header'>
	<div class='menu' id='menu'>
		<div data-menuid='main' id='menuMain'><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAABP0lEQVR42u3dMQrAMAwEwVz+/+dL686FDIYw8wAZJLb28wAAAAAAAAAAAAAAAAD8RKYD2tYal4Umufm+e5y9x2uFIBAQCAgEBAICAYGAQEAgIBBAICAQEAgIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANjJdEDbWuOy0CQ333ePs/fwiScIBAQCAgGBgEBAICAQEAgIBBAICAQEAgIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgIlMB7StNS4LTXLrbbc4fwu/3IJAQCAgEBAICAQEAgIBgYBAAIGAQEAgIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgK9MBbWuNy0KT3HrbLc7fwieeIBAQCAgEBAICAYGAQEAgIBBAICAQEAgIBAAAAAAAAAAAAAAAAAAY+gAySSB1gzxpsQAAAABJRU5ErkJggg=="/></div> <!--☶ ☴ ⚎&#9870; -->
		<div data-menuid='help' id='menuHelp'><img src="data:image/png;base64,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"/></div> <!-- &#8505; ⚙ -->
		<div onclick='printSVG();' style='cursor:pointer;'>
			<img border=0
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAABu0lEQVR42u3dQQqEMAxAUSu9/5XjRlxZUaTalPduMKOf6EA6ywIAAAAAAAAAAAAAAAAAAAAAAAD/KzN8iIgIl3LQG6yU1PfY6hKCQEAgIBAQCAgEBAICAYGAQACBgEBAICAQEAiMp/oKzmXfY3jDfo0JAgIBgYB3EM/hmCAgEBAICAQEAgIBBAICAYGAQEAgIBAQCAgEBALs7IM02EnHBAGBgEDAO4jncEwQEAgIBAQCAgGBAAIBgYBAQCAgEBAICAQEAgIBBAJXLEw1OLQBEwQEAgIB7yCewzFBQCAgEBAICAQEAggEBAICAYGAQEAgIBAQCAgEEAgIBAQCAgGBgEBAICAQEAgIBBAI3PXJEf+O8aTrTdzxrypMEBAICAQEAgIBgYBAQCAgEBAIIBAQCAgEBAICAYGAQEAgIBAQCCAQEAgIBA49j/wRCAgEBAICAYHAQOpMH6b3Lxo8l/3gchMEBAICAYGAQEAgIBAQCAgEBAIIBAQCAgGBgEBAIJDLVAtT2ZdzMEFAICAQEAgIBBAICAQEAgIBgYBAQCAgEBAIIBAQCAgEAAAAAAAAAAAAAAAAAAAAAAAAYGobYRYpMxyERNwAAAAASUVORK5CYII="/> <!-- &#8505; ⚙ -->
		</div>
		<div class='normal'>
			<a href='http://www.spiderproject.com/' target="_blank">
				<img border=0 
					src="data:image/png;base64,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"/>
			</a>
		</div>
	</div>
	<div class='project-details' id='projectDetails'>
		<div class='project-name' id='projectName'>SPIDER PROJECT</div>
		<div class='project-time-and-version' id='projectTimeAndVersion'></div>
	</div>
	<div class='project-user' id='projectUser'>
	</div>
</div>

<div class='content'>
	<div data-pageid='main'>
		<div id='containerDiv' style='width:100%; overflow-x:scroll; overflow-y:scroll; margin:0; padding:0; box-sizing:border-box; text-align:left;'>
			<table id='dataTable'>
				<thead id='dataTableHead'>
				</thead>
				<tbody id='dataTableBody'>
				</tbody>
			</table>
		</div>
		<table cellspacing="0" cellpadding="0" class='toolbox' id='toolbox'><tr valign="top">
			<td class='toolbox-left'>
				<div id='toolboxLockDataDiv' title=''>
					<img id='toolboxLockDataIcon' src=''/>
				</div>				
				<div id='toolboxNewProjectDiv' title='' onclick='newProject();'>
					<img id='toolboxNewProjectIcon' src=''/>
				</div>					
				<div id='toolboxSynchronizedDiv' title='' style='background-color:white;'>
					<img id='toolboxSynchronizedIcon' src='' style='border:0; cursor:default; background-color:white; opacity:1.0;'/>
				</div>
			</td><td class='toolbox-right'>
			</td>
		</tr></table>
	</div>
	<!-- ⇳ ⇿ ⇕ ➕ ➖ ▶ ◀ ▲ ▼ ◀-▶ ⟷ ↕ ↔ ⇳ ⇕ &#8661; -->
	<!--		
	<div data-pageid='settings'>
		<div id='settingsTableTitle'>
		</div>
		<div id='settingsTable'>
		</div>
	</div>
	-->
	<div data-pageid='help'>
		<h1 id='helpTitle'></h1>
		<div id='helpText' class='helpText'></div>
	</div>
</div>

<div id='blackOutBox' style='position:absolute; display:none; left:0; top:0; min-width:100%; min-height:100%; background-color:#4f4f4f; opacity:0.35;'></div>

<div id='editBox' style='position:absolute; display:none; left:0; top:0; width:100%; max-height:50%;'>
	<div id='editBoxContent' 
		style='position:relative; display:table-cell; min-width:100%; min-height:100%; background-color:#ffffff; text-align:center; vertical-align:top;'>
		<table style='width:100%' cellspacing=0 cellpadding=0>
			<tr style='vertical-align:top;'>
				<td style='width:60%; padding:12px;'>
					<div id='editBoxInputs'>
					</div>
					<div id='editBoxFileUploadPane'>
						<table style='float:right;' cellspacing=0 cellpadding=0>
							<tr style='vertical-align:top;'>
								<td style='text-align:center;'>
									<table cellspacing=0 cellpadding=0 class='editBoxFileUpload'><tr><td>
										<div style='cursor:default;'>
											<label for="editBoxFile0" id='editBoxFile0Label' data-index='0' title=''>&nbsp;&#8681;&nbsp;</label>
										</div>
									</td><td>
										<div id='editBoxFile0Reset' class='editBoxFileReset' data-index='0' onClick="onEditBoxFileReset(this)">&#8630;</div>
									</td><td>
										<div id='editBoxFile0Delete' class='editBoxFileDelete' data-index='0' onClick="onEditBoxDelete(this)">&#10006;</div>
									</td></tr><tr><th colspan=3>
										<label for="editBoxFile0" data-index='0'>
											<img id='editBoxFile0Preview' class='editBoxFilePreview' data-index='0' src='' title=''/>
										</label>
										<div id='editBoxFile0Name' class='editBoxFileName' data-index='0' title='' onClick="onEditBoxFilePreview(this)"></div>
									</th></tr></table>
								</td>
								<td style='width:8px;'>&nbsp;</td>
								<td style='text-align:center;'>
									<table cellspacing=0 class='editBoxFileUpload'><tr><td>
										<div style='cursor:default;'>
											<label for="editBoxFile1" id='editBoxFile1Label' data-index='1' title=''>&#8681;</label>
										</div>
									</td><td>
										<div id='editBoxFile1Reset' class='editBoxFileReset' data-index='1' onClick="onEditBoxFileReset(this)">&#8630;</div>
									</td><td>
										<div id='editBoxFile1Delete' class='editBoxFileDelete' data-index='1' onClick="onEditBoxDelete(this)">&#10006;</div>
									</td></tr><tr><th colspan=3>
										<label for="editBoxFile1" data-index='1'>
											<img id='editBoxFile1Preview' class='editBoxFilePreview' data-index='1' src=''/>
										</label>
										<div id='editBoxFile1Name' class='editBoxFileName' data-index='1' title='' onClick="onEditBoxFilePreview(this)"></div>
									</th></tr></table>
								</td>
								<td style='width:8px;'>&nbsp;</td>
								<td style='text-align:center;'>
									<table cellspacing=0 class='editBoxFileUpload'><tr><td>
										<div style='cursor:default;'>
											<label for="editBoxFile2" id='editBoxFile2Label' data-index='2' title=''>&#8681;</label>
										</div>
									</td><td>
										<div id='editBoxFile2Reset' class='editBoxFileReset' data-index='2' onClick="onEditBoxFileReset(this)">&#8630;</div>
									</td><td>
										<div id='editBoxFile2Delete' class='editBoxFileDelete' data-index='2' onClick="onEditBoxDelete(this)">&#10006;</div>
									</td></tr><tr><th colspan=3>
										<label for="editBoxFile2" data-index='2'>
											<img id='editBoxFile2Preview' class='editBoxFilePreview' data-index='2' src='' title=''/>
										</label>
										<div id='editBoxFile2Name' class='editBoxFileName' data-index='2' title='' onClick="onEditBoxFilePreview(this)"></div>
									</th></tr></table>
								</td>
								<td style='width:8px;'>&nbsp;</td>
								<td style='text-align:center;'>
									<table cellspacing=0 class='editBoxFileUpload'><tr><td>
										<div style='cursor:default;'>
											<label for="editBoxFile3" id='editBoxFile3Label' data-index='3' title=''>&#8681;</label>
										</div>
									</td><td>
										<div id='editBoxFile3Reset' class='editBoxFileReset' data-index='3' onClick="onEditBoxFileReset(this)">&#8630;</div>
									</td><td>
										<div id='editBoxFile3Delete' class='editBoxFileDelete' data-index='3' onClick="onEditBoxDelete(this)">&#10006;</div>
									</td></tr><tr><th colspan=3>
										<label for="editBoxFile3" data-index='3'>
											<img id='editBoxFile3Preview' class='editBoxFilePreview' data-index='3' src='' title=''/>
										</label>
										<div id='editBoxFile3Name' class='editBoxFileName' data-index='3' title='' onClick="onEditBoxFilePreview(this)"></div>
									</th></tr></table>
								</td>
							</tr>
						</table>
						<input id="editBoxFile0" data-index='0' type="file" onchange="onEditBoxFileChoice(this)"/>
						<input id="editBoxFile1" data-index='1' type="file" onchange="onEditBoxFileChoice(this)"/>
						<input id="editBoxFile2" data-index='2' type="file" onchange="onEditBoxFileChoice(this)"/>
						<input id="editBoxFile3" data-index='3' type="file" onchange="onEditBoxFileChoice(this)"/>
					</div>
				</td>
				<td style='width:40%; padding:12px;'>
					<div id='editBoxDetails'></div>
					<table style='width:100%;' cellspacing=0 cellpadding=0><tr>
						<td style='width:60%; padding:12px; text-align:center;'>
							<button class='ok' style='width:100%; padding:12px 0px 12px 0px; font-size:18px;' 
								onmousedown="saveUserDataFromEditBox();" >&#10004;</button>
						</td>           	
						<td style='width:40%; padding:12px; text-align:center;'>
							<button class='cancel' style='width:100%; padding:12px 0px 12px 0px; font-size:18px;' 
								onmousedown="hideEditBox();">&#8718;</button> <!--&#8718; &#8718; &#8854;⊖✖-->
						</td>
					</tr></table>
					<div id='editBoxMessage' style='font-size:12px; font-style:italic; color:#4f4f4f;'></div>
				</td>
			</tr>
		</table>
	</div>
</div>

<!--
<div id='editField' style='position:absolute; display:none;'/>
	<div style='width:100%; box-sizing:content-box; background-color:#dfdfdf; padding:0px; border:1px solid #4f4f4f;'>
		<input id='editFieldInput' class='noArrow' style='display:none; font-size:12px; box-sizing:border-box;' autofocus /><textarea id='editFieldTextarea' style='display:none; font-size:12px; box-sizing:border-box;' rows=3 autofocus /></textarea>
		<div>
			<button id='editFieldCallCalendar' class='ok-color' style='float:left;'>☷</button>
			<button id='editFieldOk' class='ok' style='float:left;'>&#10004;</button>
			<button id='editFieldCancel' class='cancel'>&#8718;</button>
			<div id='editFieldMessage' class='cancel-color' 
				style='overflow:ellipsis; background-color:#ffffff; font-size:12px;'></div>
		</div>
	</div>
</div>
-->

<div id='messageBox' style='position:absolute; display:none; left:30%; top:30%; width:40%; height:40%;'>
	<div id='messageBoxText' style='position:relative; display:table-cell; min-width:100%; min-height:100%; background-color:#ffffff; text-align:center; vertical-align:middle;'>
	</div>
</div>

<div id='confirmationBox' style='position:absolute; display:none; left:30%; top:30%; width:40%; height:40%;'>
	<div id='confirmationBoxContainer' 
		style='position:relative; display:table-cell; min-width:100%; min-height:100%; 
			background-color:#ffffff; text-align:center; vertical-align:middle;'>
		<div id='confirmationBoxText' style='padding:4px 4px 24px 4px;'></div>
		<button id='confirmationBoxOk' class='ok' style='width:50%; margin-bottom:12px;'>&#10004;</button>
		<button id='confirmationBoxCancel' class='cancel' style='width:50%; visibility:hidden;'>&#8718;</button>
	</div>
</div>

<div id='blackOutImageBox' style='position:absolute; display:none; left:0; top:0; min-width:100%; min-height:100%; background-color:#000000; opacity:0.5;'></div>
<div id='imageBox' style='position:absolute; display:none; cursor:pointer; margin:0; padding:0; left:10%; top:10%; width:80%; max-width:80%; min-width:40%; max-height:80%; min-height:40%;' onClick='hideImageBox()'>
	<div id='imageBoxContents' style='position:relative; display:table-cell; margin:0; padding:0; max-width:75%; max-height:75%; background-color:#e0e0e0; text-align:center; vertical-align:middle;'></div>
</div>

<div id='tooltipBox' 
	style='position:absolute; display:none; background-color:#ffffff; cursor:pointer; border-radius:8px; border:1px dotted gray; left:220px; top:220px; width:200px; height:100px;' 
	onclick='this.style.display="none";'>
	<div id='tooltipBoxClose' 
		style='position:absolute; left:2px; top:2px; padding:2px; cursor:pointer; color:red; font-size:14px; font-weight:bold;' 
		onclick='(this.parentNode).style.display="none";'>X</div>
	<div id='tooltipBoxText' 
		style='position:absolute; left:10px; top:20px; background-color:#ffffff; cursor:pointer; text-align:center; font-size:12px;'>
		TOOLTIP TEXT!
	</div>
</div>


	<?php 
		if( isset($userName) ) { 
			echo "<script>var _userName = '" . $userName . "';</script>"; 
		} else {
			echo "<script>var _userName = null;</script>"; 			
		} 
	?>
	
	<script type='text/javascript'>
		
		var aPages;
		var aMenuIds;
		var sMenuActiveId="";
				
		aPages = document.querySelectorAll('[data-pageid]');
		for( var i = 0 ; i < aPages.length ; i++ ) {
			aPages[i].className='page';
		}
		
		aMenuIds = document.querySelectorAll('[data-menuid]');
		for( var i = 0 ; i < aMenuIds.length ; i++ ) {
			aMenuIds[i].style.cursor = 'pointer';
			aMenuIds[i].className = 'normal';
			aMenuIds[i].onclick = function() {
				menuGoTo( this.getAttribute("data-menuid") );
			}
		}

		menuGoTo( "main" );
		
		function menuGoTo( sId ) {		
			
			for( var i = 0 ; i < aPages.length ; i++ ) {
				sPageId = aPages[i].getAttribute("data-pageid");
				if( sPageId == sId ) {
					aPages[i].style.display = 'block';
				} else {
					aPages[i].style.display = 'none';
				}
			}
			menuHighlight( sId );			
		}
		
		function menuHighlight( sId ) {
			for( var i = 0 ; i < aMenuIds.length ; i++ ) {
				if( sId == aMenuIds[i].getAttribute( "data-menuid") ) {
					aMenuIds[i].className='active';
				} else {
					aMenuIds[i].className='normal';
				}
			}
			sMenuActiveId = sId;
		}


		function displayTooltip( text, idOfTooltipedElement=null, idOfTooltipedContainer=null ) {
			if( idOfTooltipedContainer!== null ) {
				if( idOfTooltipedContainer.style.display === 'none' ) {
					return;
				}
			}
			let tooltipBox = document.getElementById('tooltipBox');
			let tooltipBoxText = document.getElementById('tooltipBoxText');
			if( idOfTooltipedElement !== null ) {
				let xy = findPositionOfElementAtPage(idOfTooltipedElement);
				tooltipBox.style.left = xy[0] + 'px';
				tooltipBox.style.top = xy[1] + 'px';
			}			
			tooltipBox.style.display = 'block';				
			tooltipBoxText.innerHTML = text;
		}

		function hideTooltip( text ) {
			let tooltipBox = document.getElementById('tooltipBox');
			let tooltipBoxText = document.getElementById('tooltipBoxText');
			tooltipBox.style.display = 'none';				
			tooltipBoxText.innerHTML = '';
		}

	</script>

<script type="text/javascript" src="parameters.js">
</script>

<script type="text/javascript" src="texts.js">
</script>

<script type="text/javascript" src="utils.js">
</script>

<script type="text/javascript" src="calendar.js">
</script>

<script type="text/javascript" src="lockdata.js">
</script>

<script type="text/javascript" src="boxes.js">
</script>

<script type="text/javascript" src="on.js">
</script>

<script type="text/javascript" src="drawtable.js">
</script>

<script type="text/javascript" src="index.js">
</script>

</body>

</html>
