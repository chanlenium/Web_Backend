let items = [
  {
    Title: "burger",
    Price: 13.99,
  },
  {
    Title: "pizza",
    Price: 9.99,
  },
  {
    Title: "steak",
    Price: 19.99,
  },
  {
    Title: "salmon",
    Price: 11.99,
  }
];

let packages = [
  {
    Title: "glutenFreePackage",
    Price: 117.0,
    Category: "western",
    noOfMeals: 12,
    content:
      'The Gluten-Free Package comes with a variety of our best selling meals from the Lunch & Dinner menu. Each meal in this package contains 1 cup of Carbohydrates, 1 cup of Vegetables and 5oz of meat protein (unless you add "protein plus" to your order). You can find the nutritional information for your meals on the Nutritional Information tab on our website.',
    top: "true",
  },
  {
    Title: "prebioticSoupCleansePackage",
    Price: 129.0,
    Category: "western",
    noOfMeals: 21,
    content:
      "This package comes with 7 of our best selling protein-packed meals and 14 of our best selling prebiotic soups! We designed this package to deliver rejuvenating benefits such as improved gut health and weight loss!",
    top: "false",
  },
  {
    Title: "veggiePackage",
    Price: 159.0,
    Category: "western",
    noOfMeals: 15,
    content:
      "This package includes a variety of 15 vegetarian-friendly meals including veggie chicken, veggie beef, veggie ground beef, tofu, a variety of fresh vegetables, seasonings, sauces and carbohydrates including rice, yams, pasta, butternut ravioli, potatoes and quinoa.",
    top: "false",
  },
  {
    Title: "weightLossPackage",
    Price: 145.0,
    Category: "western",
    noOfMeals: 10,
    content:
      "This package comes with a variety of our best selling meals from the Lunch & Dinner menu. Each meal has been properly portion controlled to help you lose weight! The longer you stick with it, the better the results will get.",
    top: "false",
  },
];

// window.onload = function () {
//   let topMeals = document.querySelector("#top-meals");
//   items.forEach(function (e) {
//     let divColTag = document.createElement("div");
//     divColTag.className = "col-sm-3";
//     topMeals.appendChild(divColTag);
//     let divImgTag = document.createElement("div");
//     divImgTag.className = "work-box-image";
//     let imgTag = document.createElement("img");
//     imgTag.className = "img-fluid";
//     imgTag.src = `/${e.Title}.jpg`;
//     divImgTag.appendChild(imgTag);
//     divColTag.appendChild(divImgTag);

//     let divContentTag = document.createElement("div");
//     divContentTag.className = "work-box-content text-center";
//     divContentTag.style = "margin-top: 10px;";
//     divContentTag.innerHTML = `<h4>${e.Title}</h4><p></p><p>$ ${e.Price}</p>`;
//     divColTag.appendChild(divContentTag);
//   });
// };
