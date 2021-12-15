import { Injectable } from "@angular/core";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  createNewUser(email: string, password: string) {
    const auth = getAuth();

   return createUserWithEmailAndPassword(auth, email, password);
  }
  signOutUser() {
    const auth = getAuth();

    auth.signOut();
  }
}
