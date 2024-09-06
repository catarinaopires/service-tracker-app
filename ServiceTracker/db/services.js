import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import DATABASE from "./firebaseConfig";

function getServicesRef() {
  return collection(DATABASE, "services");
}

async function getServices(userUID) {
  const servicesRef = getServicesRef().where("userID", "==", userUID);
  const snapshot = await getDocs(servicesRef);
  return snapshot.docs.map((doc) => doc.data());
}

async function getUpcomingService(userUID) {
  const servicesRef = getServicesRef();

  const querySnapshot = query(
    servicesRef,
    where("userID", "==", userUID),
    where("beginTime", ">", new Date()),
    orderBy("beginTime", "desc"),
    limit(1)
  );

  const snapshot = await getDocs(querySnapshot);

  return snapshot.docs.map((doc) => doc.data());
}

export { getServices, getUpcomingService };
