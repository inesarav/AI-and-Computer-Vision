const express = require('express');
const multer = require('multer');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurer le stockage pour les fichiers téléchargés
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware pour le traitement des fichiers téléchargés
app.post('/predict', upload.single('image'), async (req, res) => {
    try {
        // Récupérer l'image téléchargée depuis la requête
        const imageBuffer = req.file.buffer;

        // Charger le modèle à partir de l'URL avec la clé API
        const modelURL = 'https://detect.roboflow.com/logos-dbiuf/2?api_key=GCrKmtpuwK34pMbIxT1Z';
        const apiKey = 'GCrKmtpuwK34pMbIxT1Z';
        const response = await axios.post(modelURL, { image: imageBuffer }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Traiter la réponse du modèle
        const prediction = response.data.prediction;
        res.json({ prediction });
    } catch (error) {
        console.error('Erreur lors du traitement de la requête :', error);
        res.status(500).json({ error: 'Erreur lors du traitement de la requête' });
    }
});

// Servir le fichier index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
