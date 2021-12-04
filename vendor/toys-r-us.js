'use strict'
const faker = require('faker');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

//=============Subcsribing to delivery queue=========="
const { Consumer } = require('sqs-consumer');

const app = Consumer.create({
  queueUrl: 'https://sqs.eu-central-1.amazonaws.com/457441446271/deliveredV1',
  handleMessage: handler,
});

function handler(message) {
  console.log('\x1b[32m%s\x1b[0m', message.Body);
}

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();

//============Publishing to SNS=========
const sns = new AWS.SNS();

const topic = 'arn:aws:sns:eu-central-1:457441446271:pickup.fifo';

let timeoutID = setInterval( ()=>{  
  const payload = {
    Message: JSON.stringify({ 
      orderID: faker.datatype.uuid(),
      store: 'Toys R Us',
      customer: `${faker.name.firstName()} ${faker.name.lastName()}`,
      vendorID: 'https://sqs.eu-central-1.amazonaws.com/457441446271/deliveredV1'
    }),
    TopicArn: topic,
    MessageGroupId: '1',
  };
  
  sns.publish(payload).promise()
  .then(data => {
    console.log('\x1b[31m%s\x1b[0m', `\n NEW ORDER for ${JSON.parse(payload.Message).customer} is posted!`);
  })
  .catch(console.error);
  
}, 5000)

setTimeout( () => {
  clearTimeout(timeoutID)
}, 30000)