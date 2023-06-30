var {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
} = require("graphql");
const axios = require("axios");

const _ = require("lodash");

const CompanyType = new GraphQLObjectType({
  name: "company",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: GraphQLList(UserType),
      async resolve(parentValues, args) {
        console.log("dataCompany", parentValues);
        console.log("args", args);
        const userData = await axios.get(
          `http://localhost:3000/companies/${parentValues.id}/users/`
        );
        console.log("dataCompany", userData.data);
        return userData.data;
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "user",
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      async resolve(parentValues, args) {
        const dataCompany = await axios.get(
          `http://localhost:3000/companies/${parentValues.companyId}`
        );
        console.log("dataCompany", dataCompany.data);
        return dataCompany.data;
      },
    },
  }),
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      async resolve(parentValues, { firstName, age }) {
        const userAdd = await axios.post(`http://localhost:3000/users/`, {
          firstName,
          age,
        });
        console.log("dataCompany", userAdd.data);
        return userAdd.data;
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(parentValues, { id }) {
        const userRemoved = await axios.delete(
          `http://localhost:3000/users/${id}`
        );
        console.log("dataCompany", userRemoved.data);
        return userRemoved.data;
      },
    },
    updateUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString },
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parentValues, { id, firstName, age }) {
        const updatedUser = await axios.patch(
          `http://localhost:3000/users/${id}`,
          {
            firstName,
            age,
          }
        );
        console.log("dataCompany", updatedUser.data);
        return updatedUser.data;
      },
    },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(parentValues, args) {
        const userData = await axios.get(
          `http://localhost:3000/users/${args.id}`
        );
        return userData.data;
      },
    },
    company: {
      type: CompanyType,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(parentValues, args) {
        const dataCompany = await axios.get(
          `http://localhost:3000/companies/${args.id}`
        );

        return dataCompany.data;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
