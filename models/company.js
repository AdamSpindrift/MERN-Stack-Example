const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema({
    Name: String,
    Application: String,
    Year: String,
    Employees:[],
})

module.exports = mongoose.model("Companies_2020_2021", companySchema);