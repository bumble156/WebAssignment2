<?php 
	//Returns JSON data to Javascript file
	header("Content-type:application/json");
	
	//Connect to db 
	$pgsqlOptions = "host='####' dbname='####' user='####' password='####'";
	$dbconn = pg_connect($pgsqlOptions) or die ('connection failure');
	
	//Define sql query
	$query = "SELECT id, name, latitude, longitude, size FROM gy16cwl_ports";

	//Execute query
	$result = pg_query($dbconn, $query) or die ('Query failed: '.pg_last_error());
	
	//Define new array to store results
	$portData = array();
	
	//Loop through query results 
	while ($row = pg_fetch_array($result, null, PGSQL_ASSOC))	{
	
		//Populate portData array 
		$portData[] = array("id" => $row["id"], "name" => $row["name"], "lat" => $row["latitude"], "lon" => $row["longitude"], "size" => $row["size"]);
	}
	
	//Encode portData array in JSON
	echo json_encode($portData); 
	
	//Close db connection
	pg_close($dbconn);
?>
