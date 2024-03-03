const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const { networkInterfaces } = require('os');

const PORT = 3001;

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    res.json(db)

    console.info(`${req.method} request received to get notes`)
})

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body

    if (title && text) {
        const newNote = { title, text}

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if(err) {
                console.error(err)
                return res.status(500..json({error: "Error reading notes data"}))
            }
    
            const notes = JSON.parse(data)
            notes.push(newNote)

            fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => {
                if(err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error writing new note'}); 
                }
                res.json(newNote);
                console.info(`${req.method} request to add a new note was successful`)
            });
        });    
    } else {
        res.status(400).json({ error: "Please provide both a title and text for the note"})
    }

    
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

