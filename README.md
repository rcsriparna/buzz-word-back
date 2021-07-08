<h1>Buzz-word-back-end</h1>

<p>Back end for Buzz-Word Game:</p><br><p>Handling Api calls, back-end game logic, database read-write and more... </p>
<p><strong>Requires mongoDB to be locally installed. Remote sessions are possible too. </strong></p>

<h2>To clone from GitHub use the link below</h2>
<a href="https://github.com/madalinacristea/Buzz-word-back-end.git">https://github.com/madalinacristea/Buzz-word-back-end.git</a>

<h2>To install:</h2>
<code>npm install</code>
<p>Please make sure you can connect to mongoDB!</p>

<h2>To run:</h2>
<code>npm start</code>

<h2>AUTH endpoints</h2>
<code>/login</code>
<h4>Method: POST</h4>
<p>Logs user wit username and password provided in body</p>
<code>
body = {
    "username": "username",
    "password": "password"
}
 </code>
 <hr>
 <code>/signup</code>
<h4>Method: POST</h4>
<p>Creates account and logs user wit username and password provided in body</p>
<code>
body = {
    "username": "username",
    "password": "password"
}
 </code>
 <h2>API endpoints</h2>
<code>/api/state</code>
<h4>Method: GET</h4>
<p>Returns JSON - game state object</p>
 <hr>
 <code>/api/rndletters:num</code>
<h4>Method: GET</h4>
<p>Returns JSON - array of letters of length equal to num query parameter</p>

  <hr>
 <code>/api/room</code>
<h4>Method: POST</h4>
<p>Joins user to room.</p>
<code>
body = {
    "roomid":0
}
 </code>
 <hr>
  <code>/api/dict</code>
<h4>Method: POST</h4>
<p>Checks if word is a part of English dictionary of words. Returns JSON nested object.</p>
<code>
body = {
    "letters": {"c0":"D","c1":"E","c2":"N"}
}
 </code>
 <hr>
