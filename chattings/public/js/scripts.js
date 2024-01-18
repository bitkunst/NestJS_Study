const socket = io('/chattings');
const getElementById = (id) => document.getElementById(id) || null;

//* get DOM element
const helloStrangerElement = getElementById('hello_stranger');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

//* global socket handler
socket.on('user_connected', (username) => {
    console.log(`${username} connected!`);
    drawNewChat(`${username} connected!`);
});

socket.on('new_chat', (data) => {
    const { chat, username } = data;
    drawNewChat(`${username}: ${chat}`);
});

socket.on('disconnect_user', (username) => {
    drawNewChat(`${username}: bye,,,`);
});

//* event callback functions
const handleSubmit = (event) => {
    event.preventDefault();
    const inputValue = event.target.elements[0].value;
    if (inputValue !== '') {
        socket.emit('submit_chat', inputValue);
        // 화면 그리기
        drawNewChat(`me: ${inputValue}`);
        event.target.elements[0].value = '';
    }
};

//* draw functions
const drawHelloStranger = (username) =>
    (helloStrangerElement.innerText = `Hello ${username} Stranger :)`);

const drawNewChat = (message) => {
    const wrapperChatBox = document.createElement('div');
    const chatBox = `
            <div>
              ${message}
            </div>
            `;
    wrapperChatBox.innerHTML = chatBox;
    chattingBoxElement.append(wrapperChatBox);
};

function helloUser() {
    const username = prompt('What is your name?');
    socket.emit('new_user', username, (data) => {
        // 서버쪽 @SubscribeMessage('new_user') 데코레이터가 붙은 함수의 return 값
        console.log('data?', data);
        drawHelloStranger(data);
    });
    // socket.on('hello_user', (data) => {
    //     console.log(data);
    // });
}

function init() {
    helloUser();
    formElement.addEventListener('submit', handleSubmit);
}

init();
