import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';
import Filter from "./components/Filter"

let playlistsURIs = []

let defaultStyle = {
  color: '#fff',
  'font-family': 'Sawarabi Gothic, sans-serif'
};
let counterStyle = {
  ...defaultStyle,
  width: "50%",
  display: 'inline-block',
  'margin-top': '40px',
  'margin-bottom': '20px',
  'font-size': '20px',
  'line-height': '30px',
  'text-align': 'center'
}
let hStyle = {
  ...defaultStyle,
  'text-align': 'center',
  'margin-top': '5px'
}
let imgStyle = {
  'display': 'block',
  'margin-left': 'auto',
  'margin-right': 'auto',
  'width': '50%',
  'margin-top': '20px',
  'border-radius': '20px'
}
let divStyle = {
  'background': '#242B2E',
  'margin-top': '20px',
  'border-radius': '20px',
  'display': 'inline-block',
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
  'display': 'inline-block',
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
  //Get data function that is called when a user inputs a value they want to search for
  getData = async (e) => {
    //Prevents the page from being reloaded on the submit button
    e.preventDefault();
    //Get token data
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if (!accessToken)
      return;
    //Getting the value of the search term
    let searchTerm = e.target.elements.searchTerm.value;
    searchTerm = searchTerm.replace(' ', '%20');
    //Call fetch with new search t
    fetch(`https://api.spotify.com/v1/search?q=%22${searchTerm}%22&type=playlist&market=US&limit=50`, {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
      .then(playlistData => {
        let playlists = playlistData.playlists.items
        for (let i = 0; i < playlists.length; i++) {
          let name = playlists[i].name;
          let URI = playlists[i].href;
          let img = playlists[i].images[0].url
          let obj = { name, URI, img}
          playlistsURIs.push(obj)
        }
        fetch(`https://api.spotify.com/v1/search?q=%22${searchTerm}%22&type=playlist&offset=50&limit=50`, {
          headers: { 'Authorization': 'Bearer ' + accessToken }
        }).then(response => response.json())
          .then(playlistData => {
            let playlists = playlistData.playlists.items
            for (let i = 0; i < playlists.length; i++) {
              let name = playlists[i].name;
              let URI = playlists[i].href;
              let img = playlists[i].images[0].url
              let obj = { name, URI, img}
              playlistsURIs.push(obj)
            }
            console.log(playlistsURIs)
            let trackDataPromises = playlists.map(playlist => {
              let responsePromise = fetch(playlist.tracks.href, {
                headers: { 'Authorization': 'Bearer ' + accessToken }
              })
              let trackDataPromise = responsePromise
                .then(response => response.json())
              return trackDataPromise
            })
            let allTracksDataPromises =
              Promise.all(trackDataPromises)
            let playlistsPromise = allTracksDataPromises.then(trackDatas => {
              trackDatas.forEach((trackData, i) => {
                playlists[i].trackDatas = trackData.items
                  .map(item => item.track)
                  .map(trackData => ({
                    name: trackData.name,
                    duration: trackData.duration_ms / 1000
                  }))
              })
              return playlists
            })
            return playlistsPromise
          })
          .then(playlists => this.setState({
            playlists: playlists.map(item => {
              return {
                name: item.name,
                imageUrl: item.images[0].url,
                songs: item.trackDatas.slice(0, 3)
              }
            })
          }))
      })
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
  }

  render() {
    let playlistToRender =
      this.state.user &&
        this.state.playlists
        ? this.state.playlists.filter(playlist => {
          let matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())
          let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
            .includes(this.state.filterString.toLowerCase()))
          return matchesPlaylist || matchesSong
        }) : []
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
              <div style={{ ...playListListStyle, 'margin-top': '-25px' }}>
                {playlistToRender.map((playlist, i) => <Playlist playlist={playlist} index={i} />)}
              </div>
            </div>
          </div> : <button onClick={() => {
            window.location = window.location.href.includes('localhost')
              ? 'http://localhost:8888/login'
              : 'https://better-playlists-backend.herokuapp.com/login'
          }
          }
            style={{ padding: '20px', 'font-size': '50px', 'margin': 'auto', 'background': '#116466' }}>Sign in with Spotify</button>
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
          'text-align': 'center',
          'font-size': '10px'
        }}>{playlist.name}</h2>
        {/* <ul style={{ 'margin-top': '10px', 'font-size': '5px' }}>
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
