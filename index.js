const express = require("express");
const path = require("path");
const request = require('request');
const querystring = require('querystring');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const randomString = require('./utils/randomString');
const encode = require('./utils/encode');
const scopesArray = require('./utils/scopesArray');
const playlistMock = require('./utils/mocks/playlist');
const { userInfo, userPlaylists } = require('./utils/getUser');

const { config } = require('./config');

const app = express();

// static files
app.use("/static", express.static(path.join(__dirname, "public")));

// middlewares
app.use(cors());
app.use(cookieParser());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// routes
app.get('/', async function(req, res, next) {
  try {
    const { access_token: accessToken } = req.cookies;
    const user = await userInfo({accessToken});
    res.render('playlists', {
      playlists: { items: playlistMock },
      isHome: true,
      userInfo: user,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/playlists', async function(req, res, next) {
  try {
    const { access_token: accessToken } = req.cookies;
    if (!accessToken) {
      res.redirect('/');
    }
    const user = await userInfo({accessToken});
    const playlist = await userPlaylists({accessToken, userId: user.id});
    res.render('playlists', {
      playlists: { items: playlist },
      userInfo: user,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/login', function(req, res) {
  const state = randomString(16);
  const queryString = querystring.stringify({
    response_type: 'code',
    client_id: config.spotifyClientId,
    scope: scopesArray.join(' '),
    redirect_uri: config.spotifyRedirectUri,
    state,
  });
  res.cookie('auth_state', state, { httpOnly: true });
  res.redirect(`https://accounts.spotify.com/authorize?${queryString}`);
});

app.get('/logout', function(req, res) {
  res.clearCookie('access_token');
  res.redirect('/');
});

app.get('/callback', function(req, res, next) {
  const { code, state } = req.query;
  const { auth_state: authState } = req.cookies;
  if (state === null || state !== authState) {
    next(new Error(`The state doesn't match`))
  }
  res.clearCookie('auth_state');
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri: config.spotifyRedirectUri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization: `Basic ${encode({
        username: config.spotifyClientId,
        password: config.spotifyClientSecret,
      })}`
    },
    json: true,
  };
  request.post(authOptions, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      next(new Error('The token is invalid'));
    }
    res.cookie('access_token', body.access_token, { httpOnly: true });
    res.redirect('/playlists');
  });
})

// server
const server = app.listen(3000, function() {
  console.log(`Listening http://localhost:${server.address().port} 🔥`);
});