



console.log(document.getElementById('movie-card'));

function deleteApiMovie(idMovie) {

    fetch('/movies/:' + idMovie, { method: 'DELETE' })
        .then(function (response) {
            // console.log(response);
            alert("item Deleted")
            window.document.location = "/movies?start=1";
        })
        .catch(function (err) {
            console.log("Something went wrong!", err);
        });
}


function getApiMovie(id) {

    fetch('/movies/:' + id)
        .then(function (response) {
            return response.json();
        })
        .then(function (resultJson) {
            // console.log(resultJson[0]);
            document.getElementById("movie-card-details").innerHTML = `<img  style="min-height:100%; width:80%;" src="${resultJson[0].Poster_Link}" alt=" ">`;
            document.getElementById("card-title").innerText = resultJson[0].Series_Title;

            document.getElementById("year").innerText += " " + resultJson[0].Released_Year;
            document.getElementById("delay").innerText += " " + resultJson[0].Runtime;

            document.getElementById("genre").innerText += " " + resultJson[0].Genre;
            document.getElementById("rating").innerHTML += `${resultJson[0].IMDB_Rating}  <ion-icon name="star-outline"></ion-icon>`;

            document.getElementById("director").innerText += " " + resultJson[0].Director;

            document.getElementById("movie-description").innerHTML += "<br>" + resultJson[0].Overview;

            document.getElementById("delete").innerHTML = `<a  href='javascript:deleteApiMovie("${resultJson[0]._id}")'}'>  <button class="delete " id="delete">Delete</button></a>`;
            document.getElementById("modif").innerHTML = ` <a  href='/edit/:${resultJson[0]._id}'}'> <button class="delete " id="edit">Edit  </button> </a>`

        })
        .catch(function (err) {
            console.log("Something went wrong!", err);
        });



}

