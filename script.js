let authToken = null;
let localStream;
let remoteStream;
let rtcPeerConnection;

const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

function signup() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    console.log(`Signup: ${email}, ${password}`);
}

function login() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    console.log(`Login: ${email}, ${password}`);
    authToken = 'dummyAuthToken';
    displayLoggedInUser(email);
    showVideoChatSection();
    showChatSection();
    startVideoCall();
}

function logout() {
    authToken = null;
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('videoChatSection').style.display = 'none';
    document.getElementById('chatSection').style.display = 'none';
    document.getElementById('loggedInUser').innerText = '';
    document.getElementById('logoutButton').style.display = 'none';
}

function displayLoggedInUser(email) {
    document.getElementById('loggedInUser').innerText = `Logged in as: ${email}`;
    document.getElementById('logoutButton').style.display = 'inline-block';
    document.getElementById('authSection').style.display = 'none';
}

function showVideoChatSection() {
    document.getElementById('videoChatSection').style.display = 'block';
}

function showChatSection() {
    document.getElementById('chatSection').style.display = 'block';
}

function startVideoCall() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            document.getElementById('localVideo').srcObject = localStream;
            createPeerConnection();
        })
        .catch(error => {
            console.error('Error accessing media devices:', error);
        });
}

function createPeerConnection() {
    rtcPeerConnection = new RTCPeerConnection(configuration);

    localStream.getTracks().forEach(track => {
        rtcPeerConnection.addTrack(track, localStream);
    });

    rtcPeerConnection.ontrack = event => {
        remoteStream = event.streams[0];
        document.getElementById('remoteVideo').srcObject = remoteStream;
    };

    rtcPeerConnection.onicecandidate = event => {
        if (event.candidate) {
            // Send ICE candidate to remote peer
            console.log('New ICE candidate:', event.candidate);
        }
    };

    // Example: Create an offer
    rtcPeerConnection.createOffer()
        .then(offer => {
            rtcPeerConnection.setLocalDescription(offer);
            // Send the offer to the remote peer
            console.log('Offer:', offer);
        });
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (message !== '') {
        displayMessage('You', message);
        messageInput.value = '';
        // Send the message to the remote peer
        console.log('Send message:', message);
    }
}

function displayMessage(sender, message) {
    const chatbox = document.getElementById('chatbox');
    const messageElement = document.createElement('div');
    messageElement.innerText = `${sender}: ${message}`;
    chatbox.appendChild(messageElement);
}

// Example: Handle incoming messages
function handleIncomingMessage(message) {
    displayMessage('Partner', message);
}

// Example: Save authentication token to local storage
function saveAuthToken(token) {
    localStorage.setItem('authToken', token);
}
