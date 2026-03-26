import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { WebView } from 'react-native-webview';
import { KAKAO_JAVASCRIPT_KEY } from '@env';

// Naver zoom → Kakao level 변환 (zoom 16 → level 3, zoom 15 → level 4)
const toKakaoLevel = (zoom) => Math.max(1, Math.min(14, 19 - zoom));

const ICON_PATHS = {
  PARTNER:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M9.47719 10.2592L10.801 9.06175C11.1054 8.78689 11.466 8.58154 11.8577 8.45992C12.2494 8.33831 12.6629 8.30334 13.0695 8.35743L14.8213 8.58938L17.252 7.27598C17.2879 7.25654 17.3283 7.24676 17.3691 7.24761C17.4099 7.24846 17.4498 7.2599 17.4849 7.28081C17.52 7.30172 17.549 7.33139 17.5692 7.36691C17.5893 7.40242 17.5999 7.44257 17.5999 7.4834V11.9507C17.5999 12.1006 17.5641 12.2483 17.4956 12.3816C17.427 12.5149 17.3277 12.63 17.2058 12.7172L15.569 13.8873L13.7964 12.4013C14.1425 12.2772 14.4547 12.0737 14.7082 11.8073C14.762 11.7516 14.8043 11.6859 14.8326 11.6138C14.861 11.5417 14.8749 11.4648 14.8736 11.3873C14.8722 11.3099 14.8556 11.2335 14.8247 11.1625C14.7938 11.0914 14.7493 11.0272 14.6935 10.9734C14.6378 10.9196 14.5721 10.8773 14.5 10.8489C14.4279 10.8205 14.351 10.8066 14.2735 10.808C14.1961 10.8093 14.1197 10.8259 14.0487 10.8568C13.9776 10.8877 13.9134 10.9323 13.8596 10.988C13.6855 11.1709 13.4802 11.2859 13.2439 11.3331C13.0374 11.3736 12.7744 11.367 12.4434 11.2652L12.0229 10.9116L10.849 11.863C10.6349 12.0326 10.3634 12.1126 10.0915 12.0862C9.81962 12.0598 9.56854 11.9291 9.39099 11.7215C9.21343 11.514 9.12322 11.2457 9.13929 10.973C9.15536 10.7003 9.27648 10.4445 9.47719 10.2592ZM8.68707 9.3842L9.63747 8.52526C9.22871 8.41487 8.80084 8.3946 8.38347 8.46586L6.65333 8.76569L4.75442 7.74363C4.71775 7.72387 4.67658 7.71397 4.63494 7.7149C4.5933 7.71583 4.55262 7.72757 4.51687 7.74896C4.48113 7.77035 4.45156 7.80065 4.43105 7.83691C4.41055 7.87316 4.39982 7.91412 4.3999 7.95578V11.9497C4.3999 12.2684 4.55736 12.5663 4.82042 12.7455L9.9637 16.252C10.2887 16.4739 10.6739 16.5908 11.0674 16.587C11.4609 16.5831 11.8438 16.4586 12.1643 16.2303L14.5271 14.5529L12.0097 12.4409L11.5901 12.7785C11.1371 13.1393 10.5617 13.3102 9.98523 13.2551C9.40871 13.2 8.87611 12.9232 8.49968 12.4831C8.12326 12.043 7.93241 11.4739 7.96737 10.8958C8.00232 10.3177 8.26035 9.77576 8.68707 9.3842Z" fill="white"/>',
  CAFE: '<path d="M13.9318 6.6001V13.2001C13.9318 14.4174 12.9492 15.4001 11.7318 15.4001H7.33184C6.1145 15.4001 5.13184 14.4174 5.13184 13.2001V6.6001H13.9318Z" fill="white" stroke="white" stroke-width="1.46667" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.9316 6.6001H16.1316C16.535 6.6001 16.865 6.9301 16.865 7.33343V9.53343C16.865 9.93676 16.535 10.2668 16.1316 10.2668H13.9316" stroke="white" stroke-width="1.46667" stroke-linecap="round" stroke-linejoin="round"/>',
  FOOD: '<path d="M15.6938 9.82712C16.005 9.82712 16.3034 9.95074 16.5235 10.1708C16.7435 10.3908 16.8671 10.6893 16.8671 11.0005V11.2938C16.8671 12.2876 15.5489 14.5146 14.5304 15.3905L14.5205 15.3981V15.6938C14.5205 15.9898 14.4088 16.2749 14.2075 16.492C14.0062 16.709 13.7303 16.842 13.4351 16.8642L13.3471 16.8671H8.65379C8.3426 16.8671 8.04416 16.7435 7.82412 16.5235C7.60407 16.3034 7.48046 16.005 7.48046 15.6938V15.4028L7.44232 15.3717C6.40979 14.4941 5.21651 12.4589 5.1379 11.4L5.13379 11.2938V11.0005C5.13379 10.6893 5.25741 10.3908 5.47745 10.1708C5.69749 9.95074 5.99594 9.82712 6.30712 9.82712H15.6938ZM8.65379 5.13379C9.65699 5.13379 10.5528 5.5955 10.8743 6.30712H15.6938C15.8494 6.30712 15.9986 6.36893 16.1086 6.47895C16.2186 6.58897 16.2805 6.7382 16.2805 6.89379C16.2805 7.04938 16.2186 7.1986 16.1086 7.30862C15.9986 7.41865 15.8494 7.48046 15.6938 7.48046L10.8737 7.48104C10.5522 8.19267 9.65699 8.65379 8.65379 8.65379C7.39598 8.65379 6.30712 7.92808 6.30712 6.89379C6.30712 5.8595 7.39598 5.13379 8.65379 5.13379Z" fill="white"/>',
  PUB: '<path d="M16.2799 6.48411H14.9599V5.09464C14.9599 4.91038 14.8904 4.73367 14.7666 4.60339C14.6428 4.4731 14.4749 4.3999 14.2999 4.3999H5.0599C4.88486 4.3999 4.71699 4.4731 4.59321 4.60339C4.46944 4.73367 4.3999 4.91038 4.3999 5.09464V15.5157C4.3999 16.6648 5.28826 17.5999 6.3799 17.5999H12.9799C14.0715 17.5999 14.9599 16.6648 14.9599 15.5157V14.821H16.2799C17.0079 14.821 17.5999 14.1978 17.5999 13.4315V7.87359C17.5999 7.10729 17.0079 6.48411 16.2799 6.48411ZM8.3599 14.1262H7.0399V7.17885H8.3599V14.1262ZM12.3199 14.1262H10.9999V7.17885H12.3199V14.1262ZM16.2799 13.4315H14.9599V7.87359H16.2799V13.4315Z" fill="white"/>',
  STORE:
    '<path fill-rule="evenodd" clip-rule="evenodd" d="M6.28562 4.3999C6.19597 4.39987 6.10818 4.4254 6.03253 4.4735C5.95688 4.52159 5.89651 4.59026 5.8585 4.67145L4.44422 7.69707C4.40953 7.77153 4.39491 7.85376 4.40179 7.93562H4.3999V8.82662C4.3999 9.32067 4.61299 9.79399 4.9939 10.1428C5.37293 10.4917 5.88867 10.6878 6.4261 10.6878H6.70896C7.23791 10.6912 7.74904 10.4968 8.1421 10.1428C8.29673 10.0002 8.42245 9.8405 8.51925 9.66387C8.63899 9.50359 8.83322 9.50359 8.94542 9.65067C9.04285 9.83296 9.17076 9.99702 9.32916 10.1428C9.70913 10.4917 10.2249 10.6878 10.7623 10.6878H11.2686C11.7976 10.6912 12.3087 10.4968 12.7018 10.1428C12.8495 10.0064 12.9708 9.85433 13.0657 9.6865C13.1892 9.49322 13.4051 9.49793 13.5183 9.67707C13.6144 9.84867 13.7376 10.0039 13.8879 10.1428C14.2678 10.4917 14.7836 10.6878 15.321 10.6878H15.5737C16.1111 10.6878 16.6269 10.4926 17.0068 10.1428C17.3868 9.79305 17.5999 9.32162 17.5999 8.82662V7.93562H17.598C17.6049 7.85376 17.5903 7.77153 17.5556 7.69707L16.1413 4.67145C16.1033 4.59026 16.0429 4.52159 15.9673 4.4735C15.8916 4.4254 15.8038 4.39987 15.7142 4.3999H6.28562ZM5.34276 16.657V11.6872C6.46287 12.0568 7.7989 11.8918 8.7163 11.1819C9.94013 12.1285 12.0625 12.1285 13.2854 11.1819C14.2075 11.8947 15.5407 12.0568 16.657 11.6778V16.657C16.657 16.9071 16.5577 17.1469 16.3809 17.3237C16.2041 17.5006 15.9642 17.5999 15.7142 17.5999H14.53V14.0265C14.5304 13.9988 14.5247 13.9713 14.5133 13.946C14.5019 13.9208 14.485 13.8983 14.464 13.8803C14.4202 13.8411 14.3634 13.8195 14.3046 13.82H12.4264C12.3673 13.8193 12.3101 13.8408 12.2662 13.8803C12.2451 13.8983 12.2283 13.9208 12.2169 13.946C12.2054 13.9713 12.1997 13.9988 12.2002 14.0265V17.5999H6.28562C6.03556 17.5999 5.79574 17.5006 5.61892 17.3237C5.4421 17.1469 5.34276 16.9071 5.34276 16.657ZM6.75893 14.545V13.357C6.75893 13.232 6.8086 13.1121 6.89701 13.0237C6.98542 12.9353 7.10533 12.8856 7.23036 12.8856H10.0721C10.1972 12.8856 10.3171 12.9353 10.4055 13.0237C10.4939 13.1121 10.5436 13.232 10.5436 13.357V14.545C10.5436 14.6701 10.4939 14.79 10.4055 14.8784C10.3171 14.9668 10.1972 15.0165 10.0721 15.0165H7.23036C7.10533 15.0165 6.98542 14.9668 6.89701 14.8784C6.8086 14.79 6.75893 14.6701 6.75893 14.545Z" fill="white"/>',
};

const getHtmlTemplate = (lat, lng, zoom, appKey) => {
  const level = toKakaoLevel(zoom);
  const iconPathsJson = JSON.stringify(ICON_PATHS);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; overflow: hidden; }
    .map-marker { cursor: pointer; user-select: none; }
    #debug { position:fixed; top:0; left:0; right:0; background:rgba(255,0,0,0.85); color:#fff; font-size:12px; padding:6px; z-index:9999; display:none; word-break:break-all; }
  </style>
</head>
<body>
  <div id="debug"></div>
  <div id="map"></div>
  <script>
    function showDebug(msg) {
      var el = document.getElementById('debug');
      el.style.display = 'block';
      el.textContent = msg;
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'DEBUG', payload: { msg: msg } }));
      }
    }
    window.onerror = function(msg, src, line) {
      showDebug('JS Error: ' + msg + ' (' + src + ':' + line + ')');
    };
  </script>
  <script
    src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false"
    onerror="showDebug('SDK 로드 실패 - appkey: ${
      appKey ? appKey.substring(0, 6) + '...' : 'UNDEFINED'
    }')"
  ></script>
  <script>
    var ICON_PATHS = ${iconPathsJson};

    if (typeof kakao === 'undefined') {
      showDebug('kakao 객체 없음 - SDK 로드 실패. appkey 확인 필요');
    } else {
    kakao.maps.load(function() {
      try {
      var container = document.getElementById('map');
      var map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(${lat}, ${lng}),
        level: ${level}
      });

      var overlays = [];
      var cameraTimer = null;

      function sendToRN(type, payload) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload || {} }));
      }

      // 카메라 idle (300ms 디바운스)
      kakao.maps.event.addListener(map, 'idle', function() {
        clearTimeout(cameraTimer);
        cameraTimer = setTimeout(function() {
          var center = map.getCenter();
          var bounds = map.getBounds();
          sendToRN('CAMERA_IDLE', {
            latitude: center.getLat(),
            longitude: center.getLng(),
            zoom: map.getLevel(),
            minLat: bounds.getSouthWest().getLat(),
            maxLat: bounds.getNorthEast().getLat(),
            minLng: bounds.getSouthWest().getLng(),
            maxLng: bounds.getNorthEast().getLng()
          });
        }, 300);
      });

      // 지도 탭 (마커 클릭 시에는 clickable:true 오버레이가 이벤트를 가로챔)
      kakao.maps.event.addListener(map, 'click', function() {
        sendToRN('MAP_TAP', {});
      });

      // 마커 탭 - 이벤트 위임 방식
      document.addEventListener('click', function(e) {
        var el = e.target.closest('[data-place-id]');
        if (el) {
          sendToRN('MARKER_TAP', { placeId: el.getAttribute('data-place-id') });
        }
      });

      function createMarkerHtml(marker) {
        var placeId = marker.placeId;
        var pinType = marker.pinType;
        var category = marker.category;
        var iconPath = ICON_PATHS[category] || ICON_PATHS['PARTNER'];
        var id = String(placeId).replace(/[^a-zA-Z0-9]/g, '_');

        if (pinType === 'DEFAULT') {
          return '<div class="map-marker" data-place-id="' + placeId + '" style="position:relative;width:22px;height:22px">'
            + '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">'
            + '<defs>'
            + '<linearGradient id="a0' + id + '" x1="21.17" y1="5.28" x2="-17.94" y2="29.11" gradientUnits="userSpaceOnUse"><stop stop-color="#7DCBFF"/><stop offset="1" stop-color="#049BFF"/></linearGradient>'
            + '<linearGradient id="a1' + id + '" x1="12" y1="1" x2="12" y2="23" gradientUnits="userSpaceOnUse"><stop stop-color="#D7EFFF"/><stop offset="1" stop-color="#F5FBFF"/></linearGradient>'
            + '</defs>'
            + '<rect x="0.5" y="0.5" width="23" height="23" rx="11.5" fill="url(#a0' + id + ')"/>'
            + '<rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="url(#a1' + id + ')"/>'
            + '</svg>'
            + '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none">'
            + '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 22 22" fill="none">' + iconPath + '</svg>'
            + '</div>'
            + '</div>';
        }

        if (pinType === 'PARTNER') {
          return '<div class="map-marker" data-place-id="' + placeId + '" style="position:relative;width:30px;height:30px">'
            + '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 28 28" fill="none">'
            + '<defs>'
            + '<linearGradient id="b0' + id + '" x1="26.09" y1="4.42" x2="-27.25" y2="36.92" gradientUnits="userSpaceOnUse"><stop stop-color="#049BFF"/><stop offset="1" stop-color="#057CCC"/></linearGradient>'
            + '<linearGradient id="b1' + id + '" x1="13.59" y1="-1.42" x2="13.59" y2="28.59" gradientUnits="userSpaceOnUse"><stop stop-color="#D7EFFF"/><stop offset="1" stop-color="#F5FBFF"/></linearGradient>'
            + '</defs>'
            + '<path d="M11.2163 1.49609C12.5655 0.290648 14.6054 0.290647 15.9546 1.49609L16.6431 2.1123C17.4437 2.82767 18.4637 3.25023 19.5356 3.31055L20.4585 3.3623C22.2648 3.46407 23.7063 4.90564 23.8081 6.71191L23.8599 7.63477C23.9202 8.70673 24.3427 9.72672 25.0581 10.5273L25.6743 11.2158C26.8798 12.5651 26.8798 14.6049 25.6743 15.9541L25.0581 16.6426C24.3427 17.4432 23.9202 18.4632 23.8599 19.5352L23.8081 20.458C23.7063 22.2643 22.2648 23.7059 20.4585 23.8076L19.5356 23.8594C18.4637 23.9197 17.4437 24.3423 16.6431 25.0576L15.9546 25.6738C14.6054 26.8793 12.5655 26.8793 11.2163 25.6738L10.5278 25.0576C9.7272 24.3423 8.70722 23.9197 7.63525 23.8594L6.7124 23.8076C4.90613 23.7059 3.46456 22.2643 3.36279 20.458L3.31104 19.5352C3.25071 18.4632 2.82816 17.4432 2.11279 16.6426L1.49658 15.9541C0.291136 14.6049 0.291136 12.5651 1.49658 11.2158L2.11279 10.5273C2.82816 9.72672 3.25071 8.70673 3.31104 7.63477L3.36279 6.71191C3.46456 4.90564 4.90613 3.46407 6.7124 3.3623L7.63525 3.31055C8.70722 3.25023 9.7272 2.82767 10.5278 2.1123L11.2163 1.49609Z" fill="url(#b0' + id + ')" stroke="url(#b1' + id + ')" stroke-width="1.18519"/>'
            + '</svg>'
            + '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none">'
            + '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 22 22" fill="none">' + iconPath + '</svg>'
            + '</div>'
            + '</div>';
        }

        if (pinType === 'SELECTED') {
          return '<div class="map-marker" data-place-id="' + placeId + '" style="position:relative;width:39px;height:54px">'
            + '<svg xmlns="http://www.w3.org/2000/svg" width="39" height="54" viewBox="0 0 39 54" fill="none">'
            + '<defs>'
            + '<linearGradient id="c0' + id + '" x1="35.48" y1="10.36" x2="-43.42" y2="45.29" gradientUnits="userSpaceOnUse"><stop stop-color="#7DCBFF"/><stop offset="1" stop-color="#049BFF"/></linearGradient>'
            + '<linearGradient id="c1' + id + '" x1="19.35" y1="0" x2="19.35" y2="53.28" gradientUnits="userSpaceOnUse"><stop stop-color="#D7EFFF"/><stop offset="1" stop-color="#F5FBFF"/></linearGradient>'
            + '</defs>'
            + '<path d="M19.3545 0.879883C29.5579 0.879883 37.8299 9.15116 37.8301 19.3545C37.8301 24.389 34.8282 29.6794 30.8164 35.3438C27.1488 40.5221 22.6409 46.003 19.3203 51.584C17.647 48.9911 15.7903 46.4346 13.9238 43.9248C11.7539 41.007 9.5808 38.1614 7.63379 35.3506C3.71934 29.6993 0.879883 24.4011 0.879883 19.3545C0.880015 9.15124 9.15124 0.880015 19.3545 0.879883Z" fill="url(#c0' + id + ')" stroke="url(#c1' + id + ')" stroke-width="1.75952"/>'
            + '</svg>'
            + '<div style="position:absolute;top:0;left:0;width:39px;height:39px;display:flex;align-items:center;justify-content:center;margin-top:2px;pointer-events:none">'
            + '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 22 22" fill="none">' + iconPath + '</svg>'
            + '</div>'
            + '</div>';
        }

        return '';
      }

      window.setMarkersInWebView = function(markerData) {
        overlays.forEach(function(o) { o.setMap(null); });
        overlays = [];

        markerData.forEach(function(marker) {
          var html = createMarkerHtml(marker);
          if (!html) return;

          var overlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(marker.latitude, marker.longitude),
            content: html,
            clickable: true,
            yAnchor: marker.pinType === 'SELECTED' ? 1.0 : 0.5,
            xAnchor: 0.5,
            zIndex: marker.pinType === 'SELECTED' ? 10 : 1
          });
          overlay.setMap(map);
          overlays.push(overlay);
        });
      };

      window.moveCameraInWebView = function(lat, lng, zoom, duration) {
        var level = Math.max(1, Math.min(14, 19 - zoom));
        var latLng = new kakao.maps.LatLng(lat, lng);
        if (duration > 0) {
          map.panTo(latLng);
          setTimeout(function() { map.setLevel(level, { animate: true }); }, 200);
        } else {
          map.setCenter(latLng);
          map.setLevel(level);
        }
      };

      // RN에서 오는 메시지 처리
      function handleRNMessage(dataStr) {
        try {
          var data = JSON.parse(dataStr);
          if (data.type === 'SET_MARKERS') {
            setMarkersInWebView(data.markers);
          } else if (data.type === 'MOVE_CAMERA') {
            moveCameraInWebView(data.latitude, data.longitude, data.zoom, data.duration || 0);
          }
        } catch(e) {}
      }

      document.addEventListener('message', function(e) { handleRNMessage(e.data); });
      window.addEventListener('message', function(e) { handleRNMessage(e.data); });

      sendToRN('READY', {});
      } catch(initErr) {
        showDebug('Map init error: ' + (initErr.message || String(initErr)));
      }
    });
    } // end if kakao defined
  </script>
</body>
</html>`;
};

const KakaoMapWebView = forwardRef(
  (
    { initialCamera, markers, onCameraIdle, onMarkerTap, onMapTap, style },
    ref
  ) => {
    const webViewRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useImperativeHandle(ref, () => ({
      animateCameraTo: ({ latitude, longitude, zoom, duration }) => {
        const js = `moveCameraInWebView(${latitude}, ${longitude}, ${zoom}, ${duration || 0}); true;`;
        webViewRef.current?.injectJavaScript(js);
      },
    }));

    useEffect(() => {
      if (!isReady) return;
      const js = `setMarkersInWebView(${JSON.stringify(markers)}); true;`;
      webViewRef.current?.injectJavaScript(js);
    }, [markers, isReady]);

    const handleMessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.nativeEvent.data);
        if (type === 'READY') {
          setIsReady(true);
        } else if (type === 'CAMERA_IDLE') {
          onCameraIdle?.(payload);
        } else if (type === 'MARKER_TAP') {
          onMarkerTap?.(payload);
        } else if (type === 'MAP_TAP') {
          onMapTap?.();
        }
      } catch (e) {}
    };

    const html = getHtmlTemplate(
      initialCamera.latitude,
      initialCamera.longitude,
      initialCamera.zoom,
      KAKAO_JAVASCRIPT_KEY
    );

    return (
      <WebView
        ref={webViewRef}
        source={{ html, baseUrl: 'https://localhost' }}
        style={style}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        mixedContentMode="always"
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    );
  }
);

export default KakaoMapWebView;
