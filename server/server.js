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

// add uvc data. this is for testing purpose
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

// add constituency data. this is for testing purpose
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

// get electrol district's votes
app.get("/gevs/constituency/:constituencyName", async (req, res) => {
    const { constituencyName } = req.params;
    try {
        const constRef = await db.collection("constituency").doc(constituencyName);
        const regionalData = await constRef.get();
        const results = [];
        if (regionalData.exists) {
            const data = regionalData.data();
            // Use Object.entries to iterate over the properties of the document
            Object.entries(data).forEach(([key, doc]) => {
                results.push({
                    name: doc.name,
                    party: doc.party,
                    vote: doc.vote,
                });
            });
            res.status(200).send({
                constituency: constituencyName,
                results
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }

});

// get all electrol district's votes
app.get("/gevs/results", async (req, res) => {
    try {
        const electionStatusRef = await db.collection("election").doc("electionStatus");
        const electionSnapshot = await electionStatusRef.get();
        const electionStatus = electionSnapshot.data();
        const constituencyRef = await db.collection("constituency");
        const constSnapshot = await constituencyRef.get();
        const maxVoteCandidates = [];

        let votesCast = false; // Flag to check if any votes are cast

        const overallResults = {
            status: "Pending",
            winner: "Pending",
            seats: []
        };

        if (electionStatus === "end") {
            overallResults.status = "Completed";
        } else if (electionStatus === "started") {
            overallResults.status = "Pending";
        } else {
            // Assume election has not started
            overallResults.status = "not started";
        }

        if (overallResults.status === "not started") {
            res.status(200).send(overallResults);
            return;
        }

        constSnapshot.forEach(doc => {
            const constituencyName = doc.id;
            const candidates = doc.data();

            let maxVotes = -1;
            let maxVoteCandidate = null;

            // Iterate over candidates in the constituency
            Object.values(candidates).forEach(candidate => {
                if (candidate.vote > maxVotes) {
                    maxVotes = candidate.vote;
                    maxVoteCandidate = {
                        name: candidate.name,
                        party: candidate.party,
                        votes: candidate.vote
                    };
                }

                // Check if any votes are cast
                if (candidate.vote > 0) {
                    votesCast = true;
                }
            });

            // Add the result to the array
            maxVoteCandidates.push({
                constituency: constituencyName,
                candidate: maxVoteCandidate
            });
        });

        // Check if any votes are cast before determining the winner
        if (votesCast) {
            // Calculate total seats for each party
            const partySeats = {};

            maxVoteCandidates.forEach(result => {
                const { candidate, constituency } = result;

                if (partySeats[candidate.party]) {
                    partySeats[candidate.party]++;
                } else {
                    partySeats[candidate.party] = 1;
                }
            });

            // Find the party with the most seats
            let maxSeats = -1;
            let winningParty = "Hung Parliament";

            Object.entries(partySeats).forEach(([party, seats]) => {
                if (seats > maxSeats) {
                    maxSeats = seats;
                    winningParty = party;
                }
            });

            // Update overall results
            overallResults.winner = winningParty;

            // Format seats for each party
            overallResults.seats = Object.entries(partySeats).map(([party, seats]) => ({
                party,
                seat: seats.toString()
            }));
        }

        res.status(200).send(overallResults);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.get("/gevs/electoral/results", async (req, res) => {
    try {
        const electionStatusRef = await db.collection("election").doc("electionStatus");
        const electionSnapshot = await electionStatusRef.get();
        const electionStatus = electionSnapshot.data();

        const constituencyRef = await db.collection("constituency");
        const constSnapshot = await constituencyRef.get();
        const results = [];

        constSnapshot.forEach(doc => {
            const constituencyName = doc.id;
            const candidates = doc.data();
            const constituencyResult = {
                constituency: constituencyName,
                results: []
            };
            Object.values(candidates).forEach(candidate => {
                constituencyResult.results.push({
                    name: candidate.name,
                    party: candidate.party,
                    vote: candidate.vote
                });
            });
            results.push(constituencyResult);
        });
        res.status(200).send({ electionStatus, results });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post("/gevs/consitiuency/candidate/vote", async (req, res) => {
    const { constituencyName, candidateName } = req.body;
    try {
        const constRef = await db.collection("constituency").doc(constituencyName);
        const regionalData = await constRef.get();
        if (regionalData.exists) {
            const data = regionalData.data();
            // Use Object.entries to iterate over the properties of the document
            Object.entries(data).forEach(async ([key, doc]) => {
                if (doc.name === candidateName) {
                    const results = await constRef.update({
                        [key]: {
                            ...doc,
                            vote: doc.vote + 1
                        }
                    });
                    res.status(200).send("Vote added successfully");
                }
            });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});



const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

