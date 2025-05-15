import { UUIDTypes } from 'uuid'

export interface Marker {
  id: UUIDTypes
  mapboxMarker: L.Marker
  color: string
}
