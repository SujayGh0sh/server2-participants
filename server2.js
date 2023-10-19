const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8005; // You can change the port number as needed

// const upload = multer({ dest: 'upload/' });

// app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors({
        origin: ['http://localhost:3000'],  // Allow requests from this origin
         credentials: true, // Allow credentials (e.g., cookies, authorization headers)
       }));

       

       const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
          const extname = path.extname(file.originalname);
      
          if (file.fieldname === 'aadharCard') {
            const filename = file.fieldname + '-' + req.body.participantName + extname;
            cb(null, filename);
          } else if (file.fieldname === 'aadharCard1') {
            const filename = file.fieldname + '-' + req.body.participantName + extname;
            cb(null, filename);
          } 
           else {
            cb(null, file.fieldname + '-' + Date.now() + extname);
          }
        },
      });

      const upload = multer({ storage: storage });

      

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect('mongodb+srv://sujayghoshcool:z1y2x3w4@cluster1.oppb2.mongodb.net/ZeeBanglaMuktoMancho?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for your data
const participantSchema = new mongoose.Schema({
    name: String,
    videoLink: String,
    selectedCategory: String,
    participantName: String,
    forMyself: Boolean,
    age: String,
    gender: String,
    aadharCard: String, 
    forMyChild: Boolean,
    childAge: String,
    childGender: String,
    parentName: String,
    relationship: String, 
    aadharCard1: String,
});

const Participant = mongoose.model('Participant', participantSchema);

app.use('/uploads', express.static('uploads'));

app.use(morgan('tiny'));

// module.exports = Participant;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Create a new participant record
app.post('/participants', upload.fields([
  {name: 'aadharCard'},
  {name: 'aadharCard1'},
]), async (req, res) => {

  console.log('Uploaded file:', req.file);

  const {
    name,
    videoLink,
    selectedCategory,
    participantName,
    forMyself,
    age,
    gender,
    forMyChild,
    childAge,
    childGender,
    parentName,
    relationship
  } = req.body;

  const aadharCardPath = req.files && req.files['aadharCard'] ? req.files['aadharCard'][0].path : '';
        const aadharCardPath1 = req.files && req.files['aadharCard1'] ? req.files['aadharCard1'][0].path : '';

  try {
    const newParticipant = new Participant({
      name,
      videoLink,
      selectedCategory,
      participantName,
      forMyself,
      age,
      gender,
      forMyChild,
      childAge,
      childGender,
      parentName,
      relationship,
      aadharCard: aadharCardPath,
      aadharCard1: aadharCardPath1,
      // Other fields...
    });
    const savedParticipant = await newParticipant.save();
    res.status(201).json(savedParticipant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save participant' });
  }
});


// Handle file uploads and save file paths in your route
// app.post('/participants', upload.single('aadharCard'), upload.single('childAadharCard'), async (req, res) => {
//     const {
//       name,
//       videoLink,
//       selectedCategory,
//       participantName,
//       email,
//       phoneNumber,
//       address,
//       forMyself,
//       age,
//       gender,
//       forMyChild,
//       childAge,
//       childGender,
//       parentName,
//       relationship,
  
//       // Get file paths from file objects
//       aadharCard,
//       childAadharCard
//     } = req.body;
  
//     try {
//       // Save the file paths in the database
//       const newParticipant = new Participant({
//         name,
//         videoLink,
//         selectedCategory,
//         participantName,
//         email,
//         phoneNumber,
//         address,
//         forMyself,
//         age,
//         gender,
//         aadharCardPath: aadharCard ? aadharCard.path : null,
//         forMyChild,
//         childAge,
//         childGender,
//         parentName,
//         relationship,
//         childAadharCardPath: childAadharCard ? childAadharCard.path : null,
//       });
  
//       await newParticipant.save();
  
//       res.status(201).json({ message: 'Participant data saved successfully' });
//     } catch (err) {
//       console.error('Error:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

