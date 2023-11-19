
import { getManifest, loadRemoteModule } from "@angular-architects/module-federation";
import { Route } from "@angular/router";
import { CustomManifest } from "./models/module-federation.model";
import { routes } from "./internal.routes";
import { PageNotFoundComponent } from "./layout/page-not-found/page-not-found.component";

export declare type SpaRoute = Route & { isNavigation?: string, displayName?: string };
export declare type SpaRoutes = SpaRoute[];

export function buildRoutes(): SpaRoutes {

    const lazyRoutes = Object.entries(getManifest<CustomManifest>())
    .filter(([key, value]) => {
        return value.viaRoute === true
    }).map(([key, value]) => {
      return {
        path: value.routePath,
        isNavigation: value.isNavigation,
        displayName: value.displayName,
        loadChildren: () => loadRemoteModule({
            type: 'manifest',
            remoteName: key,
            exposedModule: value.exposedModule
        }).then(m => m[value.ngModuleName!])
      }
    });

    const notFound = [
      {
        path: '**',
        component: PageNotFoundComponent,
      }
    ];

    const combinedRoutes =  [...routes, ...lazyRoutes, ...notFound];
    return combinedRoutes as SpaRoutes;
}
