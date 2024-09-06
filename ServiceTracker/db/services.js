import { collection, getDocs } from "firebase/firestore";

import DATABASE from "./firebaseConfig";

function getServicesRef() {
  return collection(DATABASE, "services");
}

async function getServices(userUID) {
  const servicesRef = getServicesRef().where("userID", "==", userUID);
  const snapshot = await getDocs(servicesRef);
  return snapshot.docs.map((doc) => doc.data());
}

export { getServices };
