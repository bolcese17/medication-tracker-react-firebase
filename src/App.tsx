import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { db, auth } from "./firebase/config";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  date: string;
  userId: string;
  createdAt?: unknown;
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [date, setDate] = useState("");
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const fetchMedications = async (currentUser: User) => {
    try {
      const q = query(
        collection(db, "medications"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const meds: Medication[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Medication, "id">),
      }));

      setMedications(meds);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMedications(user);
    } else {
      setMedications([]);
    }
  }, [user]);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Signup error:", error);
      alert(`Signup error: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Login error:", error);
      alert(`Login error: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      alert("Error logging out");
    }
  };

  const addMedication = async () => {
    if (!user) {
      alert("Please log in first");
      return;
    }

    if (!medication.trim()) {
      alert("Please enter a medication name");
      return;
    }

    try {
      await addDoc(collection(db, "medications"), {
        name: medication,
        dosage: dosage,
        date: date,
        userId: user.uid,
        createdAt: new Date(),
      });

      setMedication("");
      setDosage("");
      setDate("");
      await fetchMedications(user);
    } catch (error) {
      console.error(error);
      alert("Error saving medication");
    }
  };

  const deleteMedication = async (id: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, "medications", id));
      await fetchMedications(user);
    } catch (error) {
      console.error(error);
      alert("Error deleting medication");
    }
  };

  if (!user) {
    return (
      <div
      style={{
        maxWidth: "700px",
        margin: "60px auto",
        padding: "24px",
        fontFamily: "Arial, sans-serif"
      }}
      >
        <h1>Medication Tracker</h1>
        <h2>Log In or Sign Up</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSignUp}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#333",
              color: "white",
              cursor: "pointer"
            }}
          >
            Sign Up
          </button>
            <button 
            onClick={handleLogin}
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#333",
              color: "white",
              cursor: "pointer"
            }}
            >Log In</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
    style={{
      maxWidth: "700px",
      margin: "60px auto",
      padding: "24px",
      fontFamily: "Arial, sans-serif"
    }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Medication Tracker</h1>
        <button
  onClick={handleLogout}
  style={{
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#333",
    color: "white",
    cursor: "pointer"
  }}
>
  Log Out
</button>
      </div>

      <p>Signed in as: {user.email}</p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
      <input
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          placeholder="Medication"
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

          <input
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="Dosage"
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />
        <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />  

        <button
          onClick={addMedication}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#333",
            color: "white",
            cursor: "pointer"
          }}
        >
          Save
        </button>
      </div>

      <h2>Saved Medications</h2>

      {medications.length === 0 ? (
        <p>No medications logged yet.</p>
      ) : (
        <ul style={{ paddingLeft: "20px" }}>
          {medications.map((med) => (
            <li key={med.id} style={{ marginBottom: "12px" }}>
              {med.name} — {med.dosage} — {med.date}
              <button
                onClick={() => deleteMedication(med.id)}
                style={{
                  marginLeft: "10px",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#444",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;