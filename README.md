## react-ping-pong

A Ping Pong game. Implemented in React, for web and mobile platform. Developed as part of a coding challenge.

### To install

Clone this repository

Enter into project folder

Run `npm install`

Run `npm run start`

### To play

After the application was initialized, follow the instructions. Take in mind that Iphone devices require an explicit permission by the user to use the motion data sensors. In that case, the application will ask about that.

Enjoy!

## Questions

 - What is the maximum frequency you can read from the accelerometer/gyroscope at? What are some factors that affect this limit?

  The maximum frequency in which the app could read sensor data is directly related with the device hardware and the limits that the OS has established. Each device has an specific hardware components that define the maximum theoretical reading frequency which could be reached. For example, the first generation Iphone, had a LIS302DL 3-axis MEMS based accelerometer, which gave a 100 MHz frame rate. That means that the maximun reading frecuency never could had overmatched 10ms between two continuos measurements. On the other hand, if the application read sensors excessively, the process become so heavy and the general performance get down. The setting for reading frequency must find a balance.

 - Briefly describe your approach of how you detect a swing using the sensor data.
  
  The main idea consist on get a vector of sensor states, it means, save the last N sensor readings. With that information, find patterns that represent know shots. The criteria that was addopted consisted on take a N = 20 (this mean that a single movement has 20 different measurements and each of them has six values: 3 acceleration components and 3 gyroscope compoentes). An adjustment criteria define if the sample is a known hit (forehand or backhand). In this case, the criteria consisted on a range [min, max] configuration on each of the 6 variables. A better approach (whose implementation exceeds the time of a coding challenge) could be use some regresion lineal algorithm over each variable.

 - Let's say we wanted to make this game multiplayer instead of single-player. Sketch a high-level block diagram of the main components of the system and scope out the call flows (UML or free sketching) 

  The approach to make the game multiple player consist on have a central server, which must receive clientes events, and two mobile devices (which should run the game application). Communication between server and clients should be bidirectional and implemented with web sockets.

    1 - Server - Main concerns are:
      a - Manage a stack of client events 
      b - Keep clients syncronized
      c - Manage central clock

    2 - Clientes - Main concerns:
      a - Recognize local shots (process local sensor readings and determintate if exists a know shot).
      b - Notify cliente events to centrar server.
      c - Syncronize local clock with central clock.
      d - Receive remote events and process it
