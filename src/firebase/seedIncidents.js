import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { incidents } from "../data/incidentData";

const seedIncidents = async () => {
  try {
    const incidentsRef = collection(db, "incidents");

    // Check if incidents already exist
    const snapshot = await getDocs(incidentsRef);

    if (snapshot.empty) {
      for (const incident of incidents) {
        await addDoc(incidentsRef, incident);
      }

      console.log("✅ Incidents uploaded to Firebase!");
    } else {
      console.log("ℹ️ Incidents already exist in Firebase.");
    }
  } catch (error) {
    console.error("❌ Firebase upload error:", error);
  }
};

seedIncidents();