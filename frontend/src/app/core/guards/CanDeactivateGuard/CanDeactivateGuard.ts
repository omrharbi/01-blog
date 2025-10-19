import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, GuardResult, MaybeAsync, RouterStateSnapshot } from "@angular/router";
import { CanComponentDeactivate } from "../../models/CanComponentDeactivate/CanComponentDeactivate";

@Injectable({
    providedIn: "root"
})

export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): MaybeAsync<GuardResult> {
        return component.canDeactivate ? component.canDeactivate() : true;
    }

}