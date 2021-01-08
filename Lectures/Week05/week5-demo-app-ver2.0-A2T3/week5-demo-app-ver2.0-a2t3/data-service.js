var mealPackages = [
    {name: "Smith", title:"Mr.", isTopPackage: true},
    {name: "Tim", title:"Ms.", isTopPackage: false},
    {name: "Jeo", title:"Mr.", isTopPackage: true}
];

module.exports.getMealPackages = function(){
    return mealPackages;
}

module.exports.getTopMealPackages = function () {
    var topMealPackages = [];
    //...
    return topMealPackages;
}

var users = [
    {name: "John Smith", username: "js@seneca.ca", password: "P@$$w0rd", role: "admin"}
];

module.exports.getAllUsers = function(){
    return users;
}

module.exports.register = function(user){
    users.push(user);
    console.log("users:", users)
}

module.exports.login = function(user){
    if(true) { 
        return true;
    } else {
        return false
    }
}


module.exports.validatFirstName = function(fname){
    if (!fname) { return false; }
    else { return ture; }
}

module.exports.validatLastName = function(n){
    return ture;
}