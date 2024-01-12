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

// add user data
app.post("/gevs/users/register", async (req, res) => {
    const { email } = req.body;
    try {
        const userRef = db.collection("users").doc(email);
        const doc = await userRef.get();
        if (doc.exists) {
            res.status(409).send("User already exists");
            return;
        }
        const results = await db.collection("users").doc(email).set(req.body);
        res.status(201).send("User registered successfully");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

// get user data
app.post("/gevs/user/login", async (req, res) => {
    const {email, password} = req.body;
    try{
        const userRef = db.collection("users").doc(email);
        const doc = await userRef.get();
        const results = doc.data();
        console.log(results);
        if (!results) {
            res.status(404).send("User not found");
            return;
        }
        if(results.password === password && results.email === email){
            res.status(200).send({
                name: results.name,
                email: results.email,
                constituency: results.constituency,
                isVoted: results.isVoted,
            });
            return;
        }
        else {
                res.status(401).send("Invalid credentials");
            }
    }
    catch(error){
        res.status(400).send(error.message);
    }
});

// add uvc data
app.post("/gevs/uvc", async (req, res) => {
    const { uvc, isUsed } = req.body;
    try {
        const results = await db.collection("uvc").doc(uvc).set({ isUsed: isUsed });
        res.status(201).send("Uvc added successfully");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

// add constituency data
app.post("/gevs/constituency/addCandidate", async (req, res) => {
    const { data, constituency } = req.body;
    try {
        const results = await db.collection("constituency").doc(constituency).set({ ...data });
        res.status(201).send("Candidate added successfully");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

app.get("/gevs/candidates/:constituencyName", async (req, res) => {
    const { constituencyName } = req.params;
    let parties = [];
    const candidates = [];
    try {
        const userRef = await db.collection("constituency").doc(constituencyName);
        const doc = await userRef.get();
        const results = doc.data();
        console.log(typeof (results));
        Object.keys(results).forEach((key) => {
            candidates.push({
                name: results[key].name,
                party: results[key].party,
            });
            parties.push(results[key].party);
        });
        // results.forEach(element => {
        //     candidates.push({
        //         name: element.name,
        //         party: element.party,
        //     });
        //     parties.push(element.party);
        // });
        parties = [...new Set(parties)];

        res.status(200).send({ candidates, parties });
        // res.status(200).send(results);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});




const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

