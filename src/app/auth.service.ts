import { Injectable } from "@angular/core";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged,signInWithEmailAndPassword } from "firebase/auth";


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

  signIn(email: string, password: string) {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);


  }

}
