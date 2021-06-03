// const goodCampground = JSON.parse(campground);
// mapboxgl.accessToken = 'pk.eyJ1IjoibWhyaXlhZCIsImEiOiJja25qNXY1MTMwMm5yMnhqeDAwcXpjZjA2In0.44Wv7AGmRALkN67mI-rgjQ';
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v9', // style URL
    // center: campground.geometry.coordinates, // starting position [lng, lat]
    center: campground.geometry.coordinates,
    zoom: 12 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${campground.title}</h3>`
        )
    )
    .addTo(map)
