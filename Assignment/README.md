# Imaginary Web site (Meal Delivery)
[Heroku webpage link](https://evening-badlands-62985.herokuapp.com/)

## Object
>* Implement web site using server-driven web applications using JavaScript with Node.js and Express.js
>* Make database using Cloud server (i.e., MongoDB Atlas) and link the database with web site
>* Implement Server-Side validation for both the login and registration form
>* Encrypt `userID` and `password` to protect user information from malicious attacks

## Homepage configuration
>* Home
>* Meals Package
>* About
>* Registration
>* Login
>* My cart (visible to at Login user only)
>* My meals (visible to Data entry clerk only)

### Home
>* Header - contain the logo of the website and could contain the navigation bar and any other contents 
>* Navigation bar - have links that navigate visitors to a sign-up page and the login page
>* Hero Section- have a prominent image element that is placed at the top of pages below the header and navigation section
>* Content Section - combination of grids, words, headings, and images (This section must display at least four (4) top meal packages)
>* Footer - include footer menu items, social media links, and any other information
![](readmeImage/home.JPG "home")

### Meals Package
>* This page must have at least 4 sample meal packages within a 4 column grid layout
>* Every meal package have an image, title, price, food category, number of meals in the package and a boolean attribute indicating if it is a top package or not 
### Registration
>* Implement Server-Side validation for the registration form
>* Check for nulls and implement complex validation criteria using regular expressions
>* When a user fills out the registration form and then hits the submit button, provided that all the validation criteria were not violated, your website must then send a welcome email message to the user’s email address and then redirect the user to an about page. 
### Login
>* Implement Server-Side validation for the login form
>* Check for nulls 
### My cart (visible to at Login user only)
>* Have a link to the logged-in user shopping cart
>* Display all the meal packages that were added to the shopping cart and how much of each package was added for the given user
### My meals (visible to Data entry clerk only)
>* Data Entry Clerk Module
>* Able to add and edit new meal packages to the database
>* View a list of all created meal packages
>* All created meal packages that were entered into the database are populated on the front-end of the web application
