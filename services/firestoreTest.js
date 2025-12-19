// services/firestoreTest.js
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const testFirestore = async () => {
  try {
    console.log("✅ Starting Firestore test setup...");

    // --- USERS ---
    const users = [
      { uid: "uid1", name: "Rajesh Patel", phone: "+919876543210", role: "labour_contractor" },
      { uid: "uid2", name: "Mehul Contractor", phone: "+919812345678", role: "contractor" },
      { uid: "uid3", name: "Main Company", phone: "+919898765432", role: "main_contractor" }
    ];

    for (const user of users) {
      await setDoc(doc(db, "users", user.uid), {
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: serverTimestamp()
      });
      console.log(`📄 User created: ${user.name}`);
    }

    // --- LABOUR TEAMS ---
    const labourTeamRef = collection(db, "labourTeams");
    await addDoc(labourTeamRef, {
      teamName: "Team A",
      createdBy: "uid1", // labour_contractor
      members: [
        { name: "Labour 1", phone: "+919800000001" },
        { name: "Labour 2", phone: "+919800000002" }
      ],
      createdAt: serverTimestamp()
    });
    console.log("📄 Sample Labour Team created");

    // --- PROJECTS ---
    const projectsRef = collection(db, "projects");
    await addDoc(projectsRef, {
      projectName: "Bridge Project",
      contractor: "uid2",
      mainContractor: "uid3",
      status: "ongoing",
      createdAt: serverTimestamp()
    });
    console.log("📄 Sample Project created");

    // --- COMPANY DATA ---
    const companyDataRef = collection(db, "companyData");
    await addDoc(companyDataRef, {
      companyName: "Buildo Constructions",
      address: "Ahmedabad, India",
      mainContractorId: "uid3",
      createdAt: serverTimestamp()
    });
    console.log("📄 Sample Company Data created");

    console.log("✅ Firestore test setup completed!");
  } catch (err) {
    console.error("❌ Error in testFirestore:", err);
  }
};

