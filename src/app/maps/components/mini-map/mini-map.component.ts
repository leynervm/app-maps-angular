import { JsonPipe } from '@angular/common'
import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
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
  selector: 'app-mini-map',
  imports: [JsonPipe],
  templateUrl: './mini-map.component.html'
})
export default class MiniMapComponent implements AfterViewInit {
  coordinates = input.required<{ lng: number; lat: number }>()
  map = signal<L.Map | null>(null)
  zoom = signal<number>(2)
  divElement = viewChild<ElementRef>('map')

  async ngAfterViewInit () {
    if (!this.divElement()?.nativeElement) return
    const element = this.divElement()!.nativeElement
    const { lng, lat } = this.coordinates()

    const map = L.map(element).setView([lat, lng], this.zoom())

    L.marker([lng, lat], {
      autoPanOnFocus: true,
      autoPan: true
    })
      .bindPopup('NEXT TECHNOLOGIES')
      .openPopup()
      .addTo(map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      // maxZoom: 17,
      // attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    this.map.set(map)
    // this.mapListener(map)
  }

  mapListener (map: L.Map) {
   
  }
}
