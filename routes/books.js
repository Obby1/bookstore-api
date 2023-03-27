const express = require("express");
const router = new express.Router();
const Book = require("../models/book");
const ExpressError = require("../expressError");
const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json")
// const deleteBookSchema = require("../schemas/deleteBookSchema.json")



/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {

    // 
    const result = jsonschema.validate(req.body, bookSchema);
      if (!result.valid) {
        //Collect all the errors in an array
        const listOfErrors = result.errors.map(e => e.stack);
        const err = new ExpressError(listOfErrors, 400);
        //Call next with error
        return next(err);
      }
    // 
    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    // 
    const result = jsonschema.validate(req.body, bookSchema);
    if (!result.valid) {
      //Collect all the errors in an array
      const listOfErrors = result.errors.map(e => e.stack);
      const err = new ExpressError(listOfErrors, 400);
      //Call next with error
      return next(err);
    }
    // 
    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */
// old route below:
// router.delete("/:isbn", async function (req, res, next) {
//   try {
//     // Note, below commented out. No need to validate delete schema since
//     // it's already validated in the above request params
//     // faulty code for future ref:
//     // // only checks if isbn is valid and present in the request
//     // const result = jsonschema.validate(req.body, deleteBookSchema);
//     // if (!result.valid) {
//     //   //Collect all the errors in an array
//     //   const listOfErrors = result.errors.map(e => e.stack);
//     //   const err = new ExpressError(listOfErrors, 400);
//     //   //Call next with error
//     //   return next(err);
//     // }
//     // // 
//     await Book.remove(req.params.isbn);
//     return res.json({ message: "Book deleted" });
//   } catch (err) {
//     return next(err);
//   }
// });

//update route:
router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
