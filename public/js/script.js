const socket = io();  // This line connects your browser (client) to the server using Socket.IO.

if(navigator.geolocation){  // Checking for User Location Access, navigator.geolocation is a built-in browser feature.
    navigator.geolocation.watchPosition((position) => {  // watchPosition keeps tracking the user’s location (not just once, but continuously — like a GPS tracker). It gives you the position object again and again whenever the location changes.
        const { latitude, longitude } = position.coords
        socket.emit("send-location", { latitude, longitude })  // This line sends the user's location to the server through Socket.IO, "send-location" is the event name — the server must be listening for this event. { latitude, longitude } is the data you're sending.
    }, (error) => {
        console.log(error)
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,  // no caching will be done, means we will need instataneous data
        timeout: 2000,
    }
);
}


const map = L.map("map").setView([0, 0], 16);  // from leaflet we can use L.map, to ask permissions for location permissions, it Creates a map in the HTML element with id="map".

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Vivek Birmani"
}).addTo(map)


const markers = {};

socket.on("recieve-location", (data) => {
    const { id, longitude, latitude } = data;
    map.setView([latitude, longitude], 16)
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
});


socket.on("user-disconnected", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})