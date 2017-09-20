import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { invokeApig, s3Upload } from "../libs/awsLib";
import "./NewNote.css";

export default class GeoCamera extends Component 
{
  constructor(props) 
  {
    super(props);

    this.file = null;
	
	this.width = 320;    // We will scale the photo width to this
	this.height = 0;     // This will be computed based on the input stream
	this.streaming = false;

	this.video = null;
	this.canvas = null;
	this.photo = null;
	this.startbutton = null;

    this.state = 
	{
      isLoading: null,
      content: ""
    };
  }
  
  componentDidMount()
  {
	  
     this.initCamera();
	  
  }

  validateForm() 
  {
    return this.state.content.length > 0;
  }

  handleChange = event => 
  {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => 
  {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => 
  {
	  
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) 
	{
      alert("Please pick a file smaller than 5MB");
	  
      return;
    }

    this.setState({ isLoading: true });

    try 
	{
	  const uploadedFilename = this.file ? (await s3Upload(this.file)).Location : null;	
		
	  console.info("Uploaded filename: '" + uploadedFilename + "'");
		
      await this.createNote({
        content: this.state.content,
		attachment: uploadedFilename
      });
	  
      this.props.history.push("/");
	  
    } 
	catch (e) 
	{
      alert(e);
      this.setState({ isLoading: false });
    }
  }
  
  getLocation()
  {
     console.info("Check!");
	 
	 var success = function(position) 
	 {
	   var positionText = "Position found: " + position.coords.latitude + ", " + position.coords.longitude;
	  
	   console.info(positionText);
	  
	   var resultEl = document.querySelector("#geoLocation");
	   resultEl.innerHTML = positionText;
	  
	 }

	 var error = function(msg) 
	 {
	   console.info(msg);
	 }  
	 
     if (navigator.geolocation) 
     {
        navigator.geolocation.getCurrentPosition(success, error);
     } 
     else 
     { 
        error('not supported');
     }
  }
  
  initCamera()
  {
    console.info("Initing camera...");
	
	this.video = document.getElementById('video');
	this.canvas = document.getElementById('canvas');
	this.photo = document.getElementById('photo');
	this.startbutton = document.getElementById('startbutton');
	
	let video = this.video;
	let canvas = this.canvas;
	let photo = this.photo;
	let startbutton = this.startbutton;

	console.info("Video: " + this.video + ", Canvas: " + this.canvas + ", Photo: " + this.photo + ", Start: " + this.startbutton);
	
	navigator.getMedia = ( navigator.getUserMedia ||
							   navigator.webkitGetUserMedia ||
							   navigator.mediaDevices.getUserMedia ||
							   navigator.msGetUserMedia);
    
	if (this.video != null && this.canvas != null && this.photo != null)
	{
		navigator.getMedia(
		{
			video: true,
			audio: false
		}, 
		function(stream) 
		  {
			console.info("Stream initialized: " + stream);
			
		    var vendorURL = window.URL || window.webkitURL;

		    video.src = vendorURL.createObjectURL(stream);
			
		    video.play();

		  }, 
		function(err) 
		  {
			console.log("An error occured! " + err);
		  }
		);
		
		let clearFunction = this.clearphoto;
		let takePictureFunction = this.takepicture;

		this.startbutton.addEventListener('click', takePictureFunction);
		
		this.video.addEventListener('canplay', function(ev)
		{
			  
		  if (!this.streaming) 
		  {
			this.height = video.videoHeight / (video.videoWidth / this.width);
			  
			if (isNaN(this.height)) 
			{
			  this.height = this.width / (4/3);
			}
			  
			video.setAttribute('width', this.width);
			video.setAttribute('height', this.height);
			canvas.setAttribute('width', this.width);
			canvas.setAttribute('height', this.height);
			this.streaming = true;
			
		  }
		
		  clearFunction();
		  
		});
		
	}
	else
	{
		console.info("Elements not initialized, init aborted.");
	}

  }

  clearphoto() 
  {
	 var canvas = document.getElementById('canvas');
	 var photo = document.getElementById('photo');
     var context = canvas.getContext('2d');
	 
	 context.fillStyle = "#AAA";
	 context.fillRect(0, 0, canvas.width, canvas.height);

	 var data = canvas.toDataURL('image/png');
	 photo.setAttribute('src', data);
  }
	  
  takepicture() 
  {
	var video = document.getElementById('video');
	var canvas = document.getElementById('canvas');
	var photo = document.getElementById('photo');

    var context = canvas.getContext('2d');
	var width = video.getAttribute('width');
	var height = video.getAttribute('height');
		
	if (width && height) 
	{
	  canvas.width = width;
	  canvas.height = height;
	  context.drawImage(video, 0, 0, width, height);
	
	  var data = canvas.toDataURL('image/png');
	  photo.setAttribute('src', data);
	} 
	else 
	{
	  this.clearphoto();
	}
  }
  
  createNote(note) 
  {
	  
    return invokeApig({
      path: "/notes",
      method: "POST",
      body: note
    });
  }

  render() 
  {
	 
     return (
      <div className="GeoCamera">
	    
	    <button onClick={this.getLocation}>Get location</button>
	    <div id="geoLocation"></div>
		
        <div>
           <video id="video" src="" width="320" height="240">Video stream not available.</video>
           <button id="startbutton">Take photo</button> 
        </div>
	 
        <canvas id="canvas" width="320" height="240">
        </canvas>
	 
        <div>
           <img id="photo" alt="The screen capture will appear in this box." src=""></img>
        </div>

	  </div>	 
	 );
  }
}
