$(function () {
  var map;
  var csvstring;
  var heatmap;
  var latlngs = [];
  var markers = [];

  $(window).on('load', function () {
    map = new google.maps.Map($('#map').get(0), {
      zoom: 5,
      center: new google.maps.LatLng(37.0963619, 139.8100293),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true
    });
  });

  $('#add-btn').on('click', function () {
    $('#file-list').empty();
    $('#import-btn').attr('disabled', true);
    $('#progress').hide();
    $('#modal').show().animation('fadeIn');
  });

  $('#map-menu-list li').on('click', function () {
    var type = $(this).data('type');
    showVisialize(type);

    $('#map-menu-list li').removeAttr('disabled');
    $(this).attr('disabled', true);
  });

  $('#modal').on('click', function () {
    $('#modal').hide();
  });

  $('#modal .modal-content').on('click', function () {
    return false;
  });

  $('#import-btn').on('click', function () {
    latlngs = getLatlngs(csv2json(csvstring));
    showVisialize(getVisualizeType());
    $('#modal').hide();
  });

  $('#drop-zone').on('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
    e.originalEvent.dataTransfer.dropEffect = 'copy';
  });

  $('#drop-zone').on('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.originalEvent.dataTransfer.files[0];

    var arr = file.name.split('.');
    var extention = arr[arr.length - 1];
    if (extention.toLowerCase() !== 'csv') {
      alert('Please drop the CSV file.');
      return;
    }

    var reader = new FileReader();

    reader.onloadstart = function(e) {
      $('#progress').show();
    };

    reader.onprogress = function (e) {
      if (e.lengthComputable) {
        var percentLoaded = Math.round((e.loaded / e.total) * 100);
        if (percentLoaded < 100) {
          $('#progress').get(0).MaterialProgress.setProgress(percentLoaded);
        }
      }
    };

    reader.onload = function (e) {
      csvstring = e.target.result;
      $('#import-btn').attr('disabled', false);
      $('#progress').get(0).MaterialProgress.setProgress(100);
    };
    reader.readAsText(file, 'Shift_JIS');
    var list = '<li>' +
                  '<strong>' + escape(file.name) + '</strong>' +
                  ' (' + file.type + ')' +
                  ' - ' + file.size + ' bytes,' +
                  ' last modified: ' + file.lastModifiedDate.toLocaleDateString() +
                '</li>';
    $('#file-list').append(list);

  });

  /**
   * CSVデータをJSONに変換します。
   * @param  {String} csvString 緯度経度CSVデータ
   * @return {JSON}
   */
  function csv2json(csvString){
    var csvArray = csvString.split('\n');
    var jsonArray = [];
    var items = csvArray[0].split(',');
    for (var i = 1; i < csvArray.length; i++) {
      var item = {};
      var csvArrayD = csvArray[i].split(',');
      for (var j = 0; j < items.length; j++) {
        var key = items[j].trim();
        item[key] = csvArrayD[j];
      }
      jsonArray.push(item);
    }
    return jsonArray;
  }

  /**
   * 緯度経度を度数形式に変換します。
   * @param  {Number} num 緯度経度
   * @return {Number}
   */
  function transformDegree(num) {
    if (-180 <= num && num <= 180) {
      return num;
    }
    return num / 3600000;
  }

  /**
   * 緯度経度オブジェクトの配列を返却します。
   * @param  {Array} jsonArray 緯度経度のJSON配列
   * @return {Array} google.maps.LatLng配列
   */
  function getLatlngs(jsonArray) {
    var latlngs = [];
    for (var i = 0; i < jsonArray.length - 1; i++) {
      var lat = transformDegree(jsonArray[i].lat);
      var lng = transformDegree(jsonArray[i].lng);
      latlngs.push(new google.maps.LatLng(lat, lng));
    }
    return latlngs;
  }

  /**
   * 地図上に表示されているデータを削除します。
   */
  function clearMapData() {
    if (heatmap) {
      heatmap.setMap(null);
      heatmap = null;
    }
    if (markers.length > 0) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    }
  }
  /**
   * 地図にヒートマップレイヤーを追加します。
   */
  function addHeatmaps() {
    var pointArray = new google.maps.MVCArray(latlngs);
    heatmap = new google.maps.visualization.HeatmapLayer({
      data: pointArray
    });
    heatmap.setMap(map);
  }
  /**
   * 地図にマーカーレイヤーを追加します。
   */
  function addMarkers() {
    for (var i = 0; i < latlngs.length; i++) {
       var marker = new google.maps.Marker({
         position: latlngs[i],
         map: map
       });
       markers.push(marker);
     }
  }
  /**
   * 地図のビジュアライズ種別(ヒートマップ/マーカー)を返却します。
   * @return {String} heatmaps / markers
   */
  function getVisualizeType() {
    return $('#map-menu-list li[disabled]').data('type');
  }

  /**
   * 地図にデータを表示します。
   * @param  {String} type ビジュアライズ種別
   */
  function showVisialize(type) {
    clearMapData();
    if (type === 'heatmaps') {
      addHeatmaps();
    } else if (type === 'markers') {
      addMarkers();
    }
  }

});
