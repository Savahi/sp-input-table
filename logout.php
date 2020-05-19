<?php

header("HTTP/1.0 401 Unauthorized");

echo "<script>window.location.replace('http://www.spiderproject.com/');</script>";

exit();

?>