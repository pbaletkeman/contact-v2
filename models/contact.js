import Address from "./address.js";

class Contact {
  #contactId;
  #firstName;
  #lastName;
  #middleName;
  #birthDate;
  #title;
  #addresses;

  set contactId(contactId) {
    this.#contactId = contactId;
  }

  get contactId() {
    return this.#contactId;
  }

  set firstName(firstName) {
    this.#firstName = firstName;
  }

  get firstName() {
    return this.#firstName;
  }

  set lastName(lastName) {
    this.#lastName = lastName;
  }

  get lastName() {
    return this.#lastName;
  }

  set middleName(middleName) {
    this.#middleName = middleName;
  }

  get middleName() {
    return this.#middleName;
  }

  set birthDate(birthDate) {
    this.#birthDate = birthDate;
  }

  get birthDate() {
    return this.#birthDate;
  }

  set title(title) {
    this.#title = title;
  }

  get title() {
    return this.#title;
  }

  set addresses(addresses) {
    this.#addresses = addresses;
  }

  get addresses() {
    return this.#addresses;
  }

  createFromJSON = function (body) {
    if (!body) {
      return new Contact();
    }
    let contact = new Contact();
    contact.contactId = body.contactId ? body.contactId : null;
    contact.firstName = body.firstName ? body.firstName : null;
    contact.lastName = body.lastName ? body.lastName : null;
    contact.middleName = body.middleName ? body.middleName : null;
    contact.birthDate = body.birthDate ? body.birthDate : null;
    contact.addresses = body.addresses
      ? this.parseAddressJSON(body.addresses)
      : null;
    return contact;
  };

  parseAddressJSON = function (addresses) {
    let adds = [];
    if (addresses && Array.isArray(addresses) && addresses.length > 0) {
      addresses.forEach((a) => {
        const address = new Address().createFromJSON(a);
        adds.push(address);
      });
    }
    return adds;
  };

  pretty = function () {
    let adds = [];
    this.addresses.forEach((element) => {
      adds.push(JSON.stringify(element.pretty()));
    });
    let str =
      '{"contact": {"contactId" : "' +
      this.contactId +
      '", "firstName" : "' +
      this.firstName +
      '", "lastName" : "' +
      this.lastName +
      '", "middleName" : "' +
      this.middleName +
      '", "title" : "' +
      this.title +
      '", "birthDate" : "' +
      this.birthDate +
      '", "addresses" : [' +
      adds +
      "]}}";
    return str.replaceAll(null, "null");
  };
}

export default Contact;

/*
-- Table: contact


CREATE TABLE IF NOT EXISTS contact
(
    contactid integer NOT NULL DEFAULT nextval('contact_contactid_seq'::regclass),
    birthDate timestamp without time zone,
    title character(4),
    province character(5),
    country character(6),
    phone character(10),
    postalCode character varying(15),
    firstName character varying(50),
    lastName character varying(50),
    middleName character varying(50),
    street1 character varying(150),
    street2 character varying(150),
    city character varying(100),
    email character varying(250),
    CONSTRAINT contact_pkey PRIMARY KEY (contactid)
)

  */
