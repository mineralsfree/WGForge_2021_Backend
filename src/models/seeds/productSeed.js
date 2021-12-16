const Product = require('../Product');
const tanks = require('./vehicle.json')
const gold = require('./gold.json')
const premium = require('./premium.json')

async function productSeed(){
  const itemsArray = Object.keys(tanks).map(el => tanks[el]);
  const filtered = itemsArray.filter(el => el.tier !== 0);
  let maxPrice = 59;
  let minPrice = 9
  const mapped = filtered.map(product => {
    let basePrice = Math.floor(Math.random() * (maxPrice-minPrice) + minPrice) + 0.99;
    let item =  {
      name: product.name,
      type: 'vehicle',
      base_price: basePrice,
      price: {
        code: 'USD',
        amount: basePrice,
      },
      images: [product.images.big_icon],
      tank_type: product.type,
      nation: product.nation,
      details: product.description,
      tier: product.tier
    }
    if (Math.random() > 0.3){
      item.discount = 10;
      item.base_price_discount = (basePrice - (basePrice * (item.discount/100))).toFixed(2);
      item.price_discount = item.base_price_discount;
    } else {
      item.discount = 0;
      item.base_price_discount = 0;
      item.price_discount = item.base_price_discount;
    }
    return item;
  })
  const seedDB = async () => {
    await Product.deleteMany({});
    await Product.insertMany([...premium, ...gold, ...mapped ])
  }
  await seedDB()
  console.log('seeded productSeed Successfully')
}

module.exports = productSeed