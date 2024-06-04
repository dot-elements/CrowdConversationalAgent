var task = {
    "name": "Fruit Taste Preference",
    "instruction": ["Interact with a chatbot to get a dish suggestion based on your taste preference."],
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
            "id": "fruit",
            "question": ["What is your favorite fruit?"],
            "answers": ["apples", "bananas"]
        },
        {
            "id": "taste_apples",
            "question": ["Do you prefer sweet or salty taste?", "For apples lovers, we have sweet and salty options."],
            "answers": ["sweet", "salty"]
        },
        {
            "id": "taste_bananas",
            "question": ["Do you prefer sweet or salty taste?", "For bananas lovers, we have sweet and salty options."],
            "answers": ["sweet", "salty"]
        },
        {
            "id": "dish_apples_sweet",
            "question": ["We recommend apple pie!"],
            "answers": ["Ok"]
        },
        {
            "id": "dish_apples_salty",
            "question": ["We recommend apple with cheese!"],
            "answers": ["Ok"]
        },
        {
            "id": "dish_bananas_sweet",
            "question": ["We recommend banana smoothie!"],
            "answers": ["Ok"]
        },
        {
            "id": "dish_bananas_salty",
            "question": ["We recommend banana with peanut butter!"],
            "answers": ["Ok"]
        }
    ]
};
