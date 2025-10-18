import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  
  // Fetch user role from Firestore
  const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
  const userData = userDoc.data();
  const role = userData?.role || 'student';
  
  return { user: cred.user, role };
}

export async function signUp(email: string, password: string, displayName?: string, role: string = 'student') {
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
        role: role,
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

