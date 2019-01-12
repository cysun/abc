const signOptions = {
    issuer: "abc",
    subject: "abc",
    audience: "abc",
    expiresIn: "5h",
    algorithm: "HS256"
};

const invalid_image = "C:/fake_path/non_image.pdf";
const valid_image = "C:/fake_path/image.jpg";

const email_address = "email@email.com";
const email_password = "password";
const website = "http://localhost:3000/";

const yandex_key = "yandex_key"

module.exports = {
  website,
  yandex_key,
  signOptions,
  valid_image,
  invalid_image,
  email_address,
  email_password
};