const {GraphQLServer} = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

// implementation of schema
// Note: return types must adhere to schema
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info)
    },
  },
  Mutation: {
    post: (root, args, context, info) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description,
        },
      }, info);
    },
  },
}
// GraphQL resolver function actually receives four inputs:
// The first argument, commonly called root (or parent) is the result of the previous resolver execution level
// removed b/c graphql can infer them!!!
// Link: {
//   id: (root) => root.id,
//   description: (root) => root.description,
//   url: (root) => root.url,
// }
// }

// 3
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/joshua-parker-f347cf/database/dev',
      secret: 'mysecret123',
      debug: true,
    })
  })
})
server.start(() => console.log(`Server is running on http://loalhost:4000`))
