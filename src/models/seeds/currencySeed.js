const Currency = require('../Currency')
const items = require('./currency.json');

async function currencySeed(){
  const itemsArray = Object.keys(items).map(el => items[el]);
  const mapped = itemsArray.map(currency => {
    return  {
      name: currency.name,
      code: currency.code,
      rate: currency.rate,
      date: currency.date,
      inverseRate: currency.inverseRate,
      minorUnit: currency.minorUnit
    }
  })
  const seedDB = async () => {
    await Currency.deleteMany({});
    await Currency.insertMany(mapped)
  }
  await seedDB()
  console.log('seeded  Currency Successfully')
}
module.exports = currencySeed