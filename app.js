let express = require('express');
let app = express();
let mongo = require('mongodb')

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/';

app.use('/', express.static(__dirname + "/wwwRoot"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.listen(8000, function () {
    console.log('Listening on port 8000');
    console.log('Server running at http://127.0.0.1:8000/');
});




// DataBase IMDB 
app.get('/movies', function (request, response) {
    console.log(request.query.start);
    console.log(request.query.end);
    MongoClient.connect(url, { useNewUrlParser: true },
        function (err, dbMongo) {
            if (err) console.log(err);
            console.log("Connected correctly to server.");
            const dbMovies = dbMongo.db("Movies");


            dbMovies.collection("IMDB").find({}).toArray(
                function (err, result) {

                    let Startindex = 1;
                    if (request.query.start) Startindex = parseInt(request.query.start);
                    // console.log(result);

                    let previousIndex = Startindex - 14
                    let nextIndex = Startindex + 14
                    if (previousIndex <= 0) (previousIndex = 1)
                    if (nextIndex >= result.length - 14) (nextIndex = result.length - 13)
                    let dataToJS = {

                        movie: result.slice(parseInt(Startindex) - 1, parseInt(Startindex) + 13),
                        maxIndex: (result.length) - 13,
                        next: nextIndex,
                        previous: previousIndex

                    }
                    response.setHeader('Content-Type', 'text/html');
                    response.render('movieList.ejs', dataToJS);
                });

        });

});




app.get('/movies/:id', function (request, response) {

    MongoClient.connect(url, { useNewUrlParser: true },
        function (err, dbMongo) {

            const dbMovies = dbMongo.db("Movies");


            const query = { _id: mongo.ObjectId((request.params.id).substring(1)) };
            dbMovies.collection("IMDB").find(query).toArray(
                function (err, result) {
                    let dataToJS = {

                        result: result.Genre

                    }

                    response.setHeader('Content-Type', 'text/json');
                    response.send(result);
                    //  response.render('movieDetails.ejs', dataToJS);
                    // console.log(result);
                });

        });



});




app.delete('/movies/:id', function (request, response) {
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
        function (err, dbMongo) {
            const dbMovies = dbMongo.db("Movies");
            const query = { _id: mongo.ObjectId(request.params.id.replace(":", "")) };
            dbMovies.collection("IMDB").deleteOne(query,
                function (err, result) {
                    if (err) throw err;
                    response.send('deleted');
                });
        });
});

app.post('/movies', function (request, response) {
    console.log(request.body.Series_Title);
    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
        function (err, dbMongo) {
            const dbMovies = dbMongo.db("Movies");
            let newMovie = {
                Series_Title: request.body.Series_Title,
                Released_Year: request.body.Released_Year,
                Runtime: request.body.Runtime,
                Genre: request.body.Genre,
                IMDB_Rating: request.body.IMDB_Rating,
                Director: request.body.Director,
                Overview: request.body.Overview, 
                Poster_Link: request.body.Poster_Link
            };
            dbMovies.collection("IMDB").insertOne(newMovie,
                function (err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                });
        });

    // response.send(" Item Created")
    response.redirect('/movies')
});
//
app.get('/edit/:id', function (request, response) {

    MongoClient.connect(url, { useNewUrlParser: true },
        function (err, dbMongo) {

            const dbMovies = dbMongo.db("Movies");


            const query = { _id: mongo.ObjectId((request.params.id).substring(1)) };
            dbMovies.collection("IMDB").find(query).toArray(
                function (err, result) {


                    response.setHeader('Content-Type', 'text/html');

                    response.render('movieEdit.ejs', result[0]);
                    // console.log(result);
                });

        });



});
app.put('/movies/:id', function (request, response) {
    // // Le code pour l'update dans la base de données  
    console.log(request.params.id)
    // console.log(request.body);


    MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
        function (err, dbMongo) {
            if (err) throw err;
            const dbMovies = dbMongo.db("Movies");
            const query = {
                _id: mongo.ObjectId(
                    request.params.id.replace(":", ""))
            };


            let newvalues = {
                $set: {
                    Series_Title: request.body.Series_Title,
                    Released_Year: request.body.Released_Year,
                    Runtime: request.body.Runtime,
                    Genre: request.body.Genre,
                    IMDB_Rating: request.body.IMDB_Rating,
                    Director: request.body.Director,
                    Overview: request.body.Overview,
                    Poster_Link: request.body.Poster_Link,


                }
            };

            dbMovies.collection("IMDB").updateOne(query, newvalues,
                function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                });
        });
    response.send('Item Modified');
});