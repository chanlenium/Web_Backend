
module.exports.validateUserForm = function(formData){
    var errors = {isValid: true, username: "", email: "", name: "", password: "", password2: ""};

    validateUserFormUsername(formData.username, errors);
    validateUserFormEmail(formData.email, errors);
    // validateUserFormName(formData.name, errors);
    // validateUserFormPassword(formData.password, formData.password2, errors);
    // console.log("errors in validateUserForm()", errors);
    return errors;
}

function validateUserFormUsername(input, errors){
    if(!input.trim()){ // if the username in "null" or empty string
        errors.isValid = false;
        errors.username += "username is required. "
        return;
    }

    // some calculation here
    if(input.length<4){ // other invalid condition
        errors.isValid = false;
        errors.username += "At least 4 characters for username. "
        return;
    }
}

function validateUserFormEmail(input, errors){
    if(!input.trim()){
        errors.isValid = false;
        errors.email += "Email field is required. "
        return;
    }

    if(!input.includes("@myseneca.ca")){ // fake: suppuse only seneca email is view as valid
        errors.isValid = false;
        errors.email += "Only Seneca student email is allowed. "
        return;
    }
}

module.exports.validateLoginForm = function(data){
    return ture;
}

