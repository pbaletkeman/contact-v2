import Router from "express-promise-router";
import bodyParser from "body-parser";

import * as db from "../db/index.js";
import Address from "../models/address.js";

// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();

// export our router to be mounted by the parent application
export default router;

// create application/json parser
var jsonParser = bodyParser.json();

// const result = await db.query("SELECT $1::text as message", ["Hello world!"]);
// console.log(result.rows[0]);

const TABLE_NAME = "address";

// await initTable();

// await seedTable();

router.get("/sorted/:sortField?/:direction?", async function (req, res) {
  // console.log("GET request received");
  res.writeHead(200, { "Content-Type": "application/json" });
  const rows = await getRecords(
    null,
    req.params["sortField"],
    req.params["direction"]
  );
  res.end(JSON.stringify(rows));
});

router.get("/:ids?/:sortField?/:direction?", async function (req, res) {
  // console.log("GET request received");
  res.writeHead(200, { "Content-Type": "application/json" });
  const rows = await getRecords(
    req.params["ids"],
    req.params["sortField"],
    req.params["direction"]
  );
  res.end(JSON.stringify(rows));
});

router.get("/:id", async function (req, res) {
  // console.log("GET /:id request received");
  res.writeHead(200, { "Content-Type": "application/json" });
  // res.end(req.params["id"]);
  const row = await getRecord(req.params["id"]);
  res.end(JSON.stringify(row));
});

router.post("/", jsonParser, async function (req, res) {
  // console.log("POST request received");
  // console.log("Req");
  // console.log(req.body);
  const contact = new Contact().createFromJSON(req.body);
  // console.log(contact.pretty());
  const inserted = await insertRecord(contact);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(inserted));
});

router.put("/", jsonParser, async function (req, res) {
  const contact = new Contact().createFromJSON(req.body);
  const updated = await updateRecord(contact);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(updated));
});

router.delete("/:ids", async function (req, res) {
  // console.log("DELETE request received");
  res.writeHead(200, { "Content-Type": "application/json" });
  const row = await deleteRecords(req.params["ids"]);
  res.end(JSON.stringify(row));
});

async function deleteRecords(ids) {
  const sqlString =
    `DELETE FROM ${TABLE_NAME} WHERE "contactid" in (` + ids + `)`;
  const res = await db.query(sqlString);
  return res.rows;
}

async function getRecord(id) {
  return await getRecords(id, null, null);
}

async function getRecords(ids, sortField, sortDirection) {
  let sqlString = `SELECT "contactid", "firstname", "lastname", "middlename", "street1", "street2", "city", "province", "postalcode", "country", "title", "phone", "birthdate", "email" FROM ${TABLE_NAME} WHERE 1=1 `;
  if (ids) {
    sqlString += ` AND "contactid" in (` + ids + ") ";
  }
  if (sortField) {
    sqlString += ` ORDER BY "` + sortField + `" `;
  }
  if (sortDirection) {
    sqlString += sortDirection;
  }
  const res = await db.query(sqlString);
  return res.rows;
}

async function updateRecord(address) {
  let sqlString = `UPDATE ${TABLE_NAME} set `;
  let sqlValues = [];
  let i = 0;
  if (address.firstName) {
    i++;
    sqlString += `"firstname" = $` + i + `,`;
    sqlValues.push(address.firstName.trim());
  }
  if (address.lastName) {
    i++;
    sqlString += `"lastname" = $` + i + `,`;
    sqlValues.push(address.lastName.trim());
  }
  if (address.middleName) {
    i++;
    sqlString += `"middlename" = $` + i + `,`;
    sqlValues.push(address.middleName.trim());
  }
  if (address.title) {
    i++;
    sqlString += `"title" = $` + i + `,`;
    sqlValues.push(address.title.trim());
  }
  if (address.birthDate) {
    i++;
    sqlString += `"birthdate" = $` + i + `,`;
    sqlValues.push(address.birthDate.trim());
  }
  i++;
  sqlString =
    sqlString.substring(0, sqlString.length - 1) +
    ` WHERE addressId = $` +
    i +
    ` RETURNING * `;
  sqlValues.push(address.addressId);
  const res = await db.query(sqlString, sqlValues, address.addressId);
  return res.rows;
}

async function insertRecord(address) {
  let sqlString = [];
  let sqlValues = [];
  if (address.contactId) {
    sqlString.push("contactId");
    sqlValues.push(address.contactId);
  }
  if (address.firstName) {
    sqlString.push("firstname");
    sqlValues.push(address.firstName.trim());
  }
  if (address.lastName) {
    sqlString.push("lastname");
    sqlValues.push(address.lastName.trim());
  }
  if (address.middleName) {
    sqlString.push("middlename");
    sqlValues.push(address.middleName.trim());
  }
  if (address.title) {
    sqlString.push("title");
    sqlValues.push(address.title.trim());
  }
  if (address.birthDate) {
    sqlString.push("birthdate");
    sqlValues.push(address.birthDate.trim());
  }
  let values = "";
  for (let i = 1; i <= sqlValues.length; i++) {
    values += "$" + i + ", ";
  }
  values = values.substring(0, values.length - 2);
  const sqlFields =
    `INSERT INTO ${TABLE_NAME} (` +
    `"` +
    sqlString.join('","') +
    `") VALUES (` +
    values +
    `) RETURNING * `;

  const res = await db.query(sqlFields, sqlValues);
  return res.rows;
}

async function initTable() {
  const sqlString = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME}
  (
      addressid SERIAL PRIMARY KEY,
      contactid bigInt,
      birthdate timestamp without time zone,
      title character(4),
      firstname character varying(50),
      lastname character varying(50),
      middlename character varying(50),
  )`;
  const res = await db.query(sqlString);
  return res.rows;
}

// async function seedTable() {
//   for (let i = 0; i < 10; i++) {
//     const sqlString = `INSERT INTO ${TABLE_NAME} ("firstname", "lastname", "middlename", "street1", "street2", "city", "province", "postalcode", "country", "title", "phone", "birthdate", "email")
//     VALUES ('firstName${i}', 'lastName${i}', 'middleName${i}', 'street1${i}', 'street2${i}', 'city${i}', 'pr${i}', 'postalCode${i}', 'count${i}', 'mr${i}', 'phone${i}', '2024-12-01', 'email${i}');`;
//     // console.log(sqlString);
//     const res = await db.query(sqlString);
//   }
// }
