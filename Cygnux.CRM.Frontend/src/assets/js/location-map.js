let map, autocomplete, marker;

function initMap() {
  // Initialize the map
  // map = new google.maps.Map(document.getElementById("map"), {
  //   center: { lat: 20.5937, lng: 78.9629 }, // Default center (India)
  //   zoom: 6,
  // });

  // Initialize the autocomplete input
  const input = document.getElementById("search-box");
  autocomplete = new google.maps.places.Autocomplete(input, {
    fields: ["geometry", "formatted_address"],
  });

  // Restrict results to geographical regions (optional)
  autocomplete.setComponentRestrictions({
    country: ["in"], // Change this to your desired country code(s)
  });

  // // Add marker to the map
  // marker = new google.maps.Marker({
  //   map: map,
  //   draggable: false,
  // });

  // Listen to the place changed event
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const location = place.geometry.location;

      // Update map center and zoom
      map.setCenter(location);
      map.setZoom(14);

      // Update marker position
      marker.setPosition(location);
      marker.setVisible(true);

      // Display the address and coordinates
      document.getElementById("address").textContent = place.formatted_address;
      document.getElementById("latitude").textContent = location.lat();
      document.getElementById("longitude").textContent = location.lng();
    } else {
      alert("No details available for the input.");
    }
  });
}
