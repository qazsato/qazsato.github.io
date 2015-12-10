$(function () {
  var map;
  var csvstring;
  var pointarray;
  var heatmap;

  $(window).on("load", function () {
    map = new google.maps.Map($("#map").get(0), {
      zoom: 5,
      center: new google.maps.LatLng(37.0963619, 139.8100293),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true
    });
  });

  $("#add-btn").on("click", function () {
    $("#file-list").empty();
    $("#import-btn").attr("disabled", true);
    $("#progress").hide();
    $("#modal").show().animation("fadeIn");
  });

  $("#modal").on("click", function () {
    $("#modal").hide();
  });

  $("#modal .modal-content").on("click", function () {
    return false;
  });

  $("#import-btn").on("click", function () {
    var jsonArray = csv2json(csvstring);
    var latlngs = [];
    for (var i = 0; i < jsonArray.length - 1; i++) {
      var lat = transformDegree(jsonArray[i].lat);
      var lng = transformDegree(jsonArray[i].lng);
      latlngs.push(new google.maps.LatLng(lat, lng));
    }
    var pointArray = new google.maps.MVCArray(latlngs);
    if (heatmap) {
      heatmap.setMap(null);
    }
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray
    });
    heatmap.setMap(map);
    $("#modal").hide();
  });

  $("#drop-zone").on("dragover", function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = "copy";
  });

  $("#drop-zone").on("drop", function (e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.originalEvent.dataTransfer.files[0];

    var arr = file.name.split(".");
    var extention = arr[arr.length - 1];
    if (extention.toLowerCase() !== "csv") {
      alert("Please drop the CSV file.");
      return;
    }

    var reader = new FileReader();

    reader.onloadstart = function(e) {
      $("#progress").show();
    };

    reader.onprogress = function (e) {
      if (e.lengthComputable) {
        var percentLoaded = Math.round((e.loaded / e.total) * 100);
        if (percentLoaded < 100) {
          $("#progress").get(0).MaterialProgress.setProgress(percentLoaded);
        }
      }
    };

    reader.onload = function (e) {
      csvstring = e.target.result;
      $("#import-btn").attr("disabled", false);
      $("#progress").get(0).MaterialProgress.setProgress(100);
    };
    reader.readAsText(file, "Shift_JIS");
    var list = "<li>" +
                  "<strong>" + escape(file.name) + "</strong>" +
                  " (" + file.type + ")" +
                  " - " + file.size + " bytes," +
                  " last modified: " + file.lastModifiedDate.toLocaleDateString() +
                "</li>";
    $("#file-list").append(list);

  });

  function csv2json(csvString){
    var csvArray = csvString.split('\n');
    var jsonArray = [];

    var items = csvArray[0].split(',');
    for (var i = 1; i < csvArray.length; i++) {
      var item = {};
      var csvArrayD = csvArray[i].split(',');
      for (var j = 0; j < items.length; j++) {
        item[items[j]] = csvArrayD[j];
      }
      jsonArray.push(item);
    }
    return jsonArray;
  }

  function transformDegree(num) {
    if (-180 <= num && num <= 180) {
      return num;
    }
    return num / 3600000;
  }

});
