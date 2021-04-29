const randomString = (length) => {
  let randomString = '';
  const possibleChars = 'ABCDEFGHI0123456789';
  for (let index = 0; index < length; index++) {
    randomString += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  return randomString;
}

module.exports = randomString;