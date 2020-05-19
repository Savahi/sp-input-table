<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);

//require('auth.php');

//if( isAuthRequired() ) {
//	auth(true);
//}

define( "AUTH_SCRIPT", "<?php require('auth.php'); if( isAuthRequired() ) { auth(true); } ?>" );

define( "NUM_FILES", 4 );
define( "FILE_FOLDER", "files" );
define( "FILENAME_COLUMN", "Folder");
define( "USERFILENAME_COLUMN", "FolderAlt");
define( "FILENAME_SPLITTER", "|" );
define( "LINE_NUMBER_KEY", "f_WebExportLineNumber");
define( "PARENT_OPERATION_KEY", "OperCode" );

define( "DATA_FILE", "user_data.csv.php" );
define( "TEMP_FILE", "user_data.temp" );

define( "MAX_UPLOAD_SIZE", (10 * 1024 * 1024) );

// Initializing status variables to assign later success/error codes
$_dataStatus = 1;
$_fileStatuses = array();
$_files = array();
$_filesUserNames = array();
for( $i = 0 ; $i < NUM_FILES ; $i++ ) {
	array_push( $_fileStatuses, 0 );	
	array_push( $_files, '' );	
	array_push( $_filesUserNames, '' );	
}

storeData();

// Creating the response, holding statuses of operations 
$_response = "dataStatus=" . $_dataStatus;
for( $i = 0 ; $i < NUM_FILES ; $i++ ) {
	$_response .= ", file" . $i . "Status=" . $_fileStatuses[$i];
	$_response .= ", file" . $i . "=" . $_files[$i];
	$_response .= ", file" . $i . "Name=" . $_filesUserNames[$i];
}
echo( $_response );

if( $_dataStatus == 1 || in_array(1, $_fileStatuses) ) { 	// Updating download status file to indicate user entered data that hasn't been transfered into Spider yet...
	$fileHandle = fopen( 'download.ini', 'w' ); 			// .. opening "download.ini" file...
	if( $fileHandle != FALSE ) {							// ... if succeeded ...
		fwrite( $fileHandle, "loaded=0" );  
		fclose( $fileHandle );					
	}
}

exit(0);

// Stores a line and uploads/deletes the file(s) if required
function storeLine($handle, $code, $lnumber, $parent, $data, $fnames, $unames, $factions) {
	$line = $code . "\t" . $lnumber . "\t" . $parent;
	foreach( $data as $key => $value ) {
		$line .= "\t";
		$line .= $value;
	}

	$fileNamesColumn = "";
	$userFileNamesColumn = "";
	$splitter = "";
	for( $i = 0 ; $i < NUM_FILES ; $i++ ) {
		if( $factions[$i] == 'upload-file' ) {
			$userFileName = getUploadFile( $i );
			if( strlen( $userFileName ) > 0 ) {		// Confirming there is a file to upload
				deleteFile( $fnames[$i], $i );      // Deleting a one uploaded previsously, if exists
				$shortFileName = createFileName( $code, $lnumber, $data, $i ); 	// Getting the name of the file to upload 	
				$status = uploadFile( $shortFileName, $i, $userFileName );
				if( $status == 0 ) {
					$fileNamesColumn .= $splitter . $shortFileName;
					$userFileNamesColumn .= $splitter . $userFileName;
				} else {
					$fileNamesColumn .= $splitter;
					$userFileNamesColumn .= $splitter;
				}
			} 
		} else if( $factions[$i] == 'delete-file' )  {
			deleteFile( $fnames[$i], $i );
			$fileNamesColumn .= $splitter;
			$userFileNamesColumn .= $splitter;
		} else {
			$fileNamesColumn .= $splitter . $fnames[$i];
			$userFileNamesColumn .= $splitter . $unames[$i];
		}
		$splitter = FILENAME_SPLITTER;
	}
	$line .= "\t" . $fileNamesColumn . "\t" . $userFileNamesColumn;			
	$line = preg_replace('/[\r\n]/', chr(1), $line);
	$line = preg_replace('/[\n]/', chr(1), $line);
	$line = preg_replace('/[\r]/', chr(1), $line);
	if( fputs($handle, $line . "\n") == FALSE ) {
		return -1;
	}
	return 0;
}


// Creates a new "user-data" file and saves data into
function storeNew( $code, $lnumber, $parent, $data, $fnames, $unames, $factions ) {
	$status = -1;

	$handle = fopen( DATA_FILE, 'w' );
	if( $handle ) {
		$status = fputs( $handle, AUTH_SCRIPT  . "\n" ); 	// "Auth" script for security

		$columnTitles = "Code\t" . LINE_NUMBER_KEY . "\t" . PARENT_OPERATION_KEY; // The header: Code f_WebExportLineNumber ... f_File			
		foreach( $data as $key => $value ) {
			$columnTitles .= "\t";
			$columnTitles .= $key;
		}
		$columnTitles .= "\t" . FILENAME_COLUMN;
		$columnTitles .= "\t" . USERFILENAME_COLUMN;
		fputs( $handle, $columnTitles . "\n" );  

		$status = storeLine( $handle, $code, $lnumber, $parent, $data, $fnames, $unames, $factions );		// A new and the only line
		fclose( $handle );
	}
	return $status;
}


// Inserts new data into the existing user-data file
function storeWithInsertion( $code, $lnumber, $parent, $data, $fnames, $unames, $factions ) {
	$status = -1;

	$srcHandle = fopen( DATA_FILE, 'r' ); 			// .. opening "download.ini" file...
	$dstHandle = fopen( TEMP_FILE, 'w' ); 			// .. opening "download.ini" file...
	
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
				$status = storeLine( $dstHandle, $code, $lnumber, $parent, $data, $fnames, $unames, $factions );
				$inserted = TRUE;
			} else {
				fputs( $dstHandle, $line );
			}
		}
		if( !$inserted ) {
			$status = storeLine( $dstHandle, $code, $lnumber, $parent, $data, $fnames, $unames, $factions );
		}
	} 
	if( $dstHandle != FALSE ) { 
		fclose( $dstHandle );					
	}
	if( $srcHandle != FALSE ) { 
		fclose( $srcHandle );					
	}

	if( $status == 0 ) {
		if( rename( TEMP_FILE, DATA_FILE ) == FALSE ) {
			$status = -1;
		}
	}
	return $status;
}


function storeData() {
	global $_dataStatus;
	$_dataStatus = -1;

	// Check if the form was submitted
	if($_SERVER["REQUEST_METHOD"] != "POST") {
		return;
	}
	if( !isset( $_POST['data'] ) ) {
		return;
	}

	$json = json_decode( stripslashes($_POST['data']) );

	if( !isset( $json->operationCode ) || !isset( $json->lineNumber ) || !isset( $json->parentOperation ) || !isset( $json->data ) ) {	
		return;
	}

	$fileActions = array();
	$fileNames = array();
	$fileUserNames = array();
	for( $i = 0 ; $i < NUM_FILES ; $i++ ) {
		$key = "file".$i."Action";
		if( isset( $json->$key ) ) {
			array_push( $fileActions, $json->$key );
		} else {
			array_push( $fileActions, "" );
		}

		$key = "file".$i."Name";
		if( isset( $json->$key ) ) {
			array_push( $fileNames, $json->$key );
		} else {
			array_push( $fileNames, "" );
		}

		$key = "file".$i."UserName";
		if( isset( $json->$key ) ) {
			array_push( $fileUserNames, $json->$key );
		} else {
			array_push( $fileUserNames, "" );
		}
	}

	$storeStatus = -1;
	if( !file_exists( DATA_FILE ) ) {
		$storeStatus = storeNew( $json->operationCode, $json->lineNumber, $json->parentOperation, $json->data, $fileNames, $fileUserNames, $fileActions );
	} else {
		$storeStatus = storeWithInsertion( $json->operationCode, $json->lineNumber, $json->parentOperation, $json->data, $fileNames, $fileUserNames, $fileActions );
	}

	$_dataStatus = ($storeStatus == 0) ? 1 : -1;
	return;
}


// Uploads a file onto a server
function uploadFile( $newFileName, $index, $userFileName ) {
	global $_fileStatuses, $_files, $_filesUserNames;

	$_fileStatuses[$index] = -1;

    // $fileType = $_FILES["file".$index]["type"];
    $fileSize = $_FILES["file".$index]["size"];

	if($fileSize > MAX_UPLOAD_SIZE) {
		return -1;
	}

	if( !file_exists(FILE_FOLDER) ) {
    	if( !mkdir(FILE_FOLDER, 0777, true) ) {
			return -1;
		}
	}
	if( lockFilesDirectory() == -1 ) {
		return -1;
	}

   	$status = move_uploaded_file( $_FILES["file".$index]["tmp_name"], FILE_FOLDER . DIRECTORY_SEPARATOR . $newFileName );
	if( $status != TRUE ) {
		return -1;
	} 
	
	$_fileStatuses[$index] = 1;
	$_files[$index] = $newFileName;
	$_filesUserNames[$index] = $userFileName;
	return 0;
}


// Confirms there is a file to upload
function getUploadFile($index) {
	if( !isset( $_FILES["file".$index] ) ) {
		return "";
	}
	if( !isset( $_FILES["file".$index]["name"] ) ) {
		return "";
	}
	$userFileName = $_FILES["file".$index]["name"];
	if( !(strlen( $userFileName ) > 0) ) {
		return "";
	}
	if( $_FILES["file".$index]["error"] != 0 ) {
		return "";
	}
	return $userFileName;
}


function deleteFile( $shortFileName, $index ) {
	global $_fileStatuses, $_files;

	//logTxt($fileName);

	$fileName = FILE_FOLDER . DIRECTORY_SEPARATOR . $shortFileName;
	if( file_exists($fileName) ) {
		unlink($fileName);
	}
	$_fileStatuses[$index] = 1;
	$_files[$index] = '';
}


// Generates the name for it
function createFileName( $code, $lnumber, $data, $index, $ext=null ) {
	if( $ext == null ) {
	    $ext = pathinfo($_FILES["file".$index]["name"], PATHINFO_EXTENSION);
		if( !( strlen($ext) > 0 ) ) {
			$ext='dat';
		} else {
			$ext = strtolower($ext);
			if( $ext == "php" ) { 		// To prevent uploading php-scripts
				$ext = "dat";
			}
		}
	}
	$fileName = $lnumber . "_" . $index . "." . $ext;
	return $fileName;	
}


function lockFilesDirectory() {
	$retVal = -1;
    $fileContent = "<FilesMatch \"^.*$\">\nOrder allow,deny\nDeny from all\n</FilesMatch>";
    $fileName = FILE_FOLDER . DIRECTORY_SEPARATOR . '.htaccess';

	if( file_exists( $fileName ) ) {
		$retVal = 0;
	} else {	
		$fp = fopen( $fileName, 'w' );
		if( $fp != FALSE ) {
			fputs( $fp, $fileContent );
			fclose( $fp );
			$retVal = 0;
		}
	}
	return $retVal;
}

function logTxt( $txt ) {
	$fp = fopen('log.txt', 'a' );
	fputs( $fp, $txt . "\n" );
	fclose($fp);
}

?>