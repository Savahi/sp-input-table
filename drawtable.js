
function drawTableHeader() {

	let tableHead = document.getElementById('dataTableHead');
	let trHead = document.createElement('tr');
	tableHead.appendChild(trHead);	
	trHead.id = 'tableHeaderRow';

	let tdExpand = document.createElement('td');
	tdExpand.id = 'tableHeaderColumn0';
	tdExpand.innerHTML = '';
	trHead.appendChild(tdExpand);

	let left = 0;
	for( let col = 1 ; col < _data.table.length ; col++ ) {
		left += _data.table[col].width;
		let props = { 'fill':_settings.tableHeaderFillColor, 'stroke':_settings.tableHeaderBorderColor, 'strokeWidth':1 };
		let title = _data.table[col].name;
		if( _data.refSettings[ _data.table[col].ref ].editableType !== null ) {
			title += "*";
		}
		let td = document.createElement('td');
		td.id = 'tableHeaderColumn' + col;
		td.innerHTML = title;
		trHead.appendChild(td);
	}
}


var _tableRowExpanded = '▼';
var _tableRowNotExpanded = '►';


function drawTableContent( init=false, shiftOnly=false ) {
	let tableBody = document.getElementById('dataTableBody');

	for( let i = 0 ; i < _data.operations.length ; i++ ) {

		let tr = document.createElement('tr');
		tableBody.appendChild(tr);	
		tr.id = 'tableRow' + i;
		tr.style.backgroundColor = _data.operations[i].colorBack;

		// Expand functionality [+] / [-]
		let expandText='';
		let expandTextColor='#8f8f8f';
		if( _data.operations[i].expandable ) {
			if( _data.operations[i].expanded ) {
				expandText = _tableRowExpanded;
 			} else {
				expandText = _tableRowNotExpanded;
			}
		}
		let expandTextId = 'tableColumn0Row' + i;

		let expandTd = document.createElement('td');
		tr.appendChild(expandTd);
		expandTd.id = expandTextId;
		expandTd.dataset.operationNumber=i;
		expandTd.style.color = expandTextColor;
		expandTd.style.fontSize = '16px';
		expandTd.innerHTML = expandText;
	 	if( _data.operations[i].expandable ) {
	 		expandTd.style.cursor = 'pointer';
		 	expandTd.onmousedown = function(e) {
		 		let operationNumber = Number(this.dataset.operationNumber); 
		 		if( _data.operations[operationNumber].expanded == true ) {
		 			for( let iO = 0 ; iO < _data.operations.length ; iO++ ) {
		 				for( let iP = 0 ; iP < _data.operations[iO].parents.length ; iP++ ) {
		 	 				if( _data.operations[iO].parents[iP] == operationNumber ) {
								document.getElementById('tableRow'+iO).style.display = 'none';
			 					_data.operations[iO].visible = false;
			 					break;
			 				}
			 			}
			 		}
					document.getElementById('tableColumn0Row'+operationNumber).innerHTML = _tableRowNotExpanded;
					_data.operations[operationNumber].expanded = false;
		 		} else {
		 			for( let iO = operationNumber+1 ; iO < _data.operations.length ; iO++ ) {
		 				for( let iP = 0 ; iP < _data.operations[iO].parents.length ; iP++ ) {
		 					let iParent = _data.operations[iO].parents[iP];
		 	 				if( iParent == operationNumber ) {
								document.getElementById('tableRow'+iO).style.display = 'table-row';
			 					_data.operations[iO].visible = true;
			 					break;
			 				}
			 				if( _data.operations[iParent].expandable && _data.operations[iParent].expanded == false ) {
			 					break;
			 				}
		 				}
		 			}
					document.getElementById('tableColumn0Row'+operationNumber).innerHTML = _tableRowExpanded;
		 			_data.operations[operationNumber].expanded = true;
		 		}
		 	};
		}

		for( let col = 1 ; col < _data.table.length ; col++ ) {
			let td = document.createElement('td');
			td.id = 'tableColumn'+col+'Row'+i; 
			tr.appendChild(td);

			let tdTextNode = document.createElement('span');	// To store value
			td.appendChild( tdTextNode );

			// If it is editable and it is neither team nor assignment...
			if( _data.refSettings[_data.table[col].ref].editableType !== null ) {
				if( (typeof(_data.operations[i].Level) === 'string') || (_data.operations[i].Level === null) ) {
					td.className = 'dataTableEditable';
					td.style.borderBottom = '1px solid #bfbfbf';
					td.setAttribute( 'data-i', i );
					td.setAttribute( 'data-col', col );
					td.setAttribute( 'data-type', _data.refSettings[_data.table[col].ref].editableType );
					td.onmousedown = onTableFieldMouseDown;
					let editableMark = document.createElement('div');
					editableMark.className = 'dataTableEditableMark';
					td.appendChild( editableMark );
					editableMark.innerHTML = '&#10000;';
				}
			}

			let ref = _data.table[col].ref;
			let content = _data.operations[i][ref];
			drawTableTd( content, i, ref, td, tdTextNode )
		}
	}
}


function drawTableTd( content, i, ref, td=null, tdTextNode=null )
{
	if( td === null && _data.refSettings[ref].editableType === null ) { 	// Called not from drawTable - thus only after editing
		return;
	}
	let col = _data.refSettings[ref].column;
	let type = _data.refSettings[ref].type;
	let format = _data.refSettings[ref].format;
	if( td === null ) {
		td = document.getElementById( 'tableColumn'+col+'Row'+i );
	}
	if( td === null ) 
		return;
	if( tdTextNode === null ) {
		tdTextNode = td.firstChild;
	}
	if( tdTextNode === null )
		return;	
	let color = _data.operations[i].colorFont; // _settings.tableContentStrokeColor;
	let fontStyle = 'normal';
	let fontWeight = 'normal';
	let backgroundColor = _data.operations[i].colorBack;
	let textAlign = 'left';
	if( 'userData' in _data.operations[i] ) { // If the value has been changed by user and not saved
		if( ref in _data.operations[i].userData ) {
			let bChanged = false;
			if( _data.refSettings[ref].editableType === 'datetime' ) {
				let d1 = parseDate(_data.operations[i].userData[ref]);
				let d2 = parseDate(_data.operations[i][ref]);
				if( d1.timeInSeconds !== d2.timeInSeconds ) {
					bChanged=true;
				}
			} else if( _data.refSettings[ref].editableType === 'float' ) {
				if( !(Math.abs(_data.operations[i].userData[ref] - _data.operations[i][ref]) < 10e-12) ) {
					bChanged = true;
				}
			} else if( _data.operations[i].userData[ref] != _data.operations[i][ref] ) {
				bChanged = true;
			} 
			if( bChanged ) {
				fontStyle = "italic";
				fontWeight = "bold";
			}
			content = _data.operations[i].userData[ref];
		}
	}
	if( typeof(content) === 'undefined' ) {
		content = '';
	} else if( content === null ) {
		content = '';
	}

	if( ref === "Level" ) { // To display no 'teams' or 'assignments' (phases only). 
		if( typeof(content) === 'string' ) {
			content = "";
		}
	}
	if( ref === 'Name' ) { // A name should be adjusted according to it position in the hierarchy
		content = spacesToPadNameAccordingToHierarchy(_data.operations[i].parents.length) + content; 
		if( typeof(_data.operations[i].Level) === 'number' ) { // If it is a phase...
			fontWeight = 'bold'; // ... making it bold.
		}
	} else {
		if( type === 'float' || type === 'int' ) {
			if( type === 'float' ) {
				value = parseFloat( content );
				if( !isNaN(value) ) {
					content = value.toFixed( format ); // For float values "format" stands for the radix.
				}
			}							
			textAlign = 'right';
		} else if( type === 'string' || type === 'text' ) { // For strings "format" stands for alignment
			if( format == 1 ) { // Align right
				textAlign = 'right';							
			} else if ( format == 2 ) {
				textAlign = 'center';														
			}
		} else if( type === 'datetime' ) {
			content = adjustDateTimeToFormat( content, format );
		} else if( type === 'signal' ) { // Signals require being 'centered'
			color = _settings.tableContentStrokeColor;						
		}
	}
	if( type === 'signal' ) {
		content = '&#9679';
	}
	tdTextNode.innerHTML = content;
	td.style.color = _data.operations[i].colorFont; // _settings.tableContentStrokeColor;
	td.style.fontStyle = fontStyle;
	td.style.fontWeight = fontWeight;
	td.style.textAlign = textAlign;
}


function writeNewValueFromInputElemIntoTable( inputElemValue, i, ref ) {
	if( !( ref in _data.refSettings) ) 
		return;
	let col = _data.refSettings[ref].column;
	let type = _data.refSettings[ref].type;
	let format = _data.refSettings[ref].format;

	let destTd = document.getElementById( 'tableColumn'+col+'Row'+i );
	if( !destTd ) 
		return;
	let destElem = destTd.firstChild;
	if( !destElem )
		return;	

	if( _data.operations[i][ref] != inputElemValue ) {
		destElem.setAttributeNS( null, 'font-style', "italic" );
		destElem.setAttributeNS( null, 'font-weight', "bold" );
	} else { // If user re-entered the old value
		destElem.setAttributeNS( null, 'font-style', "normal" );										
		destElem.setAttributeNS( null, 'font-weight', "normal" );
	}

	if( ref === 'Name') { 	// Shifting according to hierarchy if it is a name
		let hrh = _data.operations[i].parents.length;
		destElem.innerHTML = spacesToPadNameAccordingToHierarchy(hrh) + inputElemValue;
	}
	else { 
		if( type === 'float' ) {
			let valueToTrim = parseFloat(inputElemValue);
			if( !isNaN(valueToTrim) && typeof(format) !== 'undefined' ) {
				inputElemValue = valueToTrim.toFixed(format);
			}
		}
		else if( type === 'datetime' ) {
			inputElemValue = adjustDateTimeToFormat( inputElemValue, format );
		}				
		destElem.innerHTML = inputElemValue;
	}
}

function onTableFieldMouseDown(e) { 
	displayEditBoxWithData( this );
}
