const lineByLine = require("n-readlines");
const fs = require("fs");
const secret = require("../secret");
const YandexTranslator = require("yandex.translate");
const translator = new YandexTranslator(secret.yandex_key);

/**
 * Function that creates translations of english statements from the lang_en.ini file to other languages
 * @param {Array} langs - The languages to get translations of
 * @param {String} variable - The L::variable
 * @param {String} statement - The english statement we want the tranlation of
 */
function handleFiles(langs, variable, statement) {
  const no_of_elements = langs.length;
  for (let i = 0; i < no_of_elements; i++) {
    //Check all lines of each file for this sequence of characters
    let line;
    let variable_found = false;
    let file_exists = false;

    if (fs.existsSync(`./${langs[i]}.json`)) file_exists = true;
    // else fs.appendFileSync(`{`, (encoding = "utf8"));
    //If file exists
    if (file_exists) {
      let liner = new lineByLine(`./${langs[i]}.json`);
      while ((line = liner.next())) {
        let this_line = line.toString("ascii");
        //Get left part
        let first_part = this_line.split('"');
        //If found, do nothing
        if (first_part[1] == variable) {
          variable_found = true;
          break;
        }
      }
    }

    //If not found,
    if (!variable_found || !file_exists) {
      //Get translation
      //Yandex translate
      try {
        translator.translate(statement, langs[i]).then(function(v) {
          fs.appendFileSync(
            `./${langs[i]}.json`,
            `\n"${variable}": "${v[0]}",`,
            (encoding = "utf8")
          );
        });
      } catch (e) {
        console.log(e);
        process.exit(1);
      }
    }
  }
}

//Read lang_en.ini file line by line
const liner = new lineByLine("./en.json");
let line;
while ((line = liner.next())) {
  let this_line = line.toString("ascii");
  if (this_line == "" || this_line == "\r") continue;
  //Get characters before first space
  let first_part_array = this_line.split('"');
  let first_part = first_part_array[1];
  let second_part = first_part_array[3];
  //Check all the other files for these statements, get and store translations
  // handleFiles(['zh', 'hi', 'ur', 'fr', 'es', 'ar', 'pt', 'bn', 'ru', 'tr', 'it', 'ja', 'de', 'ko', 'nl', 'pa', 'sw'], first_part[0], second_part[1]);
  handleFiles(["es"], first_part, second_part);
}
