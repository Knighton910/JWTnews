require('dotenv').config()

const express = require('express');
const jwt = require('jsonwebtoken');
const secretToken = process.env.secretToken;

const app = express();

// letting the app use json from the body inside the request
app.use(express.json());

const posts = [
  {
    username: 'Kel',
    title: 'bacon and eggs'
  },
  {
    username: 'Sally',
    title: 'Souplantation rocks'
  }
]

app.get('/posts', authenticateToken, (req, res) => {
  // return only the posts the user has access to.
  res.json(posts);
})

// POST: app.post because we want to create a token inleiu of app.get
app.post('/login', (req, res) => {
  // Authenticate User
  /** Normally you want to authenticate the user first but here
  we want to get to jwt without it. **/

  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, secretToken);
  res.json({accessToken: accessToken});
})

function authenticateToken(req, res, next) {
  /** here we need to get the token and verify that this is the
  correct user. This token will come from the header. The header
  be called Bearer and the token will be after the header*/

  // to get this header
  const authHeader = req.headers['authorization']
  // which will net Bearer TOKEN

  // in order to get just the token
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  /** now if we get pass the token check we know we have a valid token
  so we need to verify this token. And we do this with JWT.veriify() we
  pass it the token and the secret we hashed the token with. It will
  take a callback which has an ERR the value we serialized */

  jwt.verify(token, secretToken, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);
