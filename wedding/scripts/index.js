$(function () {
  var map;
  $("#access-tab").on("click", function () {
    if (map) {
      return;
    }
    var bagusLatLng = new google.maps.LatLng(35.673988, 139.766385);
    map = new google.maps.Map($("#map").get(0), {
      zoom: 17,
      center: bagusLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true,
      zoomControl: true
    });
    var marker = new google.maps.Marker({
      position: bagusLatLng,
      map: map,
      title: 'BAGUS PLACE 銀座'
    });
  });
});
