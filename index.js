const { ApolloServer, gql } = require("apollo-server");
const books = require("./bookList.json");

const typeDefs = gql`
  type Book {
    id: ID
    title: String
    author: String
  }

  type Query {
    books(limit: Int, offset: Int, title: String): [Book]
    searchBooks(limit: Int, offset: Int, title: String): [Book]
  }
`;

const resolvers = {
  Query: {
    books: (_, args) => {
      const { limit = 10, offset = 0 } = args;
      return books
        .slice(offset, offset + limit)
        .map((book) => ({ ...book, __typename: "Book" }));
    },
    searchBooks: (_, args) => {
      return books.filter((book) => {
        if (book.title.indexOf(args.title) >= 0) {
          return true;
        }
        return false;
      });
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
