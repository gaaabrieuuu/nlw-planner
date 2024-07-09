import fastify from "fastify";

const app = fastify();

app.get("/teste", () => {
  return "Hello World";
});

app.listen({ port: 3001 }).then(() => {
  console.log("Server running!");
});
