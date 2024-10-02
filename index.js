import express from "express";
import axios from "axios";


const app = express();
const port = 3000;
const API_URL = "https://lingua-robot.p.rapidapi.com/language/v1/entries/en/";


app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/", async (req, res) => {
  const searchwr = req.body.id;
  try {
    const result = await axios.get(`${API_URL}${searchwr}`);
    const entries = result.data.entries;

    // Extract all definitions from the "lexemes" array, this was a problem i only knew how to add one but asked for chatgpt to find a method to use add all of them
    let definitions = [];
    entries.forEach(entry => {
      entry.lexemes.forEach(lexeme => {
        lexeme.senses.forEach(sense => {
          definitions.push(sense.definition);
        });
      });
    });

    // Render the extracted definitions,this also was part of the chatgpt i didnt know how to show the string
    res.render("index.ejs", { content: definitions.join("\n") });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response ? error.response.data : error.message) });
  }
});

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


  

