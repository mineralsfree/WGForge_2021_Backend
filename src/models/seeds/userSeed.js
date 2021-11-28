const User = require('../User');
const Admin = require('./user.json')
async function userSeed(){
  const seedDB = async () => {
    const user = new User(Admin);//password: qwerty
    await User.deleteOne({email: 'admin@admin.com'});
    await User.create(user);
  }
  await seedDB()
  console.log('seeded users Successfully')
}

module.exports = userSeed