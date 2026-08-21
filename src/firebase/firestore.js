import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "./firebase";

const incidentsCollection = collection(
  db,
  "incidents"
);

// GET INCIDENTS
export const getIncidents = async () => {
  const snapshot = await getDocs(
    incidentsCollection
  );

  return snapshot.docs.map((document) => ({
    firebaseId: document.id,
    ...document.data(),
  }));
};

// ADD INCIDENT
export const addIncident = async (incident) => {
  const docRef = await addDoc(
    incidentsCollection,
    incident
  );

  return {
    firebaseId: docRef.id,
    ...incident,
  };
};

// UPDATE INCIDENT
export const updateIncident = async (
  firebaseId,
  updates
) => {
  const incidentRef = doc(
    db,
    "incidents",
    firebaseId
  );

  await updateDoc(
    incidentRef,
    updates
  );
};
// ================================
// ALERTS
// ================================

const alertsCollection = collection(
  db,
  "alerts"
);

// GET ALERTS

export const getAlerts = async () => {
  const snapshot = await getDocs(
    alertsCollection
  );

  return snapshot.docs.map((document) => ({
    firebaseId: document.id,
    ...document.data(),
  }));
};

// ADD ALERT

export const addAlert = async (alert) => {
  const docRef = await addDoc(
    alertsCollection,
    alert
  );

  return {
    firebaseId: docRef.id,
    ...alert,
  };
};

// DELETE ALL ALERTS

export const deleteAllAlerts = async () => {
  const snapshot = await getDocs(
    alertsCollection
  );

  for (const document of snapshot.docs) {
    await deleteDoc(
      doc(
        db,
        "alerts",
        document.id
      )
    );
  }
};
// ===============================
// RESPONDERS
// ===============================

const respondersCollection = collection(
  db,
  "responders"
);

// GET RESPONDERS
export const getResponders = async () => {
  const snapshot = await getDocs(respondersCollection);

  return snapshot.docs.map((document) => ({
    firebaseId: document.id,
    ...document.data(),
  }));
};
// REAL-TIME RESPONDERS

export const subscribeToResponders = (callback) => {
  return onSnapshot(
    respondersCollection,
    (snapshot) => {
      const responders = snapshot.docs.map(
        (document) => ({
          firebaseId: document.id,
          ...document.data(),
        })
      );

      callback(responders);
    },
    (error) => {
      console.error(
        "Error listening to responders:",
        error
      );
    }
  );
};
// ADD RESPONDER
export const addResponder = async (responder) => {
  const docRef = await addDoc(
    respondersCollection,
    responder
  );

  return {
    firebaseId: docRef.id,
    ...responder,
  };
};

// UPDATE RESPONDER
export const updateResponder = async (
  firebaseId,
  updates
) => {
  const responderRef = doc(
    db,
    "responders",
    firebaseId
  );

  await updateDoc(
    responderRef,
    updates
  );
};

// DELETE RESPONDER
export const deleteResponder = async (
  firebaseId
) => {
  const responderRef = doc(
    db,
    "responders",
    firebaseId
  );

  await deleteDoc(responderRef);
};
