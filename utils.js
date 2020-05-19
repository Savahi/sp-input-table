
var _ifSynchronizedIsBeingChecked = false;

function ifSynchronizedCheck() {
	if( _ifSynchronizedIsBeingChecked ) {
		return;
	}
	_ifSynchronizedIsBeingChecked = true;

	let xmlhttpDownload = new XMLHttpRequest();

	xmlhttpDownload.onreadystatechange = function() {
	    if (this.readyState == 4 ) {
	    	if( this.status == 200 ) {
				let errorParsingDownloadData = false;
				let downloadedData;
				try {
					downloadedData = JSON.parse(this.responseText);
				} catch(e) {
					errorParsingDownloadData = true;
				}
				if( !errorParsingDownloadData && ('synchronized' in downloadedData) ) {
					_dataSynchronized = parseInt( downloadedData.synchronized );
					if( isNaN(_dataSynchronized) ) {
						_dataSynchronized = 0;
					} else if (_dataSynchronized != 1 ) {
						_dataSynchronized = 0;
					}
				} else {
					_dataSynchronized = 1;
        		}
        		displaySynchronizedStatus();
			}
			_ifSynchronizedIsBeingChecked = false;
	    } 
	};
	xmlhttpDownload.open( 'GET', 'download.php', true );
	xmlhttpDownload.send();
}


function displaySynchronizedStatus() {
	let container = document.getElementById('toolboxSynchronizedDiv');
	let icon = document.getElementById('toolboxSynchronizedIcon');

	if( !('editables' in _data) ) {
		icon.setAttribute('src',_iconSynchronizationUnapplied); // _iconEmpty
		container.title = _texts[_lang].synchronizationUnappliedMessage;
		return;		
	} 
	if( _data.editables.length == 0 ) {
		icon.setAttribute('src',_iconSynchronizationUnapplied); // _iconEmpty
		container.title = _texts[_lang].synchronizationUnappliedMessage;
		return;		
	}

	if( _dataSynchronized != null ) {
		if( _dataSynchronized == -1 ) {
			icon.setAttribute('src', _iconNotSynchronized);
			container.title = _texts[_lang].errorUserData;
		} else if( _dataSynchronized == 0 ) {
			icon.setAttribute('src', _iconNotSynchronized);
			container.title = _texts[_lang].unsynchronizedMessage;
		} else {
			icon.setAttribute('src',_iconSynchronized); // _iconEmpty
			container.title = _texts[_lang].synchronizedMessage;
		}
	}
} 

function displayTitlesPositioning( setTitlesPositioning = null, hide=false ) {
	if( setTitlesPositioning !== null ) {
		_titlesPositioning = setTitlesPositioning;
	}

	if( !hide ) {
		if( _titlesPositioning === 'r') {
			_titlesPositioningIcon.setAttribute('src',_iconTitlesRight);
			_titlesPositioningIcon.title = _texts[_lang].titlesRightTitle; 
			_titlesPositioningDiv.title = _texts[_lang].titlesRightTitle; 
			_titlesPositioningDiv.style.cursor = 'pointer';
			_titlesPositioningIcon.style.cursor = 'pointer';
			_titlesPositioningDiv.onclick = function() { 
				displayTitlesPositioning( 'a' ); 
				drawGantt(); 
			};
		} else if( _titlesPositioning === 'a' ) {
			_titlesPositioningIcon.setAttribute('src',_iconTitlesAbove);
			_titlesPositioningIcon.title = _texts[_lang].titlesAboveTitle;		 
			_titlesPositioningDiv.title = _texts[_lang].titlesAboveTitle; 
			_titlesPositioningDiv.style.cursor = 'pointer';
			_titlesPositioningIcon.style.cursor = 'pointer';
			_titlesPositioningDiv.onclick = function() { 
				displayTitlesPositioning( 'r' ); 
				drawGantt(); 
			};
		}
	} else {
		_titlesPositioningIcon.setAttribute('src',_iconTitlesHidden);
		_titlesPositioningIcon.title = _texts[_lang].titlesHiddenTitle;				 
		_titlesPositioningDiv.title = _texts[_lang].titlesHiddenTitle; 
		_titlesPositioningDiv.style.cursor = 'default';
		_titlesPositioningIcon.style.cursor = 'default';
		_titlesPositioningDiv.onclick = null;
	}
} 


function createForeignObjectWithText( text, x, y, width, height, properties ) {
	let foreignObject = createForeignObject( x, y, width, height, properties );
	foreignObject.appendChild( document.createTextNode(text) );
	return foreignObject;
}


function createForeignObject( x, y, width, height, properties ) {
	let foreignObject = document.createElementNS(NS, 'foreignObject'); 
	foreignObject.setAttribute("x",x); 
	foreignObject.setAttribute("y",y); 
	foreignObject.setAttribute("width",width); 
	foreignObject.setAttribute("height",height); 
	if( 'id' in properties ) {
		foreignObject.setAttributeNS(null, 'id', properties.id );		
	} 
	if( 'fontSize' in properties ) {
		foreignObject.setAttributeNS(null,'font-size', properties.fontSize );
	}
	if( 'textAlign' in properties ) {
		foreignObject.setAttributeNS(null,'text-align', properties.textAlign );
	}
	if( 'color' in properties ) {
		foreignObject.setAttributeNS(null,'color', properties.color );
	}	
	return foreignObject;
}


function createRhomb( x, top, height, properties ) {
	return createPolygon( calcRhombCoords(x, top, height), properties );
}

function calcRhombCoords( x, top, height ) {
	let inc = 2;
	top -= inc;
	height += inc*2;
	let halfWidth = Math.floor(height / 2.0);
	let halfHeight = halfWidth;
	let points = (x - halfWidth) + " " + (top + halfHeight) + " " + x + " " + top;
	points += " " + (x + halfWidth) + " " + (top + halfHeight) + " " + x + " " + (top + height);
	return points;
}


function createRect( x, y, width, height, properties ) {
	let rect = document.createElementNS(NS, 'rect');
	if( 'id' in properties ) {
		rect.setAttributeNS(null, 'id', properties.id );		
	} 
	rect.setAttributeNS(null, 'x', x ); 
	rect.setAttributeNS(null, 'width', width ); 
	rect.setAttributeNS(null, 'y', y ); 
	rect.setAttributeNS(null, 'height', height );
	if( 'fill' in properties ) {
		rect.setAttributeNS(null, 'fill', properties.fill );
	} 
	if( 'stroke' in properties ) {
		rect.setAttributeNS(null, 'stroke', properties.stroke );
	}
	if( 'strokeWidth' in properties ) {
		rect.setAttributeNS(null, 'stroke-width', properties.strokeWidth );		 
	}
	if( 'opacity' in properties ) {
		rect.setAttributeNS(null, 'opacity', properties.opacity );
	} 
	return rect;
}

function setRectCoords( rect, x, y, width, height ) {
	rect.setAttributeNS(null,'x',x);
	rect.setAttributeNS(null,'y',y);
	rect.setAttributeNS(null,'width',width);
	rect.setAttributeNS(null,'height',height);  
}

function createPolygon( points, properties ) {
	let polygon = document.createElementNS(NS, 'polygon');
	polygon.setAttributeNS(null, 'points', points );			
	if( 'id' in properties ) {
		polygon.setAttributeNS(null, 'id', properties.id );		 
	} 
	if( 'fill' in properties ) {
		polygon.setAttributeNS(null, 'fill', properties.fill );
	} 
	if( 'stroke' in properties ) {
		polygon.setAttributeNS(null, 'stroke', properties.stroke );
	}
	if( 'strokeWidth' in properties ) {
		polygon.setAttributeNS(null, 'stroke-width', properties.strokeWidth );		  
	}
	if( 'opacity' in properties ) {
		polygon.setAttributeNS(null, 'opacity', properties.opacity );
	} 
	return polygon;
}


function createText( textString, x, y, properties ) {
	let text = document.createElementNS(NS, 'text');
	text.setAttributeNS(null,'x', x );
	text.setAttributeNS(null,'y', y );
	if( 'id' in properties ) {
		let temp = document.getElementById(properties.id);
		text.setAttributeNS(null, 'id', properties.id );		

	} 
	if( 'fontSize' in properties ) {
		//text.setAttributeNS(null,'font-size', properties.fontSize );
		text.style.fontSize = properties.fontSize;
	}
	if( 'fontWeight' in properties ) {
		//text.setAttributeNS(null,'font-weight', properties.fontWeight );
		text.style.fontWeight = properties.fontWeight;
	}
	if( 'fontStyle' in properties ) {
		//text.setAttributeNS(null,'font-style', properties.fontStyle );		
		text.style.fontStyle = properties.fontStyle;
	}
	if( 'textAnchor' in properties ) {
		text.setAttributeNS(null,'text-anchor', properties.textAnchor );
	}
	if( 'textLength' in properties ) {
		if( properties.textLength ) {
			text.setAttributeNS(null,'textLength', properties.textLength );		 
		}
	}
	if( 'lengthAdjust' in properties ) {
		text.setAttributeNS(null,'lengthAdjust', properties.lengthAdjust );
	}
	if( 'alignmentBaseline' in properties ) {
		text.setAttributeNS(null,'alignment-baseline', properties.alignmentBaseline );
	}
	if( 'preserveAspectRatio' in properties ){
		text.setAttributeNS(null,'preserveAspectRatio', properties.preserveAspectRatio );
	}
	if( 'stroke' in properties) {
		text.setAttributeNS(null,'stroke', properties.stroke );
	}
	if( 'strokeWidth' in properties ) {
		text.setAttributeNS(null,'stroke-width', properties.strokeWidth );
	} else {
		text.setAttributeNS(null,'stroke-width', 0 );
	}
	if( 'fill' in properties ) {
		text.setAttributeNS(null,'fill', properties.fill );
	}
	if( 'clipPath' in properties ) {
		text.setAttributeNS(null,'clip-path', properties.clipPath );
	}
	text.appendChild( document.createTextNode( textString ) );
	return text;
}

function createLine( x1, y1, x2, y2, properties ) {
	let line = document.createElementNS(NS, 'line');
	if( 'id' in properties ) {
		line.setAttributeNS(null, 'id', properties.id );		
	} 
	if( 'endingArrow' in properties ) {
		if( properties.endingArrow ) {
			line.setAttributeNS(null,'marker-end', 'url(#arrow)');
		}
	}
	line.setAttributeNS(null, 'x1', x1 ); 
	line.setAttributeNS(null, 'y1', y1 ); 
	line.setAttributeNS(null, 'x2', x2 ); 
	line.setAttributeNS(null, 'y2', y2 );
	if( 'fill' in properties ) {
		line.setAttributeNS(null, 'fill', properties.fill );
	} 
	if( 'stroke' in properties ) {
		line.setAttributeNS(null, 'stroke', properties.stroke );
	}
	if( 'strokeWidth' in properties ) {
		line.setAttributeNS(null, 'stroke-width', properties.strokeWidth );		 
	}
	if( 'strokeDasharray' in properties ) {
		line.setAttributeNS(null, 'stroke-dasharray', properties.strokeDasharray );				 
	}
	if( 'opacity' in properties ) {
		line.setAttributeNS(null, 'opacity', properties.opacity );
	} 
	return line;
}


function createCircle( x, y, radius, properties ) {
	let circle = document.createElementNS(NS, 'circle');
	if( 'id' in properties ) {
		circle.setAttributeNS(null, 'id', properties.id );		
	} 
	circle.setAttributeNS(null, 'cx', x ); 
	circle.setAttributeNS(null, 'cy', y ); 
	circle.setAttributeNS(null, 'r', radius ); 
	if( 'fill' in properties ) {
		circle.setAttributeNS(null, 'fill', properties.fill );
	} 
	if( 'stroke' in properties ) {
		circle.setAttributeNS(null, 'stroke', properties.stroke );
	}
	if( 'strokeWidth' in properties ) {
		circle.setAttributeNS(null, 'stroke-width', properties.strokeWidth );		 
	}
	if( 'opacity' in properties ) {
		circle.setAttributeNS(null, 'opacity', properties.opacity );
	} 
	return circle;
}


function createSVG( x, y, width, height, properties ) {
	let svg = document.createElementNS(NS,'svg');
	svg.setAttributeNS(null,'x',x);
	svg.setAttributeNS(null,'y',y);
	svg.setAttributeNS(null,'width', width );
	svg.setAttributeNS(null,'height', height );
	if( 'fill' in properties ) {
		svg.setAttributeNS(null, 'fill', properties.fill);	  
	}
	if( 'id' in properties ) {
		svg.setAttributeNS(null, 'id', properties.id);	  
	}
	return svg; 
}


function initLinearGradient( stops, name ) {
	let gradient = document.createElementNS(NS, 'linearGradient');
	for( let i = 0 ; i < stops.length; i++ ) {
		let stop = document.createElementNS(NS, 'stop');
		stop.setAttribute('offset', stops[i].offset);
		stop.setAttribute('stop-color', stops[i].color);
		gradient.appendChild(stop);
	}
	gradient.id = name;
	gradient.setAttribute('x1', '0');
	gradient.setAttribute('x2', '1');
	gradient.setAttribute('y1', '0');
	gradient.setAttribute('y2', '0');
	return gradient;
}


// Returns the number of week of the year
function getWeekNumber(d) {
	d = new Date( Date.UTC( d.getFullYear(), d.getMonth(), d.getDate() ) );
	d.setUTCDate( d.getUTCDate() + 4 - (d.getUTCDay() || 7) );
	var startOfYear = new Date( Date.UTC( d.getUTCFullYear(), 0,1 ) );
	var weekNumber = Math.ceil( ( ( (d - startOfYear) / 86400000 ) + 1 ) / 7 );
	return weekNumber;
}


function parseDate( dateString ) {
	if( typeof(dateString) === 'undefined' ) {
		return null;
	}
	if( dateString == null ) {
		return null;
	}
	let date = null;
	let y=null, m=null, d=null, hr=null, mn=null;
	let parsedFull = dateString.match( /([0-9]+)[\.\/\-\:]([0-9]+)[\.\/\-\:]([0-9]+)[ T]+([0-9]+)[\:\.\-\/]([0-9]+)/ );
	if( parsedFull !== null ) {
		if( parsedFull.length == 6 ) {
			y = parsedFull[3];
			if( _dateDMY ) {
				m = parsedFull[2];
				d = parsedFull[1];				
			} else {
				d = parsedFull[2];
				m = parsedFull[1];								
			}
			hr = parsedFull[4];
			mn = parsedFull[5];
			date = new Date(y, m-1, d, hr, mn, 0, 0);
		}
	} else {
		let parsedShort = dateString.match( /([0-9]+)[\.\/\-\:]([0-9]+)[\.\/\-\:]([0-9]+)/ );
		if( parsedShort !== null ) {
			if( parsedShort.length == 4 ) {
				y = parsedShort[3];
				if( _dateDMY ) {
					m = parsedShort[2];
					d = parsedShort[1];					
				} else {
					d = parsedShort[2];
					m = parsedShort[1];										
				}
				hr = 0;
				mn = 0;
				date = new Date(y, m-1, d, hr, mn, 0, 0, 0, 0);
			}
		}
	}
	if( date === null ) {
		return null;
	}
	let timeInSeconds = date.getTime();
	return( { 'date':date, 'timeInSeconds':timeInSeconds/1000 } ); 
}


function parseJSDate( dateString ) {
	if( typeof(dateString) === 'undefined' ) {
		return null;
	}
	if( dateString == null ) {
		return null;
	}
	let date = null;
	let parsedFull = dateString.match( /([0-9]+)[\.\-\/\:]([0-9]+)[\.\-\/\:]([0-9]+)[ T]+([0-9]+)[\:\.\-\/]([0-9]+)/ );
	if( parsedFull !== null ) {
		if( parsedFull.length == 6 ) {
			date = new Date(parsedFull[1], parsedFull[2]-1, parsedFull[3], parsedFull[4], parsedFull[5], 0, 0);
		}
	} else {
		let parsedShort = dateString.match( /([0-9]+)[\.\-\/\:]([0-9]+)[\.\-\/\:]([0-9]+)/ );
		if( parsedShort !== null ) {
			if( parsedShort.length == 4 ) {
				date = new Date(parsedShort[1], parsedShort[2]-1, parsedShort[3], 0, 0, 0, 0);
			}
		}
	}
	if( date === null ) {
		return null;
	}
	let timeInSeconds = date.getTime();
	return( { 'date':date, 'timeInSeconds':timeInSeconds/1000 } ); 
}


function dateIntoJSDateString( date ) {
	let year = date.getFullYear(); 
	let month = (date.getMonth()+1);
	if( month < 10 ) {
		month = "0" + month;
	}
	let day = date.getDate();
	if( day < 10 ) {
		day = "0" + day;
	}
	let hours = date.getHours();
	if( hours < 10 ) {
		hours = "0" + hours;
	}
	let minutes = date.getMinutes();
	if( minutes < 10 ) {
		minutes = "0" + minutes;
	}
	return( year + "-" + month + "-" + day + "T" + hours + ":" +  minutes + ":00" ); 
}


function dateIntoSpiderDateString( date, dateOnly=false ) {
	let spiderDateString = null;

	let year = date.getFullYear(); 
	let month = (date.getMonth()+1);
	if( month < 10 ) {
		month = "0" + month;
	}
	let day = date.getDate();
	if( day < 10 ) {
		day = "0" + day;
	}
	if( _dateDMY ) {
		spiderDateString = day + _dateDelim + month + _dateDelim + year; 
	} else {
		spiderDateString = month + _dateDelim + day + _dateDelim + year;		 
	}
	if( !dateOnly ) {
		let hours = date.getHours();
		if( hours < 10 ) {
			hours = "0" + hours;
		}
		let minutes = date.getMinutes();
		if( minutes < 10 ) {
			minutes = "0" + minutes;
		}
		spiderDateString += "  " + hours + _timeDelim +  minutes;
	}
	return( spiderDateString ); 
}


function digitsOnly( string ) {
	let patt1 = /[0-9]+/g;
	let patt2 = /[^0-9 ]/;
	let res1 = string.match(patt1);
	let res2 = string.match(patt2);
	if( res1 != null && res2 == null ) {
		if( res1.length > 0 ) {
			return true;
		}
	}
	return false;	
}


function setCookie( cname, cvalue, exdays=3650 ) {
	if( exdays == null ) {
		document.cookie = cname + "=" + cvalue + "; path=/";
	}
	else {
		let d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		let expires = "expires="+ d.toUTCString();		
		document.cookie = cname + "=" + cvalue + ";" + expires + "; path=" + window.location.pathname;
		//document.cookie = cname + "=" + cvalue + ";" + expires + "; path=/";
		//document.cookie = cname + "=" + cvalue + ";" + expires;
	}

}


function deleteCookie( cname ) {
	document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + window.location.pathname;
	//document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	//document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}

function getCookie( cname, type='string' ) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for( let i = 0 ; i < ca.length ; i++ ) {
		let c = ca[i];
		while( c.charAt(0) == ' ' ) {
			c = c.substring(1);
		}
		if( c.indexOf(name) == 0 ) {
			let value = c.substring(name.length, c.length);
			if( type == 'string' ) {
				return value;
			}
			if( type == 'int' ) {
				let intValue = parseInt(value);
				if( !isNaN(intValue) ) {
					return intValue;
				}
			}
			if( type == 'float' ) {
				let floatValue = parseFloat(value);
				if( !isNaN(floatValue) ) {
					return floatValue;
				}
			}
			return null;
		}
	}
	return null;
}


function moveElementInsideArrayOfObjects( arr, from, to ) {	
	var elToMove = {};
	for( let key in arr[from] ) {
		elToMove[key] = arr[from][key];
	}
	if( from < to ) {
		for( let i = from+1 ; i <= to ; i++ ) {
			for( let key in arr[i] ) {
				arr[i-1][key] = arr[i][key];
			}
		}
	} else if( to < from ) {
		for( let i = from-1 ; i >= to ; i-- ) {
			for( let key in arr[i] ) {
				arr[i+1][key] = arr[i][key];
			}
		}
	}
	for( let key in elToMove ) {
		arr[to][key] = elToMove[key];
	}
}


function copyArrayOfObjects( arrFrom, arrTo ) {	
	if( arrTo.length == 0 ) {
		for( let i = 0 ; i < arrFrom.length ; i++ ) {
			arrTo.push({});
		}
	}

	for( let i = 0 ; i < arrFrom.length ; i++ ) {
		for( let key in arrFrom[i] ) {
			arrTo[i][key] = arrFrom[i][key];
		}
	}
}

function decColorToString( decColor, defaultColor=null ) {
	if( typeof(decColor) !== 'undefined' ) {		
		if( decColor ) {
			if( digitsOnly(decColor) ) {
				let c1 = (decColor & 0xFF0000) >> 16;
				let c1text = c1.toString(16);
				if( c1text.length == 1 ) {
					c1text = "0" + c1text;
				}
				let c2 = (decColor & 0x00FF00) >> 8;
				c2text = c2.toString(16);
				if( c2text.length == 1 ) {
					c2text = "0" + c2text;
				}
				let c3 = (decColor & 0x0000FF);	  
				c3text = c3.toString(16);
				if( c3text.length == 1 ) {
					c3text = "0" + c3text;
				}
				return '#' + c3text + c2text + c1text;
			}
		}
	}
	return defaultColor;
}


function isEditable( name ) {
	for( let iE=0 ; iE < _data.editables.length ; iE++ ) {
		let ref = _data.editables[iE].ref;
		if( ref == name ) {
			return _data.editables[iE].type;
		}
	}
	return null;
}

function padWithNChars( n, char ) {
	let s = '';
	for( let i = 0 ; i < n ; i++ ) {
		s += char;
	}
	return s;
}

function spacesToPadNameAccordingToHierarchy( hierarchy ) {
	let s = '';
	for( let i = 0 ; i < hierarchy ; i++ ) {
		s += '   '; // figure space: ' ', '·‧', '•', '⁌','|'
	}
	return s;
}


function removeClassFromElement( element, className ) {
	let replace = '\\b' + className + '\\b';
	let re = new RegExp(replace,'g');
	element.className = element.className.replace(re, '');
}

function addClassToElement( element, className ) {
	let classArray;
	classArray = element.className.split(' ');
	if( classArray.indexOf( className ) == -1 ) {
		element.className += " " + className;
	}
}

function printSVG() {
	let header = document.getElementById('header');
	let headerDisplayStyle = header.style.display;
	header.style.display = 'none';

	let toolbox = document.getElementById('toolbox');
	let toolboxDisplayStyle = toolbox.style.display;
	toolbox.style.display = 'none';

	let htmlStyles = window.getComputedStyle(document.querySelector("html"));
	let headerHeight = htmlStyles.getPropertyValue('--header-height');
	let toolboxTableHeight = htmlStyles.getPropertyValue('--toolbox-table-height');

	document.documentElement.style.setProperty('--header-height', '2px');
	document.documentElement.style.setProperty('--toolbox-table-height', '2px');

	let scrollThick = _settings.scrollThick;
	_settings.scrollThick = 0;
	_tableScrollSVG.setAttributeNS(null, 'height', 0 );
	_ganttHScrollSVG.setAttributeNS(null, 'height', 0 );
	_verticalScrollSVG.setAttributeNS(null, 'width', 0 );

	initLayoutCoords();
    drawTableHeader();
    drawTableContent();
    drawGantt();
    drawTimeScale();
	drawVerticalSplitter(true);

	window.print(); 

	_settings.scrollThick = scrollThick;
	_tableScrollSVG.setAttributeNS(null, 'height', scrollThick );
	_ganttHScrollSVG.setAttributeNS(null, 'height', scrollThick );
	_verticalScrollSVG.setAttributeNS(null, 'width', scrollThick );
	document.documentElement.style.setProperty('--header-height', headerHeight);
	document.documentElement.style.setProperty('--toolbox-table-height', toolboxTableHeight);

	initLayoutCoords();
    drawTableHeader();
    drawTableContent();
    drawGantt();
    drawTimeScale();
	drawVerticalSplitter(true);


	header.style.display = headerDisplayStyle;
	toolbox.style.display = toolboxDisplayStyle;
}


function findPositionOfElementAtPage( el ) {
	if( typeof( el.offsetParent ) !== 'undefined' ) {
		let posX, posY;
		for( posX = 0, posY = 0; el ; el = el.offsetParent ) {
			posX += el.offsetLeft;
			posY += el.offsetTop;
		}
		return [ posX, posY ];
	} else {
		return [ el.x, el.y ];
	}
}


function getCoordinatesOfClickOnImage( imgId, event ) {
	let posX = 0, posY = 0;
	let imgPos = findPositionOfElementAtPage( imgId );
	let e = ( event ) ? event : window.event;

	if( e.pageX || e.pageY ) {
		posX = e.pageX;
		posY = e.pageY;
	} else if( e.clientX || e.clientY ) {
		posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	posX = posX - imgPos[0];
	posY = posY - imgPos[1];

	let right = ( posX > parseInt( imgId.clientWidth/2 ) ) ? 1 : 0;
	let lower = ( posY > parseInt( imgId.clientHeight/2 ) ) ? 1 : 0;

	return [ posX, posY, right, lower ];
}


function filterInput( id, patternStr='([^0-9]+)', minValue=100, maxValue=10000, defaultValue=100 ) {
	let start = id.selectionStart;
	let end = id.selectionEnd;
	
	const currentValue = id.value;
	const pattern = new RegExp(patternStr, 'g');
	let correctedValue = currentValue.replace(pattern, '');
	id.value = correctedValue;
	if( correctedValue.length < currentValue.length) {
		end--;
	}
	id.setSelectionRange(start, end);   

    return correctedValue;
}


function trimString( str ) {
  return str.replace(/^\s+|\s+$/gm,'');
}


function csvIntoJSON(s) {
	
	let lines = s.split('\n');
	if( lines.length < 2 ) {
		return [];
	}
	let titles = lines[0].split('\t');
	if( titles < 3 ) {
		return [];
	}		
	titles[titles.length-1] = trimString( titles[titles.length-1] );

	let json = [];
	for( let i = 1 ; i < lines.length ; i++ ) {
		jsonLine = {};
		let line = lines[i].replace( String.fromCharCode(1), '\n' );
		let values = line.split('\t');
		if( values.length != titles.length ) {
			break;
		}
		for( let t = 0 ; t < titles.length ; t++ ) {
			jsonLine[ titles[t] ] = values[t]; 
		}
		json.push(jsonLine);
	}
	return json;
}

function getShortFileName( name ) {
	if( name === null ) {
		return null;
	}
	let shortName;
	let i = name.lastIndexOf('/');
	if( i >= 0 ) { 
  		shortName = name.substring(i + 1);
	} else {
		shortName = name;
	}
	return shortName;
}


function getFileNameExtension( fileName ) {
	let index = fileName.lastIndexOf('.');	
	if( index >= 0 && index < fileName.length - 1 ) {
		return (fileName.substring(index+1));
    }
	return '';
}


function getFileType( fileName ) {
	if( confirmFileNameIsAnImage(fileName) ) {
		return 2;
	}
	if( confirmFileNameIsAVideo(fileName) ) {
		return 3;
	}
	if( confirmFileNameIsADoc(fileName) ) {
		return 1;
	}
	return 0;
}

function confirmFileNameIsAnImage( fileName ) {
	let ext = getFileNameExtension( fileName );
	if( ext.length == 0 ) {
		return false;
	}
	ext = ext.toLowerCase();
	if( ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'bmp' || ext === 'gif' ) {
		return true;
	}
	return false;
}

function confirmFileNameIsADoc( fileName ) {
	let ext = getFileNameExtension( fileName );
	if( ext.length == 0 ) {
		return false;
	}
	ext = ext.toLowerCase();
	if( ext === 'rtf' || ext === 'doc' || ext === 'docx' || ext === 'xls' || ext === 'xlsx' || 
		ext === 'ppt' || ext === 'pptx' || ext === 'pptm' || ext === 'pdf' || ext === 'txt' ) {
		return true;
	}
	return false;
}

function confirmFileNameIsAVideo( fileName ) {
	let ext = getFileNameExtension( fileName );
	if( ext.length == 0 ) {
		return false;
	}
	ext = ext.toLowerCase();
	if( ext === 'mp4' || ext === 'mpeg' || ext === 'wmv' || ext === 'mov' || ext === 'avi' ) {
		return true;
	}
	return false;
}


function adjustDateTimeToFormat( dateTime, format ) {
	if( !(format > 0) ) { // "format == 0 " stands for "date-only"
		let pattern = new RegExp(' +[0-9]{2}' + _timeDelim + '[0-9]{2} *$'); 
		if( pattern.test(dateTime) ) {               // If time is as well found in the string...
			dateTime = dateTime.replace(pattern, ''); // ... deleting it.
		}
	} else {  // Date and time should be specified...
		let pattern = new RegExp('^ *[0-9]{2}' + _dateDelim + '[0-9]{2}' + _dateDelim + '[0-9]{4} *$');
		if( pattern.test(dateTime) ) {  // ... if not ... 
			dateTime += ' 00' + _timeDelim + '00';       // ... adding time.
		}
	}
	return dateTime;
}


function getElementPosition(el) {
	let lx=0, ly=0
    for( ; el != null ; ) {
		lx += el.offsetLeft;
		ly += el.offsetTop;
		el = el.offsetParent;    	
    }
    return {x:lx, y:ly};
}

function getClientX(e, defaultValue=null ) {
	if( 'clientX' in e  ) {
		return e.clientX;
	}
	if( 'touches' in e ) {
		if( e.touches.length > 0 ) {
			return e.touches[0].clientX;
		}
	}
	return defaultValue;
}

function getClientY(e, defaultValue=null ) {
	if( 'clientY' in e  ) {
		return e.clientY;
	}
	if( 'touches' in e ) {
		if( e.touches.length > 0 ) {
			return e.touches[0].clientY;
		}
	}
	return defaultValue;
}

function getPageX(e, defaultValue=null ) {
	if( 'pageX' in e  ) {
		return e.pageX;
	}
	if( 'touches' in e ) {
		if( e.touches.length > 0 ) {
			return e.touches[0].pageX;
		}
	}
	return defaultValue;
}


function getTouchEventXY(e) {
	if( 'touches' in e ) {
		if( e.touches.length > 0 ) {
			t = e.touches[0];
			return [ t.clientX, t.clientY, t.pageX, t.pageY, t.offsetX, t.offsetY ];
		}
	}
	if( e ) {
		return [ e.clientX, e.clientY, e.pageX, e.pageY, e.offsetX, e.offsetY ];
	}
	return [ null, null, null, null, null, null ];
}
