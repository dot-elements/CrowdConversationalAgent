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
        "Hey! I'm Andrea. could you please help me with a task called <b>__TASK_NAME__</b>?",
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
                current_conv = "fruit";
                chatbot.talk(get_question());
            } else {
                chatbot.talk(text_unsure.concat([
                    "I think you want to see the task instructions, right?",
                    "buttons-only:#Yes, I want to see the task instructions.%[yes]#No, I don\'t.%[no]"
                ]));
            }
            break;
        case "instructions":
            current_conv = "fruit";
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
                document.getElementById("submit").style.display = "block";
                document.getElementById("message").disabled = true;
                document.getElementById("chat-answers").value = JSON.stringify(answers);
            } else if ( message.includes("[no]") ) {
                chatbot.talk(conversation["edit"]);
                current_conv = "edit";
            } else {
                chatbot.talk(text_unsure.concat(get_review()));
            }
            break;
        case "bye":
            break;
        case "fruit":
        case "taste_apples":
        case "taste_bananas":
            if (!task.validate(message)) {
                chatbot.talk(get_question());
                break;
            }
            messageUtterance = message ? extractNextConv(message) : message;
            answers.push(messageUtterance);
            push_question(chatbot);
            break;
        case "dish_apples_sweet":
        case "dish_apples_salty":
        case "dish_bananas_sweet":
        case "dish_bananas_salty":
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
            if (!i) question.push("<b>Q:</b> " + e);
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
        case "apples":
            next_question_id = "taste_apples";
            break;
        case "bananas":
            next_question_id = "taste_bananas";
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
