'use strict';

///////////key variables for app to function///////////
var center = {lat: 44.9552873,lng: -93.3176149},
    googleID = "AIzaSyCOQXx5vDbUdJwzFRGhOdaE9vYFIKxpJPs",
    map,
    loaded = 0;

/////////set locations///////////
var locations = [
  {name: "The Mall of America", address: "60 E Broadway, Bloomington, MN 55425", website: "www.mallofamerica.com", position: {lat: 44.8548651, lng: -93.2444035}},
  {name: "Minnehaha Falls", address: "4801 S Minnehaha Park, Minneapolis, MN 55417", website: "www.minneapolisparks.org", position: {lat: 44.9154592, lng: -93.2092766}},
  {name: "Sculpture Garden", address: "725 Vineland Pl, Minneapolis, MN 55403", website: "www.walkerart.org", position: {lat: 44.9699808, lng: -93.2891868}},
  {name: "US Bank Stadium", address: "401 Chicago Ave, Minneapolis, MN 55415", website: "www.usbankstadium.com", position: {lat: 44.971863, lng: -93.2561852}},
  {name: "First Avenue Minneapolis", address: "701 N 1st Ave, Minneapolis, MN 55403", website: "www.first-avenue.com", position: {lat: 44.978702, lng: -93.2760631}},
  {name: "Fat Lorenzos", address: "5600 Cedar Ave S, Minneapolis, MN 55417", website: "www.fatlorenzos.com", position: {lat: 44.9008211, lng: -93.2475324}},
  {name: "Paisley Park", address: "7801 Audubon Rd, Chanhassen, MN 55317", website: "www.officialpaisleypark.com", position: {lat: 44.8618172, lng: -93.5613845}}
];

///////custom style of map//////////
var styles = [
  {"elementType":"geometry","stylers":[{"color":"#ebe3cd"}]},
  {"elementType":"labels.text.fill","stylers":[{"color":"#523735"}]},
  {"elementType":"labels.text.stroke","stylers":[{"color":"#f5f1e6"}]},
  {"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#c9b2a6"}]},
  {"featureType":"administrative.land_parcel","elementType":"geometry.stroke","stylers":[{"color":"#dcd2be"}]},
  {"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#ae9e90"}]},
  {"featureType":"administrative.neighborhood","stylers":[{"visibility":"off"}]},
  {"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},
  {"featureType":"poi","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},
  {"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},
  {"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#93817c"}]},
  {"featureType":"poi.business","stylers":[{"visibility":"off"}]},
  {"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#a5b076"}]},
  {"featureType":"poi.park","elementType":"labels.text","stylers":[{"visibility":"off"}]},
  {"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#447530"}]},
  {"featureType":"road","elementType":"geometry","stylers":[{"color":"#f5f1e6"}]},
  {"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},
  {"featureType":"road.arterial","stylers":[{"visibility":"off"}]},
  {"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#fdfcf8"}]},
  {"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#f8c967"}]},
  {"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#e9bc62"}]},
  {"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},
  {"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#e98d58"}]},
  {"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"color":"#db8555"}]},
  {"featureType":"road.local","stylers":[{"visibility":"off"}]},
  {"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#806b63"}]},
  {"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},
  {"featureType":"transit.line","elementType":"labels.text.fill","stylers":[{"color":"#8f7d77"}]},
  {"featureType":"transit.line","elementType":"labels.text.stroke","stylers":[{"color":"#ebe3cd"}]},
  {"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},
  {"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#b9d3c2"}]},
  {"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"off"}]},
  {"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#92998d"}]}
];

////handles making the markers and properties of the markers////
var Pin = function(map, icon, i, name, address, website, position) {

  this.title = name;
  this.address = address;
  this.url = website;
  this.position = position;

  var marker = new google.maps.Marker({
     map: map,
     title: this.title,
     address: this.address,
     url: this.url,
     position: this.position,
     icon: icon,
     animation: google.maps.Animation.DROP,
     visible: false,
     streetViewImage: determineImage(i)
  });

  this.isVisible = ko.observable(false);

  this.isVisible.subscribe(function(currentState) {
    if (currentState) {
      marker.setVisible(true);
    } else {
      marker.setVisible(false);
    }
  });

  marker.addListener('click', function() {
    ///////////set flickr images for specific location!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      flickrLocation = encodeURIComponent(this.title.trim());
      flickrLat = position.lat;
      flickrLng = position.lng;
      imagesAreSet = false;
      viewModel.navInfo(marker);
  });

  this.navClick = function() {
    ///////////set flickr images for specific location!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      flickrLocation = encodeURIComponent(this.title.trim());
      flickrLat = position.lat;
      flickrLng = position.lng;
      imagesAreSet = false;
		viewModel.navInfo(marker);
	};
}

//////viewModel function that runs through KO to set markers and allow the list to function when clicked////////////
function viewModel() {
    var self = this;
    self.filter = ko.observable('');
    var bounds = new google.maps.LatLngBounds();
    var largeInfo = new google.maps.InfoWindow();
    var icon = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    var markers = ko.observableArray();

    //////clicking on list or marker calls this function////////
    viewModel.navInfo = function(data) {
      populateInfoWindow(data, largeInfo, bounds, icon);
    };

    //////sets new marker for each location////////
    viewModel.placeMarkers = ko.computed(function() {
    for (var i = 0; i < locations.length; i++) {
      markers()[i] = new Pin(map, icon, i, locations[i].name, locations[i].address, locations[i].website, locations[i].position);
        bounds.extend(markers()[i].position);
    }
    map.fitBounds(bounds);
    google.maps.event.addDomListener(window, 'resize', function() {
      map.fitBounds(bounds);
    });
  });

    //////filters locations for search/////
    viewModel.navLocation = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
          ko.utils.arrayForEach(markers(), function(item) {
            item.isVisible(true);
          });
          return markers();
        } else {
          return ko.utils.arrayFilter(markers(), function(item) {
      			var result = item.title.toLowerCase().indexOf(filter) > -1;
            item.isVisible(result);
            largeInfo.close();
      			return result;
          });
        }
    });
}

function populateInfoWindow(mark, largeInfo, bounds, icon) {
    //////opens info window about location and zooms the map to the location while changing the icon/////
    map.setZoom(15);
    map.setCenter(mark.getPosition());
    mark.setIcon('https://maps.google.com/mapfiles/ms/icons/green-dot.png');
    mark.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        mark.setAnimation(null);
        mark.setIcon(icon);
    }, 1400);
    ////////////////Make sure the marker property is cleared if the infowindow is closed//////////
    largeInfo.addListener('closeclick', function() {
        mark.setIcon(icon);
    });

    largeInfo.setContent('<img src="' + mark.streetViewImage + '" width= "180" height = "90"><br> <div><strong>' +
        mark.title + '</strong><br><hr style="margin-bottom: 5px"><p>' +
        mark.address + '<br></p><a class="web-links" href="http://' + mark.url + '" target="_blank">' +
        mark.url + '</a></div><br><button onclick="infoClick()">See Flickr Photos</button><br>' +
        '<p style="font-size:10px">Information provided by Google</p>');
    ////////////Open the infowindow on the correct marker///////////////////
    largeInfo.open(map, mark);
}

///////////uses the position of the locations to get streetview for the mallofamerica and Minnehaha-Falls a set image is used//////////////
function determineImage(i) {
    var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';
    var heading = [0, 0, 5, 337, 160, 255, 118];
    if (i == 0) {
        return 'http://www.exploreminnesota.com/memberimage.ashx?id=9684&width=645&mar=1';
    }
    if (i == 1) {
        return 'https://www.minnesotamonthly.com/Blogs/Minnesota-Journeys/April-2014/Minnehaha-Falls-At-Its-Scenic-Best-in-Spring/Minnehaha01.jpg';
    } else {
        return streetViewUrl + locations[i].position.lat + ',' + locations[i].position.lng + '&fov=75&heading=' + heading[i] + '&pitch=10';
    }
}

function startMap() {
    map = new google.maps.Map(document.getElementById('map-container'), {
        zoom: 11,
        center: center,
        styles: styles,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    ko.applyBindings(new viewModel());
}

////////////////////////////////////Flickr/////////////////////////////////////////////
var flickrJSON,
    flickrPhotoArray = [],
    flickrLocation,
    flickrLat,
    flickrLng,
    counter = 0,
    imagesAreSet = false;

//Binds the button in the infowindow to open flickr
function infoClick(){
  $(".flickr").css("z-index", "3");
  $(".flickr").show();
  setFlickrImages();
}

//Binds the x button to close flickr
$("#exit-flickr").click(function() {
    $(".flickr").hide();
    imagesAreSet = true;
});

$("#right-arrow").click(forward);
$("#left-arrow").click(backWard);

//GET JSON from flickr
//Display message if error getting flickr JSON
function getFlickrImages() {
		var flickrUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=23a0c4ed44c29e78558d11f9942c9b7f&text='+flickrLocation+'&accuracy=5&lat='+flickrLat+'&lon='+flickrLng+'&format=json';
        $.ajax({
            url: flickrUrl,
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            success: function(data) {
                var photo = data.photos.photo;
                flickrJSON = photo;
            },
            error: function() {
				$('.flickr-image-container').append('<h1 style="text-align: center;">Sorry!</h1><br><h2 style="text-align: center;">Flickr Images Could Not Be Loaded</h2>');
				$("#right-arrow").hide();
				$("#left-arrow").hide();

				}
        });
}

//Get random images from flickr JSON
//Store image data in flickrPhotoArray
//Hide all images except the first
function setFlickrImages() {
	if(imagesAreSet === false) {
    removeFlickrImages();
    getFlickrImages();
		setTimeout(function() {for(var i=0; i < 10; i++) {
			var number = Math.floor((Math.random() * 45) + 1);
			var photo = 'https://farm' + flickrJSON[number].farm + '.staticflickr.com/' + flickrJSON[number].server + '/' + flickrJSON[number].id + '_' + flickrJSON[number].secret + '.jpg';
			flickrPhotoArray.push(photo);
			$('.flickr-images').append('<img id="flickr-image' + i + '" src="' + photo + '" alt="' + flickrJSON[i].title + ' Flickr Image">');
			$("#flickr-image" + i).hide();
      imagesAreSet = true;
			if(i < 1) {
				$("#flickr-image" + i).show();
		}
	}}, 1500);
	} else {
		$("#flickr-image" + counter).show();
	}
}

function removeFlickrImages(){
for(var i=0; i < 10; i++) {
  $("#flickr-image" + i).remove();
}
}

//Bind click handler to arrow button to view next image
function forward() {
	$('#flickr-image' + counter).hide();
	counter += 1;
	if(counter >= 10) {
		counter = 0;
	}
	$('#flickr-image' + counter).fadeIn(300);
}

//Bind click handler to arrow button to view previous image
function backWard() {
	$('#flickr-image' + counter).hide();
	counter -= 1;
	if(counter < 0) {
		counter = 10;
	}
	$('#flickr-image' + counter).fadeIn(300);
}

////////***************************weather api************************************************///////////////
var accuweather = "g6xbpzaUcD1tGUMICwbwZcHSqzQQ4zp1",
    accuwUrl = "https://dataservice.accuweather.com/currentconditions/v1/348794.json?language=en&apikey=" + accuweather,
    accuIcon = "https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/",
    weatherTop = ko.observable(''),
    weatherBottom = ko.observable('');
/////////////////Gets current conditions for the location.////////////
$.ajax({
    type: "GET",
    url: accuwUrl,
    dataType: "jsonp",
    ///////////////Use cache for better reponse times/////////////
    cache: true,
    //////////////Prevent unique callback name for better reponse times/////////
    jsonpCallback: "awxCallback",
    success: function(data) {
        var html;
        if (data && data.length > 0) {
            var conditions = data[0];
            var temp = conditions.Temperature.Imperial;
            var list = $("#forecast ul");
            var iconNum;
            if (conditions.WeatherIcon <= 9) {
                iconNum = '0' + conditions.WeatherIcon + '-s.png'
            } else {
                iconNum = conditions.WeatherIcon + '-s.png'
            }
            weatherTop('<img style="width: 25px" src="' + accuIcon + iconNum + '">' + conditions.WeatherText);
            weatherBottom('Temp: ' + temp.Value + '° F');
            }
        },
        /////////////Error handling of accuweather///////////
    error: function() {
      weatherTop('Sorry, Accuweather could not load!');
      weatherBottom('Reload app to try again!')
    }
})
