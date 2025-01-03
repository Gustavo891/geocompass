var modo = JSON.parse(localStorage.getItem('modo'));

console.log(modo);

var currentChallengeIndex = 0; // Índice do desafio atual

var selecionado = 0;

function carregarSlider() {
  if (modo != null) {
    const challenges = modo.challenges;
    
    const name = document.getElementById('modo-nome');
    name.innerText = modo.modo;

    if (challenges && challenges.length > 0) {
      const desafio = document.getElementById('desafio-info');

      desafio.innerText = 'Desafio ' + (currentChallengeIndex + 1) + '/' + modo.quantidade;
      const currentChallenge = challenges[currentChallengeIndex];  // Pega o desafio atual

      // Acessando as imagens do mapChallenge
      const mapChallenge = currentChallenge.mapChallenge;
      const image1 = mapChallenge.image1;
      const image2 = mapChallenge.image2;
      const image3 = mapChallenge.image3;

      // Atribuindo as imagens aos slides
      document.getElementById('slide-1').src = image1;
      document.getElementById('slide-2').src = image2;
      document.getElementById('slide-3').src = image3;

      // Exibir o quizChallenge
      const quiz = currentChallenge.quiz;
      criarQuiz(quiz);

      // Exibir o dataChallenge se houver
      const dataChallenge = currentChallenge.dataChallenge;
      if (dataChallenge) {
        criarDataChallenge(dataChallenge);
      }
      mostrarBotaoProximoDesafio();
    }
  }
}

function criarQuiz(quiz) {
  const quizContainer = document.createElement('div');
  quizContainer.classList.add('quiz-container');
  
  // Exibir a pergunta
  const pergunta = document.getElementById('quiz-pergunta');
  pergunta.textContent = quiz.perg;
  
  // Criar as opções
  const options = [
    quiz.opcao1,
    quiz.opcao2,
    quiz.opcao3,
    quiz.opcao4
  ];
  
  
  const optionButton1 = document.getElementById('opcao1');
  optionButton1.textContent = quiz.opcao1;
  optionButton1.setAttribute('data-option', 1);
  optionButton1.addEventListener('click', verificarResposta);

  const optionButton2 = document.getElementById('opcao2');
  optionButton2.textContent = quiz.opcao2;
  optionButton2.setAttribute('data-option', 2);
  optionButton2.addEventListener('click', verificarResposta);
 
  const optionButton3 = document.getElementById('opcao3');
  optionButton3.textContent = quiz.opcao3;
  optionButton3.setAttribute('data-option', 3);
  optionButton3.addEventListener('click', verificarResposta);
 
  const optionButton4 = document.getElementById('opcao4');
  optionButton4.textContent = quiz.opcao4;
  optionButton4.setAttribute('data-option', 4);
  optionButton4.addEventListener('click', verificarResposta);

}

function criarDataChallenge(dataChallenge) {
  
  // Exibir a pergunta do dataChallenge
  const pergunta = document.getElementById('data-pergunta');
  pergunta.textContent = dataChallenge.perg;
  
  const dataInput = document.getElementById('data-response');

}

function verificarResposta(event) {
  selecionado = parseInt(event.target.getAttribute('data-option'));
}

function verificarDataResposta(correctDate) {
  const selectedDate = document.getElementById('data-response').value;
  
  console.log(correctDate);
  console.log(selectedDate);

  if (selectedDate === correctDate) {
    return true;
  } else {
    return false;
  }

}

function mostrarBotaoProximoDesafio() {
  // Criar o botão de próximo desafio
  const nextButton = document.getElementById('next-button');
  nextButton.textContent = 'Próximo Desafio';
  nextButton.addEventListener('click', carregarProximoDesafio);

}

function carregarProximoDesafio() {

  if(verificarDataResposta(modo.challenges[currentChallengeIndex].dataChallenge.data) == true
   && selecionado == modo.challenges[currentChallengeIndex].quiz.resposta){
    currentChallengeIndex++;
    if (currentChallengeIndex < modo.challenges.length) {
      carregarSlider();
    } else {
      alert('Todos os desafios foram concluídos!');
    }
  } else {
    alert("false")
  }

}

// Carregar os sliders quando a página for carregada
window.onload = carregarSlider;
