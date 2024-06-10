var survey_answers = [ "Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
var aligned = false
var task = {
    "name": "Stress mitigation",
    "instruction": ["You will chat with StressLess about the stress you experience as a crowd worker and then complete a survey about your interaction."],
    "question_number": 1, // # of mandatory questions
    "validate": function(input) {
        var strip = function(text) {
            return text.toLowerCase().replace(/[\s.,\/#!$%\^&\*;:{}=\-_'"`~()]/g, "");
        }
        if (strip(input).length > 0)  return true;
        return false;
    },
    "time_limit": "10 minutes",
    "questions": [
        {
            "id": "stress_rating",
            "question": ["For starters, how would you rate your stress levels on a daily basis?", "1 = No stress, 5 = always stressed"],
            "answers": ["1", "2", "3" ,"4", "5"]
        },
        {
            "id": "stress_types",
            "question": [
                "There can be various types of stress you could be experiencing.","Which of these best describes how you are feeling?",
                "Time management: Are you having difficulty organizing your time?",
                "Mental: Are you experiencing anxiety, memory and/or other mental health difficulties?",
                "Physical: Are you unable to sleep or fatigued?",
                "Social: Are you having problems in your friendships or relationships?",
                "Financial: Are you having difficulty with money?",
            ],
            "answers":
                [
                    "Time management",
                    "Mental",
                    "Physical",
                    "Social",
                    "Financial",
                ]
        },
        {
            "id": "time_management",
            "question": ["Which of the following stress management technique would you like to try?", "Most Popular: Creating a monthly budget plan has proven results in stress management for 82 percent of users."],
            "answers": ["Sleep 8h", "Make a monthly budget", "Download a time tracking app", "Journaling", "Reach out to a family member or a friend"]
        },
        {
            "id": "mental",
            "question": ["Which of the following stress management technique would you like to try?", "Most Popular: Using a time tracking app has shown proven results in stress management for 82 percent of users."],
            "answers": ["Sleep 8h", "Make a monthly budget", "Download a time tracking app", "Journaling", "Reach out to a family member or a friend"]
        },
        {
            "id": "physical",
            "question": ["Which of the following stress management technique would you like to try?", "Most Popular: Taking a Journaling course has shown proven results in stress management for 82 percent of users."],
            "answers": ["Sleep 8h", "Make a monthly budget", "Download a time tracking app", "Journaling", "Reach out to a family member or a friend"]
        },
        {
            "id": "social",
            "question": ["Which of the following stress management technique would you like to try?", "Most Popular: Sleeping 8 hours a day has shown proven results in stress management for 82 percent of users."],
            "answers": ["Sleep 8h", "Make a monthly budget", "Download a time tracking app", "Journaling", "Reach out to a family member or a friend"]
        },
        {
            "id": "financial",
            "question": ["Which of the following stress management technique would you like to try?", "Most Popular: Reaching out to a close family member or friend has shown proven results in stress management for 82 percent of users."],
            "answers": ["Sleep 8h", "Make a monthly budget", "Download a time tracking app", "Journaling", "Reach out to a family member or a friend"]
        },
        {
            "id": "survey1",
            "question": ["Let's now move to the survey questions.", "To what extent do you agree to these statements?","I feel like my choice is highly compatible with my intention"],
            "answers": survey_answers
        },
        {
            "id": "survey2",
            "question": ["I feel like I could decide how to manage my stress."],
            "answers": survey_answers
        },
        {
            "id": "survey3-attention",
            "question": ["I do not feel like my choice is an expression of myself."],
            "answers": survey_answers
        },
        {
            "id": "survey4",
            "question": ["I feel like I had the opportunity to have influence on my choice."],
            "answers": survey_answers
        },
        {
            "id": "survey5",
            "question": ["I feel like I made a relevant choice for myself."],
            "answers": survey_answers
        },
        {
            "id": "survey6",
            "question": ["I feel like my intention was supported by the chatbot."],
            "answers": survey_answers
        },
    ]
};
