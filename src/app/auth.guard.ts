import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return new Promise(
        (resolve, reject) => {
          const auth = getAuth();
          
          auth.onAuthStateChanged(
            (user) => {
              if(user) {
                console.log(user)
                resolve(true);
              } else {
                this.router.navigate(['/signUp']);
                resolve(false);
              }
            }
          );
        }
      );
    }

    
  
}
