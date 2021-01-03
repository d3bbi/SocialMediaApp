/*dependecies*/
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose'); /*let us interface qith mongodb interface*/

/*imports */
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config.js');

const typeDefs = require('./graphql/typeDefs');


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
});

mongoose.connect(MONGODB, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log('MONGODB Connected')
        return server.listen({ port: 5000 });
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
    })
    .catch((e) => {
        console.log("ERROR")
        console.log(e.message)
    })



