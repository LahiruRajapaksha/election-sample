import cors from "cors";
import express from "express";
import admin from "firebase-admin";
import firebasekey from "./firebase-key.json" assert { type: "json" };


const app = express();
app.use(cors());
app.use(express.json());
admin.initializeApp({
    credential: admin.credential.cert(firebasekey)
});

const db = admin.firestore();


app.post("/api/users/register", async (req, res) => {
const {email} = req.body;
try{
    const userRef = db.collection("users").doc(email);
    const doc = await userRef.get();
    if(doc.exists){
        res.status(409).send("User already exists");
        return;
    }
    const results = await db.collection("users").doc(email).set(req.body);
    res.status(201).send("User registered successfully");
} 
catch(error){
    res.status(400).send(error.message);
}
}
)
app.post("/api/user/login", async (req, res) => {
    const {email, password} = req.body;
    try{
        const userRef = db.collection("users").doc(email);
        const doc = await userRef.get();
        const results = doc.data();
        console.log(results);
        if(results.password === password && results.email === email){
            res.status(200).send("User logged in successfully");
            return;
        }
        else {
                res.status(401).send("Invalid credentials");
            }
        }
        //res.status(200).send("User logged in successfully"); 
    catch(error){
        res.status(400).send(error.message);
    }
});

app.post("/api/uvc", async (req, res) => {
    const { uvc, isUsed } = req.body;
    try {
        const results = await db.collection("uvc").doc(uvc).set({ isUsed: isUsed });
        res.status(201).send("Uvc added successfully");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

app.post("/api/constituency/addCandidate", async (req, res) => {
    const { data, constituency } = req.body;
    try {
        const results = await db.collection("constituency").doc(constituency).set({ ...data });
        res.status(201).send("Candidate added successfully");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

app.get("/api/constituency/:constituencyName", async (req, res) => {
    const { constituencyName } = req.params;
    try {
        const userRef = await db.collection("constituency").doc(constituencyName);
        const doc = await userRef.get();
        const results = doc.data();
        res.status(200).send(results);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

