
function getLocation()
{
  console.info("GetLocation now");
	
  if (navigator.geolocation) 
  {
    navigator.geolocation.getCurrentPosition(success, error);
  } 
  else 
  { 
    error('not supported');
  }
}

success = function(position) 
{
  var positionText = "Position found: " + position.coords.latitude + ", " + position.coords.longitude;
  
  console.info(positionText);
  
  var resultEl = document.querySelector("#geoLocation");
  resultEl.innerHTML = positionText;
  
}

error = function(msg) 
{
  console.info(msg);
}





 


