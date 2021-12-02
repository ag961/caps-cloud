'use strict';
const faker = require('faker');
const { Producer } = require('sqs-producer');
const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  queueUrl: 'https://sqs.eu-central-1.amazonaws.com/457441446271/packages.fifo',
  pollingWaitTimeMs: 10000,
  handleMessage: handler,
});


function handler(message) {
  let result = JSON.parse(message.Body)

  let messageForDeliverySQS = JSON.parse(result['Message']);
  console.log(`${messageForDeliverySQS.customer}'s order is in IN-TRANSIT`);

  const producer = Producer.create({
    queueUrl: messageForDeliverySQS.vendorID,
    region: 'eu-central-1'
  })

  setTimeout(async () => {
    try {
      const message = {
        id: faker.datatype.uuid(),
        body: `Order ${messageForDeliverySQS.orderID} for ${messageForDeliverySQS.customer} delivered`
      }
      const response = await producer.send(message);
      console.log('DRIVER: completed delivery', response);
    } catch (e) {
      console.error(e)
    }
  }, 7000)
}

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.on('test', ()=>{
  console.log('test event is triggered');
})

app.on('message_received', (message) => {
  console.log('message received', message);
  app.emit('test');
})



app.start();
