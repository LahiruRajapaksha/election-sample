import cors from "cors";
import express from "express";



const app = express();
app.use(cors());
app.use(express.json());


const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
