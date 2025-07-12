import WebSocket from "ws";
import dotenv from "dotenv";

dotenv.config();

// const { Pool } = pkg;

const apiEndpoint = process.env.WEBSOCKETURL;

// Main function
const sendLiveData = async (event) => {
  try {
    console.log("event>>", event);
    let latitude = event["latitude"];
    let longitude = event["longitude"];
    // latitude = parseInt(latitude);
    // longitude = parseInt(longitude);
    const distress_data = event["distress_data"];

    const project_id = event["project_id"];
    console.log("Function invoked");

    const socket = new WebSocket(apiEndpoint);
    await sendToSocket(socket, project_id, latitude, longitude, distress_data);

    await closeSocket(socket);

    console.log("Function run successfully");
    return true;
  } catch (error) {
    console.log(error);
    console.log("Error in Lambda function: %s", error.message);
    return false;
  }
};

const sendToSocket = (
  socket,
  project_id,
  latitude,
  longitude,
  distress_data
) => {
  return new Promise((resolve, reject) => {
    socket.onopen = async () => {
      let message = await wsMessageBuild(
        project_id,
        latitude,
        longitude,
        distress_data
      );
      await sendAndWaitForAck(message, socket, project_id);

      resolve(socket);
    };

    // Set a timeout for opening the WebSocket
    setTimeout(() => {
      resolve();
    }, 24000); // Adjust the timeout duration as needed
  });
};

const closeSocket = (socket, timeoutMs = 5000) => {
  return new Promise((resolve, reject) => {
    // Check if socket is already closed or closing
    if (socket.readyState === WebSocket.CLOSED || socket.readyState === WebSocket.CLOSING) {
      console.log("Socket already closed or closing");
      return resolve();
    }

    // Set up the onclose handler
    socket.onclose = () => {
      console.log("Socket Connection is closed");
      clearTimeout(timeout);
      resolve();
    };

    // Handle errors (optional but recommended)
    socket.onerror = (err) => {
      console.error("Socket error during close:", err.message);
      clearTimeout(timeout);
      reject(err);
    };

    // Timeout safeguard — if onclose doesn't fire
    const timeout = setTimeout(() => {
      console.warn("Socket close timed out");
      resolve(); // fallback resolve instead of reject
    }, timeoutMs);

    // Initiate socket close
    try {
      socket.close();
    } catch (err) {
      console.error("Error calling socket.close():", err.message);
      clearTimeout(timeout);
      reject(err);
    }
  });
};


const wsMessageBuild = async (
  project_id,
  latitude,
  longitude,
  distress_data
) => {
  const msg = JSON.stringify({
    connection_id: "nsvhackathon",
    live_data: {
      latitude: latitude,
      longitude: longitude,
      distress_data: distress_data,
    },
    project_id: project_id,
  });
  const ws_msg = {
    action: "sendmessage",
    data: msg,
  };
  return ws_msg;
};

const convertEpochToDateString = async (epochTimestamp) => {
  const isValidTimestamp =
    !isNaN(epochTimestamp) &&
    epochTimestamp !== null &&
    epochTimestamp !== undefined;

  if (!isValidTimestamp) {
    return "Invalid Timestamp"; // Return an error message if the timestamp is not valid
  }

  const date = new Date(parseInt(epochTimestamp, 10));
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const final_date = `${day}/${month}/${year}`;
  return final_date;
};

const sendAndWaitForAck = async (
  message,
  socket,
  project_id,
  maxRetries = 5
) => {
  try {
    let retries = 0;
    console.log("inside sendAndWaitForAck", message);
    const waitForAck = async () => {
      return new Promise((resolve, reject) => {
        const handleMessage = async (event) => {
          const receivedMessage = JSON.parse(event.data);

          if (receivedMessage.connection_id === "nsvhackathon") {
            // Resolve the promise when the expected message is received
            console.log("receivedMessage");

            console.log(receivedMessage);
            socket.removeEventListener("message", handleMessage);
            resolve();
          } else {
            // Continue waiting for the correct message
            if (retries < maxRetries) {
              retries++;
              await waitForAck();
            } else {
              const message_new = await wsMessageBuild(
                project_id,
                latitude,
                longitude,
                distress_data
              );
              socket.send(JSON.stringify(message_new));
              console.log("maximum reteies reaches");
              reject(
                new Error("Max retries reached. Acknowledgment not received.")
              );
            }
          }
        };

        // Add the event listener for incoming messages
        socket.addEventListener("message", handleMessage);

        // Send the initial message
        socket.send(JSON.stringify(message));
      });
    };

    return await waitForAck();
  } catch (error) {
    throw new Error(error);
  }
};

export { sendLiveData };
