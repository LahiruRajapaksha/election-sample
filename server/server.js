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

app.put("/api/users/register", async (req, res) => {
        console.log("Error updating user", req.body);
});

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

