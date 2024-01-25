
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const axios = require('axios');
const cheerio = require('cheerio');


app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app.get('/utente', (req, res) => {
    res.sendFile(__dirname + '/utente.html');
});



io.on('connection', (socket) => {
    console.log('Un dispositivo si è connesso');

    // Gestisci la ricerca ricevuta dalla pagina admin
    socket.on('ricercaAdmin', async (testoRicerca) => {
        console.log(`Ricevuta ricerca: ${testoRicerca}`);

        try {
            // Effettua la ricerca su YouTube
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    q: testoRicerca,
                    part: 'snippet',
                    type: 'video',
                    key: 'AIzaSyDNFR9M9oEuingIZWQpWF6X6WuqCAM1iRI', // Sostituisci con la tua chiave API di YouTube
                    maxResults: 1,
                },
            });

            // Estrai l'ID del video dal risultato della ricerca
            const videoId = response.data.items[0].id.videoId;

            // Costruisci l'URL del video su YouTube
            const youtubeURL = `https://www.youtube.com/watch?v=${videoId}`;
            console.log(youtubeURL)

            // Invia l'URL del video all'utente
            io.emit('videoUtente', youtubeURL);
        } catch (error) {
            console.error('Errore durante la ricerca su YouTube:', error.message);
        }
    });
});

server.listen(3000, () => {
    console.log('Server in ascolto sulla porta 3000');
});
