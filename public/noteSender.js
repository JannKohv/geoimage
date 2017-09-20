
function sendNote()
{
   console.info("Sending note...");
   
   var apiUrl = "https://7jh1oyilh9.execute-api.us-east-2.amazonaws.com/prod/notes";
   
	$(document).ready(function(){

		$.post(apiUrl, {
		  "content": "test note send 1",
		  "attachment": ""
		}, 
		function(serverResponse)
		{

		  console.info("Response: " + serverResponse);
		
		  //do what you want with server response

		})

	})

}

const sendNoteTest = function()
{
   sendNote();	
}

