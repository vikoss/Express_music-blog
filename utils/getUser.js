const request = require('request');

const userInfo = ({accessToken}) => new Promise((resolve, reject) => {
  if (!accessToken) {
    resolve(null);
  }
  const options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { authorization: `Bearer ${accessToken}` },
    json: true,
  };
  request.get(options, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      reject(error);
    }
    resolve(body);
  })
});

const userPlaylists = ({accessToken, userId}) => new Promise((resolve, reject) => {
  if (!accessToken || !userId) {
    resolve(null);
  }
  const options = {
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: { Authorization: `Bearer ${accessToken}` },
    json: true,
  };
  request.get(options, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      reject(error);
    }
    resolve(body.items);
  })
});

module.exports = { userInfo, userPlaylists };
