'use strict';
let apitoken;

const question=document.querySelector('.ques');
const answerButton=document.querySelector('.options');
const nextbtn=document.querySelector('.next');
const playAgainButton=document.querySelector('.play');

const optionsContainer=document.querySelector('.options');
const startButton=document.querySelector('.startingButton');
const typeOfQuestion=document.querySelector('.type');
const numberOfQuestion=document.querySelector('.number');
const difficultOfQuestion=document.querySelector('.difficulty');
const startingPage=document.querySelector('.starter');
const quizPage=document.querySelector('.app');
let data;
let currentQuestionNumber=0;
let currentQuestion;
let correctAnswers=0;
let type,number,diff;
let curl;
function finalScreen(){
    question.innerHTML=`Final Score : ${correctAnswers} out of ${data.length}`;
    optionsContainer.innerHTML='';
    nextbtn.style.display='none';
    playAgainButton.style.display='block';
}

function displayingData() {
    
    question.innerHTML = `${currentQuestionNumber + 1}. ${data[currentQuestionNumber].question}`;
    currentQuestion = data[currentQuestionNumber];
    currentQuestionNumber++;
    // Clear previous buttons
    optionsContainer.innerHTML = '';
    playAgainButton.style.display='none';
    for (const [key, value] of Object.entries(currentQuestion.answers)) {
        if (value) {
            const button = document.createElement('button');
            button.classList.add('btn');
            button.textContent = value;

            button.addEventListener('click', function () {
                const allButtons = document.querySelectorAll('.btn');

                // Disable all buttons
                allButtons.forEach(btn => btn.disabled = true);

                // Check if the selected answer is correct
                if (currentQuestion.correct_answers[key + '_correct'] === 'true') {
                    button.style.backgroundColor = 'rgb(79, 186, 79)'; // Green for correct answer
                    button.style.color = 'black';
                    correctAnswers++;
                } else {
                    button.style.backgroundColor = 'rgb(172, 70, 70)'; // Red for wrong answer
                    button.style.color = 'black';

                    // Highlight the correct answer in green
                    allButtons.forEach(btn => {
                        const answerKey = Object.keys(currentQuestion.answers).find(k => btn.textContent === currentQuestion.answers[k]);
                        if (answerKey && currentQuestion.correct_answers[answerKey + '_correct'] === 'true') {
                            btn.style.backgroundColor = 'rgb(79, 186, 79)';
                            btn.style.color = 'black';
                        }
                    });
                }
                nextbtn.style.display='block';
            });

            optionsContainer.appendChild(button);
        }
    }
}
nextbtn.addEventListener('click',function(){
    if (currentQuestionNumber >= data.length) {
        finalScreen();
        return;
    }    
    displayingData();
})
playAgainButton.addEventListener('click',function(){
    fetchingData();
    currentQuestionNumber=0;
    correctAnswers=0;
})
startButton.addEventListener('click',function(){
   type=document.querySelector('.type input[name="a"]:checked').value;
   number=document.querySelector('.number input[name="numbers"]:checked').value;
   diff=document.querySelector('.difficulty input[name="c"]:checked').value;
   curl = `https://quizapi.io/api/v1/questions?apiKey=${apitoken}&limit=${number}&category=${type}&difficulty=${diff}`;
   startButton.classList.add('hidden');

   fetchingData();
   startingPage.style.display='none';
   quizPage.style.display='block';
})
async function fetchingData(){
    try {
        const response = await fetch(curl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
        // console.log(data);
        
        displayingData();
    } 
    catch (error) {
        console.error('Error fetching data:', error);
    }
}
// fetchingData();
startButton.style.display='block';
