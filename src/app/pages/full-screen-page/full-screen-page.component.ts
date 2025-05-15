import { DecimalPipe, JsonPipe } from '@angular/common'
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild
} from '@angular/core'
import * as L from 'leaflet'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
})

@Component({
  selector: 'app-full-screen-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './full-screen-page.component.html'
})
export default class FullScreenPageComponent implements AfterViewInit {
  map = signal<L.Map | null>(null)
  zoom = signal<number>(17)
  coordinates = signal({
    lng: -5.705862978035069,
    lat: -78.80865799002332
  })

  divElement = viewChild<ElementRef>('map')

  mappEffect = effect(() => {
    if (!this.map()) return
    this.map()?.setZoom(this.zoom())
  })

  async ngAfterViewInit () {
    if (!this.divElement()?.nativeElement) return

    // await new Promise(resolve => setTimeout(() => resolve, 80))
    const element = this.divElement()?.nativeElement
    const { lng, lat } = this.coordinates()
    const map = L.map(element).setView([lng, lat], this.zoom())
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    L.marker([lng, lat]).bindPopup('NEXT TECHNOLOGIES').openPopup().addTo(map)

    // this.map.set(map)
    this.mapListener(map)
  }

  mapListener (map: L.Map) {
    map.on('zoomend', event => {
      const newZoom = event.target.getZoom()
      this.zoom.set(newZoom)
    })

    map.on('moveend', () => {
      const center = map.getCenter()
      this.coordinates.set(center)
    })

    map.on('load', () => {
      console.log('loaded')
    })

    this.map.set(map)
  }
}
