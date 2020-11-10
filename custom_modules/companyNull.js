

module.exports = function isCompanyNull(company) {
    if(company === null || company === "undefined") {
        console.log("Company is Null or Undefined");
        return (
        res.status(404).send("Company is Null or Undefined")
        )
    }
};