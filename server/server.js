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
    console.log("data retrieved",req.body);
}
)


const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

