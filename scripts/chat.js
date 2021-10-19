const cssClasses = {
    MESSAGE_BOX: 'message-box',
    USER_NAME: 'user-name',
    USER_MESSAGE: 'user-message',
    TYPEWRITER: 'anim-typewriter',
    HIDE: 'hide',
}

const chatBox = document.querySelector('.chat-box')

const client = new tmi.Client({
    channels: ['alvadda'],
})

client.connect()

const newMessage = (userName, message) => {
    const messageBoxDiv = document.createElement('div')
    messageBoxDiv.classList.add(cssClasses.MESSAGE_BOX)

    const userNameSpan = document.createElement('span')
    userNameSpan.classList.add(cssClasses.USER_NAME)
    userNameSpan.innerHTML = `${userName}:`

    const userMessageP = document.createElement('p')
    userMessageP.classList.add(cssClasses.USER_MESSAGE)
    userMessageP.innerText = `'${message}'`

    messageBoxDiv.appendChild(userNameSpan)
    messageBoxDiv.appendChild(userMessageP)

    chatBox.insertBefore(messageBoxDiv, chatBox.firstChild)
}

client.on('message', (channel, tags, message, self) => {
    newMessage(tags['display-name'], message)
})
