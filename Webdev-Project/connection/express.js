const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');

const app = express();

// Setup Handlebars
app.engine('handlebars', exphbs({
    helpers: {
        currentYear: () => new Date().getFullYear()
    }
}));
app.set('view engine', 'handlebars');

// Set the views directory
app.set('views', path.join(__dirname, '..', 'views/pages'));

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Load JSON data
const loadJsonData = (filename) => {
    const filePath = path.join(__dirname, '..', 'data', filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Routes
app.get('/', (req, res) => {
    const services = loadJsonData('services.json');
    const features = loadJsonData('features.json');
    const userOptions = loadJsonData('userOptions.json');

    res.render('index', {
        pageTitle: 'Home',
        isHome: true,
        mapLink: 'https://goo.gl/maps/yourMapLink',
        ...services,
        ...features,
        userOptions
    });
});

// Additional routes
app.get('/about', (req, res) => {
    res.render('about', { 
        pageTitle: 'About Us',
        isAbout: true 
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', { 
        pageTitle: 'Contact',
        isContact: true 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;