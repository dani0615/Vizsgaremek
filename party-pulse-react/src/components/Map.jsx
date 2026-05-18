import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import '../css/Map.css';
import { Map as OLMap, View, Overlay as OLOverlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style';

const Map = ({ center = [20.7784, 48.1035], zoom = 10, markers = [] }) => {
    const mapRef = useRef(null);
    const popupRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const vectorLayerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: new Style({
                image: new Circle({
                    radius: 9,
                    fill: new Fill({ color: '#bc13fe' }), // var(--primary)
                    stroke: new Stroke({ color: '#00f3ff', width: 2 }) // var(--accent)
                })
            })
        });

        vectorLayerRef.current = vectorLayer;

        // Popup Overlay
        const overlay = new OLOverlay({
            element: popupRef.current,
            autoPan: true,
            autoPanAnimation: { duration: 250 }
        });

        const map = new OLMap({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM({
                        attributions: [] // Clean UI
                    })
                }),
                vectorLayer
            ],
            overlays: [overlay],
            view: new View({
                center: fromLonLat(center),
                zoom: zoom
            })
        });

        // Click handler for popup
        map.on('singleclick', (evt) => {
            const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
            if (feature) {
                const coordinates = feature.getGeometry().getCoordinates();
                popupRef.current.innerHTML = `<div class="map-popup-content"><strong>${feature.get('name')}</strong></div>`;
                overlay.setPosition(coordinates);
            } else {
                overlay.setPosition(undefined);
            }
        });

        mapInstanceRef.current = map;

        return () => {
            map.setTarget(null);
        };
    }, []);

    // Update markers
    useEffect(() => {
        if (!vectorLayerRef.current) return;
        const vectorSource = vectorLayerRef.current.getSource();
        vectorSource.clear();

        markers.forEach(marker => {
            const feature = new Feature({
                geometry: new Point(fromLonLat([marker.lon, marker.lat])),
                name: marker.name || ''
            });
            vectorSource.addFeature(feature);
        });
    }, [markers]);

    // Update view
    useEffect(() => {
        if (!mapInstanceRef.current) return;
        const view = mapInstanceRef.current.getView();
        view.animate({
            center: fromLonLat(center),
            zoom: zoom,
            duration: 1000
        });
    }, [center, zoom]);

    return (
        <div className="map-container-rel">
            <div ref={mapRef} className="ol-map-container" />
            <div ref={popupRef} className="ol-popup" />
        </div>
    );
};

export default Map;
