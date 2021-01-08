let topMeals = [
  { Title: "burger", Price: 13.99 },
  { Title: "pizza", Price: 9.99 },
  { Title: "steak", Price: 19.99 },
  { Title: "salmon", Price: 11.99 },
];

var mealPackages = [
  {
    Title: "glutenFreePackage",
    Price: 117.0,
    Category: "western",
    noOfMeals: 12,
    content:
      'The Gluten-Free Package comes with a variety of our best selling meals from the Lunch & Dinner menu. Each meal in this package contains 1 cup of Carbohydrates, 1 cup of Vegetables and 5oz of meat protein (unless you add "protein plus" to your order). You can find the nutritional information for your meals on the Nutritional Information tab on our website.',
    isTopMealPackage: true,
  },
  {
    Title: "prebioticSoupCleansePackage",
    Price: 129.0,
    Category: "western",
    noOfMeals: 21,
    content:
      "This package comes with 7 of our best selling protein-packed meals and 14 of our best selling prebiotic soups! We designed this package to deliver rejuvenating benefits such as improved gut health and weight loss!",
    isTopMealPackage: false,
  },
  {
    Title: "veggiePackage",
    Price: 159.0,
    Category: "western",
    noOfMeals: 15,
    content:
      "This package includes a variety of 15 vegetarian-friendly meals including veggie chicken, veggie beef, veggie ground beef, tofu, a variety of fresh vegetables, seasonings, sauces and carbohydrates including rice, yams, pasta, butternut ravioli, potatoes and quinoa.",
    isTopMealPackage: false,
  },
  {
    Title: "weightLossPackage",
    Price: 145.0,
    Category: "western",
    noOfMeals: 10,
    content:
      "This package comes with a variety of our best selling meals from the Lunch & Dinner menu. Each meal has been properly portion controlled to help you lose weight! The longer you stick with it, the better the results will get.",
    isTopMealPackage: false,
  },
];

module.exports.getTopMeals = function () {
  return topMeals;
};

module.exports.getMealPackages = function () {
  return mealPackages;
};

module.exports.getTopMealPackages = function (mealPackages) {
  var topMealPackages = [];
  for (element in mealPackages) {
    if (mealPackages[element].isTopMealPackage == "true") {
      topMealPackages.push(mealPackages[element]);
    }
  }
  return topMealPackages;
};

module.exports.registerValidateName = function (name) {
  let pattern = /^[a-zA-Z\-]+$/;
  return pattern.test(name);
};

module.exports.registerValidateEmail = function (email) {
  let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email) && email.includes("@myseneca.ca");
};

module.exports.registerValidatePassword = function (pw) {
  let pattern = /^[a-zA-Z0-9]{6,12}$/;
  return pattern.test(pw);
};

module.exports.registerValidateConfirmPassword = function (pw, pw2) {
  return pw == pw2;
};

module.exports.loginValidate = function (input) {
  return input.trim();
};
