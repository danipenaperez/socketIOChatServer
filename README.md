# socketIOChatServer
A simple socketIO chat Server

	Para construirlo npm install

	Arrancar el proyecto asi:
	npm start
	entrar en http://localhost:3000/html/tester.html
	y meter un id de chatroom por ejemplo 1234

	Ahroa para publicar :
	curl -X POST -H 'Content-Type: application/json' -i http://localhost:3000/chatRoom/1234 --data '{"event":"chatMessage","chatRoom":"TDYXWW3S","content":"Hi, my name is Robert"}'

Hay 2 urls basicas:
http://localhost:3000/html/tester.html que te lleva al suscriptor antiguo , es para testear normal
http://localhost:3000/html/testerRich.html  que te lleva a la interfaz que se parece al wasap

**********************************************************************
API DEFINITION:

PUBLISH AN EVENT:

curl -X POST -H 'Content-Type: application/json' -i http://localhost:3000/chatRoom/1234 --data '{"event":"chatMessage","chatRoom":"TDYXWW3S","content":"Hi, my name is Robert"}'

HTTP -> POST to http://{ip}:3001/
		Content-Type: application/json
		Body: {"event":"${eventName}","deviceId":"${deviceId}", ..... }

Subscriptors:
JAVA IMPLEMENTATION:
	<dependency>
		<groupId>io.socket</groupId>
		<artifactId>socket.io-client</artifactId>
		<version>0.8.3</version>
	</dependency>
JAVASCRIPT:
	<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js"></script>


