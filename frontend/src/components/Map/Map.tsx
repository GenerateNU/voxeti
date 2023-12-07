import { useCallback, useState } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '250px'
};

type MapProps = {
  zoom: number,
  latitude: number,
  longitude: number,
}

export default function Map({ zoom, latitude, longitude } : MapProps) {
  const [selected, setSelected] = useState(false)

  const center = {
    lat: latitude,
    lng: longitude,
  };
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAP5_5mbMLn34q2B_UHDM4MHsbfb82ZTZM"
  })

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    map.setZoom(zoom)
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
    >
      {!selected 
        ? <MarkerF 
            position={center}
            onClick={() => setSelected(true)}
          />
        : <InfoWindowF 
            position={center}
            zIndex={1}
            onCloseClick={() => setSelected(false)}
          >
            <div className='m-3'>
              <h1 className='font-semibold mb-2'>
                Delivery Address
              </h1>
              <h2>3618 NE Couch St</h2>
              <h2>Portland, OR</h2>
            </div>
          </InfoWindowF>
      }
    </GoogleMap>
) : <></>
}