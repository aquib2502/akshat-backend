import bcrypt from 'bcryptjs';

// This is your hash generated using the password "Admin!123"
const testHash = "$2b$10$sTYV/mdRA1YbVoeIUcC0q.YR37rfEm6bqPnrjXfyScws58hYe560m";
const testPassword = "Admin!123";

// Directly compare
bcrypt.compare(testPassword, testHash, (err, result) => {
  if (err) {
    console.log("Error: ", err);
  } else {
    console.log("Password Match Result: ", result); // This should log 'true' since we're using the correct hash
  }
});
