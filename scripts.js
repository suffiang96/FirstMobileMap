alert("This site will request your location in order to better serve your spatial needs. Your location information will not be shared or stored for any purposes.");

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
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)  //this adds a marker at the lat and long
        .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet from this point").openPopup(); //this binds a popup to the marker.

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

map.on('locationfound', onLocationFound);

//error message
function onLocationError(e) {
  alert(e.message);
}
map.on('locationerror', onLocationError);

//locator
map.locate( {setView: true, maxZoom: 16});

//basemap switcher
var baseMaps = {
    "Light": light,
    "Dark": dark
};

L.control.layers(baseMaps).addTo(map);
