'use strict';
window.onload = loadMap;

///////////key variables for app to function///////////
var center = {lat: 44.9552873,lng: -93.3176149}
var accuweather = "g6xbpzaUcD1tGUMICwbwZcHSqzQQ4zp1";
var googleID = "AIzaSyCOQXx5vDbUdJwzFRGhOdaE9vYFIKxpJPs";
var map;
var loaded = 0;
/////////set locations///////////
var locations = [
  {name: "The Mall of America", address: "60 E Broadway, Bloomington, MN 55425", website: "www.mallofamerica.com", position: {lat: 44.8548651, lng: -93.2444035}},
  {name: "Minnehaha Falls", address: "4801 S Minnehaha Park, Minneapolis, MN 55417", website: "www.minneapolisparks.org", position: {lat: 44.9154592, lng: -93.2092766}},
  {name: "The Sculpture Garden", address: "725 Vineland Pl, Minneapolis, MN 55403", website: "www.walkerart.org", position: {lat: 44.9699808, lng: -93.2891868}},
  {name: "U.S. Bank Stadium", address: "401 Chicago Ave, Minneapolis, MN 55415", website: "www.usbankstadium.com", position: {lat: 44.971863, lng: -93.2561852}},
  {name: "First Avenue", address: "701 N 1st Ave, Minneapolis, MN 55403", website: "www.first-avenue.com", position: {lat: 44.978702, lng: -93.2760631}},
  {name: "Fat Lorenzo's", address: "5600 Cedar Ave S, Minneapolis, MN 55417", website: "www.fatlorenzos.com", position: {lat: 44.9008211, lng: -93.2475324}},
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

///////allows googlemaps script to run from javascript file////////////
function loadMap() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&key=' + googleID + '&callback=startMap';
    document.body.appendChild(script);
}
//////viewModel function that runs through KO to set markers and allow the list to function when clicked////////////
var viewModel = function() {
    var self = this;

    self.markers = ko.observableArray();
    self.filter = ko.observable('');
    var largeInfo = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    var icon = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'

    //////sets new marker for each location////////
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].position;
        var title = locations[i].name;
        var address = locations[i].address;
        var url = locations[i].website;
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            address: address,
            url: url,
            icon: icon,
            animation: google.maps.Animation.DROP,
            streetViewImage: determineImage(i)
        });
        self.markers.push(marker);
        marker.addListener('click', function() {
            self.navInfo(this);
        });
        //////clicking on list or marker calls this function//////
        self.navInfo = function(value) {
            populateInfoWindow(value, largeInfo, bounds, icon);
        };

        bounds.extend(marker.position);
    }
    map.fitBounds(bounds);
    //////filters locations for search////
    self.navLocation = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            return self.markers();
        } else {
            return ko.utils.arrayFilter(self.markers(), function(item) {
                return item.title.toLowerCase().indexOf(filter) > -1;
            });
        }
    }, self);
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
    }, 1500);
    ////////////////Make sure the marker property is cleared if the infowindow is closed//////////
    largeInfo.addListener('closeclick', function() {
        mark.setIcon(icon);
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;

    largeInfo.setContent('<img src="' + mark.streetViewImage + '" width= "180" height = "90"><br> <div><strong>' +
        mark.title + '</strong><br><hr style="margin-bottom: 5px"><p>' +
        mark.address + '<br></p><a class="web-links" href="http://' + mark.url +
        '" target="_blank">' + mark.url + '</a></div><br><p style="font-size:10px">Information provided by Google</p>');
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
var accuwUrl = "http://dataservice.accuweather.com/currentconditions/v1/348794.json?language=en&apikey=" + accuweather;
var accuIcon = "https://apidev.accuweather.com/developers/Media/Default/WeatherIcons/";
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
            list.append('<li><img style="width: 25px" src="' + accuIcon + iconNum + '">' + conditions.WeatherText + '</li>');
            list.append('<li>Temp: ' + temp.Value + '° F</li>');
        } else {
            /////////////Error handling of accuweather///////////
            list.append('<li> Sorry, Accuweather could not load!</li>');
        }
    }
})
