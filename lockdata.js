
var _lockDataConnectionEstablished; 
var _lockDataRequestReceived; 
var _lockDataProcessingRequest;

function lockData( locked=null, success_fn=null, error_fn=null ) {
	if( _lockDataDisabled === null ) {
		if( _data.noEditables ) {
			_lockDataDisabled = true;		// ... disabling this tool
			_lockDataDiv.style.cursor = 'default';
			_lockDataIcon.style.cursor = 'default';
			_lockDataIcon.style.border = '0';			
			_lockDataDiv.title = _texts[_lang].readOnlyModeText;
			_lockDataIcon.setAttribute('src',_iconNotLocked);
		} else {
			_lockDataDisabled = false;			
		}
	}
	if( _lockDataDisabled ) {
		return;
	}

	if( !_lockDataDiv.onclick ) {
		_lockDataDiv.onclick = function(e) { 
			lockData( !_lockDataOn, lockDataSuccessFunction, lockDataErrorFunction ); 
		};	
	}

	if( success_fn === null ) {
		success_fn = function(statusData) { return; }
	}
	if( error_fn === null ) {
		error_fn = function(errorMessage) { return; }
	}

	var _lockDataConnectionEstablished = false; 
	var _lockDataRequestReceived = false; 
	var _lockDataProcessingRequest = false;

	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 ) {
			//console.log( `received=${_lockDataRequestReceived} processing=${_lockDataProcessingRequest}` );			
	    	if( this.status == 200 ) {
				//console.log( 'The site has been accessed and the file has been read!' );
				let errorParsingStatusData = false;
				let statusData;
				try {
					statusData = JSON.parse(this.responseText);
				} catch(e) {
					errorParsingStatusData = true;
				}
				if( errorParsingStatusData || !('locked' in statusData) || !('ganttmtime' in statusData) ) {
					error_fn( _texts[_lang].statusErrorMessage );
        		} else {
        			success_fn( statusData );
        		}
			} else if( _lockDataRequestReceived && _lockDataProcessingRequest ) {
				//console.log( 'The site has been accessed but the file hasn\'t been found!' );
				error_fn( _texts[_lang].statusErrorMessage );
			} else {
				//console.log( 'Error occured!' );				
				error_fn( _texts[_lang].noConnectionWithServerMessage );
			}
			//hideMessageBox();
			return;
	    } else if( this.readyState == 0 ) {
			//console.log( 'Request not initialized.' );			
	    } else if( this.readyState == 1 ) {
			//console.log( 'Connection established.' );			
	    	_lockDataConnectionEstablished = true;
	    } else if( this.readyState == 2 ) {
			//console.log( 'Request received.' );			
	    	_lockDataRequestReceived = true;
	    } else if( this.readyState == 3 ) {
			//console.log( 'Processing request.' );			
	    	_lockDataProcessingRequest = true;
		}
	};

	//displayMessageBox( _texts[_lang].waitWhileLockingMessage );
	
	_lockDataDisabled = true; // To prevent from doubling requests...

	let url = 'status.php';
	if( locked !== null ) {
		if( locked ) {
			locked=1;
		} else {
			locked=0;
		}
		url += '?locked=' + locked;
	}
	xhttp.open( 'GET', url, true );
	xhttp.send();
}


function lockDataSuccessFunction( statusData ) {
	let errorMessage = null;

	let ganttmtime = statusData.ganttmtime; 		// Data ("gantt.php") modification time.
	if( _ganttMTime < 0 ) {							// If not set yet...
		_ganttMTime = ganttmtime;					// ...setting it.
	} 
		
	if( _ganttMTime != ganttmtime ) { 				// If modification time differs from that of the data loaded... 
		_lockDataIcon.setAttribute('src',_iconNotLocked);      // ... it means to editing allowed from now on ...
		_lockDataOn = false;
		_lockDataDisabled = true; 
		errorMessage = _texts[_lang].serverDataChangedMessage; 		// ... it means the user must reload the data.
	} else {
		let locked = parseInt( statusData.locked );
		if( locked == 1 ) {
			_lockDataIcon.setAttribute('src',_iconLocked);
			_lockDataOn = true; 
			_lockDataDisabled = false; 
		} else {
			_lockDataIcon.setAttribute('src',_iconNotLocked);
			_lockDataOn = false; 
			_lockDataDisabled = false; 
		}
		_lockDataDiv.style.cursor = 'pointer';
		_lockDataIcon.style.cursor = 'pointer';
	}
	lockDataSetStyling( errorMessage );
}


function lockDataErrorFunction( errorMessage ) {
	_lockDataDisabled = false;
	_lockDataOn = false;
	_lockDataIcon.setAttribute('src',_iconNotLocked);
	lockDataSetStyling( errorMessage );
}


function lockDataSetStyling( errorMessage = null ) {
	if( !_lockDataOn ) {
		if( _lockDataDisabled ) { // Disabled means no lock/unlock is allowed
			if( errorMessage !== null ) { 					// Read ok, but modification time differs...
				_lockDataDiv.setAttribute( 'title', errorMessage );
			} 
			_lockDataDiv.style.cursor = 'default';
			_lockDataIcon.style.cursor = 'default';
			_lockDataDiv.onclick = null;
		} else {
			_lockDataDiv.setAttribute( 'title', _texts[_lang].dataNotLockedTitle );
		}
	} else {
		_lockDataDiv.setAttribute( 'title', _texts[_lang].dataLockedTitle );
	}
	if( errorMessage !== null ) {
		displayConfirmationBox( errorMessage );
	}
}