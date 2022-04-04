require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const helpers = require('handlebars-helpers')(['string'], { hbs });
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const port = 3000;

hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

// setting the spotify-api

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes

app.get('/', (req, res) => {
    spotifyApi
        .getNewReleases({ limit: 8, offset: 1, country: 'DE', locale: 'de_DE', timestamp: '2022-04-02T09:00:00' })
        .then(data => {
            const feature = data.body.albums.items;
            res.render('index', { title: 'Listen to your fav artist', feature });
        })
        .catch(error => {
            console.log(error);
        });
});

app.get('/artist-search', (req, res) => {

    const artistSearch = req.query.search

    spotifyApi
        .searchArtists(artistSearch, { limit: 6 })
        .then(data => {
            const artist = data.body.artists.items;
            res.render('artist-search', { keywords: artistSearch, artist });
        })
        .catch(error => {
            console.log(error);
        });
});

app.get('/albums/:id', (req, res) => {
    const id = (req.params.id);
    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            const album = data.body.items
            res.render('albums', { title: 'Listen to your fav artist', album });
        })
        .catch(error => {
            console.log(error);
        });
});

app.get('/tracks/:id', (req, res) => {
    const id = req.params.id;
    spotifyApi
        .getAlbumTracks(id, { limit: 6 })
        .then(data => {
            const tracks = data.body.items;
            console.log(tracks)
            res.render('tracks', { title: 'Listen to Tracks', tracks });
        })
        .catch(error => {
            console.log(error);
        });
});

app.use((req, res) => {
    res.status(404).render('404', { '404': true, title: '404' });
});

app.listen(process.env.PORT || port, () => console.log(`Server is listening on port ${port}`));