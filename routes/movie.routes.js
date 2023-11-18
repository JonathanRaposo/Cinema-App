
const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie.model');




// GET route to show form to add movie:
router.get('/movies/create', (req, res) => {
    res.render('movies/create.hbs')
})

// process form to create movie:
router.post('/movies/create', (req, res, next) => {
    console.log('body: ', req.body)
    const { title, director, description, image, stars, showtimes } = req.body;

    if (!title || !director || !description || !stars || !showtimes) {
        res.render('movies/create.hbs', { errorMessage: 'All fields must be filled.' });
        return;
    }

    const newStarsArr = stars.split(',');
    const newShowtimesArr = showtimes.split(',');

    Movie.create({ title, director, description, image, stars: newStarsArr, showtimes: newShowtimesArr })
        .then((newMovie) => {
            console.log('New movie added: ', newMovie)
            res.redirect('/movies');
        })
        .catch((err) => {
            console.log('Error while creating movie: ', err)
            next(err);
        })
})

//  GET route to show form to update movie:
router.get('/movies/edit', (req, res) => {

    const { id } = req.query;
    Movie.findById(id)
        .then((movieFromDB) => {
            res.render('movies/edit.hbs', { movie: movieFromDB })
        })
        .catch((err) => {
            console.log('Error while retrieving movie: ', err);
        });
})
//  POST route to process form:

router.post('/movies/edit', (req, res, next) => {

    const { id } = req.query;
    const { title, director, description, image, stars, showtimes } = req.body;

    if (!title || !director || !description || !stars || !showtimes) {
        res.render('movies/create.hbs', { errorMessage: 'All fields must be filled.' });
        return;
    }

    const newStarsArr = stars.split(',');
    const newShowtimesArr = showtimes.split(',');

    Movie.findByIdAndUpdate(id, { title, director, description, image, stars: newStarsArr, showtimes: newShowtimesArr }, { new: true })
        .then((updatedMovie) => {
            console.log('Updated movie: ', updatedMovie);
            res.redirect(`/movies/${updatedMovie._id}`);
        })
        .catch((err) => {
            console.log('Error while updating movie: ', err);
            next(err);
        });
})

// POST route to delete a movie:

router.post('/movies/delete', (req, res, next) => {
    console.log('Query: ', req.query)
    const { id } = req.query;

    Movie.findByIdAndDelete(id)
        .then(() => {
            console.log('Movie deleted.')
            res.redirect('/movies')
        })
        .catch((err) => {
            console.log('Error while deleting movie:', err);
            next(err)
        })
})

//  GET route to retrieve all movies:

router.get('/movies', (req, res, next) => {

    Movie.find()
        .then((moviesFromDB) => {
            res.render('movies/movies-list', { movies: moviesFromDB });
        })
        .catch((err) => {
            console.log('Error while retrieving movies: ', err)
            next(err);
        });
});

//  GET route to find a specific movie: 

router.get('/movies/:id', (req, res, next) => {
    console.log('params: ', req.params)
    const { id } = req.params;

    Movie.findOne({ _id: id })
        .then((movieFromDB) => {
            res.render('movies/movie-details.hbs', { movie: movieFromDB });
        })
        .catch((err) => {
            console.log('Error retrieving movie: ', err)
            next(err);
        });
})

//  Search for a movie :
router.get('/search', (req, res, next) => {
    console.log('query: ', req.query);
    const { q: query } = req.query;

    Movie.find(
        {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }
    )
        .then((movie) => {
            console.log('Found movie: ', movie);

            if (movie.length === 0) {
                res.render('movies/no-results.hbs', { message: `No results for "${query}"` });
                return;
            }
            res.render('movies/movies-list', { movies: movie })
        })
        .catch((err) => {
            console.log('Error while searching for movie: ', err);
            next(err);
        })
})
module.exports = router;