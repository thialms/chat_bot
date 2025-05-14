import { useState } from "react";

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Olá! Como posso ajudar você hoje?" },
  ]);

  const handleInputChange = (event) => {
    setUserMessage(event.target.value);
  };

  const sendMessage = async () => {
    const trimmedMessage = userMessage.trim();
    if (trimmedMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", text: trimmedMessage },
      ]);
      setUserMessage("");

      await getResponse(trimmedMessage);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const getResponse = async (userMessage) => {
    const apiKey = "AIzaSyDAaqC3QqJ2oYbnmcfPt8-YSb1MJtZHVGU"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
        }),
      });

      const data = await response.json();

      if (
        response.ok &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text
      ) {
        const botMessage = data.candidates[0].content.parts[0].text;
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: botMessage },
        ]);
      } else if (data.error) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: `Erro: ${data.error.message}` },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: "Resposta inesperada da API." },
        ]);
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Falha na conexão ou erro desconhecido." },
      ]);
    }
  };

  return (
    <div className="bg-[#daedff] h-screen flex flex-col">
      <div id="chatbot-container" className="flex flex-col h-full">
        <div id="chatbot-header" className="bg-[#121d54] text-white font-semibold p-4 text-center shadow-2xl">
          CHATBOT
        </div>
        <div
          id="chatbot-body"
          className="flex-grow overflow-y-auto p-4 space-y-4"
        >
          <div id="chatbot-messages" className="space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-md break-words ${
                    message.sender === "user"
                      ? "bg-[#4776ff] text-white f shadow-2xl"
                      : "bg-gray-200 text-black  shadow-2xl"
                  }`}
                >
                  {message.text.startsWith("```") ? (
                    <pre className="bg-black text-white p-3 rounded-md overflow-x-auto">
                      <code>{message.text.replace(/```/g, "")}</code>
                    </pre>
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 bg-white border-t flex">
          <input
            id="chatbot-input"
            type="text"
            placeholder="Digite sua mensagem..."
            className="flex-grow border p-2 rounded-full"
            value={userMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button
            id="send-button"
            className="ml-2 bg-[#4776ff] text-white px-4 py-2 rounded-full"
            onClick={sendMessage}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
