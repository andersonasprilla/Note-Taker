const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const uuid = require('./helpers/uuid')

const PORT = 3001;

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

// Route to serve the notes page (notes.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

// Route to serve the notes page (notes.html)
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

// API route to get all notes from the JSON file
app.get('/api/notes', (req, res) => {
    res.json(db)

    console.info(`${req.method} request received to get notes`)
})

// API route to post a new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body

    if (title && text) {
        const newNote = { title, text, id: uuid()}

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

//API route to delete a note by id
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('./db/db.json','utf8', (err, data) => {
        if(err) {
            console.error(err);
            return res.status(500).json({ error: 'Error reading notes data'})
        }

        let notes = JSON.parse(data);

        const filteredNotes = notes.filter(note => note.id !== noteId)

        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 4), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error writing notes data' });
            }

            res.json({ message: 'Note successfully deleted' });
            console.info(`DELETE request to remove note with id ${noteId} was successful`);
        })
        
    })
     
})



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

