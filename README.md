![](https://komarev.com/ghpvc/?username=TheDemonTuan)
# Blog Website Using NodeJS

It's just a small project of mine for my website.



## Tech Stack

**Client:** `Pug Template` `Jquery` `Boostrap 5` `Themeify Icons` `Sweetalert 2` `DataTables`

**Server:** `Node` `Express` `Redis` `MySQL` `NPM`


## Screenshots

![App Screenshot](https://i.imgur.com/QUzpfkS.png)

## Demo
https://node.thedemontuan.com


## Used By

This project is used for my own website `thedemontuan.com`.


## Features

- It's still under development.


## Usage/Examples

How to use my middleware popup message (`Sweetalert 2`)
```javascript
const message = require("../middlewares/message.js");
app.use(message.check)

message.create(req, res, next, status, message, isRedirect = false, pageRedirect = "");

Message will save at res.locals.showMessage.

```


## Installation

Install my-project with npm

```bash
  cd my-project
  npm i
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`

`COOKIE_SECRET`

`JWT_SECRET`

`DB_HOST`

`DB_USER`

`DB_PASSWORD`

`DB_DATABASE`


## Support

For support, email thedemontuan@gmail.com


## Authors

- [@TheDemonTuan](https://www.github.com/TheDemonTuan)

