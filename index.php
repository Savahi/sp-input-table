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
	<meta name="viewport" content="width=device-width,initial-scale=1.0">
	<link href="index.css" rel="stylesheet">
	
</head>

<body>

<!-- Header -->
<div id='header'>
	<div class='project-user' id='projectUser'>
	</div>
	<div id='headerControls'>
				<div id='toolboxLockDataDiv' title=''>
					<img id='toolboxLockDataIcon' src=''/>
				</div>				
				<div id='toolboxNewProjectDiv' title='' onclick='newProject();'>
					<img id='toolboxNewProjectIcon' src=''/>
				</div>					
				<div id='toolboxSynchronizedDiv' title=''>
					<img id='toolboxSynchronizedIcon' src=''/>
				</div>
	</div>
	<div class='project-details' id='projectDetails'>
		<div class='project-name' id='projectName'>SPIDER PROJECT</div>
		<div class='project-time-and-version' id='projectTimeAndVersion'></div>
	</div>
</div>

		<div id='containerDiv' style='width:100%; overflow:auto; margin:0; padding:0; box-sizing:border-box; text-align:left;'>
			<table id='dataTable' cellspacing=0 cellpadding=0>
				<thead id='dataTableHead'>
				</thead>
				<tbody id='dataTableBody'>
				</tbody>
			</table>
		</div>

<div id='blackOutBox' style='position:absolute; display:none; left:0; top:0; min-width:100%; min-height:100%; background-color:#4f4f4f; opacity:0.35;'></div>

<div id='editBox'>
	<div id='editBoxContent'>
		<div id='editBoxPane1'>
					<table style='width:100%;' cellspacing=0 cellpadding=0><tr>
						<td style='width:60%; padding:4px; text-align:center;'>
							<button class='ok' style='width:100%; padding:12px 0px 12px 0px; font-size:14px;' 
								onmousedown="saveUserDataFromEditBox();" >&#10004;</button>
						</td>           	
						<td style='width:40%; padding:4px; text-align:center;'>
							<button class='cancel' style='width:100%; padding:12px 0px 12px 0px; font-size:14px;' 
								onmousedown="hideEditBox();">&#8718;</button> <!--&#8718; &#8718; &#8854;⊖✖-->
						</td>
					</tr></table>
					<div id='editBoxMessage'></div>
					<div id='editBoxInputs'>
					</div>
		</div>
		<div id='editBoxPane2'> 
					<div id='editBoxDetails'></div>
		</div>
	</div>
</div>

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
