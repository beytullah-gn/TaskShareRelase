import { getAuth, signOut } from "firebase/auth";


export const SignOutService = async () => {
    const auth = getAuth();
    try {
        await signOut(auth);
        console.log('Çıkış yapıldı');
        
    } catch (error) {
        console.error('Sign out error', error);
    }
};
