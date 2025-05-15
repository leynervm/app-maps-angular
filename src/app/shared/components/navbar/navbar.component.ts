import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { routes } from '../../../app.routes'
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router'
import { filter, map, tap } from 'rxjs'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './navbar.component.html'
})
export default class NavbarComponent {
  router = inject(Router)

  routes = routes
    .filter(route => route.path !== '**')
    .map(({ path, title }) => ({
      path,
      title: `${title ?? 'Maps en Angular'}`
    }))

  pageTitle$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    // tap(event => console.log(event)),
    map(event => event.url),
    map(url => routes.find(route => `/${route.path}` === url)?.title ?? 'Maps')
  )

  pageTitle = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      // tap(event => console.log(event)),
      map(event => event.url),
      map(
        url => routes.find(route => `/${route.path}` === url)?.title ?? 'Maps'
      )
    )
  )
}
