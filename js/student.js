// Define the messages array
class Flow {
    constructor(operMessages) {
        this.operMessages = operMessages;
    }
}

class OperMessage {
    constructor(operMessage, userAnswers, action) {
        this.operMessage = operMessage;
        this.userAnswers = userAnswers;
        this.action = action;
    }
}

class Answer {
    constructor(text, action, conversionStatus) {
        this.text = text;
        this.action = action;
        this.conversionStatus = conversionStatus
    }
}

class Action {
    static actionChangeFlow = "changeFlow";
    static showCurrentOffers = "showCurrentOffers";
    static showOffers = "showOffers";
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

const haveCreditsFlow = new Flow([
    new OperMessage("В каких компаниях у тебя были займы:", null, new Action(Action.showCurrentOffers, null)),
    new OperMessage("Какую сумму хочешь получить?", [
        new Answer("До 100.000 тнг", null, "amount_select_100"),
        new Answer("100.000 - 300.000 тнг", null, "amount_select_100-300"),
        new Answer("Больше 300.000 тнг 💰", null, "amount_select_300+"),
    ], null),
    new OperMessage("Отлично! Я провожу верификацию", null, null),
    new OperMessage("Еще пару секунд...", null, null),
    new OperMessage("🎉🎁💰 Тебе предварительно одобрен запрашиваемый кредит. Его можно получить в этих организациях:", null, new Action(Action.showOffers, null))
]);

const noCreditsFlow = new Flow([
    new OperMessage("Какую сумму ты хотел бы получить?", [
        new Answer("До 100.000 тнг", null, "amount_select_100"),
        new Answer("100.000 - 300.000 тнг", null, "amount_select_100-300"),
        new Answer("Больше 300.000 тнг 💰", null, "amount_select_300+"),
    ], null),
    new OperMessage("На какой срок нужен займ?", [
        new Answer("До 10 дней", null, "term_select_10"),
        new Answer("10 - 30 дней", null, "term_select_10-30"),
        new Answer("1 - 3 месяца 🗓️", null, "term_select_13m"),
    ], null),
    new OperMessage("Отлично! Я провожу верификацию", null, null),
    new OperMessage("Еще пару секунд...", null, null),
    new OperMessage("🎉🎁💰 Тебе предварительно одобрен запрашиваемый кредит. Его можно получить в этих организациях:", null, new Action(Action.showOffers, null))
]);

// Flows
const mainFlow = new Flow([
    new OperMessage("Привет 👋", null, null),
    new OperMessage("Меня зовут Аружан, у меня для тебя есть спец. предложения по микрозайму", null, null),
    new OperMessage("У тебя были когда либо кредиты?", [
        new Answer("Да", new Action(Action.actionChangeFlow, haveCreditsFlow), "have_credits"),
        new Answer("Нет", new Action(Action.actionChangeFlow, noCreditsFlow), "no_credits"),
    ], null),
]);

var currentFlow = mainFlow
var currentMessageIndex = 0;
var bottomChatViewId = 'offers-select';
var userOffers = [];

function selectOffer(element, offer) {
    if (element.className == "offer-select") {
        userOffers.push(offer);
        element.className = "offer-select-selected";
    } else {
        removeItemOnce(userOffers, offer);
        element.className = "offer-select";
    }
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  

function doneSelectOffer(element) {
    keitaroConvertion("my_offers_select");
    document.getElementById('select-offer-button').style.display = 'none';
    proceedToNextMessage();
}

function scrollToBottom() {
    document.getElementById("main").scrollTop = document.getElementById("main").scrollHeight;

    // window.scroll({
    //     top: document.body.scrollHeight,
    //     behavior: 'smooth'  // Optional: Adds smooth scrolling
    // });
}

function renderMessage(messageDiv) {
    if (bottomChatViewId) {
        document.getElementById("chat-container").insertBefore(messageDiv, document.getElementById(bottomChatViewId))
    } else {
        document.getElementById("chat-container").insertBefore(messageDiv, null)
    }

    scrollToBottom();
}

function displayMessage(content, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.textContent = content;
    renderMessage(messageDiv);
}

function showOperatorMessage() {
    const message = currentFlow.operMessages[currentMessageIndex];
    if (message.operMessage) {
        const operatorMessageDiv = document.createElement("div");
        operatorMessageDiv.classList.add("message", "operator", "typing");

        const circleDiv = document.createElement("div");
        circleDiv.classList.add("circle");

        const circleDiv1 = document.createElement("div");
        circleDiv1.classList.add("circle");

        const circleDiv2 = document.createElement("div");
        circleDiv2.classList.add("circle");

        operatorMessageDiv.appendChild(circleDiv)
        operatorMessageDiv.appendChild(circleDiv1)
        operatorMessageDiv.appendChild(circleDiv2)

        // Disable buttons while the operator is typing
        disableAnswerButtons();

        renderMessage(operatorMessageDiv);
        
        setTimeout(() => {
            // Show operator message
            operatorMessageDiv.textContent = message.operMessage;
            
            if (message.userAnswers && message.userAnswers.length > 0) {
                // Show answer buttons
                displayAnswerButtons(message.userAnswers);
                operatorMessageDiv.classList.remove("typing")
                scrollToBottom();
            } else if (message.action) {
                // Handle custom action
                handleAction(message.action)
            } else {
                // Show next message
                operatorMessageDiv.classList.remove("typing");
                proceedToNextMessage();
                scrollToBottom();
            }
        }, Math.random() * 1000 + 1000); // random delay between 1500ms and 2500ms
    }
}

function displayAnswerButtons(answers) {
    const answerButtonsContainer = document.getElementById("answer-buttons");

    answers.forEach(answer => {
        const button = document.createElement("button");
        button.classList.add("answer-button");
        button.textContent = answer.text;
        button.onclick = () => handleUserResponse(answer);
        answerButtonsContainer.appendChild(button);
    });

    // Enable buttons after operator's message is shown
    enableAnswerButtons();
}

function handleUserResponse(response) {
    displayMessage(response.text, "user");
    keitaroConvertion(response.conversionStatus);

    if (response.action) {
        handleAction(response.action)
        hideButtons()
        return
    }

    proceedToNextMessage();
    hideButtons()
}

function handleAction(action) {
    switch (action.type) {
        case Action.actionChangeFlow:
            currentFlow = action.value;
            currentMessageIndex = 0;
            showOperatorMessage();
            break;
        case Action.showCurrentOffers:
            showOffersSelect(true)
            break;
        case Action.showOffers:
            showOffersResult(true)
            break;
    }
}

function hideButtons() {
    const answerButtonsContainer = document.getElementById("answer-buttons");
    while (answerButtonsContainer.firstChild) {
        answerButtonsContainer.removeChild(answerButtonsContainer.firstChild);
    }
}

function proceedToNextMessage() {
    currentMessageIndex++;
    if (currentMessageIndex < currentFlow.operMessages.length) {
        // Show next flow message
        setTimeout(showOperatorMessage, 500);
    }
}

function showOffersSelect(show) {
    if (show) {
        bottomChatViewId = "offers-result";
    }

    document.getElementById("offers-select").style.display = show ? "block" : "none";
    scrollToBottom();
}

function showOffersResult(show) {
    for (const element of userOffers) {
        const view = document.getElementById("offer-" + element);
        if (view) {
            view.style.display = "none";
        }
    }

    document.getElementById("offers-result").style.display = show ? "block" : "none";
}

function disableAnswerButtons() {
    const answerButtonsContainer = document.getElementById("answer-buttons");
    answerButtonsContainer.classList.add('locked'); // Lock the entire button container
}

function enableAnswerButtons() {
    const answerButtonsContainer = document.getElementById("answer-buttons");
    answerButtonsContainer.classList.remove('locked'); // Unlock the entire button container
}