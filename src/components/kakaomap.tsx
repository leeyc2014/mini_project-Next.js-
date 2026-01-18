'use client';

declare global {
    interface Window {
        kakao: any;
    }
}

import { useEffect, useRef } from "react";

interface Place {
    id: number;
    LC_LA: number;
    LC_LO: number;
    FCLTY_NM: string;
    LNM_ADDR?: string;
    RDNMADR_NM?: string;
}

interface KakaoMapProps {
    places: Place[];
    onSelectPlace: (placeId: number) => void;
}

export default function KakaoMap({ places, onSelectPlace }: KakaoMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const clustererRef = useRef<any>(null);
    const infoWindowRef = useRef<any>(null);

    /* 지도 초기화 */
    useEffect(() => {
        if (!containerRef.current) return;

        const initMap = () => {
            if (mapRef.current) return;

            const map = new window.kakao.maps.Map(containerRef.current!, {
                center: new window.kakao.maps.LatLng(36.5, 127.8),
                level: 12,
            });

            mapRef.current = map;
        };

        if (window.kakao?.maps?.LatLng) {
            initMap();
            return;
        }

        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=clusterer`;
        script.async = true;

        script.onload = () => window.kakao.maps.load(initMap);

        document.head.appendChild(script);
    }, []);

    /* 마커 & 클러스터 갱신 */
    useEffect(() => {
        if (!mapRef.current) return;
        if (!places || places.length === 0) return;

        const map = mapRef.current;

        // 기존 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // 기존 클러스터 제거
        if (clustererRef.current) {
            clustererRef.current.clear();
        }

        const bounds = new window.kakao.maps.LatLngBounds();

        const clusterer = new window.kakao.maps.MarkerClusterer({
            map,
            averageCenter: true,
            minLevel: 5,
        });

        places.forEach(place => {
            const position = new window.kakao.maps.LatLng(
                place.LC_LA,
                place.LC_LO
            );

            const marker = new window.kakao.maps.Marker({ position });

            window.kakao.maps.event.addListener(marker, "click", () => {
                onSelectPlace(place.id);
                if (!infoWindowRef.current) {
                    infoWindowRef.current = new window.kakao.maps.InfoWindow();
                }

                infoWindowRef.current.setContent(`
                    <div style="padding:8px;font-size:12px;min-width:400px;max-width:500px;">
                        <strong>${place.FCLTY_NM}</strong><br/>
                        ${place.RDNMADR_NM ? `도로명: ${place.RDNMADR_NM}<br/>` : "-"}
                        ${place.LNM_ADDR ? `지번: ${place.LNM_ADDR}` : "-"}
                    </div>
                `);

                infoWindowRef.current.open(map, marker);
            });

            markersRef.current.push(marker);
            bounds.extend(position);
        });

        clusterer.addMarkers(markersRef.current);
        clustererRef.current = clusterer;

        map.setBounds(bounds);
    }, [places]);

    return <div ref={containerRef} className="w-full h-150 border" />;
}
