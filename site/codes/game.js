const advanceButton = document.getElementById("advance-button");
const mapSection = document.getElementById("game-section");
const quizCont = document.getElementById("quiz-container");
const dataCont = document.getElementById("data-container");
const cidadeDiv = document.getElementById("cidade-div");
const cidadeElement = document.getElementById("cidade-info");
const answerCard = document.getElementById("answer");
const date = document.getElementById("data-response");
const resultCard = document.getElementById("result");

const resultImg = document.getElementById("result-img");
const resultText = document.getElementById("result-text");
const resultPoints = document.getElementById("result-points");

var map = L.map("map").setView([0, 0], 2); // Posição inicial no centro do mundo (0, 0) com zoom 2

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var modo = JSON.parse(localStorage.getItem("modo"));
//console.log(modo);

var cidade;
var resposta;

var type;

var points = 0;

var lat = 0;
var lng = 0;

var currentChallengeIndex = 0;
var selecionado = 0;
var currentChallenge;

var currentQuiz;

map.on("click", async function (e) {
  lat = e.latlng.lat;
  lng = e.latlng.lng;

  cidade = await getCityFromCoordinates(lat, lng);

  if (cidade != "Cidade não encontrada") {
    cidadeDiv.style.display = "block";
    advanceButton.style.display = "block";
    cidadeElement.innerText = `${cidade}`;
  }
});

async function getCityFromCoordinates(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    if (!response.ok) {
      throw new Error("Falha ao obter os dados da API");
    }
    const data = await response.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      "Cidade não encontrada"
    );
  } catch (error) {
    console.error("Erro ao obter a cidade:", error);
    return "Erro ao obter a cidade";
  }
}

function carregarSlider() {
  advanceButton.style.display = "none";
  cidadeDiv.style.display = "none";
  answerCard.style.display = "none";
  resultCard.style.display = "none";
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
async function advance(event) {
  console.log(type);
  if (type === 1) {
    if (lat != 0 && lng != 0) {
      var correct = false;

      try {
        // Obter a cidade do local do desafio atual
        const attemptCity = await getCityFromCoordinates(lat, lng);
        const answerCity = await getCityFromCoordinates(
          currentChallenge.mapChallenge.lat,
          currentChallenge.mapChallenge.long
        );
        console.log(`Attempt: ${attemptCity}, Answer: ${answerCity}`);
        // Exibir os resultados no HTML
        if (answerCity === attemptCity) {
          correct = true;
        } else {
          resultPoints.innerText = "Resultado: " + answerCity;
          correct = false;
        }
      } catch (error) {
        console.error("Erro ao obter a cidade:", error);
      }
      mapSection.style.display = "none";
      const quiz = currentChallenge.quiz;
      cidadeDiv.style.display = "none";
      resultCard.style.display = "block";
      if (correct === true) {
        resultImg.src = "../images/icons/result.png";
        resultText.innerText = "Correto!";
        resultText.style.color = "#19b621";
        resultPoints.innerText = "+500 pontos";
        resultCard.style.backgroundColor = "#bcfaca6c";
        points = points + 500;
      } else {
        resultImg.src = "../images/icons/wrong.png";
        resultCard.style.backgroundColor = "#fca6bc6c";
        resultText.innerText = "Errou! Que pena.";
        resultText.style.color = "#8a0707";
        resultPoints.style.fontWeight = "400";
      }
      type = 10;
    } else {
      window.alert("Selecione o local no mapa!");
    }
  } else if (type === 10) {
    resultCard.style.display = "none";
    const quiz = currentChallenge.quiz;
    criarQuiz(quiz);
    advanceButton.style.display = "none";
    type = 2;
    console.log("type 2 = " + type);
  } else if (type === 2) {
    type = 20;
    quizCont.style.display = "none";
    resultCard.style.display = "block";
    console.log("executou");
    const options = [
      currentQuiz.opcao1,
      currentQuiz.opcao2,
      currentQuiz.opcao3,
      currentQuiz.opcao4,
    ];

    if (currentQuiz.resposta === selecionado - 1) {
      resultImg.src = "../images/icons/result.png";
      resultText.innerText = "Correto!";
      resultText.style.color = "#19b621";
      resultPoints.innerText = "+250 pontos";
      resultCard.style.backgroundColor = "#bcfaca6c";
      points = points + 250;
    } else {
      resultImg.src = "../images/icons/wrong.png";
      resultCard.style.backgroundColor = "#fca6bc6c";
      resultText.innerText = "Errou! Que pena.";
      resultText.style.color = "#8a0707";
      resultPoints.style.fontWeight = "400";
      resultPoints.innerText = "Resultado: " + options[currentQuiz.resposta];
    }
    //const dataChallenge = currentChallenge.dataChallenge;
    //criarDataChallenge(dataChallenge);
  } else if (type === 20) {
    //advanceButton.style.display = "none";
    resultCard.style.display = "none";
    type = 3;
    const dataChallenge = currentChallenge.dataChallenge;
    criarDataChallenge(dataChallenge);
  } else if (type === 3) {
    if (!date || !date.value) {
      window.alert("Selecione uma data!");
      return;
    }
    type = 30;

    dataCont.style.display = "none";
    resultCard.style.display = "block";

    const dateAttempt = document.getElementById("date-attempt");
    const dateAnswer = document.getElementById("date-answer");

    if (currentChallenge.dataChallenge.data === date.value) {
      resultImg.src = "../images/icons/result.png";
      resultText.innerText = "Correto!";
      resultText.style.color = "#19b621";
      resultPoints.innerText = "+750 pontos";
      resultCard.style.backgroundColor = "#bcfaca6c";
      points = points + 750;
    } else {
      resultImg.src = "../images/icons/wrong.png";
      resultCard.style.backgroundColor = "#fca6bc6c";
      resultText.innerText = "Errou! Que pena.";
      resultText.style.color = "#8a0707";
      resultPoints.style.fontWeight = "400";

      const [ano, mes, dia] = currentChallenge.dataChallenge.data.split("-");
      const dataFormatada = `${dia}/${mes}/${ano}`;
      resultPoints.innerText = "Resultado: " + dataFormatada;
    }
  } else {
    currentChallengeIndex++;
    if (currentChallengeIndex < modo.challenges.length) {
      carregarSlider();
    } else {
      window.location.href = "modos.html";
    }
  }
}

function criarQuiz(quiz) {
  const buttons = document.querySelectorAll("button[data-option]");
  buttons.forEach((button) => {
    button.style.backgroundColor = ""; // Cor padrão (branco ou conforme o CSS)
    button.style.color = ""; // Cor padrão do texto
  });
  // Exibir a pergunta
  currentQuiz = quiz;
  quizCont.style.display = "flex";
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
  date.value = "";
  dataCont.style.display = "flex";
  const pergunta = document.getElementById("data-pergunta");
  pergunta.textContent = dataChallenge.perg;

  const dataInput = document.getElementById("data-response");
}

function verificarResposta(event) {
  // Comparação correta usando ===
  selecionado = parseInt(event.target.getAttribute("data-option"));
  // Destacar o botão clicado

  const buttons = document.querySelectorAll("button[data-option]");
  buttons.forEach((button) => {
    button.style.backgroundColor = ""; // Cor padrão (branco ou conforme o CSS)
    button.style.color = ""; // Cor padrão do texto
  });
  event.target.style.backgroundColor = "#003300"; // Cor de fundo destacada
  event.target.style.color = "white"; // Cor do texto destacada
  advanceButton.style.display = "block";
}
function verificarDataResposta(correctDate) {
  const selectedDate = document.getElementById("data-response").value;

  //console.log(correctDate);
  //console.log(selectedDate);

  if (selectedDate === correctDate) {
    return true;
  } else {
    return false;
  }
}

function carregarProximoDesafio() {
  //console.log(currentChallengeIndex);
  currentChallengeIndex++;
  if (currentChallengeIndex < modo.challenges.length) {
    carregarSlider();
  } else {
    alert("Todos os desafios foram concluídos!");
  }
}

// Carregar os sliders quando a página for carregada
window.onload = carregarSlider;
