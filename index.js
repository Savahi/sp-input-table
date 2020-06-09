
var NS = "http://www.w3.org/2000/svg";

var _touchDevice = false;
var _dateDMY=true;
var _ganttMTime = -1;
var _titlesPositioning = 'r';
var _lockDataOn = null;
var _lockDataDisabled = null;
var _dataSynchronized = null;
var _ifSynchronizedInterval = null;
var _data;

var _settings = {
	tableHeaderFontColor:'#4f4f4f',	tableHeaderFillColor:'#cfcfdf', tableHeaderColumnSplitterColor:'#bfbfcf',
	tableHeaderBorderColor:'#cfcfdf', tableHeaderActiveBorderColor:'#8f8f9f', 
	tableContentFontColor:'#4f4f4f', tableContentFillColor:'#efefff', tableContentStrokeColor:'#4f4f4f', 
	tableHeaderColumnHMargin:3, tableColumnHMargin:2, tableColumnTextMargin:2, 
	tableMaxFontSize:14, tableMinFontSize:2, minTableColumnWidth:4, hierarchyIndent:4,	
	editedColor:"#bf2f2f", zoomFactor:0.25, containerHPadding:2, 
	webExportLineNumberColumnName:'f_WebExportLineNumber', webExportFileNamesColumn:'Folder', webExportUserFileNamesColumn:'FolderAlt',
	webExportFileNameKey:'__FileName', webExportUserFileNameKey:'__UserFileName', webExportFilesNumber:4,
	readableNumberOfOperations:28, maxNumberOfOperationOnScreen:50
}

var _files = { data:"gantt.php", logout:"logout.php", userData: "user_data.csv.php", userDataSave:"user_data.php" };

var _lockDataDiv = null;
var _lockDataIcon = null;

var _containerDiv = null;

var _containerDivX, _containerDivY, _containerDivHeight, _containerDivWidth;

var _tableOverallWidth=0;
var _tableContentOverallHeight=0;

window.addEventListener( "load", onWindowLoad );

window.addEventListener( "contextmenu", onWindowContextMenu );

function loadData() {
	if( document.location.host ) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
		    if (this.readyState == 4 ) {
		    	if( this.status == 200) {
			    	let errorParsingData = false;
			    	try{
				        _data = JSON.parse(this.responseText);
			    	} catch(e) {
			    		//alert('Error: ' + e.name + ":" + e.message + "\n" + e.stack + "\n" + e.cause);
			    		errorParsingData = true;
			    	}
			    	if( errorParsingData ) { // To ensure data are parsed ok... // alert(this.responseText);
						displayMessageBox( _texts[_lang].errorParsingData ); 
						return;
			    	}

			    	let noOperations=false; 
			    	if( !('operations' in _data) ) { // To ensure there are operations in data...
			    		noOperations = true;
			    	} else if( _data.operations.length == 0 ) {
			    		noOperations = true;
			    	} 
			    	if( noOperations ) {
						displayMessageBox( _texts[_lang].errorParsingData ); 
						return;
			    	}

			    	let noEditables=false; // To check if some data are editable or not...
			    	if( !('editables' in _data) ) {
			    		noEditables = true;
			    	} else if( _data.editables.length == 0 ) {
			    		noEditables = true;
			    	} 
			    	if( noEditables ) {
			    		_data.noEditables = true;
					    hideMessageBox();		    
						if( initData() == 0 ) {
							displayData();		
						}
						return; 
			    	}
		    		_data.noEditables = false;			        	
		        	createEditBoxInputs();

		        	ifSynchronizedCheck();
		        	if( _ifSynchronizedInterval === null ) { // Launching synchronization check every XX seconds
		        		_ifSynchronizedInterval = setInterval( ifSynchronizedCheck, 30000 );
		        	}

			        var xmlhttpUserData = new XMLHttpRequest();
					xmlhttpUserData.onreadystatechange = function() {
			    		if (this.readyState == 4 ) {
			    			if( this.status == 200) {		    
								let userData = csvIntoJSON(this.responseText);
								if( userData.length == 0 ) { 				
					        		_dataSynchronized = -1;
				        		} else {
				      				//_dataSynchronized = 0;
				        			setUserData( userData );
				        		}
				        	} else if( status == 404 ) {
				        		//_dataSynchronized = 1;
				        	}
						    hideMessageBox();		    
							if( initData() == 0 ) {
								displayData();
							}
			        	}
			        }; 
			        xmlhttpUserData.open("GET", _files.userData, true);
			        xmlhttpUserData.setRequestHeader("Cache-Control", "no-cache");
					xmlhttpUserData.send();
				} else {
					displayMessageBox( _texts[_lang].errorLoadingData ); 
				}
		    }
		};
		xmlhttp.open("GET", _files.data, true);
		xmlhttp.setRequestHeader("Cache-Control", "no-cache");
		xmlhttp.send();
		displayMessageBox( _texts[_lang].waitDataText ); 
	} 
}

function displayData() {	
	displayHeaderAndFooterInfo();	
	drawTableHeader(true);
	drawTableContent(true);
}

function initData() {
	var curTimeParsed = parseDate( _data.proj.CurTime );
	if( curTimeParsed != null ) {
		_data.proj.curTimeInSeconds = curTimeParsed.timeInSeconds;
	} else {
		_data.proj.curTimeInSeconds = parseInt(Date.now()/1000);		
	}

	if( _data.operations.length == 0 ) {
		displayMessageBox( _texts[_lang].errorParsingData );						
		return(-1);				
	}
	if( !('Code' in _data.operations[0]) || !('Level' in _data.operations[0]) ) { 	// 'Code' and 'Level' is a must!!!!
		displayMessageBox( _texts[_lang].errorParsingData );						// Exiting otherwise...
		return(-1);		
	}

	// Retrieving dates of operations, calculating min. and max. dates.
	_data.startMinInSeconds = -1;
	_data.finMaxInSeconds = -1;
	_data.startFinSeconds = -1

	var parsed;
	for( let i = 0 ; i < _data.operations.length ; i++ ) {
		let d = _data.operations[i];
		parsed = parseDate( d.AsapStart );
		if( parsed !== null ) {
			_data.startMinInSeconds = reassignBoundaryValue( _data.startMinInSeconds, parsed.timeInSeconds, false );
			d.AsapStartInSeconds = parsed.timeInSeconds;
		} else {
			d.AsapStartInSeconds = -1;
		}
		parsed = parseDate( d.AsapFin );
		if( parsed !== null ) {
			_data.finMaxInSeconds = reassignBoundaryValue( _data.finMaxInSeconds, parsed.timeInSeconds, true );
			d.AsapFinInSeconds = parsed.timeInSeconds;
		} else {
			d.AsapFinInSeconds = -1;
		}
		parsed = parseDate( d.FactStart );
		if( parsed !== null ) {
			_data.startMinInSeconds = reassignBoundaryValue( _data.startMinInSeconds, parsed.timeInSeconds, false );
			d.FactStartInSeconds = parsed.timeInSeconds;
		} else {
			d.FactStartInSeconds = -1;
		}
		parsed = parseDate( d.FactFin );
		if( parsed !== null ) {
			_data.finMaxInSeconds = reassignBoundaryValue( _data.finMaxInSeconds, parsed.timeInSeconds, true );
			d.FactFinInSeconds = parsed.timeInSeconds;
		} else {
			d.FactFinInSeconds = -1;
		}
		parsed = parseDate( d.Start_COMP );
		if( parsed !== null ) {
			_data.startMinInSeconds = reassignBoundaryValue( _data.startMinInSeconds, parsed.timeInSeconds, false );			
			d.Start_COMPInSeconds = parsed.timeInSeconds;			
		} else {
			d.Start_COMPInSeconds = -1;
		}
		parsed = parseDate( d.Fin_COMP );
		if( parsed !== null ) {
			_data.finMaxInSeconds = reassignBoundaryValue( _data.finMaxInSeconds, parsed.timeInSeconds, true );			
			d.Fin_COMPInSeconds = parsed.timeInSeconds;			
		} else {
			d.Fin_COMPInSeconds = -1;
		}
		parsed = parseDate( d.alapStart );
		if( parsed !== null ) {
			_data.startMinInSeconds = reassignBoundaryValue( _data.startMinInSeconds, parsed.timeInSeconds, false );			
			d.alapStartInSeconds = parsed.timeInSeconds;			
		} else {
			d.alapStartInSeconds = -1;
		}
		parsed = parseDate( d.f_LastFin );
		if( parsed !== null ) {
			d.lastFinInSeconds = parsed.timeInSeconds;			
		} else {
			d.lastFinInSeconds = d.AsapStartInSeconds; // To prevent error if for some reason unfinished operation has no valid f_LastFin. 
		}

		// Start and finish
		if( d.FactFin ) {
			d.status = 100; // finished
			d.displayStartInSeconds = d.FactStartInSeconds; 
			d.displayFinInSeconds = d.FactFinInSeconds;
			d.displayRestartInSeconds = null; 
		} else {
			if( !d.FactStart ) { // Has not been started yet
				d.status = 0; // not started 
				d.displayStartInSeconds = d.AsapStartInSeconds; 
				d.displayFinInSeconds = d.AsapFinInSeconds;
				d.displayRestartInSeconds = null;
			} else { // started but not finished
				let divisor = (d.AsapFinInSeconds - d.AsapStartInSeconds) + (d.lastFinInSeconds - d.FactStartInSeconds); 
				if( divisor > 0 ) {
					d.status = parseInt( (d.lastFinInSeconds - d.FactStartInSeconds) * 100.0 / divisor - 1.0); 
				} else {
					d.status = 50;
				}
				d.displayStartInSeconds = d.FactStartInSeconds; 
				d.displayFinInSeconds = d.AsapFinInSeconds;
				d.displayRestartInSeconds = d.AsapStartInSeconds;
			}
		}
		d.color = decColorToString( d.f_ColorCom, _settings.ganttOperation0Color );
		d.colorBack = decColorToString( d.f_ColorBack, "#ffffff" );
		d.colorFont = decColorToString( d.f_FontColor, _settings.tableContentStrokeColor );
		if( typeof( d.Level ) === 'string' ) {
			if( digitsOnly(d.Level) ) {
				d.Level = parseInt(d.Level);
			}
		}
	}

	_data.startFinSeconds = _data.finMaxInSeconds - _data.startMinInSeconds;
	_data.visibleMin = _data.startMinInSeconds; // - (_data.finMaxInSeconds-_data.startMinInSeconds)/20.0;
	_data.visibleMax = _data.finMaxInSeconds; // + (_data.finMaxInSeconds-_data.startMinInSeconds)/20.0;
	_data.visibleMaxWidth = _data.visibleMax - _data.visibleMin;

	// Initializing the parent-children structure and the link structure
	for( let i = 0 ; i < _data.operations.length ; i++ ) {
		_data.operations[i].id = 'ganttRect' + i; // Id
		initParents(i);
		_data.operations[i]._isPhase = (typeof(_data.operations[i].Level) === 'number') ? true : false;
	}

	// Marking 'expandables'
	for( let i = 0 ; i < _data.operations.length ; i++ ) {
		let hasChild = false;
		for( let j = i+1 ; j < _data.operations.length ; j++ ) {
			for( let k = 0 ; k < _data.operations[j].parents.length ; k++ ) {
				if( _data.operations[j].parents[k] == i ) { // If i is a parent of j
					hasChild = true;
					break;
				}
			}
			if( hasChild ) {
				break;
			}
		}
		if( hasChild ) {
			_data.operations[i].expanded = true;
			_data.operations[i].expandable = true;
		} else {
			_data.operations[i].expanded = true;			
			_data.operations[i].expandable = false;
		}
		_data.operations[i].visible = true;
	}

	// Creating ref-type array and attaching it to the "data"
	_data.refSettings = {};
	for( let col = 0 ; col < _data.table.length ; col++ ) {
		let o = { column: col, type: _data.table[col].type, format: _data.table[col].format, name: _data.table[col].name, editableType: null };
		for( let ie = 0 ; ie < _data.editables.length ; ie++ ) { 	// Is editable?
			if( _data.editables[ie].ref === _data.table[col].ref ) {
				o.editableType = _data.editables[ie].type;
			}
		}
		_data.refSettings[ _data.table[col].ref ] = o;
	}

	// Handling table columns widths
	for( let col = 0 ; col < _data.table.length ; col++ ) { // Recalculating widths in symbols into widths in points 
		let add = _settings.tableColumnHMargin*2 + _settings.tableColumnTextMargin*2;
		_data.table[col].width = _data.table[col].width * _settings.tableMaxFontSize*0.5 + add;
	}

	return(0);
}


function initParents( iOperation ) {
	_data.operations[iOperation].parents = []; // Initializing "parents"
	for( let i = iOperation-1 ; i >= 0 ; i-- ) {
		let l = _data.operations[iOperation].parents.length;
		let currentLevel;
		if( l == 0 ) {
			currentLevel = _data.operations[iOperation].Level;
		} else {
			let lastPushedIndex = _data.operations[iOperation].parents[l-1];
			currentLevel = _data.operations[lastPushedIndex].Level;
		}
		if( currentLevel === null ) { // Current level is an operation
			if( typeof(_data.operations[i].Level) === 'number' ) {
				_data.operations[iOperation].parents.push(i);
			}
		} else if( typeof(currentLevel) === 'number' ) { // Current level is a phase
			if( typeof(_data.operations[i].Level) === 'number' ) {
				if( _data.operations[i].Level < currentLevel ) {
					_data.operations[iOperation].parents.push(i);
				}
			}
		} else if( typeof(currentLevel) === 'string' ) { // Current level is a team or resourse
			if( _data.operations[i].Level === null ) { // The upper level element is an operation
				_data.operations[iOperation].parents.push(i);
			} else if( currentLevel == 'A' ) {
				if( _data.operations[i].Level === 'T' ) { // The upper level element is a team
					_data.operations[iOperation].parents.push(i);
				}
			}
		}
	}	
}


function initLayout() {
	_lockDataDiv = document.getElementById('toolboxLockDataDiv'); 
	_lockDataIcon = document.getElementById('toolboxLockDataIcon'); 

	_containerDiv = document.getElementById("containerDiv");
	
	let headerDiv = document.getElementById('header');
	let headerBox = headerDiv.getBoundingClientRect();
	let headerHeight = headerBox.height;	
	//let htmlStyles = window.getComputedStyle(document.querySelector("html"));
	//let headerHeight = parseInt( htmlStyles.getPropertyValue('--header-height') );
	_containerDivHeight = window.innerHeight - headerHeight;

	_containerDiv.style.height = _containerDivHeight + "px";
	_containerDiv.style.width = window.innerWidth + "px";

	_containerDivX = _settings.containerHPadding;
	_containerDivY = headerHeight;
	_containerDivWidth = window.innerWidth - _settings.containerHPadding*2;
	_containerDiv.style.padding=`0px ${_settings.containerHPadding}px 0px ${_settings.containerHPadding}px`;

	_containerDiv.addEventListener('selectstart', function() { event.preventDefault(); return false; } );
	_containerDiv.addEventListener('selectend', function() { event.preventDefault(); return false; } );

	return true;
}


function displayHeaderAndFooterInfo() {
	let projectName = document.getElementById('projectName');
	projectName.innerText = _data.proj.Name;

	let timeAndVersion = _data.proj.CurTime + " | " + _texts[_lang].version + ": " + _data.proj.ProjVer;
	document.getElementById('projectTimeAndVersion').innerText = timeAndVersion;
	if( _userName !== null ) {
		let el = document.getElementById('projectUser');
		//el.innerHTML = _userName + "<br/><a href='" + _files.logout + "' title='Logout'>[&rarr;]</a>"; // ➜ ➡ ➝ ➲ ➠ ➞ ➩ ➯ →
		el.innerHTML = _userName + "<br/><span style='cursor:pointer;' onclick='logout();'>[&rarr;]</span>"; // ➜ ➡ ➝ ➲ ➠ ➞ ➩ ➯ →
	}

	//document.getElementById('helpTitle').innerText = _texts[_lang].helpTitle; // Initializing help text	
	//document.getElementById('helpText').innerHTML = _texts[_lang].helpText; // Initializing help text	

	document.getElementById('toolboxNewProjectDiv').title = _texts[_lang].titleNewProject;	
	document.getElementById('toolboxNewProjectIcon').setAttribute('src',_iconNewProject);

	lockData( null, lockDataSuccessFunction, lockDataErrorFunction ); 		// Initializing lock data tool
	displaySynchronizedStatus(); 		// Initializing syncho-data tool
}


function setUserData( userData ) { // Sets user data read from a file
	let ok = true;
	try {
		for( let i = 0 ; i < _data.operations.length ; i++ ) { // For all operations...
			for( let iU = 0 ; iU < userData.length ; iU++ ) { // For all userData items...
				let lineNumber = userData[iU][_settings.webExportLineNumberColumnName];	// The line number inside the exported csv-
				// If the codes are the same and the numbers of lines are the same ...
				if( !(_data.operations[i].Code == userData[iU].Code && i == lineNumber) ) {
					continue;
				}
				_data.operations[i].userData = {};
				for( let iE=0 ; iE < _data.editables.length ; iE++ ) {
					let ref = _data.editables[iE].ref;
					if( ref in userData[iU] ) {
						_data.operations[i].userData[ ref ] = userData[iU][ ref ];
					} else {
						_data.operations[i].userData[ ref ] = _data.operations[i][ ref ];						
					}
				}
				// Files uploading... 
				let fnames = [];
				let unames = [];
				if( _settings.webExportFileNamesColumn in userData[iU] && _settings.webExportUserFileNamesColumn in userData[iU] ) {
					fnames = userData[iU][_settings.webExportFileNamesColumn].split('|');
					unames = userData[iU][_settings.webExportUserFileNamesColumn].split('|');
				}
				for( let iF = 0 ; iF < _settings.webExportFilesNumber ; iF++ ) {
					let refF = _settings.webExportFileNameKey + iF;							
					let refU = _settings.webExportUserFileNameKey + iF;
					if( iF < fnames.length ) {
						_data.operations[i].userData[ refF ] = fnames[iF];						
					} else {
						_data.operations[i].userData[ refF ] = '';						
					}
					if( iF < unames.length ) {
						_data.operations[i].userData[ refU ] = unames[iF];						
					} else {
						_data.operations[i].userData[ refU ] = '';						
					}
				}
				break;
			}
		}
	} catch(e) {
		ok = false;
	}
	return ok;
}

function reassignBoundaryValue( knownBoundary, newBoundary, upperBoundary ) {
	if( knownBoundary == -1 ) {
		return newBoundary;
	} 
	if( newBoundary == -1 ) {
		return knownBoundary;
	}
	if( !upperBoundary ) { // Min.
		if( newBoundary < knownBoundary ) {
			return newBoundary;			
		} 
	} else { // Max.
		if( newBoundary > knownBoundary ) {
			return newBoundary;			
		} 		
	}
	return knownBoundary;
}


function newProject() {
	let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
    	let namevalue = cookies[i].split('=');
    	if( namevalue ) {
	    	if( namevalue.length == 2 ) {
	    		let cname = trimString(namevalue[0]);
		    		if( cname.length > 0 ) {
		    		if( cname.indexOf('verticalSplitterPosition') == 0 ) { // Skipping vertical splitter position for it is a browser setting only
		    			continue;
		    		}
			    	deleteCookie( cname );	    			
	    		}
	    	}
    	}
    }
	location.reload();
}


function resetCookies() {

	deleteCookie('visibleTop');
	deleteCookie('visibleHeight');

	for( let cookie = 0 ; cookie < 100000 ; cookie++ ) {
		let cname = _data.table[cookie].ref+"Position";
		if( getCookie(cname) != null ) {
			deleteCookie( cname );
		} else {
			break;
		}
	}
	deleteCookie('ganttVisibleWidth'); 	// Saving new values in cookies...
	deleteCookie('ganttVisibleLeft'); 		// 
}


function logout() {
	if( document.location.host ) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
		    if (this.readyState == 4 ) {
		    	if( this.status == 401 ) {
		    		window.location.replace('http://www.spiderproject.com/');
				}
		    }
		};
		xmlhttp.open("GET", _files.logout, true);
		xmlhttp.setRequestHeader("Cache-Control", "no-cache");
		xmlhttp.send();
	} 
}
