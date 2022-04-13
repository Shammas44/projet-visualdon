import * as d3 from 'd3';

const svg = d3.select('#svg');

const WIDTH = 10;



export function foo(matchs){

    let i = 0;
    svg.selectAll('rect')
        .data(matchs)
        .enter()
        .append('rect')
        .attr('x', (match, i) => i * WIDTH * 2 )
        .attr('y', '10')
        .attr('width', WIDTH)
        .attr('height', match => match.victory == 0 ? 1 : parseInt(match.victory))
        .attr('fill', 'tomato')
        .attr('style', 'transform:rotate(1turn);')

}



function salaud(){
//Promise.all récuère des données depuis des sources différentes et les met dans un array
Promise.all([
    json('https://jsonplaceholder.typicode.com/posts'),
    json('https://jsonplaceholder.typicode.com/users')
])
    //Une fois les données récupérées, la function
    .then(([posts, users]) => {
        console.log(posts)
        let longestPostCharacters = 0;
        let userWithLongestPostId = 0;
        let postWithLongestCharacters = NaN;
        users.forEach(user => {
            //définir combien on leur attribue de posts
            user.posts = [];
            posts.forEach(post => {
                //Regrouppement des posts appartenant aux utilisateur
                if (post.userId == user.id) {
                    user.posts.push(post);
                }
                //Récupération de l'utilisateur au post le plus long
                if (post.body.length > longestPostCharacters) {
                    longestPostCharacters = post.body.length;
                    userWithLongestPostId = post.userId;
                    postWithLongestCharacters = post
                }
            });
            console.log(user);
        });
        //affichae de l'utilisateur avec le plus long text
        let userWithLongestText = users.filter(user => user.id == userWithLongestPostId)
        console.log("longestText", userWithLongestText, longestPostCharacters)


        // Dessiner ici!
        console.log(users)
        let rectWidth = 5;

        const rectSvg = d3.select(".rectangles")
            .append("svg")
            .attr("width", 1000)
            .attr("height", 200)
            .attr("class", "svg-rect")

        //console.log(rectSvg)

        rectSvg.selectAll("users")
            .data(users)
            //console.log("posts user1", users[1].posts.length)
            .enter()
            .append("rect")
            .attr("width", rectWidth)
            //La hauteur correspond au nombre de pposts, soit la longeur de la propriété posts
            .attr("height", d => d.posts.length * 3)
            //.attr("height", d => console.log("d", d.posts))
            .attr("fill", "tomato")
            .attr("y", d => 60 - d.posts.length)
            .attr("x", (d, i) => i * 25 + 30*i)



            //Ajout du nombre de posts sous chaque barre
            rectSvg.selectAll("users")
            .data(users)
            //console.log("posts user1", users[1].posts.length)
            .enter()
            .append("text")
            .text(function (d) {return d.id})
            .attr("x", (d, i) => i * 25 + 30*i)
            .attr("y", d=> 130 - d.posts.length)


            //Ecrire dans le dom l'utilisateur avec le post le plus long

            d3.select(".user")
            .append("span")
            .attr("class", "userName")

            d3.select(".user")
            .append("br")

            d3.select(".user")
            .append("span")
            .attr("class", "userUserName")

            d3.select(".user")
            .append("br")

            d3.select(".user")
            .append("span")
            .attr("class", "userMail")

            d3.select(".user")
            .append("br")

            d3.select(".user")
            .append("span")
            .attr("class", "userPost")

            d3.select(".user")
            .append("br")

            d3.select(".user")
            .append("span")
            .attr("class", "userId")


            //récupération de l'utilisateur avec le plus long post
            let userToDisplay = userWithLongestText[0]
            //console.log(userWithLongestText)

            //Affichage de l'utilisateur dans le dom
            document.querySelector(".userName").textContent ="Nom de l'utilisateur:" + userToDisplay.name
            document.querySelector(".userUserName").textContent ="Username de l'utilisateur:" + userToDisplay.username
            document.querySelector(".userMail").textContent ="Email de l'utilisateur:" + userToDisplay.email
            document.querySelector(".userPost").textContent = "Post le plus long:" + postWithLongestCharacters.body


            //Nombre de posts par utilisateur
            d3.select(".postsPerUser")
            .append("span")
            .attr("class", "postsPerUserText")

            console.log(userToDisplay)
            document.querySelector(".postsPerUserText").textContent = "Nombre de posts par utilisateur:" + userToDisplay.posts.length


    })

}