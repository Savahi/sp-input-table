<?php 

require('auth.php');

if( isAuthRequired() ) {
	auth(true);
}

define( "FILE_FOLDER", "files" );

$parsedUrl = parse_url( $_SERVER['REQUEST_URI'] );
if( strlen( $parsedUrl['query'] ) > 0 ) {
	$fileName = preg_replace( "/[^0-9a-zA-Z\_\.]/", "", $parsedUrl['query'] );
	if( strlen($fileName) > 0 ) {
		$ext = pathinfo($fileName, PATHINFO_EXTENSION);
		if( strlen($ext) > 0 ) {
			$ext = strtolower($ext);
			if( $ext == 'jpg' || $ext == 'jpeg' || $ext == 'png' || $ext == 'gif' || $ext == 'tiff' || 	$ext == 'bmp' ) {
				$filePath = FILE_FOLDER . DIRECTORY_SEPARATOR . $fileName;
				$fileSize = filesize( $filePath );
				$fp = fopen($filePath, 'rb');
				if( $fp ) {
					if( $ext == 'jpg' ) {
						$ext = 'jpeg';
					}					
					header( "Content-Type: image/" . $ext );
					header( "Content-Length: " . $fileSize );
					fpassthru( $fp );
					fclose( $fp );
				}				
			} 		
		}
	}
}

exit();

?>