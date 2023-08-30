/*function renderMessageList(messages) {
  const htmlElementUlMessage = document.getElementById("message-list");

  messages.forEach((message) => {
    const newHtmlElementLi = document.createElement("li");
    const newContent = document.createTextNode(message);
    newHtmlElementLi.appendChild(newContent);
    htmlElementUlMessage.appendChild(newHtmlElementLi);
  });
}*/

/*webSocket.onmessage = (event) => {
  console.log(event.data);
};
*/

/*const handlerOpenEvent =  function(callback){
    console.log('we are connected')
    webSocket.addEventListener("open", handlerOpenEvent);
  };*/

function WebSocketClient(url) {
  (this.url = url), (this.webSocket = null);

  this.connect = function (onStatus, onMessage) {
    this.webSocket = new WebSocket(`ws://${this.url}/`);

    this.webSocket.addEventListener("open", () => {
      onStatus("OPENED");
    });
    this.webSocket.addEventListener("close", () => {
      onStatus("CLOSED");
    });
    this.webSocket.addEventListener("message", (message) => {
      onMessage(message.data);
    });
  };

  this.close = function () {
    this.webSocket.close();
  };

  this.sendMessage = function (message) {
    this.webSocket.send(message);
  };
}

function WSClientView() {
  let webSocketClient = null;

  const getJSONMessageFormatted = (message) => {
    return JSON.stringify({
      type: "NEW_MESSAGE",
      payload: {
        message: message,
      },
    });
  };

  const getStringMessageFormatted = (message, messageHistory) => {
    let messageObject = JSON.parse(message);    
    return `${messageHistory.trim()}
    ${messageObject.sendDate} ${messageObject.userId.trim()}:${messageObject.payload.message.trim()}`
  }

  const setHtmlElementTextAreaMessage = (message) => {
    const messageHistory = document.getElementById("id-textarea-message-log").value;
    const stringMessageFormatted =  getStringMessageFormatted(message,messageHistory);
    document.getElementById("id-textarea-message-log").value = stringMessageFormatted;
  };

  const setHtmlElementSpanStatus = (status) => {
    document.getElementById("id-span-status").innerText = status;
  };

  const getHtmlElementInputURL = () => {
    return document.getElementById("id-input-url").value;
  };

  const getHtmlElementTextAreaRequest = () => {
    return document.getElementById("id-textarea-request").value;
  };

  const handlerConnectWebSocket = () => {
    webSocketClient = new WebSocketClient(getHtmlElementInputURL());
    webSocketClient.connect(
      setHtmlElementSpanStatus,
      setHtmlElementTextAreaMessage
    );
  };

  const handlerCloseConnectWebSocket = () => {
    if (webSocketClient) {
      webSocketClient.close();
      webSocketClient = null;
    }
  };

  const handlerRequest = () => {
    if (webSocketClient) {
      webSocketClient.sendMessage(
        getJSONMessageFormatted(getHtmlElementTextAreaRequest())
      );
    }
  };

  return {
    handlerConnectWebSocket: handlerConnectWebSocket,
    handlerCloseConnectWebSocket: handlerCloseConnectWebSocket,
    handlerRequest: handlerRequest,
  };
}

const ws = WSClientView();
