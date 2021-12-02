'use strict'

const faker = require('faker');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-central-1' });

const sns = new AWS.SNS();

const topic = 'arn:aws:sns:eu-central-1:457441446271:pickup.fifo';

const payload = {
  Message: JSON.stringify({ 
    orderID: faker.datatype.uuid(),
    customer: `${faker.name.firstName()} ${faker.name.lastName()}`,
    vendorId: 'https://sqs.eu-central-1.amazonaws.com/457441446271/deliveredV1'
  }),
  TopicArn: topic,
  MessageGroupId: '1',
};

sns.publish(payload).promise()
  .then(data => {
    console.log(data);
  })
  .catch(console.error);

  //=============Subcsribing to delivery queue=========="

  // const { Consumer } = require('sqs-consumer');
  
  // const app = Consumer.create({
  //   queueUrl: 'https://sqs.eu-central-1.amazonaws.com/457441446271/deliveredV1',
  //   handleMessage: handler,
  // });
  
  // function handler(message) {
  //   console.log(message.Body);
  // }
  
  // app.on('error', (err) => {
  //   console.error(err.message);
  // });
  
  // app.on('processing_error', (err) => {
  //   console.error(err.message);
  // });
  
  // app.start();