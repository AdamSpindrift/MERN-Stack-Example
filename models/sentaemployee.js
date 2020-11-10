const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sentaEmployeeSchema = new Schema({
    fName: String,
    lName: String,
    Position: String,
    Year: String,
    VATReturn: [],
    PAYE: [],
    Bookkeeping: [],
    PersonalTaxReturn: [],
    AccountsProduction: [],
    NewClient: [],
    ClientOnboarding: [],
    WTargetVATReturn: Number,
    WTargetPAYE: Number,
    WTargetBookkeeping: Number,
    WTargetPersonalTaxReturn: Number,
    WTargetAccountsProduction: Number,
    WTargetNewClient: Number,
    WTargetClientOnboarding: Number,
    YTargetVATReturn: Number,
    YTargetPAYE: Number,
    YTargetBookkeeping: Number,
    YTargetPersonalTaxReturn: Number,
    YTargetAccountsProduction: Number,
    YTargetNewClient: Number,
    YTargetClientOnboarding: Number,
    AddVATReturn: Number,
    AddPAYE: Number,
    AddBookkeeping: Number,
    AddPersonalTaxReturn: Number,
    AddAccountsProduction: Number,
    AddNewClient: Number,
    AddClientOnboarding: Number,
});

module.exports = mongoose.model("SentaEmployee", sentaEmployeeSchema);