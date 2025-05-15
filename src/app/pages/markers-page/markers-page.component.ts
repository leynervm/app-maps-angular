import { DecimalPipe, JsonPipe } from '@angular/common'
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild
} from '@angular/core'
import { v4 as UUIDv4 } from 'uuid'
import * as L from 'leaflet'
import { Marker } from '../../interfaces/marker.interface'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
})

@Component({
  selector: 'app-markers-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './markers-page.component.html'
})
export default class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map')
  map = signal<L.Map | null>(null)
  zoom = signal<number>(18)
  coordinates = signal({
    lng: -5.705862978035069,
    lat: -78.80865799002332
  })
  markers = signal<Marker[]>([])

  mapEffect = effect(() => {
    if (!this.map()) return
    this.map()?.setZoom(this.zoom())
  })

  async ngAfterViewInit () {
    if (!this.divElement()?.nativeElement) return

    const element = this.divElement()?.nativeElement
    const { lng, lat } = this.coordinates()
    const map = L.map(element).setView([lng, lat], this.zoom())
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // maxZoom: 17,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    const marker = L.marker([lng, lat], {
      draggable: false
    })
      .addTo(map)
      .bindPopup('NEXT TECHNOLOGIES')
      .openPopup()

    marker.on('dragend', event => {
      console.log(event)
    })

    this.mapListeners(map)
  }

  mapListeners (map: L.Map) {
    map.on('click', event => this.mapClick(event))
    this.map.set(map)
  }

  mapClick (event: L.LeafletMouseEvent) {
    if (!this.map()) return
    const map = this.map()!

    const color = '#xxxxxx'.replace(/x/g, y =>
      ((Math.random() * 16) | 0).toString(16)
    )

    const { lng, lat } = event.latlng
    const mapboxMarker = L.marker([lat, lng]).addTo(map)
    const marker = {
      id: UUIDv4(),
      mapboxMarker: mapboxMarker,
      color: color
    }
    // console.log(marker)
    this.markers.update(markers => [marker, ...markers])
    // console.log(this.markers())
  }

  flyToMarker (latLng: L.LatLng) {
    if (!this.map()) return
    this.map()!.flyTo(latLng, this.zoom(), {
      animate: true,
      duration: 1
    })
  }

  deleteMarker (marker: Marker) {
    if (!this.map()) return
    const map = this.map()!
    marker.mapboxMarker.remove()
    // console.log('delete')
    this.markers.update(markers => markers.filter(m => m.id !== marker.id))
  }
}
