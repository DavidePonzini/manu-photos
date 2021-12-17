let map;
const MAX_ZOOM = 16;


function init() {
  initMap();
  read_photos();
}



function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: { lat: 44.4030182, lng: 8.9484311 },
  });
}



function read_photos() {
  $.ajax({
    url: '/data',
    success: addMarkers,
    error: console.log
  });
}



function addMarkers(photos) {
  photos = JSON.parse(photos);

  // Create markers from photo data
  const markers = photos.filter(hasGpsData).map(createMarker);

  // Add a marker clusterer to manage the markers.
  const markerCluster = new MarkerClusterer(map, markers, {
    imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    zoomOnClick: false,
    minimumClusterSize: 2
  });

  google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster) {
    map.setCenter(cluster.getCenter());

    // Zoom map if necessary, otherwise show all photos
    if(map.getZoom() < MAX_ZOOM)
      map.setZoom(map.getZoom()+2);
    else
      showPhotos(cluster.getMarkers().map(marker => {
        return marker.photo;
      }));
  });
}



function hasGpsData(photo) {
  return photo.gps.lat && photo.gps.lng;
}



function createMarker(photo) {
  let marker = new google.maps.Marker({
    position: {
      lat: photo.gps.lat,
      lng: photo.gps.lng
    },
    photo: photo
  });

  marker.addListener("click", () => {
    showPhotos([marker.photo]);
  });

  return marker;
}



function showPhotos(photos) {
  let gallery = $('#gallery')

  photos.forEach(photo => {
    let img = $('<img>').attr("src", `/photos/${photo.filename}`);

    gallery.append(img);
  })

  gallery.show();
}
