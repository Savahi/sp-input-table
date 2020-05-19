<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);

//require('auth.php');

//if( isAuthRequired() ) {
//	auth(true);
//}

define( "AUTH_SCRIPT", "<?php require('auth.php'); if( isAuthRequired() ) { auth(true); } ?>" );

define( "LINE_NUMBER_KEY", "f_WebExportLineNumber");
define( "PARENT_OPERATION_KEY", "OperCode" );

define( "DATA_FILE", "user_data.csv.php" );
define( "TEMP_FILE", "user_data.temp" );

$errorCode = storeData();

// Creating the response, holding statuses of operations 
$_response = "{\"errorCode\":" . $errorCode . "}";
echo( $_response );

if( $errorCode == 0 ) { 	// Updating download status file to indicate user entered data that hasn't been transfered into Spider yet...
	$fileHandle = fopen( 'download.ini', 'w' ); 			// .. opening "download.ini" file...
	if( $fileHandle != FALSE ) {							// ... if succeeded ...
		fwrite( $fileHandle, "loaded=0" );  
		fclose( $fileHandle );					
	}
}

exit(0);

// Stores a line and uploads/deletes the file(s) if required
function storeLine($handle, $code, $lnumber, $parent, $data) {
	$line = $code . "\t" . $lnumber . "\t" . $parent;
	foreach( $data as $key => $value ) {
		$line .= "\t";
		$line .= $value;
	}

	$line = preg_replace('/[\r\n]/', chr(1), $line);
	$line = preg_replace('/[\n]/', chr(1), $line);
	$line = preg_replace('/[\r]/', chr(1), $line);
	if( fputs($handle, $line . "\n") == FALSE ) {
		return 1;
	}
	return 0;
}


// Creates a new "user-data" file and saves data into
function storeNew( $code, $lnumber, $parent, $data) {
	$errorCode = 1;

	$handle = fopen( DATA_FILE, 'w' );
	if( $handle ) {
		$status = fputs( $handle, AUTH_SCRIPT  . "\n" ); 	// "Auth" script for security

		$columnTitles = "Code\t" . LINE_NUMBER_KEY . "\t" . PARENT_OPERATION_KEY; // The header: Code f_WebExportLineNumber ... f_File			
		foreach( $data as $key => $value ) {
			$columnTitles .= "\t";
			$columnTitles .= $key;
		}
		fputs( $handle, $columnTitles . "\n" );  

		$errorCode = storeLine( $handle, $code, $lnumber, $parent, $data );		// A new and the only line
		fclose( $handle );
	}
	return $errorCode;
}


// Inserts new data into the existing user-data file
function storeWithInsertion( $code, $lnumber, $parent, $data ) {
	$errorCode = 1;

	$srcHandle = fopen( DATA_FILE, 'r' ); 			// .. opening "user data" file file...
	$dstHandle = fopen( TEMP_FILE, 'w' ); 			// .. opening "temp" file file...
	
	$counter = 0;
	if( $srcHandle != FALSE && $dstHandle != FALSE ) {		// ... if succeeded ...
		$inserted = FALSE;
		while( !feof( $srcHandle ) ) {						// To let us know if the operation has already been stored or not...
			$counter += 1;

			$line = fgets( $srcHandle );
			if( $counter <= 2 ) {
				fputs( $dstHandle, $line );
				continue; 
			}

			$explodedLine = explode( "\t", $line );

			if( $explodedLine[0] == $code && $explodedLine[1] == $lnumber ) {
				$errorCode = storeLine( $dstHandle, $code, $lnumber, $parent, $data );
				$inserted = TRUE;
			} else {
				fputs( $dstHandle, $line );
			}
		}
		if( !$inserted ) {
			$errorCode = storeLine( $dstHandle, $code, $lnumber, $parent, $data );
		}
	} 
	if( $dstHandle != FALSE ) { 
		fclose( $dstHandle );					
	}
	if( $srcHandle != FALSE ) { 
		fclose( $srcHandle );					
	}

	if( $errorCode == 0 ) {
		if( rename( TEMP_FILE, DATA_FILE ) == FALSE ) {
			$errorCode = 1;
		}
	}
	return $errorCode;
}


function storeData() {
	$errorCode = 1;

	// Check if the form was submitted
	if($_SERVER["REQUEST_METHOD"] != "POST") {
		return $errorCode;
	}
	if( !isset( $_POST['data'] ) ) {
		return $errorCode;
	}

	$json = json_decode( stripslashes($_POST['data']) );

	if( !isset( $json->operationCode ) || !isset( $json->lineNumber ) || !isset( $json->parentOperation ) || !isset( $json->data ) ) {	
		return $errorCode;
	}

	if( !file_exists( DATA_FILE ) ) {
		$errorCode = storeNew( $json->operationCode, $json->lineNumber, $json->parentOperation, $json->data );
	} else {
		$errorCode = storeWithInsertion( $json->operationCode, $json->lineNumber, $json->parentOperation, $json->data );
	}

	return $errorCode;
}


function logTxt( $txt ) {
	$fp = fopen('log.txt', 'a' );
	fputs( $fp, $txt . "\n" );
	fclose($fp);
}

?>