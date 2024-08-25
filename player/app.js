var firstEvent = null;
var roomName = "SqFR5uoLEUX8Qzuo66xF686qxf23";
const PORT = 3001

const playerContainer = document.getElementById('player-container');
playerContainer.style.margin = '0 auto';
playerContainer.style.alignContent = "center"
playerContainer.style.textAlign = "center"

const submitButton = document.getElementById('submit-button');

let maxInterval;

// const serverURL = `http://localhost:${PORT}`

const serverURL = 'https://cloudexpress-backend.onrender.com'   //Final backend
// const serverURL = 'https://230ab316.cloudexpress-frontend.pages.dev' //Cloudflare
  
async function fetchReplayData(interval) {
  const response = await fetch(`${serverURL}/api/replay/${interval}`);
  const data = await response.json();
  return data;
}

async function fetchLastRecord() {
  const response = await fetch(`${serverURL}/api/last-recor-replay`);
  const data = await response.json();
  return data;
}

submitButton.addEventListener('click', async () => {
  // const userInput = parseInt(intervalInput.value);

  fetchLastRecord()
      .then(data => {
        console.log(data); // Process the fetched data

        // const activeEvents = data.filter(event => isEventActive(event));

        const filteredData = data.filter(event => event && event.type && event.timestamp); // Filter out invalid events
        console.log('Filtered data:', filteredData); // Log the filtered data

        if (filteredData.length < 2) {
          console.error('Insufficient events for playback. Minimum 2 required.');
          return; // Handle the case where there are less than 2 valid events
        } else if (filteredData.length > 3) {
          console.warn(`Data: `, filteredData[0]);

          let events = [];

          filteredData.forEach(element => {
            events.push(element);
          });

          let eventsWithTimeDiffs = events

          player = new rrwebPlayer({
            target: document.getElementById('player-container'),
            props: {
              events: eventsWithTimeDiffs,
              // jumpToTimestamp(targetTimestamp) {
              //   // Find the closest active event (if any) before the target timestamp
              //   const activeEventIndex = events.findIndex(event => event.isActive && event.timestamp <= targetTimestamp);
            
              //   if (activeEventIndex === -1) {
              //     console.warn('Target timestamp not found in data, or no active events before it.');
              //     return;
              //   }
            
              //   // Calculate the accumulated time difference up to the active event
              //   const accumulatedTimeDiff = events.slice(0, activeEventIndex + 1).reduce((acc, event) => acc + event.timestampDiff, 0);
            
              //   // Seek the player to the accumulated time
              //   player.goto(accumulatedTimeDiff, true);
              // }

              jumpToTimestamp(targetTimestamp) {
                // Find the closest active event (if any) before the target timestamp
                const activeEventIndex = eventsWithTimeDiffs.findIndex(event => event.isActive && event.timestamp <= targetTimestamp);
            
                if (activeEventIndex === -1) {
                  console.warn('Target timestamp not found in data, or no active events before it.');
                  return;
                }
            
                // Calculate the accumulated time difference up to the active event
                const accumulatedTimeDiff = activeEvents.slice(0, activeEventIndex + 1).reduce((acc, event) => acc + event.timestampDiff, 0);
            
                // Find the index of the last active event
                const lastActiveEventIndex = eventsWithTimeDiffs.slice(activeEventIndex).findIndex(event => !event.isActive) + activeEventIndex;
            
                // Calculate the end time offset for the active range
                const endTimeOffset = lastActiveEventIndex !== -1 ? eventsWithTimeDiffs[lastActiveEventIndex].timestamp : eventsWithTimeDiffs[eventsWithTimeDiffs.length - 1].timestamp;
            
                // Check if the time difference between the start and end offsets is greater than 5 seconds
                const timeDiff = endTimeOffset - accumulatedTimeDiff;
                if (timeDiff > 5000) { // Convert 5 seconds to milliseconds
                  // Skip inactive events and calculate new accumulated time
                  const filteredEvents = eventsWithTimeDiffs.slice(activeEventIndex, lastActiveEventIndex).filter(event => event.isActive);
                  const newAccumulatedTimeDiff = filteredEvents.reduce((acc, event) => acc + event.timestampDiff, accumulatedTimeDiff);
                  accumulatedTimeDiff = newAccumulatedTimeDiff;
                }
            
                // Use playRange to play only the active events
                player.playRange(accumulatedTimeDiff, endTimeOffset, true);
              }
            },
          });
          player.play();
        }
      })
      .catch(error => {
        console.error('Error fetching replay data:', error);
      });

});
