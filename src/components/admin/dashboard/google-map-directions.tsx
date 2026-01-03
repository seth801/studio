'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.5rem',
};

const center = {
    lat: 40.7608,
    lng: -111.8910, // Default to SLC
};

interface GoogleMapDirectionsProps {
    stops: { location: string }[];
}

export function GoogleMapDirections({ stops }: GoogleMapDirectionsProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyARGWbMOdRsYzX3uHHwetNQ4g2IJFHv5ps';
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey,
    });

    const [response, setResponse] = useState<google.maps.DirectionsResult | null>(null);

    const directionsCallback = useCallback((
        result: google.maps.DirectionsResult | null,
        status: google.maps.DirectionsStatus
    ) => {
        if (result !== null) {
            if (status === 'OK') {
                setResponse(result);
            } else {
                console.error('Directions request failed due to ' + status);
            }
        }
    }, []);

    if (!stops || stops.length < 2) {
        return (
            <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                <p className="text-muted-foreground">At least two stops are required to show directions.</p>
            </div>
        );
    }

    if (!apiKey) {
        return (
            <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                <p className="text-muted-foreground">Google Maps API Key not configured.</p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-full bg-muted rounded-lg">
                <p className="text-muted-foreground">Loading Map...</p>
            </div>
        );
    }

    const origin = stops[0].location;
    const destination = stops[stops.length - 1].location;
    const waypoints = stops.slice(1, -1).map(stop => ({
        location: stop.location,
        stopover: true,
    }));

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={4}
        >
            {!response && (
                <DirectionsService
                    options={{
                        destination: destination,
                        origin: origin,
                        waypoints: waypoints,
                        travelMode: google.maps.TravelMode.DRIVING,
                    }}
                    callback={directionsCallback}
                />
            )}

            {response && (
                <DirectionsRenderer
                    options={{
                        directions: response,
                    }}
                />
            )}
        </GoogleMap>
    );
}
