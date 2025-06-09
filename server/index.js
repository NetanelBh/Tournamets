import express from 'express';

const app = express();

// body-parser is a built-in middleware function in Express after version 4.16.0
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
