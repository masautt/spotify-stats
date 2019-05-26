![Spotify Stats React App](https://i.imgur.com/f8fs3C6.png "Spotify Stats React App")

# Spotify Stats React App
##### Authenticate with [Spotify API](https://spotify.com/) to display your top Tracks, Artists, and Albums

```javascript
npm install
npm start
cd backend
npm install
npm start 
```

Backend relies on MPJ's [oauth-bridge-template](https://github.com/mpj/oauth-bridge-template) and is found in */backend*

![How it works](https://i.imgur.com/v4EKgyW.jpg "How it works")

##### How the Back End Works
1. User visits localhost/login
2. User sends client_id and scope to Spotify
3. Spotify returns access token to oauth-bridge
4. The bridge forwards the token to my web app


#### How the Front End Works
![How it works](https://i.imgur.com/uEJviaw.jpg "How it works")
![How it works](https://i.imgur.com/ase0xDt.jpg "How it works")