import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

let defaultStyle = {
  color: '#fff',
  'font-family': 'Sawarabi Gothic, sans-serif'
};
let hStyle = {
  ...defaultStyle,
  'textAlign': 'center',
  'marginTop': '5px'
}
let imgStyle = {
  'display': 'block',
  'margin-left': 'auto',
  'margin-right': 'auto',
  'width': '50%',
  'marginTop': '20px',
  'border-radius': '20px'
}
let divStyle = {
  'background': '#242B2E',
  'marginTop': '20px',
  'border-radius': '20px'
}
let albumStyle = {
  'float' : 'left',
  'display': 'block',
  'width': '100px',
  'height': '100px'
}
let playListListStyle = {
  'margin': 'auto',
  'height': '700px',
  'width' : '85%',
  'overflow': 'hidden',
  'overflow-y': 'scroll'
}
let playListStyle = {
  "margin" : "auto",
  "width" : "90%",
  'height': '100px',
  'borderColor': 'white',
  'borderWeight': '10px',
  'borderStyle': 'solid',
  'backgroundColor': '#67ADF3',
  'border-radius': '5px',
}

let tracksToRender = []
let artistsToRender = []
function isEven(number) {
  return number % 2
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
    }
  }
  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if (!accessToken)
      return;
    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.display_name,
          userURL: data.external_urls.spotify,
          numFollowers: data.followers.total,
          imgURL: data.images[0].url,
          plan: data.product
        }
      }))
    fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json()).then(data => {
      for (let i = 0; i < data.items.length; i++) {
        let track = {
          "name": data.items[i].name,
          "album": data.items[i].album.name,
          "artist": data.items[i].artists[0].name,
          "id": data.items[i].id,
          "img" : data.items[i].album.images[0].url
        }
        tracksToRender.push(track)
      }
      return tracksToRender
    }
  ).then(data => this.setState({ tracks: data}))
  fetch('https://api.spotify.com/v1/me/top/artists?limit=50', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json()).then(data => {
      for (let i = 0; i < data.items.length; i++) {
        let artist = {
          "name": data.items[i].name,
          "img": data.items[i].images[0].url,
          "followers" : data.items[i].followers.total
        }
        artistsToRender.push(artist)
      }
      return artistsToRender
    }
  ).then(data => this.setState({ artists: data}))
  }

  render() {
    let theseTracksToRender = this.state.tracks
    let theseArtistsToRender = this.state.artists
    return (
      <div>
        {this.state.user ?
          <div>
            <div className="userInfo" style={{divStyle}}>
              <h3 style={hStyle}>Welcome {this.state.user.name} </h3>
              <img src={this.state.user.imgURL} style={imgStyle}></img>
              <h3 style={hStyle}>Followers:  {this.state.user.numFollowers} </h3>
              <h3 style={hStyle}> Plan: {this.state.user.plan.charAt(0).toUpperCase() 
                + this.state.user.plan.substr(1)}</h3>
            </div>
            <br></br>
            <div className="tracks" style={{divStyle}}>
              <h1 style={hStyle}>Top Tracks</h1>
              <div style={{ ...playListListStyle}}>
                {tracksToRender.map((track, i) => 
                <Track playlist={tracksToRender[i]} index={i} />)}
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="artists" style={{divStyle}}>
              <h1 style={hStyle}>Top Artists</h1>
              <div style={{ ...playListListStyle}}>
                {artistsToRender.map((track, i) => <Track playlist={artistsToRender[i]} index={i} />)}
              </div>
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
          </div> : <button onClick={() => {
            window.location = window.location.href.includes('localhost')
              ? 'http://localhost:8888/login'
              : 'https://better-playlists-backend.herokuapp.com/login'
          }
          }
            style={{ padding: '20px', 'fontSize': '50px', 'margin': 'auto', 'background': '#116466' }}>Sign in with Spotify</button>
        }
      </div>
    );
  }
}
class Track extends Component {
  render() {
    let track = this.props.playlist
    let index = this.props.index
    return (
      <div style={{ ...defaultStyle, ...hStyle, ...playListStyle}}>
        <img src={track.img} style={albumStyle} />
        <h2 style={{'fontSize' : '20px', "margin" : "5px"}}>{index+1}</h2>
        <h2 style={{'textAlign': 'center', 'fontSize': '15px'}}>{track.name}</h2>
        <h2 style={{'textAlign': 'center', 'fontSize': '10px'}}>{track.artist}</h2>
      </div>
    );
  }
}
class Artist extends Component {
  render() {
    let track = this.props.artist
    let index = this.props.index
    return (
      <div style={{ ...defaultStyle, ...hStyle, ...playListStyle}}>
        <img src={track.img} style={albumStyle} />
        <h2 style={{'fontSize' : '20px', "margin" : "5px"}}>{index+1}</h2>
        <h2 style={{'textAlign': 'center', 'fontSize': '15px'}}>{track.name}</h2>
        <h2 style={{'textAlign': 'center', 'fontSize': '10px'}}>{track.artist}</h2>
      </div>
    );
  }
}


// 

export default App;
