import { doc, getDoc } from "firebase/firestore";
import { db , } from "../firebase-config";
import app from "../firebase-config";

const fetchUserData = async (uid) => {
  try {
    const userDoc = doc(db, "usuarios", uid); 

    const userSnapshot = await getDoc(userDoc);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      console.log('userDatasss', userData); 

      return userData;
      
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw error;
  }
};

export default fetchUserData;
