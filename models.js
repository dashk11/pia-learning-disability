const mongoose = require("mongoose");




const accountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Note: In practice, save a hashed version of the password, not the plain text
    email: { type: String, required: true, unique: true }
});


const preferenceSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    font: { type: Boolean, default: true },
    assist: { type: Boolean, default: true },
    images: { type: Boolean, default: true },
    speech: { type: Boolean, default: true },

});


const Account = mongoose.model("Account", accountSchema);
const Preference = mongoose.model("Preference", preferenceSchema);


module.exports = { Account, Preference };




const mongoose = require("mongoose");
const { Account, Preference } = require("./models");


mongoose.connect('mongodb://localhost:27017');


const newAccount = new Account({
  username: "user1",
  password: "password1", // In practice, ensure the password is hashed
  email: "user1@example.com"
});

newAccount.save()
  .then(account => {
    console.log("Account has been saved.");

    // Create a Preference for the saved account
    const newPreference = new Preference({
      accountId: account._id,
      font: true,
      assist: true,
      images: true,
      speech: true
    });

    newPreference.save()
      .then(preference => {
        console.log("Preference has been saved.");
      })
      .catch(error => console.error("Could not save preference: ", error));
  })
  .catch(error => console.error("Could not save account: ", error));
