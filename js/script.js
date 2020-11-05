
console.log(key);
var script = '<script src="https://maps.googleapis.com/maps/api/js?key='+ key +'&callback=initMap&libraries=places&v=weekly" async defer></script>';
console.log(script);

$(document).ready(function(){
  $('body').append(script);
});

function initMap() {

  //////////////////////////////////////////////////////////////////////////
        //from autocomplete
        var start = new google.maps.places.Autocomplete(
             document.getElementById("start"),
             {
               types: ["(cities)"]

             }
           );//autocomplete start_address

        var end = new google.maps.places.Autocomplete(
             document.getElementById("end"),
             {
               types: ["(cities)"]

             }
           );//autocomplete end_address
  //////////////////////////////////////////////////////////////////////////

    //directions distance and duration
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();


    //callilng map from directions
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 6,
      center: { lat: 41.85, lng: -87.65 },
      mapTypeId : 'satellite'

    });//map

       directionsRenderer.setMap(map);


    document.getElementById("submit").addEventListener("click", () => {
      calculateAndDisplayRoute(directionsService, directionsRenderer);
    });
  }


  function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    const waypts = [];
    const checkboxArray = document.getElementById("waypoints");

    for (let i = 0; i < checkboxArray.length; i++) {
      if (checkboxArray.options[i].selected) {
        waypts.push({
          location: checkboxArray[i].value,
          stopover: true,
        });
      }
    }

    directionsService.route(
      {
        origin: document.getElementById("start").value,
        destination: document.getElementById("end").value,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          console.log(response);
          directionsRenderer.setDirections(response);
          const route = response.routes[0];
          const summaryPanel = document.getElementById("directions-panel");

          summaryPanel.innerHTML = "";

          // For each route, display summary information.
          for (let i = 0; i < route.legs.length; i++) {
            const routeSegment = i + 1;
            summaryPanel.innerHTML +=
              "<b>Route Segment: " + routeSegment + "</b><br>";
            summaryPanel.innerHTML += route.legs[i].start_address + " to ";
            summaryPanel.innerHTML += route.legs[i].end_address + "<br>";
            summaryPanel.innerHTML +=
              route.legs[i].distance.text + " and it takes " + route.legs[i].duration.text + " to reach."+ "<br><br>";
          }

        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }


  $('#start,#end').click(function(){
    $(this).val('');
  })
