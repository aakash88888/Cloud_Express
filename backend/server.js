const express = require('express');
const app = express();
const cors = require('cors');
const archiver = require('archiver');
const bodyParser = require('body-parser');
const path = require('path')
const fs = require('fs');
const Ajv = require('ajv');
const { count } = require('console');
const { getRandomStyleFromJSON } = require('./rl_algo.js');

const ajv = new Ajv();

const eventSchema = {
  type: 'object',
  properties: {
    type: { type: 'number' },
    data: {
      type: 'object',
      // Add your event data properties here
      // e.g., source: { type: 'number' }, ...
    },
    timestamp: { type: 'number' }
  },
  required: ['type', 'data', 'timestamp']
};

const validateEvent = ajv.compile(eventSchema);

let interval_num = 1

// app.use(cors({ origin: '*' }))
app.use(cors({
  origin: ['https://e231aa66.cloudexpress-frontend-3ck.pages.dev' , 'https://908fa98a.cloudexpress-player.pages.dev'] // Replace with your allowed origins
}));

// app.use(bodyParser.json());

app.use(bodyParser.json({ limit: '50mb' })); // Adjust limit as needed


//For sending events data to server
app.post('/api/record', (req, res) => {
  const eventData = req.body;
  const eventsFolder = 'record_data';

  const intervalCounterPath = path.join(__dirname, 'interval_cnt.txt');
  let currentFolder;
  let intervalNum;

  const createFolder = async () => {
    try {
      if (!fs.existsSync(intervalCounterPath)) {
        intervalNum = 1;
        fs.writeFileSync(intervalCounterPath, intervalNum.toString());

        console.log('Interval counter file created.');
      } else {
        intervalNum = parseInt(fs.readFileSync(intervalCounterPath, 'utf8'));
      }

    currentFolder = `${eventsFolder}/interval_${intervalNum}`
    
      if (!fs.existsSync(currentFolder)) {
        fs.mkdirSync(currentFolder);
        console.log(`Folder created: ${currentFolder}`);

        // var counter = parseInt(sessionId);
        var counter = intervalNum;
        counter = counter + 1;
        fs.writeFileSync(intervalCounterPath, counter.toString());
      }

    } catch (err) {
      console.error('Error creating folder:', err);
      res.sendStatus(500);
      return;
    }
  };


  const savefiles = async () => {
    await createFolder();

    eventData.forEach(event => {
      const isValid = validateEvent(event);
      if (isValid) {
        const jsonString = JSON.stringify(event, null, 2);
        fs.writeFile(`${currentFolder}/${event.timestamp}.json`, jsonString, (err) => {
          if (err) {
            console.error('Error saving event:', err);
            res.sendStatus(500); // Internal server error
            return;
          }

          console.log(event)
          console.log(`Event saved to file: ${event.timestamp}.json`);
        });
      }
    });

    res.sendStatus(201); // Created
  }

  // const timestamps = eventData.map(event => event.event.timestamp);

  savefiles();
});


//For sending events data to server
app.post('/api/last-record', (req, res) => {
  const eventData = req.body;
  const folderPath = './last_record';

  const createFolder = async () => {
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Folder created: ${folderPath}`);
      }

    } catch (err) {
      console.error('Error creating folder:', err);
      res.sendStatus(500);
      return;
    }
  };

  


  const savefiles = async () => {

    await createFolder();

    eventData.forEach(event => {
      const isValid = validateEvent(event);
      if (isValid) {
        const jsonString = JSON.stringify(event, null, 2);
        fs.writeFile(`${folderPath}/${event.timestamp}.json`, jsonString, (err) => {
          if (err) {
            console.error('Error saving event:', err);
            res.sendStatus(500); // Internal server error
            return;
          }

          console.log(event)
          console.log(`Event saved to file: ${event.timestamp}.json`);
        });
      }
    });

    res.sendStatus(201); // Created
  }

  // const timestamps = eventData.map(event => event.event.timestamp);

  savefiles();
});


//--------------------------Get method with Json file validations----------------------------
app.get('/api/replay/:interval', (req, res) => {
  const interval = req.params.interval;
  const recordDataPath = './record_data';
  const intervalPath = path.join(recordDataPath, `interval_${interval}`);

  fs.readdir(intervalPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).send('Error reading directory');
      return;
    }

    const filePromises = files.map(file => {
      const filePath = path.join(intervalPath, file);

      return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {

          if (err) {
            reject(err);
          } else if (stats.size === 0) {
            console.warn(`Skipping empty file: ${filePath}`);
            resolve(null);
          } else {

            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                reject(err);
              } else {
                try {
                  const parsedData = JSON.parse(data);
                  resolve(parsedData);
                } catch (error) {
                  console.error(`Error parsing file ${filePath}:`, error);
                  // Handle parsing error (e.g., send error response, log)
                  resolve(null); // Or any default value
                }
              }
            });
          }
        });
      });
    });

    Promise.all(filePromises)
      .then(data => res.json(data))
      .catch(err => {
        console.error('Error reading files:', err);
        res.status(500).send('Error reading files');
      });
  });
});


//--------------------------Get method for last record----------------------------
app.get('/api/last-recor-replay', (req, res) => {
  const recordDataPath = './last_record';

  // if (!fs.existsSync(recordDataPath)) {
  //   fs.mkdirSync(recordDataPath);
  //   console.log(`Folder created: ${recordDataPath}`);

  //   // var counter = parseInt(sessionId);
  //   var counter = intervalNum;
  //   counter = counter + 1;
  //   fs.writeFileSync(intervalCounterPath, counter.toString());
  // }

  fs.readdir(recordDataPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.status(500).send('Error reading directory');
      return;
    }

    const filePromises = files.map(file => {
      const filePath = path.join(recordDataPath, file);

      return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {

          if (err) {
            reject(err);
          } else if (stats.size === 0) {
            console.warn(`Skipping empty file: ${filePath}`);
            resolve(null);
          } else {

            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                reject(err);
              } else {
                try {
                  const parsedData = JSON.parse(data);
                  resolve(parsedData);
                } catch (error) {
                  console.error(`Error parsing file ${filePath}:`, error);
                  // Handle parsing error (e.g., send error response, log)
                  resolve(null); // Or any default value
                }
              }
            });
          }
        });
      });
    });

    Promise.all(filePromises)
      .then(data => res.json(data))
      .catch(err => {
        console.error('Error reading files:', err);
        res.status(500).send('Error reading files');
      });
  });
});


//Get counter value
app.get('/api/max-interval', (req, res) => {
  const filePath = path.join(__dirname, 'interval_cnt.txt');

  // Read the interval_cnt.txt file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return res.status(500).json({ error: 'Error reading the file' });
    }

    const maxInterval = parseInt(data.trim(), 10);

    if (isNaN(maxInterval)) {
      return res.status(400).json({ error: 'Invalid max interval value in file' });
    }

    res.json({ maxInterval });
  });
});


//Clear the folder
app.delete('/api/delete-folder', (req, res) => {
  // const folderPath = path.join(recordDataPath, req.params.folderName);
  const folderPath = './last_record';

  const createFolder = async () => {
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`Folder created: ${folderPath}`);
      }

    } catch (err) {
      console.error('Error creating folder:', err);
      res.sendStatus(500);
      return;
    }
  };

  async function checkFolder() {
    await createFolder();
  }

  try {
    checkFolder()
    // Ensure the path is within the record_data directory
    if (!folderPath.startsWith(folderPath)) {
      return res.status(400).send('Invalid folder path');
    }

    // Get a list of files within the folder
    const files = fs.readdirSync(folderPath);

    // Iterate through each file and delete it
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      fs.unlinkSync(filePath);
    }

    res.sendStatus(204); // No content
  } catch (err) {
    console.error('Error deleting folder:', err);
    res.status(400).send('Error updating counter');
  }
});



app.get('/download/record-data', (req, res) => {
  const directory = './record_data';

  const output = fs.createWriteStream('Recorded_Data.zip');
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
  });

  output.on('close', () => {
    console.log('Archive finished.');
  });

  archive.on('error', (err) => {
    console.error('Archiver error:', err);
    res.status(500).send('Error creating zip file');
  });

  archive.pipe(output);

  archive.directory(directory, false); // Add directory to zip

  archive.finalize();

  // Once the archive has been finalized, send it to the client
  res.download('Recorded_Data.zip');
});


// GET endpoint to return a random style dictionary
app.get('/random-style', (req, res) => {

  async function runner() {
    const randomStyle = await getRandomStyleFromJSON();
    res.json(randomStyle);
  }
  try{
    runner()
  }catch{
    res.status(500)
  }
});



app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
