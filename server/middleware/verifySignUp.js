// add user data
app.post("/gevs/users/register", async (req, res) => {
    const { email } = req.body;
    try {
        const userRef = db.collection("users").doc(email);
        const uvcRef = db.collection("uvc").doc(req.body.uvc);

        const uvcDoc = await uvcRef.get();
        const doc = await userRef.get();

        if (doc.exists) {
            res.status(409).send("User already exists");
            return;
        }
        if (uvcDoc.data().isUsed) {
            res.status(409).send("UVC already used");
            return;
        }
        const results = await db.collection("users").doc(email).set(req.body);
        const uvcResults = await db.collection("uvc").doc(req.body.uvc).update({ isUsed: true });
        res.status(201).send("User registered successfully");
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});