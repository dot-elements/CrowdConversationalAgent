var answers = [];
var text_unsure = ["Sorry, I don\'t get it.|Sorry, what do you mean?|Sorry, I don\'t understand."];
var edit_intro = false; // if the introduction of how to edit a question has been give
var review_process = false; // if the worker has already reviewed the answers at least once
var optional_questions = false; // if at least one optional question has been shown up
var task_stopped = false; // if the task has been terminated
var current_conv = "start"; // name of current conversation
var question_id = 0; // ID of current question
var max_question_id = 0; // ID of the last pushed question
var question_length = 0;
var id_offset = 0;  // ID of the first question

var conversation = {
    "start": [
        "Hey! I'm StressLess. Would you like to participate in a  <b>__TASK_NAME__</b> exercise?",
        "I think you want to see the task instructions, right?",
        "buttons-only:#Yes, I want to see the task instructions.%[yes]#No, I don\'t.%[no]"
    ],
    "instructions": [
        "Good. I think you now understand how to complete tasks. Shall we move on?",
        "buttons:#OK"
    ],
    "first_question": [
        "Look. The first question."
    ],
    "next_question": [
        "The next one."
    ],
    "edit_question": [
        "By the way, if you want to edit the answer of the previous question, please type &quot;<i>edit answer</i>&quot;."
    ],
    "previous_question": [
        "Here you go."
    ],
    "wrong_answer": [
        "Sorry, I don\'t understand your answer. If you forget how to answer the question, please type &quot;<i>instruction</i>&quot;."
    ],
    "optional": [
        "Nice! Do you want to continue to the next question?",
        "You can stop the task anytime by typing \"<i>stop task</i>\".",
        "buttons-only:#I want to continue.%[continue]#I want to stop now.%[stop]#"
    ],
    "review": [
        "You have completed the task. Please check your answers: __ANSWER__",
        "Do you want to proceed to answer submission?",
        "buttons-only:#Yes, I want to submit my answers.%[yes]"
        //"buttons-only:#Yes, I want to submit my answers.%[yes]#No, I want to edit my answers.%[no]#"
    ],
    "edit": [
        "Alright. Which answer you want to edit?",
        "Please type its question number."
    ],
    "bye": [
        "OK. Thank you for your participation.",
        "Complete the study by redirecting on Prolific:",
        "https://app.prolific.com/submissions/complete?cc=CZU3XDB6",
        "Or by using the code CZU3XDB6",
        "Bye!"
    ]
};

var strip = function(text) {
    return text.toLowerCase().replace(/[\s.,\/#!$%\^&\*;:{}=\-_'"`~()]/g, "");
}

var start_task = function() {
    // load CSS file
    var head = document.getElementsByTagName("head")[0];
    var style = document.createElement("link");
    style.rel = "stylesheet";
    style.type = "text/css";
    style.media = "all";
    style.href = "https://qiusihang.github.io/ticktalkturk/style/client.css";
    // style.href = "./style/client.css";
    head.appendChild(style);
    style.onload = function() {
        document.getElementById("container").style.display = "block";
        conversation["start"][0] = conversation["start"][0].replace("__TASK_NAME__",task["name"]);
        chatbot.talk(conversation["start"]);
    }
};

var taketurn = function(chatbot, message) {
    // this callback function is used for processing users message and then decide how chatbot should reply.
    switch (current_conv) {
        case "start":
            if (message.includes("[yes]")) {
                chatbot.talk(task["instruction"].concat(conversation["instructions"]));
                current_conv = "instructions";
            } else if (message.includes("[no]")) {
                current_conv = task["questions"][0]["id"];
                chatbot.talk(get_question());
            } else {
                chatbot.talk(text_unsure.concat([
                    "I think you want to see the task instructions, right?",
                    "buttons-only:#Yes, I want to see the task instructions.%[yes]#No, I don\'t.%[no]"
                ]));
            }
            break;
        case "instructions":
            current_conv = task["questions"][0]["id"];
            chatbot.talk(get_question());
            break;
        // case "edit":
        //     var qid = parseInt(message.toLowerCase().replace("q", ""));
        //     if (0 < qid && qid <= max_question_id) {
        //         question_id = qid;
        //         chatbot.talk(get_question(1));
        //         current_conv = "question";
        //     } else {
        //         chatbot.talk(text_unsure.concat(get_review()));
        //         current_conv = "review";
        //     }
        //     break;
        case "review":
            if ( message.includes("[yes]") ) {
                chatbot.talk(conversation["bye"]);
                current_conv = "bye";
                document.getElementById("chat-answers").value = JSON.stringify(answers);

                fetch('/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ answers: answers, engagement: engagement }),
                }).then(response => response.text())
                    .then(data => {
                        console.log(data);
                        alert('Answers submitted successfully!');
                    }).catch((error) => {
                    console.error('Error:', error);
                });

            } else if ( message.includes("[no]") ) {
                chatbot.talk(conversation["edit"]);
                current_conv = "edit";
            } else {
                chatbot.talk(text_unsure.concat(get_review()));
            }
            break;
        case "bye":
            break;
        case task["questions"][0]["id"]:
        case task["questions"][1]["id"]:
        case task["questions"][2]["id"]:
        case task["questions"][3]["id"]:
        case task["questions"][4]["id"]:
        case task["questions"][5]["id"]:
        case task["questions"][6]["id"]:
        case task["questions"][7]["id"]:
        case task["questions"][8]["id"]:

            if (!task.validate(message)) {
                chatbot.talk(get_question());
                break;
            }
            var messageUtterance = message!== null ? extractNextConv(message) : message;
            answers.push(messageUtterance);
            push_question(chatbot);
            break;
        case task["questions"][9]["id"]:
            // After the recommendation, move to the review state
            chatbot.talk(get_review());
            current_conv = "review";
            break;
        default:
            chatbot.talk(text_unsure);
    }

};

var get_question = function() {
    var current_question = task.questions.find(q => q.id === current_conv);
    var question = [];

    if (current_question) {
        current_question.question.forEach(function(e, i) {
            if (!i) question.push(e);
            else question.push(e);
        });

        if (current_question.answers) {
            var answer_buttons = current_question.answers.map(function(answer) {
                return `#${answer}.%[${answer}]`;
            }).join("");

            if (answer_buttons) {
                question.push(`buttons-only:${answer_buttons}`);
            }
        }
    }

    return question;
};
var extractNextConv = function(message) {
    var match = message.match(/\%\[(.*?)\]/);
    return match ? match[1] : null;
};

var push_question = function(chatbot) {
    var last_answer = answers[answers.length - 1];
    var next_question_id;
    switch (last_answer) {
        case task["questions"][0]["answers"][0]:
        case task["questions"][0]["answers"][1]:
        case task["questions"][0]["answers"][2]:
        case task["questions"][0]["answers"][3]:
        case task["questions"][0]["answers"][4]:
            next_question_id = task["questions"][1]["id"];
            break;
        case task["questions"][1]["answers"][0]:
            next_question_id = task["questions"][2]["id"];
            break;
        case task["questions"][1]["answers"][1]:
            next_question_id = task["questions"][3]["id"];
            break;
        case task["questions"][1]["answers"][2]:
            next_question_id = task["questions"][4]["id"];
            break;
        case task["questions"][1]["answers"][3]:
            next_question_id = task["questions"][5]["id"];
            break;
        case task["questions"][2]["answers"][0]:
        case task["questions"][2]["answers"][1]:
        case task["questions"][2]["answers"][2]:
        case task["questions"][2]["answers"][3]:
        case task["questions"][2]["answers"][4]:
        case task["questions"][2]["answers"][5]:
            next_question_id = task["questions"][6]["id"];
            break;
        case survey_answers[0]:
        case survey_answers[1]:
        case survey_answers[2]:
        case survey_answers[3]:
        case survey_answers[4]:
            if(current_conv === task["questions"][6]["id"]) {
                next_question_id = task["questions"][7]["id"];
            }
            if(current_conv === task["questions"][7]["id"]) {
                next_question_id = task["questions"][8]["id"];
            }
            if(current_conv === task["questions"][8]["id"]) {
                next_question_id = task["questions"][9]["id"];
            }
            // if(current_conv === task["questions"][9]["id"]) {
            //     current_conv = 'review';
            //     return;
            // }
            break;
        case "sweet":
            if (answers.includes("apples")) {next_question_id = "dish_apples_sweet";}
            if (answers.includes("bananas")) next_question_id = "dish_bananas_sweet";
            break;
        case "salty":
            if (answers.includes("apples")) next_question_id = "dish_apples_salty";
            if (answers.includes("bananas")) next_question_id = "dish_bananas_salty";
            break;
        default:
            next_question_id = null;
    }

    if (!next_question_id && (max_question_id >= task.questions.length|| task_stopped)) { //this needs to be fixed!
        chatbot.talk(get_review());
        current_conv = "review";
        return;
    }

    max_question_id += 1;
    question_id = max_question_id;

    if (next_question_id) {
        current_conv = next_question_id;
        chatbot.talk(get_question());
    } else {
        chatbot.talk(text_unsure.concat(["I didn't understand your choice."]));
    }
};

var stop_task = function(chatbot) {
    if (typeof answers[max_question_id-1] === "undefined") max_question_id -= 1;
    task_stopped = true;
    push_question(chatbot);
}

var get_review = function() {
    var ans_string = "";
    review_process = true;
    for (var i = 0; i < max_question_id; i++)
        ans_string += "<br/><b>Q" + (i + 1) + ":</b> " + answers[i];
    var review = []
    conversation["review"].forEach((item, i) => {
        review.push(item);
    });
    for ( var i = 0 ; i < review.length ; i ++ )
        review[i] = review[i].replace("__ANSWER__",ans_string);
    return review;
}
