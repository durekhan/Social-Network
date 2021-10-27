# Social-Network
This project is bootstrapped with https://nestjs.com/

## **Description**
- This project is a backend server implementation of a social network with a few features.
- Users are able to signup/login and then post content of their choice.
- Users are able to follow other users and see their posts.
- Users are able to delete their account.
- A feed is shown to users containing all the posts from the users they follow.

## **Requirements**
- MongoDb
- NestJs

## **SDK's Used in this project**
- Mongoose

## **Installation Instructions**
- Install NodeJs in your machine using: $ sudo apt install nodejs

- Install mongoose using: $ npm install mongoose
- Install NestJs using: npm i -g @nestjs/cli

## **Setup Instructions**
Clone the repo and install the dependencies.

`npm install`

`Create .env file in the project root`

`Add these credentials in .env file`

`secret='super-secret'
DB_URL=`mongodb+srv://durekhan:TomAndJerry@cluster0.6lpgs.mongodb.net/social-network`

## **Running on local**

`npm run start:dev`

## **Database Design**
![db-design](https://user-images.githubusercontent.com/90218712/139103489-e97b6813-8ee9-4ba5-92ec-18c0bdd49607.png)
