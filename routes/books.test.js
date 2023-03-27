process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

// Add sample book data to use for testing
const testBook = {
  "isbn": "0691161518",
  "amazon_url": "http://a.co/eobPtX2",
  "author": "Matthew Lane",
  "language": "english",
  "pages": 264,
  "publisher": "Princeton University Press",
  "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
  "year": 2017
};

beforeEach(async () => {
  await db.query("DELETE FROM books");
  await Book.create(testBook);
});

beforeAll(async () => {
    await db.query("DELETE FROM books");
  });
  
afterAll(async () => {
    await db.query("DELETE FROM books");
    await db.end();
  });
  

describe("GET /books", () => {
  test("Get all books", async () => {
    const response = await request(app).get("/books");
    expect(response.statusCode).toBe(200);
    expect(response.body.books.length).toBe(1);
  });
});

describe("GET /books/:id", () => {
  test("Get book by id", async () => {
    const response = await request(app).get(`/books/${testBook.isbn}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.book).toEqual(testBook);
  });

  test("Get non-existing book", async () => {
    const response = await request(app).get("/books/nonexistent");
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /books", () => {
  test("Create a new book", async () => {
    const newBook = {
      "isbn": "1234567890",
      "amazon_url": "http://a.co/example",
      "author": "John Doe",
      "language": "english",
      "pages": 300,
      "publisher": "Example Publisher",
      "title": "Example Book",
      "year": 2022
    };
    const response = await request(app).post("/books").send(newBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.book).toEqual(newBook);
  });

  test("Create a book with invalid data", async () => {
    const invalidBook = {
      "isbn": "1234567890",
      "amazon_url": "http://a.co/example"
    };
    const response = await request(app).post("/books").send(invalidBook);
    expect(response.statusCode).toBe(400);
  });
});

describe("PUT /books/:isbn", () => {
  test("Update a book", async () => {
    const updatedBook = {
      ...testBook,
      "title": "Updated Title"
    };
    const response = await request(app).put(`/books/${testBook.isbn}`).send(updatedBook);
    expect(response.statusCode).toBe(200);
    expect(response.body.book).toEqual(updatedBook);
  });

  test("Update a non-existing book", async () => {
    const response = await request(app).put("/books/nonexistent").send(testBook);
    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /books/:isbn", () => {
  test("Delete a book", async () => {
    const response = await request(app).delete(`/books/${testBook.isbn}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Book deleted" });
  });

  test("Delete a non-existing book", async () => {
    const response = await request(app).delete("/books/nonexistent");
    expect(response.statusCode).toBe(404);
  });
});