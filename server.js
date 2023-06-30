const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");

// Construct a schema, using GraphQL schema language

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return "Hello world!";
  },
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
