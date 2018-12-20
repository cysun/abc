const signOptions = {
    issuer: "abc",
    subject: "abc",
    audience: "abc",
    expiresIn: "abc",
    algorithm: "abc"
};

const invalid_image = "C:/fake_path/non_image.pdf";
const valid_image = "C:/fake_path/image.jpg";

module.exports = {
    signOptions,
    valid_image,
    invalid_image
}