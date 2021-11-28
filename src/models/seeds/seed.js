const currencySeed = require('./currencySeed');
const userSeed = require('./userSeed')
const productSeed = require('./productSeed')
const connect = require("./connect");

(async ()=>{
  const connection = await connect();
  await currencySeed(connection);
  await userSeed(connection);
  await productSeed(connection);
  connection.close(() => {
  console.log('all seeds ran successfully')
  })
})()
