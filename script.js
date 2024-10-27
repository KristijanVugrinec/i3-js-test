console.log("Script loaded");

document.addEventListener("DOMContentLoaded", () => {
  saveAnswers();
  displayNumberOfQuestion();
  showQuestion(currentQuestionIndex);
});


const questions = [
  {
    question: "Pitanje broj 1",
    answers: [1, 2, 3, 4, 5, 6, 7, 8],
    validAnswers: [],
    userAnswers: [],
  },
  {
    question: "Pitanje broj 2",
    answers: [1, 2, 3, 4, 5, 6, 7, 8],
    validAnswers: [],
    userAnswers: [],
  },
  {
    question: "Pitanje broj 3",
    answers: [1, 2, 3, 4, 5, 6, 7, 8],
    validAnswers: [],
    userAnswers: [],
  },
  {
    question: "Pitanje broj 4",
    answers: [1, 2, 3, 4, 5, 6, 7, 8],
    validAnswers: [],
    userAnswers: [],
  },
];

let currentQuestionIndex = 0;  // Postavljanje indexa na početno pitanje 


//Funkcija za računanje odgovora
const randomAnswers = (question) => {
  const { answers } = question;

  const total = Math.floor(Math.random() * (8 - 2 + 1)) + 2;

  const correctAnswers = Math.min(2 + currentQuestionIndex, answers.length);  //Računanje točnih odgovora(min 2+ currentQuestionIndex)
  const selectedCorrectAnswers = [];

  while (selectedCorrectAnswers < correctAnswers) {
    const getRandom = Math.floor(Math.random() * answers.length);
    const answer = answers[getRandom];


    if (!selectedCorrectAnswers.includes(answer)) {
      selectedCorrectAnswers.push(answer);
    }
  }

  const incorrectAnswers = answers.filter(
    (answer) => !selectedCorrectAnswers.includes(answer)
  );
  const maxIncorrectAnswers = total - selectedCorrectAnswers.length;

  const allIncorrectAnswers = incorrectAnswers
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.max(0, maxIncorrectAnswers));

  const answersTogether = [...selectedCorrectAnswers, ...allIncorrectAnswers];

  return answersTogether.sort(() => Math.random() - 0.5);
};


//Funkcija za čuvanje odgovora

const saveAnswers = () => {
  questions.forEach((question) => {
    question.answers = randomAnswers(question);
  });
};


//Funkcija za prikaz slidera
const displayNumberOfQuestion = () => {
  const questionNumberDiv = document.getElementById("questionNumber");   //Dohvaćanje containera za slider

  const questionNumber = questions
    .map((question, index) => { //Mapiranje slidera
      return `<button onclick="showQuestion(${index})" class="${
        questions[index].userAnswers.length >= 1 ? "highlight" : ""
      }">${index + 1}</button>`;  //Dodavanje +1 na index od pitanja da kreće od 1
    })
    .join("");

  questionNumberDiv.innerHTML = questionNumber;
};


//Funkcija za prikaz gumbova te prikaz pitanja i rezultata
const showQuestion = (index) => {
  const previousButton = document.getElementById("previous");

  console.log("Radi");
  currentQuestionIndex = index; //Dodjeljivanje indexa na pitanje

  const questionDiv = document.getElementById("question");
  const answerDiv = document.getElementById("answer");
  const question = questions[index];
  const result = document.getElementById("results")

  questionDiv.innerHTML = `<h2>${question.question}</h2>`;  //Dodavanje pitanja u h2 element

  const answer = question.answers 
    .map((answer) => {
      const isChecked =
        question.userAnswers && question.userAnswers.includes(answer.toString())  //Provjera da li je odgovor označen,ako je,vrati označeno
          ? "checked"
          : "";
      return `<label>
        <input type="checkbox" name="answer" value="${answer}" ${isChecked} >
        ${answer} </label><br>`;
    })
    .join("");

  answerDiv.innerHTML = `
    <div>${answer}</div>
    `;

  const checkboxes = document.querySelectorAll('input[name="answer"]');  //Selektiranje svih odgovora sa name answer
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {   //Dodani event listener da provjerava ako je odgovor označen
      const selectedAnswers = Array.from(
        document.querySelectorAll('input[name="answer"]:checked')
      ).map((input) => input.value);
      questions[currentQuestionIndex].userAnswers = selectedAnswers; // Spremi odabrane odgovore odmah
      displayNumberOfQuestion(); // Osvježi prikaz brojeva pitanja s bojom


        //Promjena boje ako je označeni

      if (event.target.checked) {
        event.target.parentElement.style.backgroundColor = "#a8ffb0";
        event.target.parentElement.style.color = "black";
      } else {
        event.target.parentElement.style.backgroundColor = "transparent";
        event.target.parentElement.style.border = "2px solid #b380ff"
        event.target.parentElement.style.color = "white";
      }

      if (currentQuestionIndex === questions.length - 1) {
        showResultButton.disabled = !questionsAnswered();
      } 
    });
    if (checkbox.checked) {
      checkbox.parentElement.style.backgroundColor = "#a8ffb0";
      checkbox.parentElement.style.border = "2px solid #b380ff";
      checkbox.parentElement.style.color = "black"
    } else {
      checkbox.parentElement.style.backgroundColor = "transparent";
      checkbox.parentElement.style.border = "2px solid #b380ff "
      checkbox.parentElement.style.color = "white"
    }
  });

  if (currentQuestionIndex === 0) {
    previousButton.style.display = "none";
  } else {
    previousButton.style.display = "inline-block";
  }

  const showResultButton = document.getElementById("showResult");  //Dohvačanje gumba za prikaz rezultata
  const nextButton = document.getElementById("next");
  showResultButton.style.display = "none";

  if (currentQuestionIndex === questions.length - 1) {   //AKo je zadnji slide prikazati gumb za rezultat,te maknuti Next button
    nextButton.style.display = "none";
    showResultButton.style.display = "inline-block";

    result.style.display = "flex"
    if (questionsAnswered()) {   //Ako je odgovoreno omogućiti gumb
      showResultButton.disabled = false;
    } else {
      showResultButton.disabled = true;
    }
  } else {
    nextButton.style.display = "inline-block";
    result.style.display = "none"
  }
};

const questionsAnswered = () => {
  return questions.every((question) => question.userAnswers.length > 0);   //Provjera da li je odgovoreno na sva pitanja
};

const nextQuestion = () => {   //Funkcija za next button
  const selectedAnswers = Array.from(
    document.querySelectorAll('input[name="answer"]:checked')
  ).map((input) => input.value);
  const maximumAnswers = 2 + currentQuestionIndex;

  if (selectedAnswers.length > maximumAnswers) {  // ako je odgovoreno vise nego sto je dopusteno vratiti alert
    const warningDiv = document.getElementById("alert");
    warningDiv.innerHTML = `Moguće je odabrati najviše ${maximumAnswers} točna odgovora`;
    warningDiv.style.display = "block";

    setTimeout(() => {  //uklanjanje alerta nakon 3 sekunde
      warningDiv.style.display = "none";
    }, 3000);
    return;
  }
  // questions[currentQuestionIndex].userAnswers = selectedAnswers;
  displayNumberOfQuestion();
  currentQuestionIndex++;
  showQuestion(currentQuestionIndex);
};

const previousQuestion = () => {
  currentQuestionIndex--;

  showQuestion(currentQuestionIndex);
};

const showResult = (index) => {
  // const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked')).map(input => input.value)
  // questions[currentQuestionIndex].userAnswers = selectedAnswers

  const result = document.getElementById("results");
  let resultsHTML = "";

  questions.forEach((question, index) => {
    resultsHTML += `<div id="allResult">
                      <h2>${question.question}</h2>
                      <hr/>
                      <p>Odabrani odgovori: ${
                        question.userAnswers
                          ? question.userAnswers.join(", ")
                          : "Nema odabranih odgovora."
                      }</p>
                    </div>`; 
  });
  result.innerHTML = resultsHTML;
  result.style.display = "flex";

  displayNumberOfQuestion();
};
