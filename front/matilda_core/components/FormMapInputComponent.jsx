import React, { useState, useContext, useCallback, useEffect } from 'react'
import mapboxgl from '!mapbox-gl'
import mapboxglgeocoder from 'mapbox-gl-geocoder'
import { MatildaContext } from '../index'

import 'mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function FormMapInputComponent (props) {
  const { style, zoom, value, onChange } = props
  const { getConfig, getLocale } = useContext(MatildaContext)
  const [mapItem, setMapItem] = useState(null)
  const [location, setLocation] = useState(value || { lat: null, lng: null, name: null })
  mapboxgl.accessToken = getConfig('mapbox_token')

  const mapRef = useCallback((el) => {
    if (!el) return

    setMapItem(new mapboxgl.Map({
      container: el,
      center: [location.lng, location.lat],
      style: getConfig('mapbox_style'),
      zoom: zoom || 10
    }))
  }, [])

  useEffect(() => {
    if (!mapItem) return

    let geocoder = new mapboxglgeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      language: getLocale() + '-' + getLocale().toUpperCase()
    })
    geocoder.on('result', (e) => {
      setLocation({ lng: e.result.center[0], lat: e.result.center[1], name: e.result.place_name })
    })
    mapItem.addControl(geocoder)

    mapItem.marker = new mapboxgl.Marker()
    mapItem.geocoder = geocoder
  }, [mapItem])

  useEffect(() => {
    if (value) setLocation(value)
  }, [value])

  useEffect(() => {
    if (mapItem?.marker && location) {
      const markerCenter = [location.lng, location.lat]
      mapItem.marker.setLngLat(markerCenter).addTo(mapItem)
      mapItem.setCenter(markerCenter)
    }
    onChange(location)
  }, [location])

  return (
    <div ref={mapRef} style={Object.assign({ backgroundColor: '#eeeeee' }, style)} />
  )
}
