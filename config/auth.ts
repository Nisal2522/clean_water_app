import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
}

export async function signUp(email: string, password: string, displayName?: string) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  try {
    await setDoc(
      doc(db, 'users', cred.user.uid),
      {
        uid: cred.user.uid,
        email: cred.user.email ?? email.trim(),
        displayName: displayName ?? cred.user.displayName ?? '',
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err: any) {
    // Surface Firestore errors clearly to the caller
    console.error('Failed to save user profile to Firestore:', err);
    throw new Error(err?.message || 'Failed to save user profile');
  }
  return cred.user;
}

