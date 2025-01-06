const databasePath = "../data/database.json"; // Caminho para o arquivo JSON

// Função para carregar o arquivo JSON
async function loadGameModes() {
  try {
    const response = await fetch(databasePath);
    if (!response.ok) {
      throw new Error(`Erro ao carregar o arquivo: ${response.statusText}`);
    }

    const data = await response.json();

    // Organizar os modos por nível
    const modosPorNivel = {};
    data.modos.forEach((modo) => {
      if (!modosPorNivel[modo.nivel]) {
        modosPorNivel[modo.nivel] = [];
      }
      modosPorNivel[modo.nivel].push(modo);
    });

    // Renderizar os modos no HTML
    renderModos(modosPorNivel);
  } catch (error) {
    console.error("Erro ao carregar os modos:", error);
  }
}

// Função para renderizar os modos no HTML
function renderModos(modosPorNivel) {
  const container = document.querySelector(".container");

  Object.keys(modosPorNivel)
    .sort((a, b) => a - b) // Ordenar os níveis em ordem crescente
    .forEach((nivel) => {
      // Criar a seção do nível
      const section = document.createElement("section");
      section.classList.add("nivel");

      const titulo = document.createElement("h1");
      titulo.classList.add("sub-title");
      titulo.textContent = `Nível ${nivel}:`;

      section.appendChild(titulo);

      modosPorNivel[nivel].forEach((modo) => {
        // Criar o item do modo
        const responsiveDiv = document.createElement("div");
        responsiveDiv.classList.add("responsive");

        const galleryDiv = document.createElement("div");
        galleryDiv.classList.add("gallery");

        // Criar o div para as questões
        const questionsDiv = document.createElement("div");
        questionsDiv.classList.add("questions");

        const questionImg = document.createElement("img");
        questionImg.classList.add("icon");
        questionImg.src = "../images/icons8-questionário-50 (2).png"; // Caminho do ícone
        questionImg.alt = "Ícone de questões";

        const questionText = document.createElement("h2");
        questionText.textContent = `${modo.quantidade}`; // Número de questões do modo

        questionsDiv.appendChild(questionImg);
        questionsDiv.appendChild(questionText);

        // Criar o link para a imagem do modo
        const link = document.createElement("a");
        link.href = "game.html"; // Página para onde irá ao clicar
        link.target = "_blank";

        // Armazenar o objeto 'modo' no localStorage ao clicar
        link.addEventListener("click", function () {
          localStorage.setItem("modo", JSON.stringify(modo)); // Salva o objeto no localStorage
        });

        const img = document.createElement("img");
        img.src = modo.imageTitle;
        img.alt = `Modo de Jogo ${modo.modo}`;

        link.appendChild(img);

        // Criar a descrição do modo
        const descDiv = document.createElement("div");
        descDiv.classList.add("desc");
        descDiv.textContent = modo.modo; // Nome do modo

        galleryDiv.appendChild(questionsDiv);
        galleryDiv.appendChild(link);
        galleryDiv.appendChild(descDiv);
        responsiveDiv.appendChild(galleryDiv);

        section.appendChild(responsiveDiv);
      });

      const clearfixDiv = document.createElement("div");
      clearfixDiv.classList.add("clearfix");
      section.appendChild(clearfixDiv);

      container.appendChild(section);
    });
}

// Carregar os modos ao carregar a página
document.addEventListener("DOMContentLoaded", loadGameModes);
