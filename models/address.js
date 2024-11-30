class Address {
  #street1;
  #addressId;
  #contactId;
  #street2;
  #city;
  #province;
  #postalCode;
  #country;
  #phone;
  #email;

  set addressId(addressId) {
    this.#addressId = addressId;
  }

  get addressId() {
    return this.#addressId;
  }

  set contactId(contactId) {
    this.#contactId = contactId;
  }

  get contactId() {
    return this.#contactId;
  }

  set street1(street1) {
    this.#street1 = street1;
  }

  get street1() {
    return this.#street1;
  }

  set street2(street2) {
    this.#street2 = street2;
  }

  get street2() {
    return this.#street2;
  }

  set city(city) {
    this.#city = city;
  }

  get city() {
    return this.#city;
  }

  set province(province) {
    this.#province = province;
  }

  get province() {
    return this.#province;
  }

  set postalCode(postalCode) {
    this.#postalCode = postalCode;
  }

  get postalCode() {
    return this.#postalCode;
  }

  set country(country) {
    this.#country = country;
  }

  get country() {
    return this.#country;
  }

  set phone(phone) {
    this.#phone = phone;
  }

  get phone() {
    return this.#phone;
  }

  set email(email) {
    this.#email = email;
  }

  get email() {
    return this.#email;
  }

  createFromJSON = function (body) {
    if (!body) {
      return new Address();
    }

    let address = new Address();
    address.contactId = body.contactid ? body.contactid : null;
    address.addressId = body.addressid ? body.addressid : null;
    address.street1 = body.street1 ? body.street1 : null;
    address.street2 = body.street2 ? body.street2 : null;
    address.city = body.city ? body.city : null;
    address.province = body.province ? body.province : null;
    address.postalCode = body.postalcode ? body.postalcode : null;
    address.country = body.country ? body.country : null;
    address.phone = body.phone ? body.phone : null;
    address.email = body.email ? body.email : null;

    return address;
  };

  pretty = function () {
    let str =
      '{"address": {"addressId":"' +
      this.addressId +
      '", "contactId":"' +
      this.contactId +
      '", "street1":"' +
      this.street1 +
      '", "street2":"' +
      this.street2 +
      '", "city":"' +
      this.city +
      '", "province":"' +
      this.province +
      '", "postalCode":"' +
      this.postalCode +
      '", "country":"' +
      this.country +
      '", "phone":"' +
      this.phone +
      '", "email":"' +
      this.email +
      '"}}';
    return JSON.parse(str.replaceAll(null, "null"));
  };
}

export default Address;
