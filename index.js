const { ApolloServer, gql } = require("apollo-server");
const books = require("./bookList.json");

const typeDefs = gql`
  type Book {
    id: ID
    title: String
    author: String
  }

  type Query {
    books(limit: Int, offset: Int): [Book]
    book(id: ID, title: String, author: String): Book
  }
`;

const resolvers = {
  Query: {
    book: (_, args) => {
      return (
        books.find((book) => book.id === args.id) ||
        books.find((book) => book.title === args.title) ||
        books.find((book) => book.author === args.author)
      );
    },
    books: (_, variables) => {
      const { limit = 10, offset = 0 } = variables;
      return books
        .slice(offset, offset + limit)
        .map((book) => ({ ...book, __typename: "Book" }));
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
