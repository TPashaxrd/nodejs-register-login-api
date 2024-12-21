const express = require('express');
const app = express();
const port = 3000;

const userRoute = require("./routes/user.js");  

app.use(express.json());

app.use('/user', userRoute)

app.get('/', (req, res) => {
  res.send("I'm working!");
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
