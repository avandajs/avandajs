# Avanda JSGA

Avanda Json Graph Api is a Json based graph API built on top of javascript and nodejs, this library lets you communicate with the backend controllers and functions

## Installation

To install Avanda Json Graph Api, run:

```bash
$ npm i @avanda/avandajs // or yarn add @avanda/avandajs
```

## Calling backend controller/Service function

To call and get response from backend function, you first have to import avanda json graph API

```javascript
import Graph from "@avanda/avandajs";
```

then proceed to instantiating it

```javascript
let user = await new Graph().service('User/get')
```
'User' in the .service() function is the controller class name you already created in the backend, 'get' is the function in the User controller(class), this could also be any function 

you can now specify which column from user response you want

```javascript
let user = await new Graph()
                .service('User/get')//ServiceName/MethodName
                .select("full_name","number_of_posts")//needed columns
```

you can now specify what type of request you want to send to it

```javascript
let user = await new Graph()
                .service('User/get')//ServiceName/MethodName
                .select("full_name","number_of_posts")//needed columns
                .get()//get request will be sent to this function, this could be .post(), .delete() and so on
```

## Nesting backend function calls

The real power of avanda json graph API comes from the fact that you can nest as many and as deep Graph instance you want, an example of a nested graph calls below

```javascript
let blog = new Graph().service("Blog/getAll").as("posts")
let user = await new Graph()
                .service('User/get')
                .select("id","full_name","number_of_posts",blog)//Avanda will automatically link relative blog to their users so far blogs has a user_id in it's associated model's structure
                .get()
```

the code above will produce a response like this:

```json
{
  "msg": "",
  "data": {
    "id":1,  
    "full_name": "aisha",
    "number_of_posts": 1,
    "posts": [{//all blog posts with user_id of 1
      "title":"hello world"
    }]
  },
  "status_code": 200
}
```

## Add constraint clauses

Avanda avanda json graph API lets you add some constraints to limit the amount of data to fetch, below is an example of howto do that


```javascript
let blog = new Graph().service("Blog/getAll")
let user = await new Graph()
                .service('User/get')
                .select(
                    "id",
                    "full_name",
                    "number_of_posts",
                    blog.as("posts")
                 )
                .where("number_of_posts").lessThan(10)
                .get()//gets only users with posts less than 10
```

## Security at the back of your mind

while it is easier to just use the constraint clauses on the go, be sure you aren't giving user's access to too much by add additional constraints to you model in your function on the server side and also implementing necessary middleWares