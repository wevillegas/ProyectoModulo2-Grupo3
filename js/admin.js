// Hago referencia al formulario de creacion del itml 
const gameForm = document.getElementById("gameForm")

// me traigo el aray de juegos del localStorage 
let games = JSON.parse(localStorage.getItem("games")) || []

// hago referencia al modal de juegos para poder darle funciones en js
const modalJuegos = new bootstrap.Modal(document.getElementById("modalJuegos"));

// inicializo la variable existGame, la cual me servirá mas adelante para definir que funcion ejecutar dentro de la funcion saveGame()
let existGame = false

// creo la clase para añadir los juegos 
class Game {
    constructor(codigo, nombre, categoria, descripcion, precio, publicado, imagen, video) {
        this.code = codigo
        this.name = nombre
        this.categorie = categoria
        this.description = descripcion
        this.price = precio
        this.publicated = publicado
        this.IMG = imagen
        this.trailer = video
    }
}

// creo una variable en la cual hago referencia al boton para abrir el modal de juegos
let btnModalOpen = document.getElementById("btnModalOpen")
// a ese boton le agrego un evento onclick, el cual me va a limpiar el formulario y me va a establecer el titulo y otras cosas del modal
btnModalOpen.addEventListener("click", () => {
    clearForm()
    // cambio el titulo del modal por agregar juego
    document.getElementById("modalJuegosLabel").innerHTML = "Agregar juego"
    // inserto el asterisco que asigna al input de codigo como requerido
    document.getElementById("labelCode").innerHTML = `Codigo <span class="text-danger">*</span>`;
    //quito el bloqueo el input del codigo para que pueda ser agregado
    document.getElementById('gameCode').removeAttribute("disabled");
})


// FUNCION CREADORA DE JUEGOS


// creo los juegos 
const createGame = (evt) => {


    // me traigo los juegos del LS
    let localGames = JSON.parse(localStorage.getItem('games')) || []

    // Hago referencia al formulario del html
    const gameForm = document.getElementById("gameForm")

    // creo una variable con los valores de los input
    const {
        gameCode,
        gameName,
        gameCategorie,
        gameDescription,
        gamePrice,
        gamePublicated,
        gameIMG,
        gameTrailer
    } = gameForm.elements;

    // creo el nuevo juego usando la clase GAME definida anteriormente, asi todos los juegos creados tendrán la misma estructura 
    const game = new Game(gameCode.value, gameName.value, gameCategorie.value, gameDescription.value, gamePrice.value, gamePublicated.checked, gameIMG.value, gameTrailer.value);


    // si el codigo del juego coincide con uno ya creado, disparo un error y dejo de leer el codigo
    if (localGames.some(localGame => localGame.code === gameCode.value)) {
        Swal.fire({
            title: "Error",
            text: "Ya existe un juego con ese código",
            icon: "error",
            timer: 4000,
            timerProgressBar: true,
            allowEscapeKey: true,
        })
        return
    }

    // si todo salio bien, agrego el juego al array de juegos
    localGames.push(game)

    // envio el array de juegos con los nuevos cambios al local storage
    localStorage.setItem("games", JSON.stringify(localGames))

    // lanzo una alerta que indica que el juego se creo correctamente
    Swal.fire({
        title: "Juego agregado",
        text: "El juego se ha agregado correctamente",
        icon: "success",
        timer: 4000,
        timerProgressBar: true,
        allowEscapeKey: true,
    })

    // llamo a una funcion para que me limpie el formulario
    clearForm()

    modalJuegos.hide()

    // llamo a la funcion para que pinte los juegos en la tabla
    RenderGameList()
}


// FUNCION PARA LIMPIAR FORMULARIO 


function clearForm() {
    document.getElementById("gameForm").reset()
}

console.log(games)

// funcion para pintar los juegos en la tabla
function RenderGameList() {

    // traigo el array del local storage
    let games = JSON.parse(localStorage.getItem('games')) || []
    // hago referencia al body de la tabla
    let tableBody = document.getElementById("tableBody")
    // creo la variable donde irán los juegos, si no hay nada esta ira vacia
    let tableHTMLcode = ""

    // recorro el array de juegos, por cada juego iterado agregaré todo este codigo htmnl a la variable tableHTMLcode iniciada anteriormente (que es el juego iterado con todas sus propiedades)
    games.map(game => {
        tableHTMLcode += `<tr>
        <th scope="row">${game.code}</th>
        <td scope="row">${game.name}</td>
        <td scope="row">${game.categorie}</td>
        <td scope="row">${game.description}</td>
        <td scope="row">${game.price}</td>
        <td scope="row">${game.publicated}</td>
        <td scope="row">
        <div class="tableIMGContainer">
            <img src ="${game.IMG}">
        </div>
        </td>
        <td class="">
        <button class="btn btn-primary adminBTN" onclick="editGame(this)" id="${game.code}">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger adminBTN" onclick="deleteGame(this)" id="${game.code}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </tr>`
    })

    // agrego a la tabla el codigo html del tableHTMLcode y lo inserto en el html
    tableBody.innerHTML = tableHTMLcode

}


// FUNCION BARA BORRAR JUEGOS


function deleteGame(game) {
    // game.id es el code del juego
    // console.log(game.id)

    // llamo a la alerta
    Swal.fire({
        title: '¿Borrar juego?',
        text: "El cambio será permanente",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        // si en la alerta le doy a borrar, entonces se ejecuta este codigo
        if (result.isConfirmed) {
            // traigo los datos del localStorage
            let juegos = JSON.parse(localStorage.getItem("games")) || []

            // filtro el array traido del LS, el nuevo array que voy a retornar va a tener todos los juegos cuyo codigo NO sea igual al id del boton borrar(traido del html). Así mi nuevo array tendrá todos los juegos menos el que fue presionado para borrar, ya que su codigo coincide con el id del boton. O sea, que cuando se itero ese juego, el metodo filter devolvió un false (no se cumplio la condicion, la cual era que el codio del juego NO SEA IGUAL al id del boton), por lo tanto ese juego no entrará en el nuevo array
            let filteredGames = juegos.filter(juego => juego.code != game.id)

            // subo el array filtrado al localStorage con el nombre de games asi es sobrescrito y se guarden los cambios
            localStorage.setItem("games", JSON.stringify(filteredGames))

            // llamo a la alerta para avisar que el juego se borró correctamente
            Swal.fire(
                '¡Borrado!',
                'El juego fue borrada',
                'success'
            )
        }
        // llamo a la funcion para que se pinten los juegos en la tabla
        RenderGameList()
    })

}


// FUNCION PARA MODIFICAR JUEGOS PT 1


function editGame(editBtn) {
    // limpio los datos del formulario
    clearForm()

    // llamo al array del local storage
    let games = JSON.parse(localStorage.getItem("games")) || []

    // busco el juego a modificar a traves del metodo find, la condicion es que el codigo del juego sea igual al id del boton (que viene del html). O sea, que el id del boton del juego que precione sea igual al del juego iterado. Si se cumple la condicion, ese juego se guarda en la variable searchedGame
    let searchedGame = games.find(game => game.code === editBtn.id)

    // console.log(searchedGame)

    // hago referencia a los input del formulario de creacion de juego
    const {
        gameCode,
        gameName,
        gameCategorie,
        gameDescription,
        gamePrice,
        gamePublicated,
        gameIMG,
        gameTrailer
    } = gameForm.elements;

    // asigno los datos del juego buscado (a traves del metodo find) a los input del formulario de creacion de juegos
    gameCode.value = searchedGame.code
    gameName.value = searchedGame.name
    gameCategorie.value = searchedGame.categorie
    gameDescription.value = searchedGame.description
    gamePrice.value = searchedGame.price
    gamePublicated.checked = searchedGame.publicated
    gameIMG.value = searchedGame.IMG
    gameTrailer.value = searchedGame.trailer

    existGame = true

    // cambio el titulo del modal por modificar juego
    document.getElementById("modalJuegosLabel").innerHTML = "Modificar juego"
    // saco el asterisco que asignaba al inputr de codigo como requerido
    document.getElementById("labelCode").innerHTML = "Codigo";
    // bloqueo el input del codigo para que no se pueda modificarlo
    document.getElementById('gameCode').setAttribute("disabled", "");

    // muestro el modal de creacion/modificacion de juego
    modalJuegos.show()


}


//FUNCION PARA MODIFICAR JUEGOS PT 2


function changeGameData() {
    // llamo al array del juegos del local storage
    let games = JSON.parse(localStorage.getItem("games")) || []
    
    // creo variables a las cuales les voy a agregar el valor de los inputs del formulario
    let gameCode = document.getElementById("gameCode").value
    let gameName = document.getElementById("gameName").value
    let gameCategorie = document.getElementById("gameCategorie").value
    let gameDescription = document.getElementById("gameDescription").value
    let gamePublicated = document.getElementById("gamePublicated").checked
    let gameIMG = document.getElementById("gameIMG").value
    let gameTrailer = document.getElementById("gameTrailer").value
    
    // itero el array de juegos, si el codigo del juego iterado coincide con el valor del codigo de input (gameCode), entonces igualo cada propiedad del juego a los valores que se encuentran en los inputs del formulario, pudiendo así modificar los valores del juego
    games.map(game => {
        if(game.code === gameCode){
            game.name = gameName
            game.categorie = gameCategorie
            game.descripcion = gameDescription
            game.publicated = gamePublicated
            game.IMG = gameIMG
            game.video = gameTrailer
        }
    })
    
    
    // envio los cambios al local storage
    localStorage.setItem("games", JSON.stringify(games))
    
    // limpio el formulario
    clearForm()
    
    // cierro el modal del formulario
    modalJuegos.hide()
    
    // lanzo una alerta avisando que el juego fue modificado
    Swal.fire(
        'Juego modificado!',
        'Los datos del juego han sido modificados',
        'success'
        );
        
        // pinto el array de juegos en la tabla
        RenderGameList()
    }


    // creo una funcion (esta funcion se ejecutará cuando le de al boton guardar en el formulario de juegos) la cual me va a definir internamente que funcion se va a realizar, la de modificar datos del juego o la de crear juego nuevo. La variable existGame será la que me maneje eso, inicializo la variable al principio del codigo con un valor del false, en la funcion de editGame le asigno un valor true, asi cuando se ejecute esta funcion, el existgame tendra valor de verdadero, por lo cual se ejecutara la funcion de changeGameData. En cambio, si la funcion sigue siendo falsa (no presiono el btn de editar juego) entonces la funcion que se ejecutará será la de crear juego
    function saveGame(event) {
        event.preventDefault()
    
        if (existGame === true) {
            changeGameData()
        } else {
            createGame()
        }
    }

    // llamo a la funcion para que se pinten los juegos en la tabla
    RenderGameList()