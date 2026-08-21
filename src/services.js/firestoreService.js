import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase/firebase";


// ================================
// INCIDENTS
// ================================

const incidentsRef = collection(db, "incidents");


// Get all incidents
export const getIncidents = async () => {
  const snapshot = await getDocs(incidentsRef);

  return snapshot.docs.map((doc) => ({
    firestoreId: doc.id,
    ...doc.data(),
  }));
};


// Add incident
export const addIncident = async (incident) => {
  await addDoc(incidentsRef, incident);
};


// Update incident
export const updateIncident = async (
  firestoreId,
  data
) => {
  const incidentRef = doc(
    db,
    "incidents",
    firestoreId
  );

  await updateDoc(
    incidentRef,
    data
  );
};


// Real-time incidents
export const listenToIncidents = (
  callback
) => {

  return onSnapshot(
    incidentsRef,
    (snapshot) => {

      const incidents =
        snapshot.docs.map((doc) => ({
          firestoreId: doc.id,
          ...doc.data(),
        }));

      callback(incidents);

    }
  );
};