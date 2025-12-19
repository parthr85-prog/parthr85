import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

export default async function testFirestore() {
  await addDoc(collection(db, "test"), {
    name: "Firebase Connected",
    time: Date.now()
  });
}
