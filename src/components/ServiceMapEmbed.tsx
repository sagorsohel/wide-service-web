"use client";

import React, { useMemo } from "react";

interface ServiceMapEmbedProps {
  serviceLat: number;
  serviceLng: number;
  serviceName: string;
  userLat?: number | null;
  userLng?: number | null;
  height?: number | string;
}

export const ServiceMapEmbed: React.FC<ServiceMapEmbedProps> = ({
  serviceLat,
  serviceLng,
  serviceName,
  userLat,
  userLng,
  height = 280,
}) => {
  const hasUser = userLat != null && userLng != null;
  const cleanServiceName = (serviceName || "Service Location").replace(/'/g, "\\'");

  const srcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=18.0, user-scalable=yes" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .custom-service-pin {
      background: #e0b328;
      border: 3px solid #0f172a;
      border-radius: 50%;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.45);
      font-size: 16px;
    }
    .custom-user-pin {
      background: #2563eb;
      border: 3px solid #ffffff;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.35);
    }
    .leaflet-popup-content-wrapper {
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: false, attributionControl: false }).setView([${serviceLat}, ${serviceLng}], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    var serviceIcon = L.divIcon({
      className: '',
      html: '<div class="custom-service-pin">📍</div>',
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    var sMarker = L.marker([${serviceLat}, ${serviceLng}], { icon: serviceIcon }).addTo(map);
    sMarker.bindPopup("<b>${cleanServiceName}</b>").openPopup();

    ${
      hasUser
        ? `
    var userIcon = L.divIcon({
      className: '',
      html: '<div class="custom-user-pin"></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });
    var uMarker = L.marker([${userLat}, ${userLng}], { icon: userIcon }).addTo(map);
    uMarker.bindPopup("<b>Your Location</b>");

    // Polyline connecting user and service
    var latlngs = [
      [${userLat}, ${userLng}],
      [${serviceLat}, ${serviceLng}]
    ];
    var polyline = L.polyline(latlngs, {
      color: '#e0b328',
      weight: 3,
      dashArray: '6, 8',
      opacity: 0.85
    }).addTo(map);

    // Fit bounds to show both pins
    var group = new L.featureGroup([sMarker, uMarker]);
    map.fitBounds(group.getBounds().pad(0.25));
    `
        : ""
    }
  </script>
</body>
</html>`;
  }, [serviceLat, serviceLng, serviceName, userLat, userLng, hasUser]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner dark:border-slate-800"
      style={{ height }}
    >
      <iframe
        srcDoc={srcDoc}
        title={`Map for ${serviceName}`}
        className="w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
};
