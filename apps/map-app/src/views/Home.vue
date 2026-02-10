<template>
  <div class="map-container">
    <div class="controls">
      <t-input v-model="origin" placeholder="请输入起点" class="input-field" />
      <t-input
        v-model="destination"
        placeholder="请输入终点"
        class="input-field"
      />
      <t-button theme="primary" @click="calculateRoute">规划路径</t-button>
    </div>
    <div id="google-map" ref="mapRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { MessagePlugin } from "tdesign-vue-next";

const mapRef = ref<HTMLElement | null>(null);
const origin = ref("");
const destination = ref("");
let map: google.maps.Map | null = null;
let directionsService: google.maps.DirectionsService | null = null;
let directionsRenderer: google.maps.DirectionsRenderer | null = null;

const initMap = () => {
  if (!mapRef.value) return;

  // 默认中心点：北京
  const center = { lat: 39.9042, lng: 116.4074 };

  map = new google.maps.Map(mapRef.value, {
    center: center,
    zoom: 12,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
};

const loadGoogleMaps = () => {
  // 检查是否已经加载
  if (window.google && window.google.maps) {
    initMap();
    return;
  }

  const script = document.createElement("script");
  // 请替换 YOUR_GOOGLE_MAPS_API_KEY 为真实的 API Key
  script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMapCallback`;
  script.async = true;
  script.defer = true;

  window.initMapCallback = () => {
    initMap();
  };

  document.head.appendChild(script);
};

const calculateRoute = () => {
  if (!origin.value || !destination.value) {
    MessagePlugin.warning("请输入起点和终点");
    return;
  }

  if (!directionsService || !directionsRenderer) {
    MessagePlugin.error("地图服务未初始化");
    return;
  }

  directionsService.route(
    {
      origin: origin.value,
      destination: destination.value,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK" && response) {
        directionsRenderer?.setDirections(response);
      } else {
        MessagePlugin.error("路径规划失败: " + status);
      }
    }
  );
};

onMounted(() => {
  loadGoogleMaps();
});

// 声明全局回调函数类型
declare global {
  interface Window {
    initMapCallback: () => void;
  }
}
</script>

<style scoped lang="scss">
.map-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);

  .controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .input-field {
      width: 300px;
    }
  }

  #google-map {
    flex: 1;
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
  }
}
</style>
