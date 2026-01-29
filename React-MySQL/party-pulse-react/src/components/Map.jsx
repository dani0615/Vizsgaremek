import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map as OLMap, View } from 'ol';
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
    const mapInstanceRef = useRef(null);
    const vectorLayerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Create vector source for markers
        const vectorSource = new VectorSource();

        // Create vector layer for markers
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: new Style({
                image: new Circle({
                    radius: 8,
                    fill: new Fill({ color: '#ff4444' }),
                    stroke: new Stroke({ color: '#fff', width: 2 })
                })
            })
        });

        vectorLayerRef.current = vectorLayer;

        // Initialize map
        const map = new OLMap({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                vectorLayer
            ],
            view: new View({
                center: fromLonLat(center),
                zoom: zoom
            })
        });

        mapInstanceRef.current = map;

        // Cleanup on unmount
        return () => {
            map.setTarget(null);
        };
    }, []);

    // Update markers when they change
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

    // Update view when center or zoom changes
    useEffect(() => {
        if (!mapInstanceRef.current) return;

        const view = mapInstanceRef.current.getView();
        view.setCenter(fromLonLat(center));
        view.setZoom(zoom);
    }, [center, zoom]);

    return (
        <div
            ref={mapRef}
            style={{
                width: '100%',
                height: '400px',
                borderRadius: '8px',
                overflow: 'hidden'
            }}
        />
    );
};

export default Map;
