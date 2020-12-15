var i = 0; 
var score = 0;
var question = document.getElementById("question");
const quiz = document.getElementById("quiz");
var options = document.getElementById("op");
var quizData = []

get_quetions();

function get_quetions() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://quizapi.io/api/v1/questions?apiKey=f2jQiAEl4ZibDskjEot3n3SQFovJ2LcnGdcuvt99&category=sql&limit=10`, true);
    xhr.onload = function () {
        if (this.status === 200) {
            let json = JSON.parse(this.responseText);
            quizData = json
            loadQuiz();
            //console.log(json[0].question);
        }
        else {
            console.log("Some error occured");
        }
    }
    xhr.send();
}


function loadQuiz() {
    deselect();
    question.innerHTML = quizData[i].question;
    inhtml = ``

    if (quizData[i].multiple_correct_answers == "true") {
        for (let op in quizData[i].answers) {

            if (quizData[i].answers[op] != null) {
                inhtml += `<li><input type="checkbox" name="option" value="${op}">${quizData[i].answers[op]}</li>`
            }
        }
    }

    else {
        for (let op in quizData[i].answers) {

            if (quizData[i].answers[op] != null) {
                inhtml += `<li><input type="radio" name="option" value="${op}">${quizData[i].answers[op]}</li>`
            }
        }
    }
    inhtml += `
    <button id="submit" onclick="submited()">Submit</button>`
    options.innerHTML = inhtml
}


function getResult() {

    let pr = (score * 100) / quizData.length;
    let complement = undefined;

    if (pr >= 80) {
        confetti.start();
        complement = "EXCELLENT!!";
    }
    else if (pr >= 50) {
        complement = "GOOD!!";
    }
    else {
        complement = "better luck next time :)";
    }
    quiz.innerHTML = `
        <h2 id="question">Your Result</h2>
        <div id="option">
        <h2>${complement}</h2>
        <h1 style="color: rgb(21, 41, 78);"> ${score}/${quizData.length}</h1>
        <button onclick="location.reload()">Reload</button>
        <button onclick="viewAnswer()">View Answer</button>
        </div>
        `;
}

function viewAnswer() {
    // console.log(i)
    
    let question = document.getElementById("question");
    let inhtmls = document.getElementById("option"); 
    inhtml = ``
    if (i >= quizData.length) {
        i = 0;
        question.innerHTML = `<h2>Start new quiz :)</h2>`;
        inhtml += `<button onclick="location.reload()">Reload</button>`
    }
    else
    {
    question.innerHTML = quizData[i].question;
    if (quizData[i].multiple_correct_answers == "true") {
        for (let op in quizData[i].correct_answers) {
            op1 = op.slice(0, 8)
            if (quizData[i].correct_answers[op] == "true") {
                inhtml += `<li><h2 style="color: #5c306e" value="${op}">${quizData[i].answers[op1]}</h2></li>`
            }
        }
    }

    else {
        for (let op in quizData[i].correct_answers) {
            op1 = op.slice(0, 8)
            if (quizData[i].correct_answers[op] == "true") {
                inhtml += `<li><h2 style="color: #5c306e" value="${op}">${quizData[i].answers[op1]}</h2></li>`
            }
        }
    }
        inhtml += `<button id="next" onclick="viewAnswer()">next</button>`
    }
    inhtmls.innerHTML = inhtml;
    // console.log(options)
    i++;
}

function deselect() {
    let answerSlc = document.getElementsByName("option")
    answerSlc.forEach((answ) => {
        answ.checked = false;
    });
}
function submited() {

    if (quizData[i].multiple_correct_answers == "true") {
        let correct = []
        let c = undefined;
        let flag = 0;

        let answerSlc = document.getElementsByName("option")
        for (var key in quizData[i].correct_answers) {
            if (quizData[i].correct_answers[key] == "true") {
                c = key;
                correct.push(c.slice(0, 8));
            }
        }
        answerSlc.forEach((answ) => {
            if (answ.checked) {
                if (correct.includes(answ.value)) {
                    if (flag == 0) {
                        score++;
                        flag++;
                    }
                }
            }
        });
    }
    else {
        options = document.getElementById("op");


        let corect = undefined
        let answer = undefined;

        let answerSlc = document.getElementsByName("option");

        answerSlc.forEach((answ) => {
            if (answ.checked) {
                answer = answ.value;
            }
        });

        for (var key in quizData[i].correct_answers) {
            if (quizData[i].correct_answers[key] == "true") {
                corect = key
            }
        }
        corect = corect.slice(0, 8)
        if (corect.localeCompare(answer) == 0) {
            score++;
        }
    }
    i++;

    if (i >= quizData.length) {
        i = 0;
        getResult();
    }
    else {
        loadQuiz();
    }
}

