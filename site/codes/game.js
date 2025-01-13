const advanceButton = document.getElementById("advance-button");
const mapSection = document.getElementById("game-section");
const quizCont = document.getElementById("quiz-container");
const dataCont = document.getElementById("data-container");
// Criar o mapa com uma visão global
var map = L.map("map").setView([0, 0], 2); // Posição inicial no centro do mundo (0, 0) com zoom 2

// Adicionar o tile layer (camada de mapa)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Evento de clique no mapa
var modo = JSON.parse(localStorage.getItem("modo"));
console.log(modo);

var type;

var lat = 0; // latitude
var lng = 0; // longetiude

var currentChallengeIndex = 0; // Índice do desafio atual
var selecionado = 0;
var currentChallenge;

map.on("click", function (e) {
  // Captura as coordenadas do clique
  lat = e.latlng.lat;
  lng = e.latlng.lng;

  console.log(lat);
  console.log(lng);

  advanceButton.style.display = "block";
});

function carregarSlider() {
  if (modo != null) {
    const challenges = modo.challenges;
    type = 1;
    const name = document.getElementById("modo-nome");
    name.innerText = modo.modo;

    if (challenges && challenges.length > 0) {
      selecionado = 0;
      lat = 0;
      lng = 0;
      type = 1;
      mapSection.style.display = "flex";
      quizCont.style.display = "none";
      advanceButton.style.display = "none";
      dataCont.style.display = "none";
      const buttons = document.querySelectorAll(
        "#opcao1, #opcao2, #opcao3, #opcao4"
      );
      buttons.forEach((button) => {
        button.style.backgroundColor = ""; // Restaurar a cor original
      });

      const desafio = document.getElementById("desafio-info");
      desafio.innerText =
        "Desafio " + (currentChallengeIndex + 1) + "/" + modo.quantidade;
      currentChallenge = challenges[currentChallengeIndex]; // Pega o desafio atual

      // Acessando as imagens do mapChallenge
      const mapChallenge = currentChallenge.mapChallenge;
      const image1 = mapChallenge.image1;
      const image2 = mapChallenge.image2;
      const image3 = mapChallenge.image3;

      // Atribuindo as imagens aos slides
      document.getElementById("slide-1").src = image1;
      document.getElementById("slide-2").src = image2;
      document.getElementById("slide-3").src = image3;
    }
  }
}

// AVANÇAR ENTRE AS PARTES DOS DESAFIOS
function advance(event) {
  console.log(type);
  if (type == 1) {
    if (lat != 0 && lng != 0) {
      mapSection.style.display = "none";
      const quiz = currentChallenge.quiz;
      criarQuiz(quiz);
      advanceButton.style.display = "none";
      type = 2;
    } else {
      window.alert("Selecione o local no mapa!");
    }
  } else if (type == 2) {
    quizCont.style.display = "none";
    const dataChallenge = currentChallenge.dataChallenge;
    criarDataChallenge(dataChallenge);
    type = 3;
  } else {
    carregarProximoDesafio();
  }
}

function criarQuiz(quiz) {
  // Exibir a pergunta
  quizCont.style.display = "block";
  const pergunta = document.getElementById("quiz-pergunta");
  pergunta.textContent = quiz.perg;

  // Criar as opções
  const options = [quiz.opcao1, quiz.opcao2, quiz.opcao3, quiz.opcao4];

  const optionButton1 = document.getElementById("opcao1");
  optionButton1.textContent = quiz.opcao1;
  optionButton1.setAttribute("data-option", 1);
  optionButton1.addEventListener("click", verificarResposta);

  const optionButton2 = document.getElementById("opcao2");
  optionButton2.textContent = quiz.opcao2;
  optionButton2.setAttribute("data-option", 2);
  optionButton2.addEventListener("click", verificarResposta);

  const optionButton3 = document.getElementById("opcao3");
  optionButton3.textContent = quiz.opcao3;
  optionButton3.setAttribute("data-option", 3);
  optionButton3.addEventListener("click", verificarResposta);

  const optionButton4 = document.getElementById("opcao4");
  optionButton4.textContent = quiz.opcao4;
  optionButton4.setAttribute("data-option", 4);
  optionButton4.addEventListener("click", verificarResposta);
}

function criarDataChallenge(dataChallenge) {
  dataCont.style.display = "block";
  const pergunta = document.getElementById("data-pergunta");
  pergunta.textContent = dataChallenge.perg;

  const dataInput = document.getElementById("data-response");
}

function verificarResposta(event) {
  if (selecionado === 0) {
    // Comparação correta usando ===
    selecionado = parseInt(event.target.getAttribute("data-option"));
    // Destacar o botão clicado
    event.target.style.backgroundColor = "#003300"; // Cor de fundo destacada
    event.target.style.color = "white"; // Cor do texto destacada
    advanceButton.style.display = "block";
  }
}
function verificarDataResposta(correctDate) {
  const selectedDate = document.getElementById("data-response").value;

  console.log(correctDate);
  console.log(selectedDate);

  if (selectedDate === correctDate) {
    return true;
  } else {
    return false;
  }
}

function carregarProximoDesafio() {
  console.log(currentChallengeIndex);
  currentChallengeIndex++;
  if (currentChallengeIndex < modo.challenges.length) {
    carregarSlider();
  } else {
    alert("Todos os desafios foram concluídos!");
  }
}

// Carregar os sliders quando a página for carregada
window.onload = carregarSlider;
