/** Common config for bookstore. */


let DB_URI = `postgresql://`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/books_test`;
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/books`;
}


// const DB_URI = (process.env.NODE_ENV === "test")
//   ? "postgresql:///express_auth_test"
//   : "postgresql:///express_auth";

module.exports = { DB_URI };