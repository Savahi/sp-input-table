<?php

require('auth.php');

if( isAuthRequired() ) {
	auth(true);
}

/*$authScript = "<?php require('auth.php'); if( isAuthRequired() ) { auth(true); } ?>";*/

// FOR DEBUGGING PURPOSES ONLY!
// $GET = array('locked'=>'0');
// $GET=null;
$locked = $_GET['locked'];

$returnStr = '{'; // The JSON-string To be returned to http client... 

if( strlen( $locked ) > 0 ) { 					// If a status must be set...
	$fileHandle = fopen( 'status.ini', 'w' ); 		// ... opening "status.ini" file
	if( $fileHandle != FALSE ) { 					// ... if succeeded... 
		if( $locked == 1 ) { 
			$locked = 1;
		} else {
			$locked = 0;
		}
		$status = fwrite( $fileHandle, '[Data]'. PHP_EOL . 'locked=' . $locked ); 		// ...writing "locked" status...
		if( $status != FALSE ) {										// ... if succeeded...
	   		$returnStr .= '"locked":' . $locked;						//
		} else {
	   		$returnStr .= '"locked":0, "error":"File write error"';
		}			
		fclose( $fileHandle );
	} else { 														// ... if failed to write into "status.ini" file... 
	   	$returnStr .= '"locked":0, "error":"File open error"';
	} 
} else { 												// If not writing but only reading locked/unlocked status... 
	$fileHandle = fopen( 'status.ini', 'r' ); 			// .. opening "status.ini" file...
	if( $fileHandle != FALSE ) {						// ... if succeeded ...
		$found = false;
		while( !feof( $fileHandle ) ) {					// ... searching for and reading the "locked" line
			$line = fgets( $fileHandle );
			$explodedLine = explode( '=', $line );
			if( strtolower( $explodedLine[0] ) == 'locked' ) {
		   		$returnStr .= '"locked":' . $explodedLine[1];
				$found = true;
				break;
			}
		}
		if( !$found ) {								// ... if not found...
	   		$returnStr .= '"locked":0';				// ... setting to "unlocked"
		}
		fclose( $fileHandle );					
	} else {													// If failed to open "status.ini" file...
		$fileHandle = fopen( 'status.ini', 'w' ); 				// ... creating the one...
		if( $fileHandle != FALSE ) {							// ... if succeeded...
			$status = fwrite( $fileHandle, '[Data]'. PHP_EOL . 'locked=0' );	 	// ... writing "unlocked" status...
			if( $status != FALSE ) {							// ... if succeeded...
	   			$returnStr .= '"locked":0';						// ...setting "unlocked" status
			} else {											// . otherwise											
	   			$returnStr .= '"locked":0, "error":"File write error"'; // ... adding "error" status
			}
			fclose($fileHandle);
		} else {														// If failed to open "status.ini" for writing...
	   		$returnStr .= '"locked":0, "error":"File open error"'; 		// ... reporting "unlocked" and "error" status
		}
	}
}	
$returnStr .= ', "ganttmtime":' . filemtime('gantt.php'); 		// Adding data modification time. 
$returnStr .= '}';

echo($returnStr); 		// Sending data to client via http.

exit(0);

?>