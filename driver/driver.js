'use strict';

const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  queueUrl: 'https://sqs.eu-central-1.amazonaws.com/457441446271/packages.fifo',
  handleMessage: handler,
});

function handler(message) {
  let result = JSON.parse(message.Body)

  console.log(result['Message']);
  let messageForDeliverySQS = JSON.parse(result['Message']);
}

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();

// ======================== publishing to SQS delivery ============///


// const { Producer } = require('sqs-producer');

// const producer = Producer.create({
//   queueUrl: messageForDeliverySQS.vendorID,
//   region: `eu-central-1`,
// });

// let counter = 0;

// setInterval(async () => {

//   try {
//     const message = {     
//       body: `This is message #${counter++}`,
//     };

//     const response = await producer.send(message);
//     console.log(response);
//   } catch (e) {
//     console.error(e);
//   }
// }, Math.floor(Math.random() * 1000));