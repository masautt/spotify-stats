import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
import Filter from "./components/Filter"

let defaultStyle = {
  color: '#fff',
  'font-family': 'Sawarabi Gothic, sans-serif'
};
let counterStyle = {
  ...defaultStyle,
  width: "50%",
  display: 'inlineBlock',
  'marginTop': '40px',
  'marginBottom': '20px',
  'fontSize': '20px',
  'lineHeight': '30px',
  'textAlign': 'center'
}
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
  'border-radius': '20px',
  'display': 'inlineBlock',
  'margin': '20px'
}
let smallDivStyle = {
  float: 'left',
  width: '300px',
  height: '400px',
}
let largeDivStyle = {
  'width': '850px',
  'height': '850px',
}
let albumStyle = {
  'display': 'block',
  'margin-left': 'auto',
  'margin-right': 'auto',
  'width': '100px',
  'height': '100px'
}
let playListListStyle = {
  'margin': 'auto',
  'height': '100%',
  'width': '95%',
  'height': '800px',
  'overflow': 'hidden',
  'overflow-y': 'scroll',
  'border-radius': '20px',
}
let playListStyle = {
  'display': 'inlineBlock',
  'width': '130px',
  'height': '130px',
  'border-color': 'white',
  'border-weight': '10px',
  'border-style': 'solid',
  'padding': '5px',
  'overflow-y': 'hidden',
  'background-color': '#116466',
  'border-radius': '5px',
  'margin': '5px',
}

let tracksToRender = []
let next
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
      console.log(tracksToRender)
    }
  )
  }

  render() {
    return (
      <div>
        {this.state.user ?
          <div>
            <div className="userInfo" style={{ float: 'left', width: '300px', height: '400px', ...divStyle }}>
              <h3 style={hStyle}>Welcome {this.state.user.name} </h3>
              <img src={this.state.user.imgURL} style={imgStyle}></img>
              <h3 style={hStyle}>Followers:  {this.state.user.numFollowers} </h3>
              <h3 style={hStyle}> Plan: {this.state.user.plan.charAt(0).toUpperCase() + this.state.user.plan.substr(1)}</h3>
              <br></br>
              <Filter getData={this.getData} />
            </div>

            <div className="currentPlaylist" style={{ ...divStyle, ...smallDivStyle }}>
              <h3 style={hStyle}>Current Playlist</h3>

            </div>

            <div className="data" style={{ ...divStyle, ...largeDivStyle }}>
              {/*<PlaylistCounter playlists={playlistToRender} /><HoursCounter playlists={playlistToRender} />*/}
              <h1 style={hStyle}>Playlists</h1>
              <div style={{ ...playListListStyle, 'marginTop': '-25px' }}>
                {tracksToRender.map((track, i) => <Playlist playlist={tracksToRender[i].track} index={i} />)}
              </div>
            </div>
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
class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <div style={{ ...defaultStyle, ...hStyle, ...playListStyle, /*'background-color': isEven(this.props.index) ? '#116466' : '#EB6E18' */ }}>
        <img src={playlist.imageUrl} style={albumStyle} />
        <h2 style={{
          'textAlign': 'center',
          'fontSize': '10px'
        }}>{playlist.name}</h2>
        {/* <ul style={{ 'marginTop': '10px', 'fontSize': '5px' }}>
          {playlist.songs.map(song =>
            <li style={{ 'padding-top': '2px' }}>{song.name}</li>
          )}
        </ul> */}
      </div>
    );
  }
}


class PlaylistCounter extends Component {
  render() {
    let playlistCounterStyle = counterStyle
    return (
      <div style={playlistCounterStyle}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    let totalDurationHours = Math.round(totalDuration / 60)
    let isTooLow = totalDurationHours < 40
    let hoursCounterStyle = {
      ...counterStyle,
      color: isTooLow ? 'red' : 'white',
      'font-weight': isTooLow ? 'bold' : 'normal',
    }
    return (
      <div style={hoursCounterStyle}>
        <h2>{totalDurationHours} hours</h2>
      </div>
    );
  }
}


// 

export default App;
