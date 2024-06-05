var survey_answers = [ "Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
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
            "question": ["For starters, how would you rate your stress levels on a daily basis?"],
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
            ],
            "answers":
                [
                    "Time management",
                    "Mental",
                    "Physical",
                    "Social",
                ]
        },
        {
            "id": "time_management",
            "question": ["Which of the following stress management technique would you like to try?", "Most Popular: Using a time tracking app has shown proven results in stress management for 82 percent of users."],
            "answers": ["Sleep 8h", "Running", "Make a monthly budget", "Download a time tracking app", "Journaling", "Reach out to a family member or a friend"]
        },
        {
            "id": "mental",
            "question": ["Which of the following stress management technique would you like to try?", "Most Popular: Taking a Journaling course has shown proven results in stress management for 82 percent of users."],
            "answers": ["Sleep 8h", "Running", "Make a monthly budget", "Download a time tracking app", "Journaling", "Reach out to a family member or a friend"]
        },
        {
            "id": "physical",
            "question": ["Which of the following stress management technique would you like to try?", "Most Popular: Sleeping 8 hours a day has shown proven results in stress management for 82 percent of users."],
            "answers": ["Sleep 8h", "Running", "Make a monthly budget", "Download a time tracking app", "Journaling", "Reach out to a family member or a friend"]
        },
        {
            "id": "social",
            "question": ["Which of the following stress management technique would you like to try?", "Most Popular: Reaching out to a family member or a friend has shown proven results in stress management for 82 percent of users."],
            "answers": ["Sleep 8h", "Running", "Make a monthly budget", "Download a time tracking app", "Journaling", "Reach out to a family member or a friend"]
        },
        {
            "id": "survey1",
            "question": ["Let's now move to the survey questions.", "To what extent do you agree to these statements?","My choice is highly compatible with my goals and interests."],
            "answers": survey_answers
        },
        {
            "id": "survey2",
            "question": ["I feel very strongly that my choice perfectly fits my taste."],
            "answers": survey_answers
        },
        {
            "id": "survey3",
            "question": ["I feel that my choice is definitely an expression of myself."],
            "answers": survey_answers
        },
        {
            "id": "survey4",
            "question": ["I feel very strongly that I had the opportunity to have an influence on my choice."],
            "answers": survey_answers
        },
    ]
};
