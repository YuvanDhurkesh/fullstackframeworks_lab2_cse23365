require('dotenv').config();
const mongoose = require('mongoose');
const Helper = require('./models/Helper');

const helpers = [
  {
    name: 'Doctor',
    image: '/images/doctor.png',
    tools: ['Stethoscope', 'Thermometer', 'Syringe'],
    description: 'I help people feel better when they are sick.',
    video: 'https://www.youtube.com/watch?v=s8GvfflImB4'
  },
  {
    name: 'Farmer',
    image: '/images/farmer.png',
    tools: ['Hoe', 'Plough', 'Tractor'],
    description: 'I grow crops and provide food for everyone.',
    video: 'https://www.youtube.com/watch?v=aqz0Mj6sIwY'
  },
  {
    name: 'Firefighter',
    image: '/images/firefighter.png',
    tools: ['Fire Hose', 'Helmet', 'Axe'],
    description: 'I put out fires and help keep everyone safe.',
    video: 'https://www.youtube.com/watch?v=D5Mh2KW7AI8'
  },
  {
    name: 'Mason',
    image: '/images/mason.png',
    tools: ['Trowel', 'Brick', 'Cement'],
    description: 'I build houses and buildings.',
    video: 'https://www.youtube.com/watch?v=iW9jpYqBOM8'
  },
  {
    name: 'Police Officer',
    image: '/images/police.png',
    tools: ['Handcuffs', 'Radio', 'Badge'],
    description: 'I help keep the community safe and follow rules.',
    video: 'https://www.youtube.com/watch?v=Y-J4XRFFBtw'
  },
  {
    name: 'Sweeper',
    image: '/images/sweeper.png',
    tools: ['Broom', 'Dustpan', 'Cart'],
    description: 'I keep the streets and places clean.',
    video: 'https://www.youtube.com/shorts/15MXSeE68aA'
  },
  {
    name: 'Teacher',
    image: '/images/teacher.png',
    tools: ['Book', 'Chalk', 'Board'],
    description: 'I help children learn new things every day.',
    video: 'https://www.youtube.com/watch?v=ifCK1VDgM-g'
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  // Clear all helpers before seeding
  await Helper.deleteMany({});
  await Helper.insertMany(helpers);
  console.log('Helpers seeded!');
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  mongoose.disconnect();
});
