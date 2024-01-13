import cors from "cors";
import express from "express";
import admin from "firebase-admin";
import firebasekey from "./firebase-key.json" assert { type: "json" };
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app = express();
// enable cors
app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

admin.initializeApp({
    credential: admin.credential.cert(firebasekey)
});

const db = admin.firestore();

// add user data
app.post("/gevs/users/register", async (req, res) => {
    const { email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userRef = db.collection("users").doc(email);
        const uvcRef = db.collection("uvc").doc(req.body.uvc);

        const uvcDoc = await uvcRef.get();
        const doc = await userRef.get();

        if (doc.exists) {
            res.status(409).send("User already exists");
            return;
        }
        if (!uvcDoc.exists) {
            res.status(404).send("UVC not found");
            return;
        }
        if (uvcDoc.data().isUsed) {
            res.status(409).send("UVC already used");
            return;
        }
        const results = await db.collection("users").doc(email).set({
            ...req.body,
            isVoted: false,
            userType: "voter",
            password: hashedPassword,
        });
        const uvcResults = await db.collection("uvc").doc(req.body.uvc).update({ isUsed: true });
        res.status(201).send("User registered successfully");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

// get user data
app.post("/gevs/user/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password, req.body)
    try{
        const userRef = db.collection("users").doc(email);
        const doc = await userRef.get();
        if (!doc.exists) {
            res.status(404).send("User not found");
            return;
        }
        const results = doc.data();
        if (await bcrypt.compare(password, results.password) && results.email === email) {
            const responseData = {};
            if (results.userType === "officer") {
                responseData["isAuthenticated"] = true;
                responseData["userType"] = "officer";
                responseData["email"] = results.email;
            } else {
                responseData["userType"] = results.userType;
                responseData["email"] = results.email;
                responseData["isVoted"] = results.isVoted;
                responseData["constituency"] = results.constituency;
                responseData["fullName"] = results.fullName;
                responseData["dateOfBirth"] = results.dateOfBirth;
            }
            const accessToken = jwt.sign(responseData, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).send({ accessToken: accessToken });
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

// get candidates and parties based on constituency
app.get("/gevs/candidates/:constituencyName", async (req, res) => {
    const { constituencyName } = req.params;
    let parties = [];
    const candidates = [];
    try {
        const userRef = await db.collection("constituency").doc(constituencyName);
        const doc = await userRef.get();
        const results = doc.data();
        Object.keys(results).forEach((key) => {
            candidates.push({
                name: results[key].name,
                party: results[key].party,
            });
            parties.push(results[key].party);
        });
        parties = [...new Set(parties)];
        res.status(200).send({ candidates, parties });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

app.get("/gevs/results", async (req, res) => {
    const seats = []
    try {
        const userRef = await db.collection("constituency");
        const electionRef = await db.collection("election").doc("electionStatus");
        const doc = await userRef.get();
        const status = await electionRef.get();
        console.log(status.data());
        const results = doc.docs;
        results.forEach(element => {
            seats.push({
                constituency: element.id,
                candidates: element.data()
            });
        });

        res.status(200).send({ seats });

    } catch (error) {
        res.status(400).send(error.message);
    }

});






const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

