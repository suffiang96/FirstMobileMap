alert("This site requests your location in order to better serve your spatial needs. Your location data will not be shared or stored for any purposes.");

var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    accessToken: 'pk.eyJ1Ijoic3VmZmlhbmc5NiIsImEiOiJjazJqbzVveXoxMHB1M25waDNmajltdjBzIn0.Rvaq-B6WyZ-s64wKMEdL2Q',
    tileSize: 512,
    zoomOffset: -1,
});

var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        accessToken: 'pk.eyJ1Ijoic3VmZmlhbmc5NiIsImEiOiJjazJqbzVveXoxMHB1M25waDNmajltdjBzIn0.Rvaq-B6WyZ-s64wKMEdL2Q',
        tileSize: 512,
        zoomOffset: -1,
});

var map = L.map('map', {layers:[light]}).fitWorld();

//locationPopup
function onLocationFound(e) {
    var radius = e.accuracy; //this defines a variable radius as the accuracy value returned by the locate method divided by 2. It is divided by 2 because the accuracy value is the sum of the estimated accuracy of the latitude plus the estimated accuracy of the longitude. The unit is meters.

    L.marker(e.latlng).addTo(map)  //this adds a marker at the lat and long returned by the locate function.
        .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet from this point").openPopup(); //this binds a popup to the marker. The text of the popup is defined here as well. Note that we multiply the radius by 3.28084 to convert the radius from meters to feet and that we use Math.round to round the conversion to the nearest whole number.

        if (radius = 100) {
              L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
          }
          else{
              L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
          }

          var times = SunCalc.getTimes(new Date(), e.latitude, e.longitude);
          var sunrise = times.sunrise.getHours();
          var sunset = times.sunset.getHours();


          var currentTime = new Date().getHours();
              if (sunrise < currentTime && currentTime < sunset){
                map.removeLayer(dark);
                map.addLayer(light);
              }
              else {
                map.removeLayer(light);
                map.addLayer(dark);
              }
}

map.on('locationfound', onLocationFound); //this is the event listener

//error message
function onLocationError(e) {
  alert(e.message);
}
map.on('locationerror', onLocationError);

//locator
map.locate({setView: true, maxZoom: 16});

var baseMaps = {
    "Light": light,
    "Dark": dark
};

L.control.layers(baseMaps).addTo(map);
