var map;
var markersArray = [];

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
        '&key=AIzaSyCOQXx5vDbUdJwzFRGhOdaE9vYFIKxpJPs&callback=initialize';
    document.body.appendChild(script);
}
window.onload = loadScript;

//Initialize the map and its contents
function initialize() {
    var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(44.9552873, -93.3176149),
        mapTypeControl: false,
        disableDefaultUI: true
    };
    if ($(window).width() <= 1080) {
        mapOptions.zoom = 11;
    }
    if ($(window).width() < 850 || $(window).height() < 595) {
        hideNav();
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    setMarkers(markers);

    setAllMap();

    //Reset map on click handler and
    //when window resize conditionals are met
    function resetMap() {
        map.setZoom(11);
        map.setCenter(mapOptions.center);
    }
    $("#reset").click(function() {
        resetMap();
    });
    $(window).resize(function() {
        resetMap();
    });
}

//Determines if markers should be visible
//This function is passed in the knockout viewModel function
function setAllMap() {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].boolTest === true) {
            markers[i].holdMarker.setMap(map);
        } else {
            markers[i].holdMarker.setMap(null);
        }
    }
}

//Information about the different locations
//Provides information for the markers
var markers = [{
    title: "The Mall of America",
    lat: 44.8548651,
    lng: -93.2444035,
    streetAddress: "60 E Broadway",
    cityAddress: "Bloomington, MN 55425",
    url: "mallofamerica.com",
    id: "nav0",
    visible: ko.observable(true),
    boolTest: true
}, {
    title: "Minnehaha Falls",
    lat: 44.9154592,
    lng: -93.2092766,
    streetAddress: "4801 S Minnehaha Park Dr",
    cityAddress: "Minneapolis, MN 55417",
    url: "minneapolisparks.org",
    id: "nav1",
    visible: ko.observable(true),
    boolTest: true
}, {
    title: "The Sculpture Garden",
    lat: 44.9699808,
    lng: -93.2891868,
    streetAddress: "725 Vineland Pl",
    cityAddress: "Minneapolis, MN 55403",
    url: "walkerart.org",
    id: "nav2",
    visible: ko.observable(true),
    boolTest: true
}, {
    title: "U.S. Bank Stadium",
    lat: 44.971863,
    lng: -93.2561852,
    streetAddress: "401 Chicago Ave",
    cityAddress: "Minneapolis, MN 55415",
    url: "usbankstadium.com",
    id: "nav3",
    visible: ko.observable(true),
    boolTest: true
}, {
    title: "First Avenue",
    lat: 44.978702,
    lng: -93.2760631,
    streetAddress: "701 N 1st Ave",
    cityAddress: "Minneapolis, MN 55403",
    url: "first-avenue.com",
    id: "nav4",
    visible: ko.observable(true),
    boolTest: true
}];

//Get Google Street View Image for each inidividual marker
//Passed lat and lng to get each image location
//no image avaible for the falls so i found another
var headingImageView = [5, 0, 5, 337, 171];
var streetViewImage;
var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';

function determineImage() {
    if (i == 1) {
        streetViewImage = 'http://www.minnesotamonthly.com/Blogs/Minnesota-Journeys/April-2014/Minnehaha-Falls-At-Its-Scenic-Best-in-Spring/Minnehaha01.jpg';
    } else {
        streetViewImage = streetViewUrl +
            markers[i].lat + ',' + markers[i].lng +
            '&fov=75&heading=' + headingImageView[i] + '&pitch=10';
    }
}

//Sets the markers on the map within the initialize function
//Sets the infoWindows to each individual marker
//The markers are inidividually set using a for loop
function setMarkers(location) {

    for (i = 0; i < location.length; i++) {
        location[i].holdMarker = new google.maps.Marker({
            position: new google.maps.LatLng(location[i].lat, location[i].lng),
            map: map,
            title: location[i].title,
            icon: {
                url: 'img/marker.png',
                size: new google.maps.Size(25, 40),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(12.5, 40)
            },
            shape: {
                coords: [1, 25, -40, -25, 1],
                type: 'poly'
            }
        });

        //function to place google street view images within info windows
        determineImage();

        //Binds infoWindow content to each marker
        location[i].contentString = '<img src="' + streetViewImage +
            '" width= "180" height = "90" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 5px"><strong>' +
            location[i].title + '</strong><br><p>' +
            location[i].streetAddress + '<br>' +
            location[i].cityAddress + '<br></p><a class="web-links" href="http://' + location[i].url +
            '" target="_blank">' + location[i].url + '</a>';

        var infowindow = new google.maps.InfoWindow({
            content: markers[i].contentString
        });

        //Click marker to view infoWindow
        //zoom in and center location on click
        new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(location[i].contentString);
                infowindow.open(map, this);
                var windowWidth = $(window).width();
                if (windowWidth <= 1080) {
                    map.setZoom(14);
                } else if (windowWidth > 1080) {
                    map.setZoom(16);
                }
                map.setCenter(marker.getPosition());
                location[i].picBoolTest = true;
            };
        })(location[i].holdMarker, i));

        //Click nav element to view infoWindow
        //zoom in and center location on click
        var searchNav = $('#nav' + i);
        searchNav.click((function(marker, i) {
            return function() {
                infowindow.setContent(location[i].contentString);
                infowindow.open(map, marker);
                map.setZoom(16);
                map.setCenter(marker.getPosition());
                location[i].picBoolTest = true;
            };
        })(location[i].holdMarker, i));
    }
}

//Query through the different locations from nav bar with knockout.js
//only display markers and nav elements that match query result
var viewModel = {
    query: ko.observable(''),
};

viewModel.markers = ko.dependentObservable(function() {
    var self = this;
    var search = self.query().toLowerCase();
    return ko.utils.arrayFilter(markers, function(marker) {
        if (marker.title.toLowerCase().indexOf(search) >= 0) {
            marker.boolTest = true;
            return marker.visible(true);
        } else {
            marker.boolTest = false;
            setAllMap();
            return marker.visible(false);
        }
    });
}, viewModel);

ko.applyBindings(viewModel);

//show $ hide markers in sync with nav
$("#input").keyup(function() {
    setAllMap();
});

//Hide and Show entire Nav/Search Bar on click
// Hide/Show Bound to the arrow button
//Nav is repsonsive to smaller screen sizes
var isNavVisible = true;

function noNav() {
    $("#search-nav").animate({
        height: 0,
    }, 500);
    setTimeout(function() {
        $("#search-nav").hide();
    }, 500);
    $("#arrow").attr("src", "img/down-arrow.gif");
    isNavVisible = false;
}

function yesNav() {
    $("#search-nav").show();
    var scrollerHeight = $("#scroller").height() + 55;
    if ($(window).height() < 600) {
        $("#search-nav").animate({
            height: scrollerHeight - 100,
        }, 500, function() {
            $(this).css('height', 'auto').css("max-height", 439);
        });
    } else {
        $("#search-nav").animate({
            height: scrollerHeight,
        }, 500, function() {
            $(this).css('height', 'auto').css("max-height", 549);
        });
    }
    $("#arrow").attr("src", "img/up-arrow.gif");
    isNavVisible = true;
}

function hideNav() {
    if (isNavVisible === true) {
        noNav();

    } else {
        yesNav();
    }
}
$("#arrow").click(hideNav);

//Hide Nav if screen width is resized to < 850 or height < 595
//Show Nav if screen is resized to >= 850 or height is >= 595
//Function is run when window is resized
$(window).resize(function() {
    var windowWidth = $(window).width();
    if ($(window).width() < 850 && isNavVisible === true) {
        noNav();
    } else if ($(window).height() < 595 && isNavVisible === true) {
        noNav();
    }
    if ($(window).width() >= 850 && isNavVisible === false) {
        if ($(window).height() > 595) {
            yesNav();
        }
    } else if ($(window).height() >= 595 && isNavVisible === false) {
        if ($(window).width() > 850) {
            yesNav();
        }
    }
});

//Expand .forecast div on click to see Weather Underground forecast
//and shrink back when additionally clicked
//size is repsonsive to smaller screens
var weatherContainer = $("#weather-image-container");
var isWeatherVisible = false;
weatherContainer.click(function() {
    if (isWeatherVisible === false) {
        if ($(window).width() < 670) {
            $(".forecast li").css("display", "block");
            weatherContainer.animate({
                width: "245"
            }, 500);
        } else {
            $(".forecast li").css("display", "inline-block");
            weatherContainer.animate({
                width: "380"
            }, 500);
        }
        isWeatherVisible = true;
    } else {
        weatherContainer.animate({
            width: "80"
        }, 500);
        isWeatherVisible = false;
    }
});

//GET Weather Underground JSON
//Append Weather forecast for minneapolis to .forecast
//If error on GET JSON, display message
var weatherUgUrl = "http://api.wunderground.com/api/8b2bf4a9a6f86794/conditions/q/MN/minneapolis.json";

$.getJSON(weatherUgUrl, function(data) {
    var list = $(".forecast ul");
    detail = data.current_observation;
    list.append('<li>Temp: ' + detail.temp_f + '° F</li>');
    list.append('<li><img style="width: 25px" src="' + detail.icon_url + '">  ' + detail.icon + '</li>');
}).error(function(e) {
    $(".forecast").append('<p style="text-align: center;">Sorry! Weather Underground</p><p style="text-align: center;">Could Not Be Loaded</p>');
});

//Hide and show Weather forecast div from screen on click
var isWeatherImageVisible = true;
var hideWeatherArrow = $("#hide-weather").find("img");

function hideWeather() {
    if (isWeatherImageVisible === true) {
        $("#weather-image-container").animate({
            height: 0,
            paddingTop: 0
        }, 300);
        isWeatherImageVisible = false;
        hideWeatherArrow.attr("src", "img/small-down-arrow.png");
    } else {
        $("#weather-image-container").animate({
            height: 60,
            paddingTop: 5
        }, 300);
        isWeatherImageVisible = true;
        hideWeatherArrow.attr("src", "img/small-up-arrow.png");
    }
}

$("#hide-weather").click(hideWeather);
