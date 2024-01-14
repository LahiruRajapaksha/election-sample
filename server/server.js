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

        const totalSeats = {};

        const constituencyTotal = {};
        const seatsPerConstituency = {};
        const totalVotesPerConstituency = {};

        constSnapshot.forEach(doc => {
            const constituencyName = doc.id;
            const candidates = doc.data();
            const constituencyVotes = {};
            Object.values(candidates).forEach(candidate => {
                if (constituencyVotes[candidate.party]) {
                    constituencyVotes[candidate.party] += candidate.vote;
                } else {
                    constituencyVotes[candidate.party] = candidate.vote;
                }
            });
            constituencyTotal[constituencyName] = constituencyVotes;
        });

        Object.entries(constituencyTotal).forEach(([constituencyName, votesPerParty]) => {
            const totalVotes = Object.values(votesPerParty).reduce((acc, votes) => acc + votes, 0);
            totalVotesPerConstituency[constituencyName] = totalVotes;

            const seats = {};
            Object.entries(votesPerParty).forEach(([party, votes]) => {
                // Check if a party gets 2/3 or more votes in the constituency
                if (totalVotes > 0) {
                    seats[party] = votes >= (2 / 3) * totalVotes ? 1 : 0;
                } else {
                    seats[party] = 0;
                }
            });
            seatsPerConstituency[constituencyName] = seats;
        });

        Object.values(seatsPerConstituency).forEach(seats => {
            Object.entries(seats).forEach(([party, seat]) => {
                if (totalSeats[party]) {
                    totalSeats[party] += seat;
                } else {
                    totalSeats[party] = seat;
                }
            });
        });

        // Determine the winner based on 2/3 of total seats
        let winningParty = ["Hung Parliament"];

        Object.entries(totalSeats).forEach(([party, seats]) => {
            if (seats > (2 / 3) * Object.values(totalSeats).reduce((acc, s) => acc + s, 0)) {
                winningParty.push(party);
            }
        });

        let overallResults = {};

        if (electionStatus.status === "end") {
            overallResults = {
                status: "Completed",
                winner: winningParty.pop(),
                seats: Object.entries(totalSeats).map(([party, seats]) => {
                    return {
                        party,
                        seats
                    };
                })
            };
        } else if (electionStatus.status === "started") {
            overallResults = {
                status: "In Progress",
                winner: "Pending",
                seats: Object.entries(totalSeats).map(([party, seats]) => {
                    return {
                        party,
                        seats
                    };
                })
            };
        } else {
            overallResults = {
                status: "Not Started",
                winner: "",
                seats: []
            };
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
        const constituencyTotal = {};

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


        constSnapshot.forEach(doc => {
            const constituencyName = doc.id;
            const candidates = doc.data();
            const constituencyVotes = {};
            Object.values(candidates).forEach(candidate => {
                if (constituencyVotes[candidate.party]) {
                    constituencyVotes[candidate.party] += candidate.vote;
                } else {
                    constituencyVotes[candidate.party] = candidate.vote;
                }
            });
            constituencyTotal[constituencyName] = constituencyVotes;
        });
        res.status(200).send({ electionStatus, results, constituencyTotal });
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

